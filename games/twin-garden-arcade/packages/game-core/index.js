/** Twin Garden deterministic simulation. Units are garden coordinates, time is 60 Hz. */
                                      
                                                           
                                                        
                                                                                                            
                                                                                                          
                                                        
const EPS=1e-7,DT=1/60;
export const cross=(a      ,b      ,c      )=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
export const distance=(a      ,b      )=>Math.hypot(a.x-b.x,a.y-b.y);
const lerp=(a      ,b      ,t       )      =>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const copy=(p      )      =>({x:p.x,y:p.y});
export function intersection(a      ,b      ,c      ,d      )                                       {
 const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,den=rx*sy-ry*sx;
 if(Math.abs(den)<EPS)return null;
 const t=((c.x-a.x)*sy-(c.y-a.y)*sx)/den,u=((c.x-a.x)*ry-(c.y-a.y)*rx)/den;
 return t>=-EPS&&t<=1+EPS&&u>=-EPS&&u<=1+EPS?{point:lerp(a,b,Math.max(0,Math.min(1,t))),t,u}:null;
}
export function pointInPolygon(p      ,poly        )        {
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[j],b=poly[i];
  if(Math.abs(cross(a,b,p))<1e-5&&p.x>=Math.min(a.x,b.x)-EPS&&p.x<=Math.max(a.x,b.x)+EPS&&p.y>=Math.min(a.y,b.y)-EPS&&p.y<=Math.max(a.y,b.y)+EPS)return true;
  if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }return inside;
}
export function polygonArea(poly        )       {return poly.reduce((s,a,i)=>{const b=poly[(i+1)%poly.length];return s+a.x*b.y-a.y*b.x},0)/2}
/** Split every intersection, build angular half-edge graph, walk bounded faces. */
export function boundedFaces(line        )          {
 const segments=line.slice(1).map((b,i)=>({a:line[i],b,ts:[0,1]})).filter(s=>distance(s.a,s.b)>EPS);
 for(let i=0;i<segments.length;i++)for(let j=i+1;j<segments.length;j++){
  const a=segments[i],b=segments[j],h=intersection(a.a,a.b,b.a,b.b);
  if(h){a.ts.push(h.t);b.ts.push(h.u)}
  else if(Math.abs(cross(a.a,a.b,b.a))<EPS&&Math.abs(cross(a.a,a.b,b.b))<EPS){
   const project=(p      ,s         )=>((p.x-s.a.x)*(s.b.x-s.a.x)+(p.y-s.a.y)*(s.b.y-s.a.y))/((s.b.x-s.a.x)**2+(s.b.y-s.a.y)**2);
   for(const p of [b.a,b.b]){const t=project(p,a);if(t>EPS&&t<1-EPS)a.ts.push(t)}
   for(const p of [a.a,a.b]){const t=project(p,b);if(t>EPS&&t<1-EPS)b.ts.push(t)}
  }
 }
 const points        =[],adj           =[],ids=new Map               ();
 function vertex(p      ){const key=`${Math.round(p.x*1e5)},${Math.round(p.y*1e5)}`;let id=ids.get(key);if(id===undefined){id=points.length;ids.set(key,id);points.push(p);adj.push([])}return id}
 for(const s of segments){s.ts.sort((a,b)=>a-b);for(let j=1;j<s.ts.length;j++){const a=vertex(lerp(s.a,s.b,s.ts[j-1])),b=vertex(lerp(s.a,s.b,s.ts[j]));if(a!==b&&!adj[a].includes(b)){adj[a].push(b);adj[b].push(a)}}}
 adj.forEach((neighbors,i)=>neighbors.sort((a,b)=>Math.atan2(points[a].y-points[i].y,points[a].x-points[i].x)-Math.atan2(points[b].y-points[i].y,points[b].x-points[i].x)));
 const used=new Set        (),faces          =[];
 for(let a=0;a<points.length;a++)for(const b of adj[a]){if(used.has(`${a}:${b}`))continue;const poly        =[];let u=a,v=b;for(let guard=0;guard<segments.length*segments.length*8+8;guard++){
  const key=`${u}:${v}`;if(used.has(key))break;used.add(key);poly.push(points[u]);const ns=adj[v],next=ns[(ns.indexOf(u)+ns.length-1)%ns.length];u=v;v=next;if(u===a&&v===b)break;
 }if(polygonArea(poly)>25)faces.push(poly)}
 return faces;
}
export const stageNames=['朝露の約束','四つ葉の回廊','きのこの円舞','星屑の小道','風渡る花壇','月虹の池','蜂蜜の迷路','双子の星座','水晶の果樹園','宵闇のアーチ','天空の温室','奇跡の庭'];
export class Game{
 players        =[{x:430,y:570},{x:570,y:570}]; pegs        =[]; targets         =[]; enemies        =[];
 score=0;energy=80;lives=3;stage=1;status                         ='playing';tick=0;powered=0;combo=0;bonus=0;
 events            =[];capturedAreas                              =[];recording        =[];timeline                                                    =[];        lowEnergy=false;
 invincible=180;gems=0;bonusTicks=0;        seed       ;        rng       ;        anchors                        =[];        comboUntil=0;
 difficulty           ;
 constructor(seed=1,difficulty           ='standard'){this.difficulty=difficulty;this.seed=seed>>>0;this.rng=this.seed||1;this.loadStage()}
 get stageName(){return this.bonus?['','星の収穫祭','花の大合唱','宝石の流星群'][this.bonus]:stageNames[this.stage-1]}
 get rope(){return [this.players[0],...this.anchors.map(a=>a.p),this.players[1]]}
 random(){this.rng^=this.rng<<13;this.rng^=this.rng>>>17;this.rng^=this.rng<<5;return (this.rng>>>0)/4294967296}
         emit(type       ,p      ={x:500,y:350},value        ){this.events.push({...p,type,value})}
 loadStage(){
  this.anchors=[];this.players=[{x:430,y:590},{x:570,y:590}];this.targets=[];this.enemies=[];this.pegs=[];this.status='playing';this.combo=0;this.comboUntil=0;this.lowEnergy=false;this.invincible=180;this.energy=Math.max(75,this.energy);this.gems=0;
  const n=this.stage;let id=0;
  if(n%3===1){for(let y=160;y<=520;y+=120)for(let x=200;x<=800;x+=150)this.pegs.push({x,y})}
  else if(n%3===2){for(let i=0;i<12;i++){const a=i*Math.PI/6;this.pegs.push({x:500+Math.cos(a)*310,y:350+Math.sin(a)*230})}this.pegs.push({x:400,y:350},{x:600,y:350})}
  else{for(let row=0;row<4;row++)for(let col=0;col<5;col++)this.pegs.push({x:160+col*165+(row%2)*40,y:140+row*125})}
  for(let i=0;i<6+Math.floor(n/2);i++){const a=i*2.399+n*.3,r=100+(i%3)*65;this.targets.push({id:id++,x:500+Math.cos(a)*r,y:330+Math.sin(a)*r*.8,kind:'flower',active:true})}
  for(let i=0;i<4;i++)this.targets.push({id:id++,x:150+i*230,y:i%2?490:230,kind:'plant',active:true});
  this.targets.push({id:id++,x:180+this.random()*640,y:140+this.random()*350,kind:'treasure',active:true});
  if(this.difficulty!=='practice')for(let i=0;i<Math.min(5,1+Math.floor(n/3));i++){const p={x:160+i*170,y:95+(i%2)*440};this.enemies.push({...p,origin:copy(p),id:i,kind:'enemy',active:true,phase:this.random()*6.28,behavior:(n+i)%3})}
 }
 nextStage(){if(this.status!=='clear')return;this.timeline.push({type:'next'});if(this.stage===12){this.status='over';return}this.stage++;this.bonus=0;this.loadStage()}
 resetLine(record=true){if(record)this.timeline.push({type:'reset'});this.anchors=[];this.emit('reset')}
         capture(polys          ){if(!polys.length)return;if(this.tick>=this.comboUntil)this.combo=0;let count=0;
  for(const p of polys)this.capturedAreas.push({points:p.map(copy),ttl:60});
  for(const t of [...this.targets]){if(!t.active||!polys.some(p=>pointInPolygon(t,p)))continue;t.active=false;count++;
   if(t.kind==='flower'){this.score+=100*(1+this.combo);this.emit('capture',t,100*(1+this.combo))}
   if(t.kind==='plant'){if(!this.bonus)t.regrowAt=this.tick+900;this.energy=Math.min(100,this.energy+26);this.score+=50;this.emit('heal',t);if(this.energy>=99){this.powered=600;this.emit('power',t)}}
   if(t.kind==='treasure'){this.emit('treasure',t);for(let i=0;i<3;i++){const a=i*2.094;this.targets.push({id:100+i,x:Math.max(60,Math.min(940,t.x+Math.cos(a)*65)),y:Math.max(60,Math.min(640,t.y+Math.sin(a)*65)),kind:'gem',active:true})}}
   if(t.kind==='gem'){this.gems++;this.score+=300;this.emit('gem',t)}
  }
  if(this.powered)for(const e of this.enemies)if(e.active&&polys.some(p=>pointInPolygon(e,p))){e.active=false;this.score+=250;this.emit('capture',e)}
  this.emit('loop',polys[0][0],count);if(count){this.combo=this.tick<this.comboUntil?Math.min(9,this.combo+1):1;this.comboUntil=this.tick+240}
  this.anchors=[];
  if(this.gems>=3&&!this.bonus){this.bonus=(this.stage-1)%3+1;this.bonusTicks=1200;this.emit('bonus');for(let i=0;i<10;i++)this.targets.push({id:200+i,x:160+this.random()*680,y:130+this.random()*400,kind:this.bonus===2?'plant':this.bonus===3?'gem':'flower',active:true})}
 }
         moveEnd(index       ,next      ){
  const old=copy(this.players[index]); const prior=this.rope.map(copy);this.players[index]=next;
  // Swept endpoint crossing any non-incident old rope edge creates a precisely closed loop.
  const faces          =[];
  if(index===0){for(let j=1;j<prior.length-1;j++){const h=intersection(old,next,prior[j],prior[j+1]);if(h&&h.t>EPS){faces.push(...boundedFaces([h.point,old,...prior.slice(1,j+1),h.point]));break}}}
  else{for(let j=0;j<prior.length-2;j++){const h=intersection(old,next,prior[j],prior[j+1]);if(h&&h.t>EPS){faces.push(...boundedFaces([h.point,...prior.slice(j+1,-1),old,h.point]));break}}}
  if(faces.length){this.capture(faces);return}
  const near=index===0?this.anchors[0]:this.anchors.at(-1),other=index===0?this.anchors[1]?.p??this.players[1]:this.anchors.at(-2)?.p??this.players[0];
  if(near){const s=cross(near.p,other,next);if(s*near.sign*(index===0?1:-1) < -2){if(index===0)this.anchors.shift();else this.anchors.pop();this.emit('unhook',near.p)}}
  const pivot=index===0?this.anchors[0]?.p??this.players[1]:this.anchors.at(-1)?.p??this.players[0];
  const candidates=this.pegs.filter(p=>!this.anchors.some(a=>a.p===p)&&distance(p,pivot)>1&&distance(p,old)>8&&pointInPolygon(p,[old,next,pivot])).sort((a,b)=>distance(a,next)-distance(b,next));
  const peg=candidates[0];if(peg&&Math.abs(cross(old,next,pivot))>EPS&&this.anchors.length<40){const a={p:peg,sign:(Math.sign(cross(peg,pivot,next))||1)*(index===0?1:-1)};if(index===0)this.anchors.unshift(a);else this.anchors.push(a);this.emit('hook',peg)}
 }
 step(input      ){
  this.events=[];if(this.status!=='playing')return;this.tick++;this.timeline.push({type:'step',input:{red:copy(input.red),blue:copy(input.blue),reset:input.reset}});this.recording.push({red:copy(input.red),blue:copy(input.blue),reset:input.reset});if(input.reset)this.resetLine(false);
  for(const t of this.targets)if(!t.active&&t.kind==='plant'&&t.regrowAt!==undefined&&this.tick>=t.regrowAt&&!this.bonus){t.active=true;delete t.regrowAt;this.emit('regrow',t);}
  this.capturedAreas=this.capturedAreas.filter(a=>--a.ttl>0);if(this.powered>0)this.powered--;if(this.invincible>0)this.invincible--;
  const speed=(this.difficulty==='easy'?150:this.difficulty==='hard'?215:180)*(this.powered?1.15:1),moves=[input.red,input.blue].map(v=>{const m=Math.max(1,Math.hypot(v.x,v.y));return{x:v.x/m*speed*DT,y:v.y/m*speed*DT}});
  const subdivisions=Math.max(1,Math.ceil(Math.max(...moves.map(v=>Math.hypot(v.x,v.y)))/2));
  for(let sub=0;sub<subdivisions;sub++){
   for(let i=0;i<2;i++){const p=this.players[i],m=moves[i];this.moveEnd(i,{x:Math.max(35,Math.min(965,p.x+m.x/subdivisions)),y:Math.max(35,Math.min(665,p.y+m.y/subdivisions))})}
   let line=this.rope;let faces=boundedFaces(line);
   if(!faces.length&&line.length>3&&distance(line[0],line.at(-1) )<12){const p=lerp(line[0],line.at(-1) ,.5);this.players=[copy(p),copy(p)];line=this.rope;faces=boundedFaces(line)}
   if(faces.length)this.capture(faces);
  }
  if(this.tick>this.comboUntil)this.combo=0;
  if(this.difficulty!=='practice'&&!this.bonus)this.energy=Math.max(0,this.energy-(this.difficulty==='easy'?.7:this.difficulty==='hard'?1.3:1)*DT);
  for(const e of this.enemies){if(!e.active)continue;const t=this.tick*DT*(this.difficulty==='easy'?.65:1),a=t*.65+e.phase;
   if(e.behavior===0){e.x=e.origin.x+Math.sin(a)*95;e.y=e.origin.y+Math.cos(a*.7)*35}
   else if(e.behavior===1){e.x=e.origin.x+Math.cos(a)*65;e.y=e.origin.y+Math.sin(a)*65}
   else{const p=this.players[e.id%2],d=distance(e,p);if(d>1){e.x+=(p.x-e.x)/d*25*DT;e.y+=(p.y-e.y)/d*25*DT}}
   e.x=Math.max(40,Math.min(960,e.x));e.y=Math.max(40,Math.min(660,e.y));
  }
  if(!this.powered&&!this.invincible&&(this.energy<=0||this.enemies.some(e=>e.active&&this.players.some(p=>distance(e,p)<22)))){
   this.lives--;this.emit('hit');this.energy=80;this.invincible=180;this.players=[{x:430,y:590},{x:570,y:590}];this.anchors=[];this.combo=0;if(this.lives<=0)this.status='over';
  }
  if(this.energy>30)this.lowEnergy=false;if(this.energy<=20&&!this.lowEnergy&&this.status==='playing'){this.lowEnergy=true;this.emit('warning');}
  if(this.bonus&&this.status==='playing'){this.bonusTicks--;if(this.bonusTicks<=0||!this.targets.some(t=>t.id>=200&&t.active)){this.score+=Math.max(0,Math.ceil(this.bonusTicks/60))*25;this.status='clear';this.emit('clear');}}
  if(this.status==='playing'&&!this.bonus&&!this.targets.some(t=>t.active&&t.kind==='flower')){this.status='clear';this.score+=1000;this.emit('clear')}
 }
 exportReplay(){return {version:2,seed:this.seed,difficulty:this.difficulty,actions:this.timeline}}
 static fromReplay(data    ){if(data?.version!==2||!Array.isArray(data.actions)||data.actions.length>1000000||!Number.isInteger(data.seed)||!['practice','easy','standard','hard'].includes(data.difficulty))throw new Error('Unsupported replay');const g=new Game(data.seed,data.difficulty);for(const a of data.actions){if(a.type==='step'){if(!a.input||![a.input.red?.x,a.input.red?.y,a.input.blue?.x,a.input.blue?.y].every(Number.isFinite))throw new Error('Invalid replay input');g.step(a.input);}else if(a.type==='reset')g.resetLine();else if(a.type==='next')g.nextStage();else throw new Error('Invalid replay action');}return g;}
}
