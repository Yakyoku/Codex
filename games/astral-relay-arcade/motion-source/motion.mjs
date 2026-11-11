// ASTRAL RELAY motion-r05. Presentation state only; never writes game/save data.
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const ease=v=>{v=clamp(v,0,1);return v*v*(3-2*v)};
export const follow=(v,target,rate,dt)=>target+(v-target)*Math.exp(-rate*dt);
export const EFFECT_LIMIT=96;
const lengths={shot:.13,impact:.26,explode:.72,damage:.6,merge:1.15,bonus:1.1,formation:1.1,extend:1.2};
export class Motion {
 constructor(){this.tracks=new Map;this.effects=[];this.last=null;this.time=0;this.reduced=false;this.player=null;this.serial=0;this.samples=new WeakMap;this.proxies=new WeakMap;this.alpha=1;this.sampleTime=-1;}
 sample(g){if(g.time<this.sampleTime)this.samples=new WeakMap;this.sampleTime=g.time;for(const o of [g,...g.entities,...g.shots,...g.bullets]){let s=this.samples.get(o);if(!s||Math.hypot(o.x-s.x,o.y-s.y)>80){s={x:o.x,y:o.y,px:o.x,py:o.y,time:g.time};this.samples.set(o,s)}else if(s.time!==g.time){s.px=s.x;s.py=s.y;s.x=o.x;s.y=o.y;s.time=g.time}}}
 presentation(g){const m=this,arrays=new Map;const wrap=o=>{let p=m.proxies.get(o);if(!p){p=new Proxy(o,{get(target,key){if(key==='x'||key==='y'){const s=m.samples.get(target);return s?s['p'+key]+(s[key]-s['p'+key])*m.alpha:target[key]}return Reflect.get(target,key)}});m.proxies.set(o,p)}return p};return new Proxy(g,{get(target,key){if(['entities','shots','bullets'].includes(key)){let out=arrays.get(key);if(!out){out=[];arrays.set(key,out)}out.length=target[key].length;for(let i=0;i<out.length;i++)out[i]=wrap(target[key][i]);return out}if(key==='x'||key==='y')return wrap(target)[key];const v=Reflect.get(target,key);return typeof v==='function'?v.bind(target):v}})}
 clear(){this.samples=new WeakMap;this.sampleTime=-1;this.tracks.clear();this.effects.length=0;this.player=null;this.last=null;this.time=0;}
 event(e,g){if(this.last!==null&&g.time<this.last)this.clear();if(!(e.type in lengths))return;
  if(this.effects.length===EFFECT_LIMIT)this.effects.shift();
  this.effects.push({type:e.type,x:e.x,y:e.y,born:g.time,life:lengths[e.type],seed:++this.serial});
  if(e.type==='shot'&&this.player)this.player.recoil=1;
  if(e.type==='damage'&&this.player)this.player.damage=1;
 }
 track(key,e,dt,kind){let p=this.tracks.get(key);if(!p){p={x:e.x,y:e.y,vx:0,vy:0,roll:0,pitch:0,yaw:kind==='player'?0:Math.PI,scale:1,thrust:1,fin:0,hit:0,recoil:0,damage:0,hp:e.hp,kind,phase:typeof key==='number'?key*2.399:0};this.tracks.set(key,p);}
  const jump=Math.hypot(e.x-p.x,e.y-p.y)>80;
  let vx=dt&&!jump?(e.x-p.x)/dt:0,vy=dt&&!jump?(e.y-p.y)/dt:0;
  if(dt){const rate=kind==='carrier'?4:kind==='dart'?16:10;p.vx=follow(p.vx,clamp(vx,-500,500),rate,dt);p.vy=follow(p.vy,clamp(vy,-500,500),rate,dt);
   p.roll=follow(p.roll,clamp(-p.vx/700,-.32,.32),rate,dt);
   p.pitch=follow(p.pitch,clamp(p.vy/1500,-.13,.13),9,dt);
   const target=kind==='player'?0:Math.atan2(-p.vx,-p.vy);
   const delta=Math.atan2(Math.sin(target-p.yaw),Math.cos(target-p.yaw));p.yaw+=clamp(delta*(1-Math.exp(-rate*dt)),-3*dt,3*dt);
   p.thrust=follow(p.thrust,clamp(1+Math.hypot(p.vx,p.vy)/350,.8,1.8),7,dt);
   p.recoil*=Math.exp(-32*dt);p.damage*=Math.exp(-9*dt);p.hit*=Math.exp(-20*dt);
  }
  if(e.hp<p.hp)p.hit=1;p.hp=e.hp;p.x=e.x;p.y=e.y;
  return p;
 }
 update(g){if(this.last!==null&&g.time<this.last)this.clear();const dt=this.last===null?0:clamp(g.time-this.last,0,.1);this.last=g.time;this.time=g.time;
  const p=this.track('player',g,dt,'player');this.player=p;
  p.scale=follow(p.scale,g.power?1.18:1,6,dt);p.fin=follow(p.fin,g.focus?-.18:g.power?.14:0,12,dt);
  p.shield=g.shield;p.power=g.power;p.focus=g.focus;
  const alive=new Set(['player']);for(const e of g.entities){alive.add(e.id);const q=this.track(e.id,e,dt,e.kind);q.age=e.age;q.warning=!['tower','hidden','relay'].includes(e.kind)&&e.y>0&&e.y<480?ease(1-(e.shot??10)/.4):0;q.reveal=e.kind==='hidden'?follow(q.reveal||0,(12-e.hp)/12,8,dt):0;}
  for(const key of this.tracks.keys())if(!alive.has(key))this.tracks.delete(key);
  this.effects=this.effects.filter(e=>g.time-e.born<e.life);return dt;
 }
 pose(key){const p=this.tracks.get(key);if(!p)return null;const t=this.time,small=this.reduced?.2:1;
  p.bank=p.roll*small;p.nod=p.pitch*small;
  p.wing=p.fin+(p.kind==='dart'?Math.sin(t*5+p.phase)*.045:0)*small;
  p.hover=p.kind==='relay'?Math.sin(t*3+p.phase)*.025*small:0;
  p.spin=p.kind==='orb'?t*.65+p.phase:0;
  p.beacon=p.kind==='relay'?.55+.45*Math.sin(t*4+p.phase):0;
  p.light=.65+.35*Math.sin(t*3+p.phase);
  p.engine=p.thrust*(1+.045*Math.sin(t*23+p.phase)*small);
  p.kick=(p.recoil*.035+p.damage*.07)*small;
  p.coreRadius=.38+.65*(1-ease((p.age||0)/2));
  p.corePulse=p.kind==='core'&&p.age>=2&&p.age<4.2?1+.07*Math.sin(t*7)*small:1;
  return p;
 }
}
export function particle(effect,index,time){const age=clamp(time-effect.born,0,effect.life),u=age/effect.life,a=index*2.399+effect.seed*.7;
 const speed=35+index%4*13,travel=speed*(1-Math.exp(-3*age))/3;
 return {x:effect.x+Math.cos(a)*travel,y:effect.y+Math.sin(a)*travel+age*age*18,z:Math.sin(a*2)*travel/160,angle:a+age*(index%2?4:-3),alpha:(1-u)**2,size:2.5*(1-u)+.5};
}
export function installMotionPreference(motion){if(typeof document==='undefined')return;const host=document.createElement('button');host.type='button';host.textContent='動き: 標準';host.title='機体の傾き・装飾動作を抑える（ゲーム速度は変わりません）';host.style.cssText='font:14px sans-serif;background:#10283c;color:#baffef;border:1px solid #456575;border-radius:6px;padding:10px;margin:8px';
 motion.reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
 const label=()=>{host.textContent=motion.reduced?'動き: 控えめ':'動き: 標準';host.setAttribute('aria-pressed',String(motion.reduced))};host.onclick=()=>{motion.reduced=!motion.reduced;label()};motion.preferenceLabel=label;label();(document.getElementById?.("options")||document.body).append(host);
}
