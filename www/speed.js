/* lighter output chain: one limiter + soft clipper that can never hard-clip */
[master,comp,mu,lim,pre,sh3].forEach(n=>{try{n.disconnect()}catch(e){}});
const lm=ctx.createDynamicsCompressor();lm.threshold.value=-8;lm.knee.value=3;lm.ratio.value=14;lm.attack.value=.001;lm.release.value=.12;
const up2=ctx.createGain();up2.gain.value=2.8;
const pg=ctx.createGain();pg.gain.value=.6;
const sat=ctx.createWaveShaper(),fcv=new Float32Array(2048);
for(let i=0;i<2048;i++){const x=i/1024-1;fcv[i]=Math.tanh(2*x)}
sat.curve=fcv;sat.oversample='2x';
master.connect(lm);lm.connect(up2);up2.connect(pg);pg.connect(sat);sat.connect(ctx.destination);lm.connect(an);

/* recorder only runs while recording */
const _MR=window.MediaRecorder;
window.MediaRecorder=function(s,o){sat.connect(dest);const r=new _MR(s,o);r.addEventListener('stop',()=>{try{sat.disconnect(dest)}catch(e){}});return r};

/* cheaper sounds */
DR['Hi-hat']=t=>{noise(t,.05,'highpass',8000,.7,.4*vl());noise(t,.03,'bandpass',10000,1.5,.25*vl())};
DR['Open Hat']=t=>noise(t,.35,'highpass',7500,.7,.3*vl());
DR.Crash=t=>noise(t,1.2,'highpass',6500,.6,.3*vl());
const _pn=playNote;
playNote=function(k,m,t){
 if(k==='pad'){const g=ctx.createGain(),lp=ctx.createBiquadFilter(),os=[];lp.type='lowpass';lp.frequency.value=1100;lp.Q.value=.5;
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(.25,t+.5);
  [-7,7].forEach(d=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m);o.detune.value=d;o.connect(lp);o.start(t);os.push(o)});
  lp.connect(g);g.connect(cur);return{rel(tt){rel(g,.25,tt);os.forEach(o=>o.stop(tt+2))}}}
 if(k==='grand'){const g=ctx.createGain(),f=mtof(m),dec=Math.max(1.2,4-m/30);g.connect(cur);
  [[1,1],[2,.45],[3,.2]].forEach(([h,a])=>{const o=ctx.createOscillator(),p2=ctx.createGain();o.type='sine';o.frequency.value=f*h;env(p2,t,.003,a*.5,dec/h*1.3);o.connect(p2);p2.connect(g);o.start(t);o.stop(t+dec/h*1.3+.1)});
  noise(t,.02,'lowpass',2500,.5,.1);return{rel(tt){rel(g,.15,tt)}}}
 return _pn(k,m,t)};

/* glow switch + auto-lighten when the screen lags */
if(localStorage.getItem('bfglow')==='1')document.body.classList.add('glow');
let lt=performance.now(),bad=0;
(function fr(){const n=performance.now(),d=n-lt;lt=n;
 if(d>50&&playing)bad++;else if(bad>0&&d<25)bad-=.05;
 if(bad>20){bad=0;if(document.body.classList.contains('glow')){document.body.classList.remove('glow');localStorage.setItem('bfglow','0')}}
 requestAnimationFrame(fr)})();
const _rb2=rBrow;
rBrow=function(m){_rb2(m);m.append(el('h4',null,'Visuals'));
 const on=document.body.classList.contains('glow');
 m.append(el('div','bi','Glow effects: '+(on?'ON':'OFF')+' (tap to switch)',()=>{document.body.classList.toggle('glow');localStorage.setItem('bfglow',document.body.classList.contains('glow')?'1':'0');render()}))};
render();
