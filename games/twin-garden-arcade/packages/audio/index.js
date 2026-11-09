/** Twin Garden's original score. All oscillators, envelopes and noise are local.
 * A look-ahead scheduler keeps musical time independent of rendering FPS. */
                                                             
                                                  
                                         
const tunes                            = {
 title:[72,76,79,83,81,79,76,74,72,0,67,71,74,76,79,0,76,79,84,83,81,79,76,74,72,71,69,67,71,74,72,0],
 play:[76,79,81,79,72,76,79,0,74,77,81,84,83,79,77,74,76,79,84,86,84,81,79,76,77,81,79,74,76,72,71,72],
 power:[84,88,91,88,86,89,93,89,88,91,95,91,86,89,93,89,84,91,88,96,95,91,88,84,86,89,93,89,88,84,79,83],
 bonus:[79,84,88,91,88,84,86,89,93,89,86,84,83,86,91,95,93,89,86,81,88,91,96,91,89,86,83,79,84,88,91,84]
};
const chords=[[48,52,55],[45,48,52],[53,57,60],[43,47,50]];
const safeStorage={read()                       {try{const value        =JSON.parse(localStorage.getItem('twin-garden-audio')||'{}');return value!==null&&typeof value==='object'&&!Array.isArray(value)?value                          :{};}catch{return {}}},write(v        ){try{localStorage.setItem('twin-garden-audio',JSON.stringify(v))}catch{}}};
export class AudioEngine {
 context                  =null;
 volumes                       ={music:.46,sfx:.65,ambient:.2};
 muted=false;
 mode          ='title';
         master              =null;
         buses                                  ={};
         timer                                    =null;
         next=0;         beat=0;         noise                 =null;
         mapper                                 =null;
         ambientNodes                 =[];
         effectAt                      ={};
         lifecycle=0;
 constructor(){const saved=safeStorage.read();for(const c of ['music','sfx','ambient']             )if(typeof saved[c]==='number'&&Number.isFinite(saved[c]))this.volumes[c]=Math.max(0,Math.min(1,saved[c]          ));this.muted=saved.muted===true;}
 async unlock(){
  const revision=++this.lifecycle;
  if(!this.context){
   const C=globalThis.AudioContext||(globalThis       ).webkitAudioContext;
   if(!C)return;
   const ctx=this.context=new C({latencyHint:'interactive'});
   this.master=ctx.createGain();this.master.gain.value=this.muted?0:.72;
   const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=12;limiter.ratio.value=6;limiter.attack.value=.004;limiter.release.value=.18;
   const ceiling=ctx.createWaveShaper();const curve=new Float32Array(4096);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=.9*Math.tanh(x/.9);}ceiling.curve=curve;
   this.master.connect(limiter);limiter.connect(ceiling);ceiling.connect(ctx.destination);
   for(const c of ['music','sfx','ambient']             ){const g=ctx.createGain();g.gain.value=this.volumes[c];g.connect(this.master);this.buses[c]=g;}
   this.noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const data=this.noise.getChannelData(0);let seed=23917;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/4294967296*2-1);}
   // Quiet, breathing garden drone, kept far below gameplay warnings.
   for(const [f,gain] of [[130.81,.012],[196,.008],[261.63,.004]]){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.value=gain;o.connect(g);g.connect(this.buses.ambient );o.start();this.ambientNodes.push(o);}
  }
  const ctx=this.context ;try{await ctx.resume();}catch{return;}if(this.context!==ctx||revision!==this.lifecycle||ctx.state!=='running')return;if(!this.timer)this.next=ctx.currentTime+.05;this.startScheduler();
 }
         startScheduler(){if(this.timer)return;this.timer=setInterval(()=>this.schedule(),25);this.schedule();}
         save(){safeStorage.write({...this.volumes,muted:this.muted});}
 setVolume(channel        ,value       ){this.volumes[channel]=Math.max(0,Math.min(1,Number.isFinite(value)?value:0));if(this.context&&this.buses[channel])this.buses[channel] .gain.setTargetAtTime(this.volumes[channel],this.context.currentTime,.025);this.save();}
 setMuted(value        ){this.muted=value;if(this.context&&this.master)this.master.gain.setTargetAtTime(value?0:.72,this.context.currentTime,.025);this.save();}
 setMode(mode          ){if(this.mode===mode)return;this.mode=mode;this.beat=0;if(this.context)this.next=Math.max(this.next,this.context.currentTime+.03);}
 suspend(){this.lifecycle++;if(this.timer){clearInterval(this.timer);this.timer=null;}if(this.context?.state==='running')void this.context.suspend().catch(()=>{});}
 async resume(){const ctx=this.context,revision=++this.lifecycle;if(ctx){try{await ctx.resume();}catch{return;}if(this.context!==ctx||revision!==this.lifecycle||ctx.state!=='running')return;if(!this.timer)this.next=ctx.currentTime+.04;this.startScheduler();}}
 dispose(){this.suspend();for(const n of this.ambientNodes)n.stop();this.ambientNodes=[];void this.context?.close().catch(()=>{});this.context=null;this.buses={};this.master=null;this.effectAt={};}
 setSpatialMapper(mapper                                 ){this.mapper=mapper;}
 listener(position     ,forward     ,up     ={x:0,y:1,z:0}){if(!this.context)return;const l=this.context.listener,t=this.context.currentTime;if(l.positionX){l.positionX.setValueAtTime(position.x,t);l.positionY.setValueAtTime(position.y,t);l.positionZ.setValueAtTime(position.z,t);l.forwardX.setValueAtTime(forward.x,t);l.forwardY.setValueAtTime(forward.y,t);l.forwardZ.setValueAtTime(forward.z,t);l.upX.setValueAtTime(up.x,t);l.upY.setValueAtTime(up.y,t);l.upZ.setValueAtTime(up.z,t);}else{l.setPosition(position.x,position.y,position.z);l.setOrientation(forward.x,forward.y,forward.z,up.x,up.y,up.z);}}
         tone(note       ,t       ,duration       ,volume       ,type               ='triangle',destination           ,detune=0){const c=this.context;if(!c||!note)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=440*2**((note-69)/12);o.detune.value=detune;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.35),t+duration*.4);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(destination||this.buses.music );o.start(t);o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};}
         drum(t       ,hat        ){const c=this.context ;if(hat){const n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();n.buffer=this.noise;f.type='highpass';f.frequency.value=5200;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.0001,t+.055);n.connect(f);f.connect(g);g.connect(this.buses.music );n.start(t);n.stop(t+.07);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};}else{const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(105,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(.17,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(this.buses.music );o.start(t);o.stop(t+.18);o.onended=()=>{o.disconnect();g.disconnect();};}}
         schedule(){const c=this.context;if(!c||c.state!=='running')return;if(this.next<c.currentTime-.1)this.next=c.currentTime+.02;const step=60/({title:104,play:126,power:150,bonus:138}[this.mode])/2;while(this.next<c.currentTime+.13){const b=this.beat,t=this.next,melody=tunes[this.mode],note=melody[b%32],chord=chords[Math.floor(b/8)%4];this.tone(note,t,step*.87,.105,'triangle');if(note)this.tone(note+12,t,step*.6,.025,'sine',undefined,3);if(b%2===0)this.tone(chord[b%4===0?0:2]-12,t,step*1.65,.12,'triangle');if(b%8===0)for(const n of chord)this.tone(n+12,t,step*7.6,.026,'sine');if(this.mode!=='title'){if(b%4===0)this.drum(t,false);this.drum(t,true);}if(this.mode==='bonus'||this.mode==='power')this.tone(chord[b%3]+24,t+step*.5,step*.35,.035,'square');this.next+=step;this.beat++;}}
 event(type       ,x=500,y=350){const c=this.context;if(!c||c.state!=='running')return;const t=c.currentTime+.008;if((this.effectAt[type]||0)>t-.055)return;this.effectAt[type]=t;
  const aliases                      ={peg:'hook',attach:'hook',wrap:'hook',unhook:'hook',capture:'capture',captured:'capture',plant:'heal',recover:'heal',powerup:'power',powered:'power',hit:'hit',miss:'hit',death:'hit',treasure:'treasure',reveal:'treasure',gem:'gem',bonus:'bonus',clear:'clear',stageclear:'clear',move:'move',reset:'reset'};
  const kind=aliases[type]||type;
  const patterns                        ={warning:[55,0,55,62],regrow:[67,72],hook:[76,83],capture:[72,76,79,84],heal:[67,74,79],power:[72,79,84,88,91],hit:[48,43,36],treasure:[79,84,88,91,96],gem:[84,91,96],bonus:[72,76,79,84,88,91,96],clear:[72,76,79,84,79,84,88,91],move:[55],reset:[79,74],start:[72,79,84],pause:[72,67],ui:[79]};
  const notes=patterns[kind]||[76,79];let dest          =this.buses.sfx ,spatial               =null;
  // Critical warnings always centered, preserving salience regardless of head pose.
  if(kind!=='hit'&&kind!=='warning'&&this.mapper){const p=c.createPanner();p.panningModel='HRTF';p.distanceModel='inverse';p.refDistance=1.5;p.rolloffFactor=.35;const v=this.mapper(x,y);p.positionX.value=v.x;p.positionY.value=v.y;p.positionZ.value=v.z;p.connect(dest);dest=p;spatial=p;}else if(kind!=='hit'&&kind!=='warning'){const p=c.createStereoPanner();p.pan.value=Math.max(-.7,Math.min(.7,(x-500)/715));p.connect(dest);dest=p;spatial=p;}
  notes.forEach((n,i)=>{this.tone(n,t+i*.055,kind==='hit'?.2:.22,kind==='move'?.018:.15,kind==='hit'?'sawtooth':'triangle',dest);if(kind!=='hit'&&kind!=='move')this.tone(n+12,t+i*.055,.3,.035,'sine',dest);});if(spatial)setTimeout(()=>spatial?.disconnect(),(notes.length*.055+.5)*1000);
 }
}
