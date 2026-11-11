import {particle,ease} from './motion-e57b71ed95ab.js';
// Uses the existing Three.js build; no second renderer, camera movement or physics changes.
export class MotionScene {
 constructor(m,T,board,player){this.m=m;this.T=T;this.board=board;this.player=player;this.pool=[];this.used=0;
  this.geo=new T.Sphere(.04,6,4);this.ring=new T.Ring(.95,1,24);this.shard=new T.Box(.055,.022,.035);
 }
 sprite(kind,color,x,y,z,size,alpha,angle=0){if(this.used>=160)return null;let o=this.pool[this.used++];if(!o){o=new this.T.Mesh(this.geo,new this.T.Basic({transparent:true,depthWrite:false}));o.userData.motionEffect=true;this.board.add(o);this.pool.push(o)}
  o.geometry=kind==='ring'?this.ring:kind==='shard'?this.shard:this.geo;o.visible=true;o.material.color.set(color);o.material.opacity=Math.max(0,Math.min(1,alpha));o.position.set((x-240)/80,y,(z-350)/80);o.scale.setScalar(size);o.rotation.set(kind==='ring'?-Math.PI/2:0,angle,kind==='shard'?angle:0);return o;
 }
 ship(o,p){if(!p)return;const small=this.m.reduced?.2:1;o.rotation.set(p.nod,p.kind==='player'?0:p.yaw,p.bank);o.scale.setScalar(p.scale*(p.kind==='carrier'?1.3:1));o.position.y+=p.hover;o.position.z+=p.kick;
  if(p.kind==='orb'){o.rotation.y+=Math.sin(p.spin)*.3*small;o.rotation.z+=Math.sin(p.spin*1.3)*.12*small}
  const engines=o.children.filter(n=>n.userData.motionEngine);for(const n of engines){n.scale.y=p.engine*(p.kind==='relay'?1+p.beacon*.2:1);n.position.z=.28+(n.scale.y-1)*.06}
  o.traverse(n=>{if(n.userData.motionWing)n.rotation.z=n.userData.motionWing*p.wing;if(n.userData.motionLight){n.scale.setScalar(.7+.3*p.light);n.material.opacity=.6+.4*p.light}});
 }
 draw(g,active){this.used=0;const p=this.m.pose('player');this.ship(this.player,p);this.player.visible=g.state!=='over';
  // Protection remains readable without the previous 12Hz whole-ship disappearance.
  if(p&&g.shield>0)this.player.scale.multiplyScalar(1+.018*Math.sin(this.m.time*4));
  for(const e of g.entities){const q=this.m.pose(e.id),o=active.get('e'+e.id);if(!o||!q)continue;
   if(!['core','tower','hidden'].includes(e.kind))this.ship(o,q);
   if(e.kind==='tower'||e.kind==='hidden'){o.rotation.z=q.hit*.045;o.scale.y=1-q.hit*.06;if(e.kind==='hidden'){o.children[1].scale.y=1+q.reveal*1.44;o.children[1].position.y=.1+q.reveal*.06;o.children[1].rotation.y=q.reveal*.3}}
   if(e.kind==='core'){o.rotation.y=this.m.time*.32;o.rotation.z=Math.sin(this.m.time*.6)*.12;o.scale.setScalar(q.corePulse);for(let j=0;j<4;j++){const a=j*Math.PI/2+this.m.time*.65,r=q.coreRadius*80;this.sprite('shard','#ef9cab',e.x+Math.cos(a)*r,.2,e.y+Math.sin(a)*r,3,.9,a)}}
   if(q.warning)this.sprite('ring','#ffb5a1',e.x,.21,e.y+16,.06+q.warning*.06,q.warning*.7);
   if(e.kind==='relay')this.sprite('ring','#78ffdc',e.x,.12,e.y,.3,.2+q.beacon*.25);
  }
  g.shots.forEach((s,i)=>{const o=active.get('s'+i);if(o){o.scale.set(1,1,1);this.sprite('shard','#8ff8ff',s.x,.16,s.y+18,1.3,.3,0)}});
  g.bullets.forEach((b,i)=>{const o=active.get('b'+i);if(o){o.scale.set(.8,.8,1.35);o.rotation.y=Math.atan2(b.vx,b.vy)}});
  for(const f of this.m.effects){const age=this.m.time-f.born,u=age/f.life,fade=(1-u)**2;
   if(f.type==='shot')this.sprite('spark','#dfffff',f.x,.18,f.y-25,1.4*(1-u),fade);
   if(f.type==='impact'){for(let j=0;j<4;j++){const a=j*Math.PI/2+f.seed;this.sprite('spark','#ffe8ad',f.x+Math.cos(a)*u*14,.18+u*.08,f.y+Math.sin(a)*u*14,1-u,fade)}}
   if(f.type==='explode'||f.type==='damage'){const color=f.type==='damage'?'#ff9ac4':'#ffd39a';this.sprite('ring',color,f.x,.2,f.y,(4+ease(u)*30)/80,fade);if(u<.22)this.sprite('spark','#fff0c5',f.x,.22,f.y,3*(1-u/.22),1-u/.22);for(let j=0;j<(this.m.reduced?4:8);j++){const q=particle(f,j,this.m.time);this.sprite('shard',j%2?'#a6b6bc':'#ffc48a',q.x,.2+q.z,q.y,q.size/2,q.alpha,q.angle)}}
   if(f.type==='merge')for(let j=0;j<6;j++){const a=j*Math.PI/3+u*2,r=32*(1-ease(u))+8;this.sprite('spark','#8ffff0',f.x+Math.cos(a)*r,.2+Math.sin(u*Math.PI)*.2,f.y+Math.sin(a)*r,1+u,fade)}
   if(f.type==='bonus'||f.type==='formation')this.sprite('shard','#ffe3a5',f.x,.22+ease(u)*.5,f.y,2,fade,u*2);
   if(f.type==='extend')for(let j=0;j<3;j++){const a=j*2.094+u*3;this.sprite('ring','#8dffe4',f.x+Math.cos(a)*32,.2,f.y+Math.sin(a)*32,.05+.025*Math.sin(u*Math.PI),fade)}
  }
  for(let i=this.used;i<this.pool.length;i++)this.pool[i].visible=false;
 }
}
