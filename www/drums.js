const hz=()=>1+(Math.random()-.5)*.05,vl=()=>.9+Math.random()*.2;
function metal(t,dur,v,fc){const g=ctx.createGain(),hp=ctx.createBiquadFilter(),bp=ctx.createBiquadFilter();
 hp.type='highpass';hp.frequency.value=7000;bp.type='bandpass';bp.frequency.value=fc||10000;bp.Q.value=.8;
 env(g,t,.001,v,dur);
 [263,400,421,474,587,845].forEach(f=>{const o=ctx.createOscillator();o.type='square';o.frequency.value=f*hz();o.connect(bp);o.start(t);o.stop(t+dur+.05)});
 bp.connect(hp);hp.connect(g);g.connect(cur)}
DR.Kick=t=>{const v=vl();tone('sine',190*hz(),46,t,.55,v);tone('sine',60,40,t,.35,.5*v);noise(t,.012,'highpass',2500,1,.35*v)};
DR['808 Kick']=t=>{const v=vl();tone('sine',120,45,t,1.2,v);noise(t,.01,'highpass',3000,1,.2*v)};
DR.Snare=t=>{const v=vl();noise(t,.2,'highpass',1500,.7,.75*v);noise(t,.12,'bandpass',3500,.8,.3*v);tone('triangle',210*hz(),150,t,.1,.55*v);tone('triangle',330*hz(),230,t,.07,.3*v)};
DR.Clap=t=>{const v=vl();[0,.011,.023,.036].forEach(d=>noise(t+d,.04,'bandpass',1400,1.1,.55*v));noise(t+.04,.28,'bandpass',1300,1,.45*v)};
DR['Hi-hat']=t=>metal(t,.06,.1*vl());
DR['Open Hat']=t=>metal(t,.4,.09*vl());
DR.Crash=t=>metal(t,1.4,.1*vl(),8000);
DR.Tom=t=>{const v=vl();tone('sine',200*hz(),80,t,.45,.9*v);noise(t,.01,'bandpass',1500,1,.2*v)};
DR.Rim=t=>{const v=vl();tone('square',900*hz(),700,t,.04,.22*v);noise(t,.03,'bandpass',2500,2,.3*v)};
DR.Shaker=t=>noise(t,.09,'bandpass',6000*hz(),1,.3*vl());
DR.Cowbell=t=>{const v=vl();tone('square',560,555,t,.25,.22*v);tone('square',845,840,t,.25,.22*v)};
DR.Snap=t=>{const v=vl();noise(t,.03,'bandpass',2200,3,.6*v);tone('sine',1800,1200,t,.03,.2*v)};
DR.Perc=t=>{const v=vl();tone('sine',420*hz(),300,t,.18,.8*v)};
