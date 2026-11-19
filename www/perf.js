master.gain.value=.6;
comp.threshold.value=-10;comp.knee.value=0;comp.ratio.value=20;comp.attack.value=.002;comp.release.value=.08;
const sh=ctx.createWaveShaper(),cv=new Float32Array(2048);
for(let i=0;i<2048;i++){const x=i/1024-1;cv[i]=Math.tanh(x*1.3)/Math.tanh(1.3)}
sh.curve=cv;sh.oversample='2x';comp.disconnect(ctx.destination);comp.connect(sh);sh.connect(ctx.destination);

let act=0;const _t2=trig;
trig=function(c,n,t){if(act>40)return;act++;setTimeout(()=>act--,1200);_t2(c,n,t)};

const hq=[];
sched=function(){while(nextT<ctx.currentTime+.2){const st=pos%16,bar=Math.floor(pos/16);
 barPats(bar).forEach(pi=>chs.forEach(c=>(pats[pi][c.id]||[]).forEach(n=>{if(n.s===st)trig(c,n,nextT)})));
 hq.push([nextT,pos]);nextT+=sd();pos++;if(pos>=(song?songLen():1)*16)pos=0}};
(function raf(){const lat=(ctx.outputLatency||0)+(ctx.baseLatency||0);let last=-1;
 while(hq.length&&hq[0][0]+lat<=ctx.currentTime)last=hq.shift()[1];
 if(last>=0&&playing)head(last);requestAnimationFrame(raf)})();

const wk=new Worker(URL.createObjectURL(new Blob(['let t=null;onmessage=e=>{clearInterval(t);if(e.data==="go")t=setInterval(()=>postMessage(0),20)}'])));
wk.onmessage=()=>{if(playing)sched()};
$('#play').onclick=()=>{ctx.resume();if(playing)return stop();playing=true;pos=0;nextT=ctx.currentTime+.06;hq.length=0;wk.postMessage('go');$('#play').classList.add('on')};
stop=function(){wk.postMessage('x');playing=false;pos=0;hq.length=0;$('#play').classList.remove('on');document.querySelectorAll('.cur').forEach(x=>x.classList.remove('cur'));$('#lcd').textContent='1:1'};
$('#stop').onclick=()=>stop();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)ctx.resume()});

rPiano=function(m){const c=chs.find(x=>x.id===sel);
 if(!c||c.kind!=='syn'){m.append(el('div','msg','Pick a synth channel in the Rack and tap "Piano".'));return}
 const bar=el('div','row');bar.append(el('b',null,c.name));
 [1,2,4].forEach(l=>bar.append(el('button','b'+(nl===l?' on':''),'Snap '+l,()=>{nl=l;render()})));m.append(bar);
 const g=el('div','roll'),a=nt(c);
 const prev=k=>{cur=c.n;playNote(c.key,k,ctx.currentTime).rel(ctx.currentTime+.4)};
 for(let k=84;k>=48;k--){const r=el('div','rr'+([1,3,6,8,10].includes(k%12)?' bk':'')),kl=el('div','kl',k%12===0?'C'+(k/12-1):'');
  kl.onpointerdown=()=>prev(k);r.append(kl);
  for(let s=0;s<16;s++){const n=a.find(n=>n.m===k&&s>=n.s&&s<n.s+n.l);
   const u=el('div','cell'+(n?' on':'')+(n&&n.s===s?' hd':''));u.dataset.c=s;
   u.onclick=()=>{const x=a.find(q=>q.m===k&&s>=q.s&&s<q.s+q.l);
    if(x){a.splice(a.indexOf(x),1);for(let i=x.s;i<x.s+x.l;i++)r.children[i+1].classList.remove('on','hd')}
    else{const q={s,m:k,l:Math.min(nl,16-s)};a.push(q);for(let i=q.s;i<q.s+q.l;i++)r.children[i+1].classList.add('on');r.children[q.s+1].classList.add('hd');prev(k)}
    save()};r.append(u)}
  g.append(r)}m.append(g)};
render();
