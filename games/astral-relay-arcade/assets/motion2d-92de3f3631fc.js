import {particle,ease} from './motion-e57b71ed95ab.js';
export function details2D(c,m,g){
 c.save();
 // Ground armor responds to impacts; hidden structures unfold without changing collision.
 for(const e of g.entities){const p=m.pose(e.id);if(!p)continue;
  if(e.kind==='tower'||e.kind==='hidden'){c.save();c.translate(e.x,e.y);c.rotate(p.hit*.07);c.strokeStyle=e.kind==='hidden'?'#8fffe0':'#ffc68a';c.globalAlpha=.25+.5*p.hit;const r=16+(p.reveal||0)*9;c.strokeRect(-r,-r,r*2,r*2);if(p.reveal){c.globalAlpha=.5;c.beginPath();c.arc(0,0,r+3,-Math.PI/2,-Math.PI/2+Math.PI*2*p.reveal);c.stroke()}c.restore()}
  if(p.warning){c.globalAlpha=p.warning*.65;c.strokeStyle='#ffb6ab';c.lineWidth=1.5;c.beginPath();c.arc(e.x,e.y+15,3+4*p.warning,0,Math.PI*2);c.stroke()}
  if(e.kind==='relay'){c.globalAlpha=.25+p.beacon*.35;c.strokeStyle='#80ffe2';c.beginPath();c.ellipse(e.x,e.y,24,10,0,0,Math.PI*2);c.stroke()}
 }
 c.globalAlpha=1;
 // Deliberately short trails keep enemy bullet silhouettes readable.
 for(const s of g.shots){c.strokeStyle='#7af9ff77';c.lineWidth=2;c.beginPath();c.moveTo(s.x,s.y+12);c.lineTo(s.x,s.y+22);c.stroke()}
 for(const b of g.bullets){const a=Math.atan2(b.vy,b.vx);c.strokeStyle='#ff799166';c.lineWidth=2;c.beginPath();c.moveTo(b.x-Math.cos(a)*7,b.y-Math.sin(a)*7);c.lineTo(b.x-Math.cos(a)*14,b.y-Math.sin(a)*14);c.stroke()}
 for(const f of m.effects){const age=m.time-f.born,u=age/f.life,fade=(1-u)**2;c.save();c.translate(f.x,f.y);c.globalAlpha=fade;
  if(f.type==='shot'){c.strokeStyle='#d6ffff';c.lineWidth=2;c.beginPath();c.moveTo(-5,-22);c.lineTo(0,-29-age*20);c.lineTo(5,-22);c.stroke()}
  if(f.type==='impact'){c.strokeStyle='#fff0bb';c.lineWidth=1.5;for(let j=0;j<5;j++){const a=j*1.256+f.seed;c.beginPath();c.moveTo(Math.cos(a)*3,Math.sin(a)*3);c.lineTo(Math.cos(a)*(5+u*12),Math.sin(a)*(5+u*12));c.stroke()}}
  if(f.type==='explode'||f.type==='damage'){const r=4+ease(u)*30;c.strokeStyle=f.type==='damage'?'#ff93b4':'#ffd697';c.lineWidth=3*(1-u)+.5;c.beginPath();c.arc(0,0,r,0,7);c.stroke();if(u<.22){c.fillStyle='#fff2c9';c.beginPath();c.arc(0,0,6*(1-u/.22),0,7);c.fill()}for(let j=0;j<(m.reduced?4:8);j++){const p=particle(f,j,m.time);c.save();c.translate(p.x-f.x,p.y-f.y);c.rotate(p.angle);c.globalAlpha=p.alpha;c.fillStyle=j%2?'#a6b6bc':'#ffc48a';c.fillRect(-p.size,-p.size/2,p.size*2,p.size);c.restore()}}
  if(f.type==='merge'){c.strokeStyle='#7ffff0';c.lineWidth=2;for(let j=0;j<6;j++){const a=j*Math.PI/3+u*2,r=32*(1-ease(u)) + 8;c.beginPath();c.arc(Math.cos(a)*r,Math.sin(a)*r,2+u*3,0,7);c.stroke()}}
  if(f.type==='bonus'||f.type==='formation'){c.strokeStyle='#ffe3a5';c.lineWidth=2;const y=-ease(u)*22;c.beginPath();c.moveTo(-8,y);c.lineTo(0,y-8);c.lineTo(8,y);c.lineTo(0,y+8);c.closePath();c.stroke()}
  if(f.type==='extend'){c.strokeStyle='#8dffe4';c.lineWidth=2;for(let j=0;j<3;j++){const a=j*2.094+u*3;c.beginPath();c.arc(Math.cos(a)*32,Math.sin(a)*32,3+2*Math.sin(u*Math.PI),0,7);c.stroke()}}
  c.restore();
 }c.restore();
}
