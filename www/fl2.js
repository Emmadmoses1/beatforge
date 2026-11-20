const BW=56,TH=54,NB=32,NT=6,RUL=24;let PLsel=null,PLmute=[],lastTap=0,lastClip=null;
if(Array.isArray(PL[0])){const n=[];PL.forEach((tr,t)=>tr.forEach((p,b)=>{if(p>=0)n.push({t,s:b,l:1,p})}));PL=n}
barPats=function(b){if(!song)return[pat];const r=[];PL.forEach(c=>{if(!PLmute[c.t]&&b>=c.s&&b<c.s+c.l&&!r.includes(c.p))r.push(c.p)});return r};
songLen=function(){let m=1;PL.forEach(c=>{m=Math.max(m,c.s+c.l)});return m};
const _h=head;
head=function(p){_h(p);const ph=document.getElementById('ph');if(ph){ph.style.display=song?'block':'none';ph.style.left=(70+p/16*BW)+'px'}};
const _t4=trig;
trig=function(c,n,t){if(c.kind==='syn'&&n.v!=null){if(c.mute||act>32)return;act++;setTimeout(()=>act--,1200);
 const g=ctx.createGain();g.gain.value=n.v;g.connect(c.n);cur=g;playNote(c.key,n.m,t).rel(t+n.l*sd());return}_t4(c,n,t)};

/* ---------- PLAYLIST (FL style) ---------- */
rList=function(m){
 const bar=el('div','row');bar.append(el('b',null,'Pattern'));
 pats.forEach((_,i)=>bar.append(el('button','b'+(i===pat?' on':''),'P'+(i+1),()=>{pat=i;render()})));
 bar.append(
  el('button','b','Edit',()=>{if(PLsel)pat=PLsel.p;go('rack')}),
  el('button','b','Copy',()=>{const c=PLsel;if(!c||c.s+c.l*2>NB)return;const n={t:c.t,s:c.s+c.l,l:c.l,p:c.p};
   if(PL.some(x=>x.t===n.t&&n.s<x.s+x.l&&x.s<n.s+n.l))return;PL.push(n);PLsel=n;save();render()}),
  el('button','b','Del',()=>{if(!PLsel)return;PL.splice(PL.indexOf(PLsel),1);PLsel=null;save();render()}));
 m.append(bar,el('div','hint','Tap empty: place clip · Tap clip: select · Double-tap: edit · Hold + drag: move · Drag ⋮: resize'));
 const box=el('div','plb');box.style.width=(70+NB*BW)+'px';
 const rl=el('div','pl2 rul');rl.append(el('div','th',''));
 const rc=el('div','lane');rc.style.width=NB*BW+'px';
 for(let b=0;b<NB;b++){const u=el('div','rn',b+1);u.style.width=BW+'px';rc.append(u)}
 rl.append(rc);box.append(rl);
 for(let t=0;t<NT;t++){const r=el('div','pl2'),th=el('div','th');
  th.append(el('span',null,'Track '+(t+1)),el('button','mt'+(PLmute[t]?' on':''),'M',()=>{PLmute[t]=!PLmute[t];render()}));
  const ln=el('div','lane');ln.style.width=NB*BW+'px';
  ln.onclick=ev=>{if(ev.target!==ln)return;const b=Math.floor(ev.offsetX/BW);
   if(PL.some(c=>c.t===t&&b>=c.s&&b<c.s+c.l)){PLsel=null;render();return}
   const c={t,s:b,l:1,p:pat};PL.push(c);PLsel=c;save();render()};
  r.append(th,ln);box.append(r)}
 const cl=el('div','cl');cl.style.width=(70+NB*BW)+'px';cl.style.height=(RUL+NT*TH)+'px';box.append(cl);
 box.append(Object.assign(el('div'),{id:'ph'}));
 function clip(c){const e=el('div','clip'+(c===PLsel?' sel':'')),h=el('i','grip');e._c=c;e.append(el('span',null,'Pattern '+(c.p+1)),h);
  e.style.background=COL[c.p%7];
  const pos=()=>{e.style.left=(70+c.s*BW)+'px';e.style.top=(RUL+c.t*TH+3)+'px';e.style.width=(c.l*BW-2)+'px';e.style.height=(TH-6)+'px'};pos();
  const sl=()=>box.querySelectorAll('.clip').forEach(x=>x.classList.toggle('sel',x._c===c));
  e.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();PLsel=c;sl();
   const now=Date.now();if(lastClip===c&&now-lastTap<320){pat=c.p;go('rack');return}lastClip=c;lastTap=now;
   const x0=ev.clientX,y0=ev.clientY,o={s:c.s,t:c.t};let mode=0;e.setPointerCapture(ev.pointerId);
   const tm=setTimeout(()=>{mode=1;e.classList.add('lift')},300);
   e.onpointermove=q=>{const dx=q.clientX-x0,dy=q.clientY-y0;if(!mode){if(Math.abs(dx)+Math.abs(dy)>10)clearTimeout(tm);return}
    c.s=Math.max(0,Math.min(NB-c.l,o.s+Math.round(dx/BW)));c.t=Math.max(0,Math.min(NT-1,o.t+Math.round(dy/TH)));pos()};
   const up=()=>{clearTimeout(tm);e.onpointermove=null;e.classList.remove('lift');save()};e.onpointerup=up;e.onpointercancel=up};
  h.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();PLsel=c;sl();const x0=ev.clientX,l0=c.l;h.setPointerCapture(ev.pointerId);
   h.onpointermove=q=>{c.l=Math.max(1,Math.min(NB-c.s,l0+Math.round((q.clientX-x0)/BW)));pos()};
   h.onpointerup=h.onpointercancel=()=>{h.onpointermove=null;save()}};
  return e}
 PL.forEach(c=>cl.append(clip(c)));m.append(box)};

/* ---------- PIANO ROLL (FL style gestures) ---------- */
rPiano=function(m){const c=chs.find(x=>x.id===sel);
 if(!c||c.kind!=='syn'){m.append(el('div','msg','Pick a synth channel in the Rack and tap "Piano".'));return}
 const CW=36,RH=28,TOP=84,BOT=48,NN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
 const a=nt(c),keys={},rows={};if(selN&&!a.includes(selN))selN=null;
 const prev=k=>{cur=c.n;playNote(c.key,k,ctx.currentTime).rel(ctx.currentTime+.4)};
 const hl=k=>{Object.values(keys).forEach(x=>x.classList.remove('kon'));Object.values(rows).forEach(x=>x.classList.remove('ron'));if(k!=null&&keys[k]){keys[k].classList.add('kon');rows[k].classList.add('ron')}};
 const bar=el('div','row');bar.append(el('b',null,c.name));
 [1,2,4].forEach(l=>bar.append(el('button','b'+(nl===l?' on':''),'Snap '+l,()=>{nl=l;render()})));
 bar.append(el('button','b','Clear',()=>{a.length=0;selN=null;save();render()}));
 m.append(bar,el('div','hint','Tap grid: add · Tap note: delete · Hold + drag: move · Drag ⋮: resize'));
 const g=el('div','roll');g.style.setProperty('--c',COL[chs.indexOf(c)%7]);
 const ru=el('div','rr rul2');ru.append(el('div','kl',''));
 for(let s=0;s<16;s++)ru.append(el('div','cell',s%4?'':(s/4+1)));g.append(ru);
 for(let k=TOP;k>=BOT;k--){const r=el('div','rr'+([1,3,6,8,10].includes(k%12)?' bk':'')),kl=el('div','kl',k%12===0?'C'+(k/12-1):'');
  keys[k]=kl;rows[k]=r;
  kl.onpointerdown=()=>{prev(k);hl(k);setTimeout(()=>hl(selN?selN.m:null),350)};r.append(kl);
  for(let s=0;s<16;s++){const u=el('div','cell');u.dataset.c=s;
   u.onclick=()=>{const q={s,m:k,l:Math.min(nl,16-s),v:.8};a.push(q);draw(q);select(q);prev(k);vel();save()};r.append(u)}
  g.append(r)}
 const L=el('div','nl');L.style.top='24px';L.style.height=((TOP-BOT+1)*RH)+'px';L.style.width=(16*CW)+'px';
 const gd=el('div','gd');L.append(gd);g.append(L);
 const vl=el('div','vl');g.append(vl);
 const guide=(q,on)=>{gd.style.display=on?'block':'none';gd.style.left=q.s*CW+'px';gd.style.width=q.l*CW+'px'};
 const pos=(e,q)=>{e.style.left=q.s*CW+'px';e.style.top=(TOP-q.m)*RH+'px';e.style.width=q.l*CW+'px';e.style.height=RH+'px';e.firstChild.textContent=NN[q.m%12]+(Math.floor(q.m/12)-1)};
 function select(q){selN=q;L.childNodes.forEach(e=>e.classList.toggle('sel',e._q===q));hl(q?q.m:null)}
 function vel(){vl.innerHTML='';a.forEach(q=>{const b=el('div','vb');b.style.left=(q.s*CW+5)+'px';b.style.height=((q.v==null?.8:q.v)*84)+'px';
  b.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();b.setPointerCapture(ev.pointerId);const y0=ev.clientY,v0=q.v==null?.8:q.v;
   b.onpointermove=t=>{q.v=Math.max(.05,Math.min(1,v0-(t.clientY-y0)/84));b.style.height=q.v*84+'px'};
   b.onpointerup=b.onpointercancel=()=>{b.onpointermove=null;save()}};vl.append(b)})}
 function draw(q){const e=el('div','note'),h=el('i','grip');e._q=q;e.append(el('span'),h);pos(e,q);
  e.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();prev(q.m);
   const x0=ev.clientX,y0=ev.clientY,o={s:q.s,m:q.m};let mode=0,mv=0;e.setPointerCapture(ev.pointerId);
   const tm=setTimeout(()=>{mode=1;e.classList.add('lift');select(q);guide(q,1)},300);
   e.onpointermove=t=>{const dx=t.clientX-x0,dy=t.clientY-y0;
    if(!mode){if(Math.abs(dx)+Math.abs(dy)>10){mv=1;clearTimeout(tm)}return}
    q.s=Math.max(0,Math.min(16-q.l,o.s+Math.round(dx/CW)));const nm=Math.max(BOT,Math.min(TOP,o.m-Math.round(dy/RH)));
    if(nm!==q.m){q.m=nm;prev(nm);hl(nm)}pos(e,q);guide(q,1)};
   e.onpointerup=()=>{clearTimeout(tm);e.onpointermove=null;e.classList.remove('lift');guide(q,0);
    if(!mode&&!mv){a.splice(a.indexOf(q),1);e.remove();if(selN===q)selN=null;hl(null)}vel();save()};
   e.onpointercancel=()=>{clearTimeout(tm);e.onpointermove=null;e.classList.remove('lift');guide(q,0)}};
  h.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();select(q);prev(q.m);
   const x0=ev.clientX,l0=q.l;h.setPointerCapture(ev.pointerId);guide(q,1);
   h.onpointermove=t=>{const n2=Math.max(1,Math.min(16-q.s,l0+Math.round((t.clientX-x0)/CW)));if(n2!==q.l){q.l=n2;pos(e,q);guide(q,1)}};
   h.onpointerup=h.onpointercancel=()=>{h.onpointermove=null;guide(q,0);vel();save()}};
  L.append(e)}
 a.forEach(draw);m.append(g);select(selN);vel()};
render();
