const BUILD='v11',COL=['#ff8a1f','#4fc3f7','#9ccc65','#ba68c8','#ffd54f','#f06292','#4dd0e1'];
(function(){
 const ic={rack:'<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/>',
 piano:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 5v14M15 5v14"/>',
 list:'<rect x="3" y="5" width="9" height="4" rx="1"/><rect x="8" y="10" width="13" height="4" rx="1"/><rect x="3" y="15" width="7" height="4" rx="1"/>',
 mix:'<path d="M6 4v16M12 4v16M18 4v16"/><circle cx="6" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="8" r="2"/>',
 brow:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'};
 const nm={rack:'Rack',piano:'Piano',list:'Playlist',mix:'Mixer',brow:'Browser'};
 document.querySelectorAll('#tabs button').forEach(b=>{const v=b.dataset.v;
  b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ic[v]+'</svg><span>'+nm[v]+'</span>'});
 const lg=document.createElement('div');lg.className='logo';lg.innerHTML='<span>Beat<b>Forge</b></span><small>'+BUILD+'</small>';$('#top').prepend(lg);
})();
const _r2=rRack;
rRack=function(m){_r2(m);m.querySelectorAll('.ch').forEach((r,i)=>r.style.setProperty('--c',COL[i%7]))};

rPiano=function(m){const c=chs.find(x=>x.id===sel);
 if(!c||c.kind!=='syn'){m.append(el('div','msg','Pick a synth channel in the Rack and tap "Piano".'));return}
 const CW=36,RH=28,TOP=84,BOT=48,NN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
 const a=nt(c),keys={},rows={};if(selN&&!a.includes(selN))selN=null;
 const prev=k=>{cur=c.n;playNote(c.key,k,ctx.currentTime).rel(ctx.currentTime+.4)};
 const hl=k=>{Object.values(keys).forEach(x=>x.classList.remove('kon'));Object.values(rows).forEach(x=>x.classList.remove('ron'));if(k!=null&&keys[k]){keys[k].classList.add('kon');rows[k].classList.add('ron')}};
 const bar=el('div','row');bar.append(el('b',null,c.name));
 [1,2,4].forEach(l=>bar.append(el('button','b'+(nl===l?' on':''),'Snap '+l,()=>{nl=l;render()})));
 bar.append(el('button','b','Delete',()=>{if(!selN)return;a.splice(a.indexOf(selN),1);selN=null;save();render()}));
 m.append(bar);
 const g=el('div','roll');g.style.setProperty('--c',COL[chs.indexOf(c)%7]);
 for(let k=TOP;k>=BOT;k--){const r=el('div','rr'+([1,3,6,8,10].includes(k%12)?' bk':'')),kl=el('div','kl',k%12===0?'C'+(k/12-1):'');
  keys[k]=kl;rows[k]=r;
  kl.onpointerdown=()=>{prev(k);hl(k);setTimeout(()=>hl(selN?selN.m:null),350)};r.append(kl);
  for(let s=0;s<16;s++){const u=el('div','cell');u.dataset.c=s;
   u.onclick=()=>{const q={s,m:k,l:Math.min(nl,16-s)};a.push(q);draw(q);select(q);prev(k);save()};r.append(u)}
  g.append(r)}
 const L=el('div','nl');L.style.height=((TOP-BOT+1)*RH)+'px';L.style.width=(16*CW)+'px';
 const gd=el('div','gd');L.append(gd);g.append(L);
 const guide=(q,on)=>{gd.style.display=on?'block':'none';gd.style.left=q.s*CW+'px';gd.style.width=q.l*CW+'px'};
 const pos=(e,q)=>{e.style.left=q.s*CW+'px';e.style.top=(TOP-q.m)*RH+'px';e.style.width=q.l*CW+'px';e.style.height=RH+'px';e.firstChild.textContent=NN[q.m%12]+(Math.floor(q.m/12)-1)};
 function select(q){selN=q;L.childNodes.forEach(e=>e.classList.toggle('sel',e._q===q));hl(q?q.m:null)}
 function draw(q){const e=el('div','note'),h=el('i','grip');e._q=q;e.append(el('span'),h);pos(e,q);
  e.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();select(q);prev(q.m);
   const x0=ev.clientX,y0=ev.clientY,o={s:q.s,m:q.m};e.setPointerCapture(ev.pointerId);guide(q,1);
   e.onpointermove=t=>{const dx=Math.round((t.clientX-x0)/CW),dy=Math.round((t.clientY-y0)/RH);
    q.s=Math.max(0,Math.min(16-q.l,o.s+dx));const nm=Math.max(BOT,Math.min(TOP,o.m-dy));
    if(nm!==q.m){q.m=nm;prev(nm);hl(nm)}pos(e,q);guide(q,1)};
   const up=()=>{e.onpointermove=null;guide(q,0);save()};e.onpointerup=up;e.onpointercancel=up};
  h.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();select(q);
   const x0=ev.clientX,l0=q.l;h.setPointerCapture(ev.pointerId);guide(q,1);
   h.onpointermove=t=>{const n2=Math.max(1,Math.min(16-q.s,l0+Math.round((t.clientX-x0)/CW)));if(n2!==q.l){q.l=n2;pos(e,q);guide(q,1)}};
   const up=()=>{h.onpointermove=null;guide(q,0);save()};h.onpointerup=up;h.onpointercancel=up};
  L.append(e)}
 a.forEach(draw);m.append(g);select(selN)};
render();
