import {GAP,floorY} from './stages.js';
// Decorative geometry stays behind the playable corridor. Profiles change only
// dressing density, never ladders, platforms, hazards, input or game rules.
export function dressWorkshop(l,stage,profile='pc'){
 const rich=profile==='pc',medium=profile!=='quest',top=(stage.floors-1)*GAP;
 const metal=(p,s,c='#90a7a5',r)=>l.cylinder(p,s,c,r,.32,0,2);
 const plate=(p,s,c='#2f6872',r)=>l.box(p,s,c,r,.54,0,6);
 for(const side of [-1,1]){
  const x=side*10.7;
  metal([x,top/2,-2.1],[.15,top+3,.15],'#98714f');
  for(let tier=0;tier<stage.floors;tier++){
   const y=tier*GAP;
   metal([x,y+.18,-2.1],[.21,.12,.21]);metal([x,y+.4,-2.1],[.20,.10,.20]);
   plate([x,y+.3,-2.32],[.65,.55,.15]);
   if(medium){for(const dy of [-.16,.16])for(const dx of [-.22,.22])metal([x+dx,y+.3+dy,-2.22],[.035,.04,.035],'#ddbd7e',[Math.PI/2,0,0]);}
  }
  // Enclosed work lights: dark housing, reflector, warm luminous glass.
  for(const y of [1,GAP*2+1,top+1]){
   plate([side*10.4,y,-.14],[.54,.40,.33],'#263f4a',[0,0,side*.3]);
   plate([side*10.4,y,.04],[.40,.26,.025],'#dcae64');
   l.box([side*10.4,y,.058],[.31,.18,.012],'#ffe2a1',undefined,.2,2.2,7);
   if(rich)for(const dx of [-.13,0,.13])metal([side*10.4+dx,y,.08],[.009,.23,.009],'#514e47');
  }
 }
 for(let tier=0;tier<stage.floors;tier++){
  const slope=stage.kind==='iron'?(tier%2===0?-.025:.025):0;
  for(const x of [-6,-3,3,6]){
   const y=floorY(stage,tier,x);
   plate([x,y-.23,.996],[1.00,.28,.035],'#355e64',[0,0,slope]);
   for(const dx of [-.39,.39])metal([x+dx,y-.23,1.025],[.044,.026,.044],'#d1a96c',[Math.PI/2,0,0]);
   if(rich)for(let i=0;i<5;i++)l.box([x-.29+i*.14,y-.23,1.019],[.036,.15,.012],'#a9b8aa',[0,0,-.45],.7,0,6);
  }
  if(medium)for(const x of [-8,8]){
   const y=floorY(stage,tier,x);
   plate([x,y+.55,-1.53],[.65,.85,.11],'#254653');
   l.box([x,y+.7,-1.46],[.48,.16,.015],'#8ac7bf',undefined,.3,.5,7);
   for(let i=0;i<4;i++)plate([x,y+.42-i*.075,-1.46],[.40,.018,.025],'#16313d');
   metal([x+.4,y+.2,-1.7],[.025,.6,.025],'#bd8751');
  }
 }
 if(rich){
  // Service gantry and cable reels behind the stage, with actual open trusses.
  for(const x of [-13.2,13.2]){
   plate([x,top*.5,-4.0],[.32,top+5,.32],'#273e4e');
   for(let y=0;y<top+3;y+=2.4){plate([x,y,-4],[2.8,.18,1.8],'#416772');
    for(const dx of [-1.1,1.1])metal([x+dx,y+.52,-3.25],[.035,1.0,.035]);
    plate([x,y+1,-3.25],[2.4,.04,.05],'#c99a55');
   }
   for(const y of [1.6,top-1]){metal([x,y,-3.55],[.64,.55,.64],'#293d48',[Math.PI/2,0,0]);
    for(const z of [-3.25,-3.85])l.torus([x,y,z],[.78,.78,.78],'#9b7953',[Math.PI/2,0,0],.34,0,2);
    for(let n=0;n<5;n++)l.torus([x,y,-3.37-n*.09],[.53,.53,.53],'#534c42',[Math.PI/2,0,0],.85,0,8);
   }
  }
  // Roof structures and antennas make the skyline volumetric at oblique angles.
  for(let i=0;i<19;i++){
   const j=i*2,x=(j-19)*2.2,h=3+((j*17)%19)*.65,z=-10-(j%4)*3;
   plate([x+.24,h-2.6,z],[.75,.6,.75],'#344a59');
   for(const dz of [-.26,.26])l.box([x+.24,h-2.25,z+dz],[.65,.018,.04],'#809499',undefined,.5,0,2);
   if(i%3===0){metal([x-.5,h-2.1,z],[.025,1.7,.025]);l.sphere([x-.5,h-1.22,z],[.045,.045,.045],'#efbc76',undefined,.3,1);}
  }
 }
}
