// Native-resolution botanical underpainting. Rebuilt only when the framebuffer changes.
export function gardenBackdrop(width       ,height       ){
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const c=canvas.getContext('2d') ;c.scale(width/1000,height/700);
 const light=c.createRadialGradient(470,290,20,500,350,640);light.addColorStop(0,'#2b5140');light.addColorStop(.65,'#183d35');light.addColorStop(1,'#0b2930');c.fillStyle=light;c.fillRect(0,0,1000,700);
 let seed=614;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<1500;i++){const x=30+random()*940,y=30+random()*640;c.strokeStyle=i%3?'#8db38712':'#031e2822';c.lineWidth=.6+random()*.6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-3,y-3,x+random()*7-3,y-5-random()*5);c.stroke();}
 for(let i=0;i<160;i++){const x=35+random()*930,y=35+random()*630;c.fillStyle=i%2?'#c4c8950b':'#82b5a20b';c.beginPath();c.ellipse(x,y,6+random()*12,2+random()*4,random()*6,0,Math.PI*2);c.fill();}
 c.strokeStyle='#c1b78235';c.lineWidth=1;c.strokeRect(22,22,956,656);c.strokeStyle='#d3c39816';c.strokeRect(27,27,946,646);
 for(let i=0;i<100;i++){const top=i<50,x=40+(i%50)*18.8,y=top?15:685;c.save();c.translate(x,y);c.rotate((i%7-3)*.18);c.fillStyle=i%2?'#426c54':'#345d4e';c.beginPath();c.ellipse(0,0,9,3,-.4,0,Math.PI*2);c.fill();c.strokeStyle='#a7bb7d35';c.lineWidth=.65;c.beginPath();c.moveTo(-6,2);c.lineTo(6,-2);c.stroke();c.restore();}
 for(const x of [16,984])for(let y=48;y<670;y+=22){c.fillStyle='#4e765b';c.beginPath();c.ellipse(x,y,3,8,.4,0,Math.PI*2);c.fill();}
 for(const x of [22,978])for(const y of [22,678]){c.strokeStyle='#c7bb85';c.beginPath();c.moveTo(x,y-8);c.lineTo(x+8,y);c.lineTo(x,y+8);c.lineTo(x-8,y);c.closePath();c.stroke();}
 return canvas;
}
