// Presentation only. No game state/input/storage writes and no unseeded random phases.
                               
const copy=(p      )=>({x:p.x,y:p.y});
const mix=(a       ,b       ,t       )=>a+(b-a)*t;
export const clamp=(n       ,a       ,b       )=>Math.max(a,Math.min(b,n));
export const damp=(a       ,b       ,rate       ,dt       )=>mix(a,b,1-Math.exp(-rate*dt));
const smooth=(x       )=>{const t=clamp(x,0,1);return t*t*(3-2*t);};
                                                                                                                                                                                             
const neutral=()     =>({lean:0,gazeX:0,gazeY:0,lift:0,wing:0,blink:1,squash:1,arrival:1,glow:0,turn:0,breath:1,fatigue:0,power:0});
export class CharacterMotion {
 owner    =null;previous    =null;current    =null;clock=0;
 poses=[neutral(),neutral()];velocities=[{x:0,y:0},{x:0,y:0}];phases=[0,2.1];reward=0;arrivalAge=2;
 enemyPoses=new Map            ();born=new Map               ();ghosts      =[];reveals      =[];
 reset(g    ){this.owner=g;this.current=this.snapshot(g);this.previous=this.current;this.poses=[neutral(),neutral()];this.velocities=[{x:0,y:0},{x:0,y:0}];this.phases=[0,2.1];this.reward=0;this.arrivalAge=0;this.enemyPoses.clear();this.born.clear();this.ghosts=[];this.reveals=[];}
 snapshot(g    ){return {tick:g.tick,stage:g.stage,players:g.players.map(copy),enemies:g.enemies.map((e    )=>({...e})),targets:g.targets.map((e    )=>({...e})),rope:g.rope.map(copy)};}
 capture(g    ){
  if(this.owner!==g||!this.current||g.stage!==this.current.stage||g.tick<this.current.tick){this.reset(g);return;}
  this.previous=this.current;this.current=this.snapshot(g);
  for(const t of this.previous.targets){if(t.active&&!this.current.targets.some((n    )=>n.id===t.id&&n.kind===t.kind&&n.active))this.ghosts.push({...t,born:this.clock});}
  this.ghosts=this.ghosts.slice(-64);
  // A topology change, stage reset or teleport cannot stretch a constraint across the board.
  const discontinuity=this.current.rope.length!==this.previous.rope.length||g.players.some((p      ,i       )=>Math.hypot(p.x-this.previous.players[i].x,p.y-this.previous.players[i].y)>50);
  if(discontinuity)this.previous=this.current;
  for(const e of g.events||[]){if(['capture','heal','gem','clear'].includes(e.type))this.reward=1;if(e.type==='hit'){this.arrivalAge=0;this.velocities=[{x:0,y:0},{x:0,y:0}];this.previous=this.current;}if(e.type==='treasure')this.reveals.push({...e,born:this.clock});}
  this.reveals=this.reveals.slice(-8);
 }
 sample(g    ,alpha       ,dt       ,animate=true,reduced=false){
  if(this.owner!==g||!this.current||this.current.stage!==g.stage)this.reset(g);
  const a=clamp(alpha,0,1),secs=animate?clamp(dt,0,.05):0;
  this.clock+=secs;this.arrivalAge+=secs;this.reward*=Math.exp(-5*secs);
  const lerp=(p      ,q      )=>({x:mix(p.x,q.x,a),y:mix(p.y,q.y,a)});
  const players=this.current.players.map((p      ,i       )=>lerp(this.previous.players[i],p));
  const enemies=this.current.enemies.map((e    ,i       )=>{const old=this.previous.enemies[i];return {...e,...(old?.id===e.id&&Math.hypot(old.x-e.x,old.y-e.y)<50?lerp(old,e):e)};});
  const rope=this.current.rope.map(copy);if(rope.length){rope[0]=copy(players[0]);rope[rope.length-1]=copy(players[1]);}
  this.poses=this.poses.map((pose,i)=>{
   if(reduced)return {...neutral(),power:g.powered?1:0};
   const before=this.previous.players[i],now=this.current.players[i],v=this.velocities[i],oldVX=v.x;
   const vx=clamp((now.x-before.x)*60/180,-1,1),vy=clamp((now.y-before.y)*60/180,-1,1);
   v.x=damp(v.x,vx,12,secs);v.y=damp(v.y,vy,12,secs);const speed=Math.min(1,Math.hypot(v.x,v.y));
   // Integrate phase, never multiply absolute time by a changing speed (which visibly jumps).
   this.phases[i]+=secs*(2.4+speed*1.2);const phase=this.phases[i];
   const blinkPhase=(this.clock+i*1.63)%4.7,blink=blinkPhase<.18?.08+.92*smooth(Math.abs(blinkPhase-.09)/.09):1;
   const fatigue=damp(pose.fatigue,g.energy<25?(25-g.energy)/25:0,3,secs);
   return {lean:damp(pose.lean,v.x*.19,10,secs),gazeX:damp(pose.gazeX,v.x*2.5,14,secs),gazeY:damp(pose.gazeY,v.y*1.6,14,secs),lift:Math.sin(phase)*(1.3+speed*.6)-fatigue*1.5,wing:Math.sin(phase*2)*(.12+speed*.16)*(1-fatigue*.35),blink:blink*(1-fatigue*.22),squash:1+this.reward*.12*Math.sin(this.clock*18),arrival:1-.22*Math.exp(-this.arrivalAge*8),glow:this.reward,turn:damp(pose.turn,secs?clamp((v.x-oldVX)/secs*.03,-.2,.2):pose.turn,10,secs),breath:1+Math.sin(this.clock*2+i)*.012*(1-speed),fatigue,power:damp(pose.power,g.powered?1:0,5,secs)};
  });
  const enemyKeys=new Set        ();
  const enemyPoses=enemies.map((e    ,i       )=>{
   enemyKeys.add(e.id);const old=this.previous.enemies[i]??e,stored=this.enemyPoses.get(e.id)??{lean:0,gazeX:0,gazeY:0,phase:e.id*1.7,antenna:0,alert:0};
   const current=this.current.enemies[i]??e;const vx=(current.x-old.x)*60,vy=(current.y-old.y)*60;const speed=clamp(Math.hypot(vx,vy)/90,0,1);
   const near=players.reduce((best      ,p      )=>Math.hypot(p.x-e.x,p.y-e.y)<Math.hypot(best.x-e.x,best.y-e.y)?p:best,players[0]);
   stored.phase+=secs*(3+speed*6);stored.lean=damp(stored.lean,clamp(vx/140,-.22,.22),8,secs);
   stored.gazeX=damp(stored.gazeX,clamp((near.x-e.x)/60,-1,1),6,secs);stored.gazeY=damp(stored.gazeY,clamp((near.y-e.y)/60,-1,1),6,secs);
   stored.antenna=damp(stored.antenna,-stored.lean*1.7,5,secs);stored.alert=damp(stored.alert,clamp(1-Math.hypot(near.x-e.x,near.y-e.y)/140,0,1),4,secs);this.enemyPoses.set(e.id,stored);
   return {lean:reduced?0:stored.lean,gazeX:reduced?0:stored.gazeX,gazeY:reduced?0:stored.gazeY,step:reduced?0:Math.sin(stored.phase)*(.2+speed*.8),antenna:reduced?0:stored.antenna,alert:stored.alert,breath:reduced?1:1+Math.sin(this.clock*2.8+e.id)*.025, lift:reduced?0:Math.abs(Math.sin(stored.phase))*speed*1.6};
  });
  for(const id of this.enemyPoses.keys())if(!enemyKeys.has(id))this.enemyPoses.delete(id);
  const targetKeys=new Set        ();const targets=this.current.targets.filter((t    )=>t.active).map((t    )=>{
   const key=t.kind+':'+t.id;targetKeys.add(key);if(!this.born.has(key))this.born.set(key,this.clock);const age=this.clock-this.born.get(key) ;
   const phase=this.clock*1.5+t.id*2.399;
   const nearest=players.reduce((best      ,p      )=>Math.hypot(p.x-t.x,p.y-t.y)<Math.hypot(best.x-t.x,best.y-t.y)?p:best,players[0]);
   const distance=Math.hypot(nearest.x-t.x,nearest.y-t.y),bend=clamp((t.x-nearest.x)/50,-1,1)*clamp(1-distance/90,0,1);
   return {...t,pose:{sway:reduced?0:Math.sin(phase)*.055,head:reduced?0:Math.sin(phase-.6)*.045,bend:reduced?0:bend*.11,bloom:reduced?1:.25+.75*smooth(age/.65),spin:reduced?.4:t.id*.7+Math.max(0,age-.35*(1-Math.exp(-age/.35)))*1.2,lift:reduced?0:Math.sin(this.clock*2+t.id)*2.5}};
  });
  for(const key of this.born.keys())if(!targetKeys.has(key))this.born.delete(key);
  this.ghosts=this.ghosts.filter(t=>this.clock-t.born<.28);this.reveals=this.reveals.filter(t=>this.clock-t.born<.7);
  return {players,enemies,rope,poses:this.poses,enemyPoses,targets,ghosts:reduced?[]:this.ghosts.map(t=>({...t,progress:clamp((this.clock-t.born)/.28,0,1)})),reveals:reduced?[]:this.reveals.map(t=>({...t,progress:clamp((this.clock-t.born)/.7,0,1)})),clock:this.clock};
 }
}
