const _t=trig,_r=rRack,_mk=mk;
const guess=d=>{for(const b of[4,2,8,1]){const v=b*240/d;if(v>=70&&v<=180)return Math.round(v)}return 0};
mk=function(o){const c=_mk(o);if(c.kind==='smp'&&c.buf&&c.lb==null)c.lb=guess(c.buf.duration);return c};
trig=function(c,n,t){
 if(c.kind==='smp'&&c.buf){if(c.mute)return;const s=ctx.createBufferSource();s.buffer=c.buf;
  if(c.lb)s.playbackRate.value=bpm/c.lb;s.connect(c.n);s.start(t);return}
 _t(c,n,t)};
rRack=function(m){_r(m);const rows=m.querySelectorAll('.ch');
 chs.forEach((c,i)=>{if(c.kind!=='smp')return;const h=rows[i].querySelector('.h');
  const f=document.createElement('input');f.type='number';f.className='lb';f.value=c.lb||'';f.placeholder='BPM';
  f.onchange=()=>{c.lb=+f.value||0;save()};h.insertBefore(f,h.querySelector('input[type=range]'))})};
save=function(){try{localStorage.setItem('bf2',JSON.stringify({bpm,pats,PL,chs:chs.map(({id,name,kind,key,vol,pan,mute,lb})=>({id,name,kind,key,vol,pan,mute,lb}))}))}catch(e){}};
render();
