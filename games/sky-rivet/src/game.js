import {clamp,sweptHit} from './math.js';
import {STAGES,DIFFICULTY,GAP,STEP,floorY,solidAt,liftY,hazardAt,pressState} from './stages.js';
export const neutralInput=()=>({x:0,y:0,z:0,jump:false,action:false,grip:false});
export class Game{
 constructor(save,onEvent=()=>{}){this.save=save;this.emit=onEvent;this.mode='2d';this.stageIndex=1;this.state='title';this.score=0;this.checkpoint=0;this.lives=3;this.time=0;this.accumulator=0;this.nextId=1;this.events=[];this.resetStage();}
 get stage(){return STAGES[this.stageIndex]};get rules(){return DIFFICULTY[this.save.settings.difficulty]}
 get flightWarningTier(){return this.stage.kind==='lift'&&this.elapsed%7>5.5?1+(Math.floor(this.elapsed/7)+1)%3:null;}
 resetStage(){this.player={x:-8,y:floorY(this.stage,0,-8),z:0,vy:0,vx:0,grounded:true,tier:0,ladder:-1,invincible:2.8,hammer:0,facing:1,land:0,anim:0};this.barrels=[];this.elapsed=0;this.remaining=this.rules.time;this.spawnIn=this.stageIndex===0?7:3.5;this.devices=new Set();this.powerTaken=false;this.score=this.checkpoint;this.accumulator=0;this.previous=neutralInput();this.warning=false;this.fallFade=0;this.jumpBuffer=0;this.coyote=.08;this.enemyReaction=0;this.endingTime=0;this.emit('reset');}
 start(index=1){this.stageIndex=clamp(index,0,this.save.unlocked);this.score=0;this.checkpoint=0;this.lives=this.rules.lives;this.resetStage();this.state='playing';this.emit('start');}
 pause(reason='manual'){if(this.state==='playing'){this.state='paused';this.previous=neutralInput();this.jumpBuffer=0;this.coyote=0;this.accumulator=0;this.emit('pause',reason);}}
 resume(){if(this.state==='paused'){this.state='playing';this.accumulator=0;this.jumpBuffer=0;this.coyote=this.player.grounded?.08:0;this.previous=neutralInput();this.emit('resume');}}
 switchMode(mode){if(mode===this.mode)return;this.mode=mode;this.resetStage();this.state='paused';this.emit('mode',mode);}
 retry(){this.lives=this.rules.lives;this.resetStage();this.state='playing';this.emit('start');}
 next(){if(this.state!=='clear')return;if(this.stageIndex===0){this.save.tutorial=true;this.stageIndex=1;}else this.stageIndex++;this.checkpoint=this.score;this.resetStage();this.state='playing';this.emit('start');}
 damage(reason='barrel'){if(this.player.invincible>0||this.state!=='playing')return;this.lives--;this.emit('hurt',reason);if(this.lives<=0){this.state='gameover';this.record();return;}this.resetStage();this.fallFade=.45;}
 record(){const key=`${this.mode}-${this.save.settings.difficulty}`;this.save.records[key]=Math.max(this.save.records[key]||0,this.score);this.emit('save');}
 complete(){if(this.state!=='playing')return;if(this.stage.kind==='summit'&&this.devices.size<3)return;this.score+=1000+Math.floor(this.remaining)*10;this.record();this.state=this.stageIndex===4?'ending':'clear';if(this.stageIndex>0)this.save.unlocked=Math.min(4,Math.max(this.save.unlocked,this.stageIndex+1));this.emit('clear');this.emit('save');}
 update(delta,input=neutralInput()){if(this.state==='ending')this.endingTime+=Math.min(.1,Math.max(0,delta));if(this.state!=='playing'){this.accumulator=0;return;}this.accumulator+=Math.min(.1,Math.max(0,delta));while(this.accumulator+1e-9>=STEP&&this.state==='playing'){this.tick(STEP,input);this.accumulator-=STEP;}this.accumulator=Math.max(0,this.accumulator);}
 tick(dt,input){const p=this.player,s=this.stage;const old=[p.x,p.y+.7,p.z];const jump=input.jump&&!this.previous.jump,action=input.action&&!this.previous.action,grip=input.grip&&!this.previous.grip;this.previous={...input};this.jumpBuffer=jump?.1:Math.max(0,this.jumpBuffer-dt);this.coyote=p.grounded?.08:Math.max(0,this.coyote-dt);this.enemyReaction=Math.max(0,this.enemyReaction-dt);const previousFlightWarning=this.flightWarningTier;this.elapsed+=dt;if(this.flightWarningTier!==null&&previousFlightWarning===null)this.emit('warning',[-9.5,this.flightWarningTier*GAP+.45,0]);this.remaining-=dt;this.time+=dt;this.fallFade=Math.max(0,this.fallFade-dt);p.invincible=Math.max(0,p.invincible-dt);p.hammer=Math.max(0,p.hammer-dt);p.land=Math.max(0,p.land-dt);p.anim+=dt*(Math.abs(input.x)>0.1?9:2);if(this.remaining<=0){p.invincible=0;this.damage('time');return;}
 let near=-1;for(let i=0;i<s.ladders.length;i++){const l=s.ladders[i];if(Math.abs(p.x-l.x)<.65&&Math.abs(p.z)<.65&&p.y>=floorY(s,l.from,l.x)-.25&&p.y<=floorY(s,l.to,l.x)+.2){near=i;break;}}
 if(p.ladder<0&&near>=0&&(this.mode==='2d'?Math.abs(input.y)>.2:grip)){p.ladder=near;p.vy=0;p.z=0;p.grounded=false;this.emit('ladder');}
 else if(p.ladder>=0&&this.mode==='vr'&&grip){p.ladder=-1;p.vy=0;}
 if(p.ladder>=0){let l=s.ladders[p.ladder],bottom=floorY(s,l.from,l.x),top=floorY(s,l.to,l.x);p.x=l.x;p.y+=input.y*1.9*dt;p.z=0;p.tier=Math.round(p.y/GAP);if(p.y>=top){p.y=top;p.tier=l.to;p.ladder=-1;p.grounded=true;}else if(p.y<=bottom&&input.y<0){p.y=bottom;p.tier=l.from;p.ladder=-1;p.grounded=true;}this.jumpBuffer=0;this.coyote=0;if(jump){p.ladder=-1;p.vy=4.7;this.emit('jump');}}
 else{let speed=3.8;p.vx=input.x*speed;if(s.kind==='conveyor'&&p.grounded&&p.tier>0)p.vx+=(p.tier%2?1:-1)*1.1;p.x=clamp(p.x+p.vx*dt,-9.6,9.6);if(Math.abs(input.x)>.1)p.facing=Math.sign(input.x);p.z=this.mode==='2d'?0:clamp(p.z+input.z*2.5*dt,-.56,.56);if(this.jumpBuffer>0&&(p.grounded||this.coyote>0)){this.jumpBuffer=0;this.coyote=0;p.vy=5.8;p.grounded=false;this.emit('jump');}let before=p.y;
 if(p.grounded){const tier=p.tier;if(solidAt(s,tier,p.x))p.y=floorY(s,tier,p.x);else{p.grounded=false;p.vy=0;}}
 if(!p.grounded){p.vy-=12*dt;p.y+=p.vy*dt;}let landed=false;
 for(let tier=s.floors-1;tier>=0;tier--){let y=floorY(s,tier,p.x);if(solidAt(s,tier,p.x)&&p.vy<=0&&before>=y-.025&&p.y<=y){p.y=y;p.vy=0;p.grounded=true;p.tier=tier;landed=true;break;}}
 if(s.kind==='lift'){for(let tier=0;tier<s.floors-1;tier++){let y=liftY(this.elapsed,tier),prev=liftY(this.elapsed-dt,tier);if(Math.abs(p.x)<1.05&&p.vy<=0&&before>=prev-.08&&p.y<=y+.06){p.y=y;p.vy=0;p.grounded=true;p.tier=tier;landed=true;}}}
 if(landed&&before-p.y>.015){p.land=.15;this.emit('land');}}
 if(p.y<-1.2){p.invincible=0;this.damage('fall');return;}
 this.spawnIn-=dt;this.warning=this.spawnIn<1.1;if(this.spawnIn<=0){this.spawn();this.spawnIn=this.rules.interval*(s.kind==='summit'?.8:1);}
 for(const b of this.barrels){let a=[b.x,b.y,b.z];if(b.kind==='gear'){b.x+=b.vx*dt;b.spin+=dt*4;}else{let tier=b.tier;if(!b.falling){b.x+=b.vx*dt;b.y=floorY(s,tier,clamp(b.x,-10,10))+.42;if(Math.abs(b.x)>10.35){b.falling=true;b.vy=0;}}else{b.vy-=12*dt;b.y+=b.vy*dt;if(tier>0&&b.y<=floorY(s,tier-1,b.x)+.42){b.tier--;b.falling=false;b.vx=-b.vx;b.x=clamp(b.x,-10.3,10.3);b.y=floorY(s,b.tier,b.x)+.42;this.emit('wood',[b.x,b.y,b.z]);}}b.spin-=b.vx*dt/.42;}
 if(!b.dead&&sweptHit(a,[b.x,b.y,b.z],old,[p.x,p.y+.7,p.z],.68,1.02,.74)){if(p.hammer>0){b.dead=true;this.score+=100;this.enemyReaction=.55;this.emit('tool',[b.x,b.y,b.z]);}else if(p.invincible<=0){this.damage(b.kind);return;}}
 if(!b.passed&&b.tier===p.tier&&Math.abs(b.x-p.x)<.6&&p.y>b.y+.65){b.passed=true;this.score+=100;this.emit('bonus');}}
 this.barrels=this.barrels.filter(b=>!b.dead&&b.y>-2&&Math.abs(b.x)<16);if(s.kind==='conveyor'){for(let tier=1;tier<4;tier++){if(p.tier===tier&&Math.abs(p.x-(tier%2?-1.5:3))<.8&&p.y<tier*GAP+1.8&&hazardAt(this.elapsed,tier)==='active'){if(p.invincible<=0){this.damage('steam');return;}}}}
 if(s.kind==='conveyor'&&p.tier===2&&Math.abs(p.x-5.5)<.85&&pressState(this.elapsed)==='active'&&p.y<2*GAP+1.8&&p.invincible<=0){this.damage('press');return;}
 if(s.kind==='lift'&&Math.floor(this.elapsed/7)>Math.floor((this.elapsed-dt)/7)){const tier=1+(Math.floor(this.elapsed/7)%3);this.barrels.push({id:this.nextId++,kind:'gear',x:-14,y:tier*GAP+.45,z:0,vx:3.7,spin:0,tier});this.emit('metal',[-14,tier*GAP+.45,0]);}
 if(!this.powerTaken&&Math.hypot(p.x-s.hammer[0],p.y-s.hammer[1])<.9){this.powerTaken=true;p.hammer=10;this.emit('power');}
 if(action){if(p.hammer>0){for(const b of this.barrels)if(Math.hypot(b.x-p.x,b.y-p.y)<2.2){b.dead=true;this.score+=100;this.enemyReaction=.55;this.emit('tool',[b.x,b.y,b.z]);}}if(s.devices)s.devices.forEach((d,i)=>{if(!this.devices.has(i)&&Math.hypot(p.x-d[0],p.y-d[1])<1.2){this.devices.add(i);this.score+=250;this.enemyReaction=1;this.emit('device');}});}
 if(Math.hypot(p.x-s.goal[0],p.y-s.goal[1])<.8)this.complete();
 }
 spawn(){const tier=this.stage.floors-1;this.barrels.push({id:this.nextId++,kind:'barrel',x:-8.8,y:floorY(this.stage,tier,-8.8)+.42,z:0,vx:this.rules.speed,vy:0,tier,falling:false,spin:0});this.emit('throw',[-8.8,tier*GAP,0]);}
}
