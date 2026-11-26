const $ = (id) => document.getElementById(id);
const state = { name: localStorage.getItem('nova_name') || '', messages: [], busy: false, recorder: null, chunks: [] };
const API_KEY = 'nova_backend_url';
const cleanBase = () => (localStorage.getItem(API_KEY) || '').trim().replace(/\/$/, '');

function showApp(){
  $('onboarding').classList.toggle('hidden', !!state.name);
  $('app').classList.toggle('hidden', !state.name);
  $('sidebar-greeting').textContent = `Welcome, ${state.name} 👋`;
  $('message-input').placeholder = `Ask me anything, ${state.name}...`;
  renderMessages();
}
function setStatus(message){ $('status-line').textContent = message; }
function addMessage(role, content, model='') { state.messages.push({role,content,model}); renderMessages(); }
function renderMessages(){
  const host=$('chat-history'); host.innerHTML='';
  $('empty-state').classList.toggle('hidden', state.messages.length>0);
  state.messages.forEach((m,i)=>{
    const wrap=document.createElement('div'); wrap.className=`message ${m.role}`;
    const avatar=document.createElement('div'); avatar.className='avatar'; avatar.textContent=m.role==='user'?'👤':'✦';
    const bubble=document.createElement('div'); bubble.className='bubble'; bubble.textContent=m.content;
    wrap.append(avatar,bubble); host.append(wrap);
    if(m.role==='assistant'){
      const tools=document.createElement('div'); tools.className='message-tools';
      const label=document.createElement('span'); label.textContent=`✦ ${m.model || 'NOVA AI'}  `;
      const listen=document.createElement('button'); listen.textContent='🔊 Listen'; listen.onclick=()=>speak(m.content);
      tools.append(label,listen); host.append(tools);
    }
  });
  host.scrollTop=host.scrollHeight;
}
function speak(text){ if(!('speechSynthesis' in window)){setStatus('Speech playback is not supported in this browser.');return;} speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=1;speechSynthesis.speak(u); }
function chooseModel(prompt){const keys=['python','code','coding','program','debug','error','bug','function','javascript','html','css','sql','algorithm','streamlit','api'];return keys.some(k=>prompt.toLowerCase().includes(k))?'qwen/qwen3.8-27b':'openai/gpt-oss-120b';}
async function sendMessage(text){
  const prompt=(text||'').trim(); if(!prompt||state.busy)return;
  if(!cleanBase()){ $('api-url').value=''; $('settings-modal').classList.remove('hidden'); setStatus('Add your backend URL to connect NOVA.'); return; }
  addMessage('user',prompt); $('message-input').value=''; $('message-input').style.height='auto';
  state.busy=true; $('send-button').disabled=true; setStatus('✦ NOVA is thinking...');
  try{
    const response=await fetch(`${cleanBase()}/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:state.messages.map(({role,content})=>({role,content})),user_name:state.name,provider:'groq',model:chooseModel(prompt)})});
    const data=await response.json(); if(!response.ok)throw new Error(data.detail||`Request failed (${response.status})`);
    addMessage('assistant',data.answer||'I could not generate a response.',data.model||'Groq'); setStatus(`Connected · ${data.model||'Groq'}`);
  }catch(err){addMessage('assistant',`I couldn't reach the NOVA server. ${err.message}\n\nCheck your backend URL and make sure the API is running.`,'Connection');setStatus('Connection issue');}
  finally{state.busy=false;$('send-button').disabled=false;$('message-input').focus();}
}
$('name-form').addEventListener('submit',e=>{e.preventDefault();const name=$('name-input').value.trim();if(!name)return;state.name=name;localStorage.setItem('nova_name',name);showApp();});
$('send-button').addEventListener('click',()=>sendMessage($('message-input').value));
$('message-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(e.target.value);}});
$('message-input').addEventListener('input',e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,150)+'px';});
$('new-chat').addEventListener('click',()=>{state.messages=[];renderMessages();setStatus('New chat started.');});
$('change-name').addEventListener('click',()=>{state.name='';localStorage.removeItem('nova_name');$('name-input').value='';showApp();});
document.querySelectorAll('.suggestion').forEach(b=>b.addEventListener('click',()=>sendMessage(b.dataset.prompt)));
$('settings-button').addEventListener('click',()=>{$('api-url').value=cleanBase();$('settings-modal').classList.remove('hidden');});
$('close-settings').addEventListener('click',()=>$('settings-modal').classList.add('hidden'));
$('save-settings').addEventListener('click',()=>{const url=$('api-url').value.trim().replace(/\/$/,'');if(!/^https?:\/\//i.test(url)){setStatus('Enter a valid URL starting with https://');return;}localStorage.setItem(API_KEY,url);$('settings-modal').classList.add('hidden');setStatus('Backend URL saved. Checking connection...');fetch(`${url}/health`).then(r=>r.json()).then(()=>setStatus('Backend connection successful.')).catch(()=>setStatus('URL saved, but the backend did not respond.'));});
$('mic-button').addEventListener('click',async()=>{
  if(state.recorder&&state.recorder.state==='recording'){state.recorder.stop();$('mic-button').textContent='🎙';setStatus('Transcribing your recording...');return;}
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){setStatus('Voice recording is not supported in this browser.');return;}
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});state.chunks=[];state.recorder=new MediaRecorder(stream);state.recorder.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data)};state.recorder.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());try{const form=new FormData();form.append('file',new Blob(state.chunks,{type:state.recorder.mimeType||'audio/webm'}),'nova-recording.webm');const res=await fetch(`${cleanBase()}/transcribe`,{method:'POST',body:form});const data=await res.json();if(!res.ok)throw new Error(data.detail||'Transcription failed');$('message-input').value=data.transcript||'';$('message-input').focus();setStatus('Voice transcribed. Press send when ready.');}catch(err){setStatus(`Voice transcription failed: ${err.message}`)}};state.recorder.start();$('mic-button').textContent='⏹';setStatus('Recording... click the microphone again to stop.');}catch(err){setStatus(`Microphone permission error: ${err.message}`)}
});
showApp();
