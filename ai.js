/* Xceed10 Smart Coach v2 — local, API-free retrieval engine. */
const output = document.getElementById('aiOutput');
const status = document.getElementById('aiStatus');
const promptBox = document.getElementById('aiPrompt');
const askBtn = document.getElementById('askBtn');
const clearBtn = document.getElementById('clearBtn');
let currentMode='Explain';
let lastEntry=null;
const playfulAbusePatterns = [
  /\b(chutiya|chutiye|bewakoof|pagal|bakwas|bakchodi|bc|bkl|mc|madarchod|gaandu|gandu|fuck|fucking|idiot|stupid)\b/i,
  /\b(gaali|gaaliyan|gali)\b/i
];

function isPlayfulAbuse(text){
  const q = norm(text);
  return playfulAbusePatterns.some(re => re.test(q));
}

function showPlayfulBoundary(){
  status.textContent = 'Xceed10 Smart Coach';
  status.className = 'ai-status success';
  output.innerHTML = `
    <div class="coach-result">
      <div class="coach-block">
        <strong>😄 Arre bhai!</strong>
        <p>Mere malik ne mujhe mana kara hai bakchodi karne ko 😂</p>
        <p class="muted">Chal, ab koi Class 10 ka doubt puch — main padhai wali help karta hoon.</p>
      </div>
    </div>`;
}


const stopWords=new Set('the a an and or for of to in on is are was were what why how do does did with from by this that these those me my your you i explain tell give show please simple simply mujhe mera meri mere hai hain ho ko ka ki ke me mein se par par kya kyu kyun kaise samjha samjhao bata batao karo karna'.split(/\s+/));
const synonyms={
  'd': ['discriminant'], 'roots':['zero','zeros','solutions'], 'solution':['roots','answer'],
  'food':['nutrition'], 'plant':['photosynthesis','nutrition'], 'foodmaking':['photosynthesis'],
  'current':['electricity'], 'voltage':['potential','potentialdifference'], 'potential':['voltage'],
  'sums':['arithmetic','ap'], 'ap':['arithmetic','progression'], 'trigo':['trigonometry'],
  'federal':['federalism'], 'panchayat':['federalism','decentralisation'],
  'development':['development','percapita','literacy'], 'loan':['credit','money'],
  'story':['chapter','literature'], 'poem':['poetry','poem']
};

function norm(s){return s.toLowerCase().replace(/²/g,'2').replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();}
function stem(t){
  t=norm(t); if(t.length>6 && t.endsWith('ing')) return t.slice(0,-3);
  if(t.length>5 && t.endsWith('ed')) return t.slice(0,-2);
  if(t.length>5 && t.endsWith('s')) return t.slice(0,-1);
  return t;
}
function tokens(s){
  return norm(s).split(/\s+/).filter(x=>x && !stopWords.has(x)).map(stem);
}
function similarity(q, entry){
  const qraw=norm(q), qt=tokens(q);
  let score=0;
  const hay=[entry.title,entry.subject,entry.summary,(entry.notes||[]).join(' '),(entry.keywords||[]).join(' ')].map(norm).join(' ');
  const title=norm(entry.title);
  if(qraw.includes(title)) score+=12;
  if((entry.phrases||[]).some(p=>qraw.includes(norm(p)))) score+=8;
  for(const t of qt){
    if(t.length<3) continue;
    if(hay.includes(t)) score+=2.5;
    for(const [k,vals] of Object.entries(synonyms)) if(t===k && vals.some(v=>hay.includes(v))) score+=3;
  }
  // chapter-specific phrase overlap
  const kws=(entry.keywords||[]).map(norm);
  for(const k of kws){ if(k.length>4 && qraw.includes(k)) score+=4; }
  return score;
}
function findBest(q){
  return window.XCEED10_KNOWLEDGE.map(e=>({e,s:similarity(q,e)})).sort((a,b)=>b.s-a.s)[0];
}
function safe(t){return String(t).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));}
function answerFor(entry, q){
  const notes=entry.notes||[]; const practice=entry.practice||[];
  const mode=currentMode;
  let body='';
  if(mode==='Explain' || mode==='Simpler'){
    const bullets=notes.slice(0,5).map(x=>`<li>${safe(x)}</li>`).join('');
    body=`<div class="coach-block"><strong>🧠 ${mode==='Simpler'?'Simple explanation':'Explanation'}</strong><ul class="ace-list">${bullets}</ul></div>`;
  } else if(mode==='Example'){
    body=`<div class="coach-block"><strong>💡 Example / application</strong><p>${safe(entry.summary || 'Use the chapter notes and practice set to apply the concept.')}</p></div>`;
  } else if(mode==='Formula'){
    body=`<div class="coach-block"><strong>📐 Formula / key rule</strong><div class="formula">${safe(entry.formula || 'No single formula is stored for this topic. Check the Ace Notes for definitions, rules and key facts.')}</div></div>`;
  } else if(mode==='Quiz' || mode==='Practice'){
    const qlist=practice.length?practice:['Try writing one exam-style question from this topic and solve it without notes.'];
    body=`<div class="coach-block"><strong>${mode==='Quiz'?'🎯 Quick quiz':'📝 Practice'}</strong><ol>${qlist.slice(0,5).map(x=>`<li>${safe(x)}</li>`).join('')}</ol></div>`;
  } else if(mode==='Related'){
    const rel=window.XCEED10_KNOWLEDGE.filter(e=>e!==entry && e.subject===entry.subject).map(e=>e.title).slice(0,5);
    body=`<div class="coach-block"><strong>🔗 Related topics</strong><p>${rel.map(s=>`<span class="tag">${safe(s)}</span>`).join(' ')}</p></div>`;
  } else if(mode==='Study Plan'){
    body=`<div class="coach-block"><strong>🗓️ 30-minute study plan</strong><ol><li>8 min — read the Ace Notes once.</li><li>7 min — close notes and recall the key ideas.</li><li>10 min — solve the practice set.</li><li>5 min — write one mistake or takeaway in your Mistake Log.</li></ol></div>`;
  }
  const practice=entry.practice?.[0] ? `<div class="coach-block"><strong>📝 One practice question</strong><p>${safe(entry.practice[0])}</p></div>`:'';
  output.innerHTML=`<div class="coach-result"><div class="coach-topic"><span class="tag">${safe(entry.subject)}</span> <strong>${safe(entry.title)}</strong></div>${body}${practice}<div class="coach-actions"><button class="btn coach-action" data-action="Simpler">🔹 Explain simpler</button><button class="btn secondary coach-action" data-action="Example">💡 Give example</button><button class="btn secondary coach-action" data-action="Quiz">📝 Quiz me</button><button class="btn secondary coach-action" data-action="Formula">📐 Show formula</button><button class="btn secondary coach-action" data-action="Practice">🎯 Practice question</button><button class="btn secondary coach-action" data-action="Related">🔗 Related topic</button><a class="cta" href="${entry.link}">Open chapter →</a></div><p class="muted coach-note">Xceed10 Smart Coach searches its original Class 10 knowledge base. It is not a free-form generative AI and will not invent an answer for an unsupported topic.</p></div>`;
  output.querySelectorAll('.coach-action').forEach(b=>b.addEventListener('click',()=>{currentMode=b.dataset.action; if(lastEntry) answerFor(lastEntry,q);}));
}

document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentMode=btn.dataset.mode;}));
clearBtn.addEventListener('click',()=>{promptBox.value='';output.textContent='Your Xceed10 Smart Coach answer will appear here.';status.textContent='';lastEntry=null;});
askBtn.addEventListener('click',()=>{const q=promptBox.value.trim(); if(!q){status.textContent='Write a question first.';status.className='ai-status danger';return;} if(isPlayfulAbuse(q)){showPlayfulBoundary(); return;} const r=findBest(q); if(!r || r.s<3){status.textContent='I could not find a close match in the current Xceed10 knowledge base.';status.className='ai-status danger';output.innerHTML=`<strong>Try asking about a Class 10 topic:</strong><br>For example: “Explain discriminant”, “How does photosynthesis work?”, “Why is power sharing important?”, or “Explain the theme of The Proposal.”<br><br><span class="muted">For genuinely new questions outside the stored syllabus knowledge, Xceed10 will need an approved generative-AI service.</span>`;return;} lastEntry=r.e; status.textContent=`Found: ${r.e.title}`;status.className='ai-status success';answerFor(r.e,q);});
