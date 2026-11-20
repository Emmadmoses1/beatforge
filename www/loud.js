master.gain.value=1;
comp.threshold.value=-12;comp.release.value=.15;
comp.disconnect(lim);
const mu=ctx.createGain();mu.gain.value=2;comp.connect(mu);mu.connect(lim);
lim.threshold.value=-4;
pre.gain.value=1;pre.disconnect();sh2.disconnect();
const sh3=ctx.createWaveShaper(),cv3=new Float32Array(4096);
for(let i=0;i<4096;i++){const x=i/2048-1;cv3[i]=Math.tanh(1.6*x)/Math.tanh(1.6)}
sh3.curve=cv3;sh3.oversample='4x';pre.connect(sh3);sh3.connect(ctx.destination);
const _rm=rMix;
rMix=function(m){_rm(m);const f=m.querySelector('.strip:last-child .fader');if(f){f.max=200;f.value=master.gain.value*100}};
render();
