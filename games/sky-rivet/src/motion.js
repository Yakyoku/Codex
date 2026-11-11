import {clamp,lerp} from './math.js';
import {STEP,floorY} from './stages.js';
export const TAU=Math.PI*2;
export const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
export const damp=(a,b,rate,dt)=>lerp(a,b,1-Math.exp(-rate*Math.max(0,dt)));
export function angleDamp(a,b,rate,dt){const delta=Math.atan2(Math.sin(b-a),Math.cos(b-a));return a+delta*(1-Math.exp(-rate*Math.max(0,dt)));}
export class Spring{
 constructor(value=0){this.x=value;this.v=0;}
 update(target,dt,omega=18){const y=this.x-target,j=this.v+omega*y,e=Math.exp(-omega*Math.max(0,dt));this.x=target+(y+j*dt)*e;this.v=(this.v-omega*j*dt)*e;return this.x;}
}
const add=(a,b)=>a.map((x,i)=>x+b[i]),scale=(a,s)=>a.map(x=>x*s),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
export function solveTwoBone(root,target,upper,lower,pole=[0,0,1]){
 let delta=sub(target,root),raw=Math.hypot(...delta),n=raw>1e-8?scale(delta,1/raw):[0,-1,0];
 const distance=clamp(raw,Math.abs(upper-lower)+1e-5,upper+lower-1e-5),end=add(root,scale(n,distance));
 let bend=sub(pole,scale(n,dot(pole,n))),len=Math.hypot(...bend);
 if(len<1e-6){const alternate=Math.abs(n[0])<.8?[1,0,0]:[0,0,1];bend=sub(alternate,scale(n,dot(alternate,n)));len=Math.hypot(...bend);}
 bend=scale(bend,1/len);const along=(upper*upper-lower*lower+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,upper*upper-along*along));
 return {root:[...root],joint:add(add(root,scale(n,along)),scale(bend,height)),end,reachable:raw<=upper+lower&&raw>=Math.abs(upper-lower)};
}
export function footCycle(phase,stride=.86){
 const u=((phase/TAU)%1+1)%1,stance=.62,span=stride*stance;
 if(u<stance){const pitch=u<.10?lerp(-.15,0,ease(u/.10)):u>.49?lerp(0,.22,ease((u-.49)/(.62-.49))):0;return {z:span*(.5-u/stance),lift:0,pitch,stance:true};}
 const t=(u-stance)/(1-stance);return {z:lerp(-span*.5,span*.5,ease(t)),lift:.14*Math.sin(Math.PI*t)**2,pitch:.25*Math.sin(TAU*t),stance:false};
}
// Rotate around the actual heel/toe ground contact, rather than sinking the
// sole into the floor when rolling the foot at heel strike or toe-off.
export function footRoll(pitch){const z=pitch>0?.28:-.12,y=-.13;return {y:y-(y*Math.cos(pitch)-z*Math.sin(pitch)),z:z-(y*Math.sin(pitch)+z*Math.cos(pitch))};}
export function rungAnchor(bodyY,base,offset=0,height=1.25){
 const travel=(bodyY+height-base)/.29+offset,k=Math.floor(travel),f=travel-k;
 return base+(k+ease((f-.64)/.36))*.29;
}
export function rungCycle(bodyY,base,offset,height){const u=(bodyY+height-base)/.29+offset,f=u-Math.floor(u),t=clamp((f-.64)/.36,0,1),arc=Math.sin(Math.PI*t)**2;return {anchor:rungAnchor(bodyY,base,offset,height),arc,grip:1-arc};}
export function toolClip(age){
 const u=clamp(age/.48,0,1);let angle;
 if(u<.22)angle=lerp(-.28,-1.35,ease(u/.22));
 else if(u<.53)angle=lerp(-1.35,1.45,ease((u-.22)/.31));
 else angle=lerp(1.45,-.28,ease((u-.53)/.47));
 return {angle,active:age>=0&&age<.48,reach:Math.sin(clamp((u-.18)/.48,0,1)*Math.PI)};
}
export function blinkAt(time,offset=0,period=4.1){const t=((time+offset)%period+period)%period;return t<.18?Math.sin(Math.PI*t/.18)**2:0;}
export function interpolatePlayer(game){const p=game.player,previous=game.previousVisualPlayer||p,a=game.state==='playing'?clamp(game.accumulator/STEP,0,1):1;return {...p,x:lerp(previous.x,p.x,a),y:lerp(previous.y,p.y,a),z:lerp(previous.z,p.z,a)};}
export function interpolateBarrel(game,b){const prev=b.renderPrevious||b,a=game.state==='playing'?clamp(game.accumulator/STEP,0,1):1;return {x:lerp(prev.x,b.x,a),y:lerp(prev.y,b.y,a),z:lerp(prev.z,b.z,a),spin:lerp(prev.spin,b.spin,a)};}

export function humanPose({time=0,phase=0,run=0,air=0,climb=0,win=0,hurt=0,yaw=0,landing=0,lean=0,toolAge=1,vy=0,world=[0,0,0],ladder=null,stage=null,tier=0,secondary=0,role='hero',anticipation=0,recoil=0,welcome=0,lookYaw=0,lookPitch=0}={}){
 const gait=[footCycle(phase),footCycle(phase+Math.PI)],hip=.76+landing-climb*.20+run*.016*Math.cos(phase*2)+.006*Math.sin(time*2.1),tool=toolClip(toolAge),feet=[],hands=[],handGrip=[];
 for(let i=0;i<2;i++){
  const side=i?1:-1,f=gait[i],roll=f.pitch*run*(1-climb)*(1-air),pivot=footRoll(roll);let ankle=[side*.145,.13+f.lift*run+air*(vy>0?.14:.025)*(1-anticipation)+pivot.y,f.z*run+pivot.z];
  if(stage){const x=world[0]+Math.cos(yaw)*ankle[0]+Math.sin(yaw)*ankle[2];if(!(stage.kind==='lift'&&Math.abs(world[0])<1.1))ankle[1]+=(floorY(stage,tier,x)-world[1])*(1-climb)*(1-air);}
  if(ladder){const cycle=rungCycle(world[1],ladder.base,i*.5,-.06),last=Number.isFinite(ladder.top)?ladder.base+Math.floor((ladder.top+.10-ladder.base)/.29)*.29:Infinity,y=Math.min(last,cycle.anchor)-world[1]+.165+cycle.arc*.10,dx=(ladder.x??world[0])+side*.19-world[0],dz=.28-world[2]-cycle.arc*.5,target=[Math.cos(yaw)*dx-Math.sin(yaw)*dz,y,Math.sin(yaw)*dx+Math.cos(yaw)*dz],weight=climb*(1-ease((world[1]-(ladder.top??Infinity)+.18)/.18));ankle=ankle.map((v,k)=>lerp(v,target[k],weight));}
  const slope=stage?.kind==='iron'?(tier%2===0?-.025:.025):0;
  feet.push({ankle,pitch:roll-Math.atan(slope*Math.sin(yaw))*(1-air)*(1-climb),stance:f.stance});
  let hand=[side*.32,hip-.08+air*.38+win*.82,.04-Math.sin(phase+i*Math.PI)*.24*run+air*.18];
  if(win){hand[0]=side*(.37+.035*Math.sin(time*2.7));hand[1]=1.63+landing+.035*Math.sin(time*2.7+i);hand[2]=.10;}
  let grip=0;if(ladder){const cycle=rungCycle(world[1],ladder.base,i*.5,1.25),last=Number.isFinite(ladder.top)?ladder.base+Math.floor((ladder.top+.1-ladder.base)/.29)*.29:Infinity,y=Math.min(last,cycle.anchor)-world[1],dx=(ladder.x??world[0])+side*.25-world[0],dz=.32-world[2]-cycle.arc*.13,target=[Math.cos(yaw)*dx-Math.sin(yaw)*dz,y,Math.sin(yaw)*dx+Math.cos(yaw)*dz],weight=climb*(1-ease((world[1]-(ladder.top??Infinity)+.75)/.75));hand=hand.map((v,k)=>lerp(v,target[k],weight));grip=cycle.grip*weight;}
  if(i===1&&tool.active){const a=tool.angle;hand=[.33,1.08+.38*Math.cos(a),.12+.4*Math.sin(a)];}
  if(i===0&&tool.active)hand=[-.35,.90+tool.reach*.07,-.10-tool.reach*.12];
  if(role==='rescue'&&(win>0||welcome>0)){const wave=1-(1-win)*(1-welcome);hand=hand.map((v,k)=>lerp(v,(i===0?[-.35,1.55+.07*Math.sin(time*4.1),.12]:[.27,1.08,.22])[k],wave));}
  hands.push(hand);handGrip.push(grip);
 }
 tool.angle+=recoil;return {time,phase,run,air,climb,win,hurt,yaw,hip,lean,secondary,tool,feet,hands,handGrip,blink:blinkAt(time,role==='hero'?1.2:2.7),gazeX:clamp(lookYaw*.05,-.016,.016)+.004*Math.sin(time*.7),gazeY:clamp(lookPitch*.1,-.018,.022)+air*.012+climb*.015,lookYaw,lookPitch,smile:.2+.8*win-.15*hurt,breath:Math.sin(time*2.1)*.012,pelvisX:-Math.cos(phase)*.022*run*(1-climb),spineTwist:Math.sin(phase)*.055*run,headLag:secondary*.35,role};
}

export class MotionDirector{
 constructor(game){this.reset(game);}
 reset(game){this.time=0;this.phase=0;this.run=0;this.air=0;this.climb=game.player.ladder>=0?1:0;this.win=0;this.yaw=game.player.facing*1.3;this.last={x:game.player.x,y:game.player.y};this.body=new Spring();this.follow=new Spring();this.toolAge=1;this.throwAge=2;this.toolStart=null;this.throwStart=null;this.bossLoad=0;this.bossReact=0;this.attachX=0;this.lastLadder=game.player.ladder;this.ladderData=null;this.accel=0;this.lastVelocity=game.player.vx;this.impact=new Spring();this.lookYaw=0;this.lookPitch=0;this.welcome=0;this.bossDirection=1;this.footWorldYaw=[this.yaw,this.yaw];}
 event(type,game){if(type==='reset'){this.reset(game);return;}if(type==='swing'){this.toolAge=0;this.toolStart=game.elapsed;}if(type==='tool'){this.impact.v-=3;if(this.toolAge>=.48){this.toolAge=.24;this.toolStart=game.elapsed-.24;}}if(type==='tool'||type==='device')this.bossDirection=Math.sign((game.player.x||0)+7.9)||1;if(type==='throw'){this.throwAge=0;this.throwStart=game.elapsed;}if(type==='land')this.body.v-=Math.min(8,Math.abs(game.previousVisualPlayer?.vy||4))*.7;}
 sample(game,delta){
  const active=['playing','title','ending','clear'].includes(game.state),dt=active?clamp(delta,0,.1):0,p=interpolatePlayer(game);let dx=p.x-this.last.x;
  if(Math.abs(dx)>2||Math.abs(p.y-this.last.y)>4){this.reset(game);dx=0;}
  if(dt){this.time+=dt;this.toolAge+=dt;this.throwAge+=dt;this.phase+=Math.min(Math.abs(dx),.5)/.86*TAU;}
  if(p.ladder>=0&&this.lastLadder<0)this.attachX=this.last.x-p.x;this.attachX=damp(this.attachX,0,24,dt);this.lastLadder=p.ladder;const renderX=p.x+this.attachX;this.last={x:p.x,y:p.y};const renderTime=game.elapsed+(game.state==='playing'?game.accumulator-STEP:game.endingTime||0);if(dt&&this.toolStart!==null)this.toolAge=Math.max(0,renderTime-this.toolStart);if(dt&&this.throwStart!==null)this.throwAge=Math.max(0,renderTime-this.throwStart);const targetRun=game.state==='playing'&&p.grounded&&p.ladder<0?clamp(Math.abs(p.vx)/3.8,0,1):0;
  this.run=damp(this.run,targetRun,14,dt);this.air=damp(this.air,!p.grounded&&p.ladder<0?1:0,20,dt);this.climb=damp(this.climb,p.ladder>=0?1:0,18,dt);this.win=damp(this.win,['ending','clear'].includes(game.state)?1:0,6,dt);
  const targetYaw=p.ladder>=0?0:p.facing*(1.3+.27*this.run);this.yaw=angleDamp(this.yaw,targetYaw,15,dt);
  this.accel=damp(this.accel,dt?(p.vx-this.lastVelocity)/dt:0,14,dt);this.lastVelocity=p.vx;const landing=clamp(this.body.update(0,dt),-.105,.018),lean=.07*this.run+clamp(this.accel*Math.sin(this.yaw)/40,-.08,.08)+landing*.4,secondary=this.follow.update(lean+landing*2,dt,10),recoil=clamp(this.impact.update(0,dt,24),-.12,.04);
  let gazeTarget=null,nearest=6;for(const b of game.barrels){const distance=Math.hypot(b.x-p.x,b.y-p.y-1.2,b.z-p.z);if(distance<nearest){nearest=distance;gazeTarget=b;}}const goal=gazeTarget?[gazeTarget.x,gazeTarget.y,gazeTarget.z]:game.stage.goal,deltaLook=[goal[0]-p.x,goal[1]-p.y-1.4,goal[2]-p.z],yawTo=Math.atan2(deltaLook[0],deltaLook[2]);this.lookYaw=damp(this.lookYaw,clamp(Math.atan2(Math.sin(yawTo-this.yaw),Math.cos(yawTo-this.yaw)),-.35,.35),8,dt);this.lookPitch=damp(this.lookPitch,p.ladder>=0?.15:clamp(Math.atan2(deltaLook[1],Math.hypot(deltaLook[0],deltaLook[2])),-.18,.18),8,dt);
  const altitude=p.y-floorY(game.stage,p.tier,p.x),anticipation=p.vy<0?ease((.40-altitude)/.40):0;
  const l=game.stage.ladders[p.ladder];if(l)this.ladderData={x:l.x,base:floorY(game.stage,l.from,l.x)+.18,top:floorY(game.stage,l.to,l.x)};else if(this.climb<.001)this.ladderData=null;const ladder=this.ladderData;
  const pose=humanPose({time:this.time,phase:this.phase,run:this.run,air:this.air,climb:this.climb,win:this.win,hurt:game.fallFade>0?1:0,yaw:this.yaw,landing,lean,toolAge:this.toolAge,vy:p.vy,world:[renderX,p.y,p.z],ladder,stage:game.stage,tier:p.tier,secondary,anticipation,recoil,lookYaw:this.lookYaw,lookPitch:this.lookPitch});
  for(let i=0;i<2;i++){const swing=!pose.feet[i].stance||this.run<.1||this.climb>.1;if(swing)this.footWorldYaw[i]=angleDamp(this.footWorldYaw[i],this.climb>.1?0:this.yaw,10,dt);const relative=Math.atan2(Math.sin(this.footWorldYaw[i]-this.yaw),Math.cos(this.footWorldYaw[i]-this.yaw));this.footWorldYaw[i]=this.yaw+clamp(relative,-.4,.4);pose.feet[i].yaw=clamp(relative,-.4,.4);}
  const invulnerable=game.state!=='title'&&p.invincible>0&&p.invincible<10;pose.glow=invulnerable?.10+.075*Math.sin(this.time*9):0;
  const top=game.stage.floors-1,bossY=floorY(game.stage,top,-7.9),wind=ease((1.1-game.spawnIn)/1.1);
  this.bossLoad=damp(this.bossLoad,wind,12,dt);this.bossReact=damp(this.bossReact,game.enemyReaction,14,dt);
  this.welcome=damp(this.welcome,Math.abs(p.y-game.stage.goal[1])<2&&Math.abs(p.x-game.stage.goal[0])<4?1:0,5,dt);
  const release=[-8.8,floorY(game.stage,top,-8.8)+.42,0],held=[lerp(-7.9,release[0],wind),lerp(bossY+2.1,release[1],wind),lerp(.72,0,wind)];
  return {player:{position:[renderX,p.y,p.z],pose},boss:{load:this.bossLoad,releaseWind:wind,reaction:this.bossReact,throwAge:this.throwAge,defeat:ease(game.endingTime/1.4),held:game.spawnIn<1.1?held:null,rootY:bossY,direction:this.bossDirection,footY:[floorY(game.stage,top,-7.9-.46*1.4)-bossY,floorY(game.stage,top,-7.9+.46*1.4)-bossY]},rescue:humanPose({time:this.time+2,win:this.win,welcome:this.welcome,yaw:-.14,lookPitch:Math.sin(this.time*2.6)*this.win*.05,secondary:Math.sin(this.time*2)*.018,role:'rescue'})};
 }
}
