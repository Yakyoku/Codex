// Original resolution-independent craft and cached archipelago artwork. No extracted assets.
export const hulls={
 player:[[0,-28],[6,-20],[9,-5],[25,10],[24,22],[10,15],[6,23],[-6,23],[-10,15],[-24,22],[-25,10],[-9,-5],[-6,-20]],
 wing:[[0,-23],[8,-8],[29,1],[25,17],[11,11],[6,22],[-6,22],[-11,11],[-25,17],[-29,1],[-8,-8]],
 dart:[[0,-34],[6,-13],[14,15],[11,25],[4,17],[0,24],[-4,17],[-11,25],[-14,15],[-6,-13]],
 orb:[[0,-23],[14,-18],[24,-4],[24,10],[13,22],[-13,22],[-24,10],[-24,-4],[-14,-18]],
 carrier:[[0,-25],[10,-18],[13,-5],[24,-17],[30,-9],[30,24],[15,27],[10,15],[-10,15],[-15,27],[-30,24],[-30,-9],[-24,-17],[-13,-5],[-10,-18]],
 relay:[[0,-24],[8,-11],[27,-16],[19,3],[26,15],[12,12],[0,26],[-12,12],[-26,15],[-19,3],[-27,-16],[-8,-11]]};
function path(c,points){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()}
export function craft(c,x,y,size,color,front,pose){
 const kind=pose?.kind||'wing',p=pose||{};c.save();c.translate(x,y);c.scale(size*(p.scale||1),size*(p.scale||1));c.rotate((front?0:p.yaw??Math.PI)+(p.bank||0)*.55+(p.spin?Math.sin(p.spin)*.2:0));c.scale(1-Math.abs(p.bank||0)*.25,1-Math.abs(p.nod||0));c.translate(0,(p.kick||0)*80+(p.hover||0)*80);
 // Narrow exhaust cones, insulated nozzles, inner hot cores.
 for(const side of [-1,1]){const ex=side*(kind==='dart'?6:kind==='carrier'?22:12),len=10*(p.engine||1);const jet=c.createLinearGradient(0,18,0,23+len);jet.addColorStop(0,'#e5ffff');jet.addColorStop(.35,'#55e4ffcc');jet.addColorStop(1,'#2088ff00');c.fillStyle=jet;path(c,[[ex-3,17],[ex+3,17],[ex+2,23+len*.5],[ex,23+len],[ex-2,23+len*.5]]);c.fill()}
 const fill=c.createLinearGradient(-28,-22,26,24);fill.addColorStop(0,'#e1f4f7');fill.addColorStop(.2,color);fill.addColorStop(.48,'#52798a');fill.addColorStop(.51,'#aec4ce');fill.addColorStop(1,'#193148');c.fillStyle=fill;c.strokeStyle='#bdebf2';c.lineWidth=.8;path(c,hulls[kind]||hulls.wing);c.fill();c.stroke();
 // Separate armor plates and beveled seams, with legible asymmetrical identification.
 for(const side of [-1,1]){c.save();c.scale(side,1);c.translate(0,0);c.rotate(side*(p.wing||0));c.fillStyle='#142b40';path(c,kind==='dart'?[[6,-9],[11,14],[9,20],[5,13]]:[[10,-3],[22,7],[21,17],[12,12]]);c.fill();c.strokeStyle='#d3efff99';c.lineWidth=.6;c.stroke();c.fillStyle=color;path(c,[[11,2],[18,8],[17,10],[11,7]]);c.fill();for(let i=0;i<4;i++){c.strokeStyle=i%2?'#78a7af':'#071322';c.beginPath();c.moveTo(11+i*1.7,8+i*.5);c.lineTo(11+i*1.7,13+i*.5);c.stroke()}c.fillStyle='#d9ffff';c.globalAlpha=.6+.4*(p.light??1);c.beginPath();c.arc(kind==='dart'?11:22,14,1.2,0,7);c.fill();c.globalAlpha=1;c.restore()}
 c.fillStyle='#09192c';path(c,[[0,-21],[4,-9],[3,7],[-3,7],[-4,-9]]);c.fill();const glass=c.createLinearGradient(-4,-15,4,4);glass.addColorStop(0,'#edffff');glass.addColorStop(.3,'#80d9f8');glass.addColorStop(1,'#174a79');c.fillStyle=glass;path(c,[[0,-19],[2.5,-9],[2,0],[-2,0],[-2.5,-9]]);c.fill();c.strokeStyle='#f2ffff88';c.lineWidth=.5;c.stroke();
 c.fillStyle='#091a2d';c.fillRect(-3,9,6,9);c.fillStyle=color;c.fillRect(-1,10,2,5);for(const side of [-1,1])for(let j=0;j<3;j++){c.fillStyle='#d7e3e7';c.beginPath();c.arc(side*(7+j*3),10+j*3,.55,0,7);c.fill()}
 if(kind==='orb'){c.strokeStyle='#cbb7ff';c.lineWidth=1.5;c.beginPath();c.ellipse(0,1,17,12,p.spin||0,0,7);c.stroke();c.fillStyle='#f0d8ff';c.beginPath();c.arc(0,2,4,0,7);c.fill()}
 if(kind==='carrier'){for(const side of [-1,1]){c.fillStyle='#0e2434';c.fillRect(side*22-3,-7,6,19);c.strokeStyle='#ffd09b';c.strokeRect(side*22-2,-5,4,12)}}
 c.restore();
}
export class Archipelago {
 constructor(){this.tiles=new Map;this.quality='pc'}
 tile(theme){const key=theme+':'+this.quality;if(this.tiles.has(key))return this.tiles.get(key);const a=document.createElement('canvas');a.width=a.height=this.quality==='pc'?1024:512;const c=a.getContext('2d');c.scale(a.width/256,a.height/256);const colors=['#43847b','#8d7754','#685f8b','#557e95','#8c5b62','#4d6690'];const color=colors[theme%6];
 const outline=Array.from({length:13},(_,i)=>{const t=i/13*Math.PI*2,r=82+(i*31%23);return[128+Math.cos(t)*r,116+Math.sin(t)*r*.63]});
 for(let layer=5;layer>=0;layer--){c.save();c.translate(0,layer*5);path(c,outline);c.fillStyle=layer?'#122a39':color;c.fill();c.strokeStyle=layer?'#355462':'#93c9bb66';c.lineWidth=1;c.stroke();c.restore()}
 c.save();path(c,outline);c.clip();for(let i=0;i<90;i++){const x=36+i*47%190,y=55+i*73%135;c.strokeStyle=i%3?'#0e293742':'#aecfc035';c.lineWidth=.7;c.beginPath();c.moveTo(x,y);c.lineTo(x+15+i%14,y-8);c.lineTo(x+25,y-3);c.stroke()}
 for(let i=0;i<22;i++){const x=55+i*37%150,y=65+i*29%100,w=8+i%4*3,h=5+i%3*3;c.fillStyle='#0c2030';c.fillRect(x+3,y+5,w+2,h+4);c.fillStyle='#3f6268';c.fillRect(x,y,w,h);c.strokeStyle='#c4dac155';c.lineWidth=.7;c.strokeRect(x,y,w,h);c.fillStyle='#9ef0d168';c.fillRect(x+2,y+2,2,1)}
 c.strokeStyle='#a5cdbd55';c.lineWidth=2;c.beginPath();c.ellipse(128,110,39,22,0,0,7);c.stroke();c.lineWidth=.7;c.beginPath();c.ellipse(128,110,32,17,0,0,7);c.stroke();for(let i=0;i<8;i++){const t=i*Math.PI/4;c.fillStyle='#a5c6b0';c.fillRect(127+Math.cos(t)*38,108+Math.sin(t)*21,3,5)}c.restore();this.tiles.set(key,a);return a;
 }
 draw(c,g){const img=this.tile(g.area%6);for(let i=0;i<4;i++){const y=(i*275+g.time*38)%1100-260;c.globalAlpha=.6;c.drawImage(img,25+i*157%200,y,240,240)}c.globalAlpha=1}
}
