/* final stage: two limiters + soft clipper, so output can never hard-clip */
sh.disconnect();comp.disconnect(sh);
const lim=ctx.createDynamicsCompressor();
lim.threshold.value=-3;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=0;lim.release.value=.05;
const pre=ctx.createGain();pre.gain.value=.5;
const sh2=ctx.createWaveShaper(),cv2=new Float32Array(4096);
for(let i=0;i<4096;i++){const x=i/2048-1;cv2[i]=Math.tanh(2*x)}
sh2.curve=cv2;sh2.oversample='4x';
comp.connect(lim);lim.connect(pre);pre.connect(sh2);sh2.connect(ctx.destination);

/* click-free samples and loops */
const _t3=trig;
trig=function(c,n,t){
 if(c.kind==='smp'&&c.buf){if(c.mute||act>32)return;act++;setTimeout(()=>act--,1200);
  const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=c.buf;if(c.lb)s.playbackRate.value=bpm/c.lb;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+.004);s.connect(g);g.connect(c.n);s.start(t);return}
 _t3(c,n,t)};

/* audio mode setting */
const _rb=rBrow;
rBrow=function(m){_rb(m);m.append(el('h4',null,'Audio'));
 const md=localStorage.getItem('bfmode')||'balanced';
 [['interactive','Fast (lowest delay)'],['balanced','Balanced (recommended)'],['playback','Safe (never crackles)']]
 .forEach(([v,t])=>m.append(el('div','bi',(md===v?'✔ ':'')+t,()=>{localStorage.setItem('bfmode',v);location.reload()})))};
render();
