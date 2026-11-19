document.addEventListener('contextmenu',e=>e.preventDefault());
let selN=null;
rPiano=function(m){const c=chs.find(x=>x.id===sel);
 if(!c||c.kind!=='syn'){m.append(el('div','msg','Pick a synth channel in the Rack and tap "Piano".'));return}
 const CW=34,RH=26,TOP=84,BOT=48,NN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
 const a=nt(c),keys={},rows={};if(selN&&!a.includes(selN))selN=null;
 const prev=k=>{cur=c.n;playNote(c.key,k,ctx.currentTime).rel(ctx.currentTime+.4)};
 const hl=k=>{Object.values(keys).forEach(x=>x.classList.remove('kon'));Object.values(rows).forEach(x=>x.classList.remove('ron'));if(k!=null&&keys[k]){keys[k].classList.add('kon');rows[k].classList.add('ron')}};
 const bar=el('div','row');bar.append(el('b',null,c.name));
 [1,2,4].forEach(l=>bar.append(el('button','b'+(nl===l?' on':''),'Snap '+l,()=>{nl=l;render()})));
 bar.append(el('button','b','Delete',()=>{if(!selN)return;a.splice(a.indexOf(selN),1);selN=null;save();render()}));
 m.append(bar);
 const g=el('div','roll');
 for(let k=TOP;k>=BOT;k--){const r=el('div','rr'+([1,3,6,8,10].includes(k%12)?' bk':'')),kl=el('div','kl',k%12===0?'C'+(k/12-1):'');
  keys[k]=kl;rows[k]=r;
  kl.onpointerdown=()=>{prev(k);hl(k);setTimeout(()=>hl(selN?selN.m:null),350)};r.append(kl);
  for(let s=0;s<16;s++){const u=el('div','cell');u.dataset.c=s;
   u.onclick=()=>{const q={s,m:k,l:Math.min(nl,16-s)};a.push(q);draw(q);select(q);prev(k);save()};r.append(u)}
  g.append(r)}
 const L=el('div','nl');L.style.height=((TOP-BOT+1)*RH)+'px';L.style.width=(16*CW)+'px';g.append(L);
 const pos=(e,q)=>{e.style.left=q.s*CW+'px';e.style.top=(TOP-q.m)*RH+'px';e.style.width=q.l*CW+'px';e.style.height=RH+'px';e.textContent=NN[q.m%12]+(Math.floor(q.m/12)-1)};
 function select(q){selN=q;L.childNodes.forEach(e=>e.classList.toggle('sel',e._q===q));hl(q?q.m:null)}
 function draw(q){const e=el('div','note');e._q=q;pos(e,q);
  e.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();select(q);prev(q.m);
   const x0=ev.clientX,y0=ev.clientY,o={s:q.s,m:q.m,l:q.l},rz=ev.offsetX>e.offsetWidth-16;
   const mv=t=>{const dx=Math.round((t.clientX-x0)/CW),dy=Math.round((t.clientY-y0)/RH);
    if(rz){q.l=Math.max(1,Math.min(16-q.s,o.l+dx))}
    else{q.s=Math.max(0,Math.min(16-q.l,o.s+dx));const nm=Math.max(BOT,Math.min(TOP,o.m-dy));if(nm!==q.m){q.m=nm;prev(nm);hl(nm)}}
    pos(e,q)};
   const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);save()};
   addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)};
  L.append(e)}
 a.forEach(draw);m.append(g);select(selN)};
render();
