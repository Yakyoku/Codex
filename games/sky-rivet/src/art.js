import {dressWorkshop} from './scenery.js';
import {human,beast,glove} from './characters.js';
export {human,beast,glove} from './characters.js';
import {interpolateBarrel} from './motion.js';
import {SceneList} from './render.js';
import {transform} from './math.js';
import {GAP,floorY,liftY,hazardAt,pressHeight,pressState} from './stages.js';
const C={steel:'#225665',edge:'#53a5ad',gold:'#efb34c',dark:'#102935',rust:'#944e3d',skin:'#f5bb8e',red:'#d96346',navy:'#2b485f',ivory:'#e8ddbe',wood:'#b27538'};
function bolt(l,x,y,z){l.cylinder([x,y,z],[.055,.035,.055],C.gold,[Math.PI/2,0,0],.3);}
function rail(l,x,y,len,z=1){l.box([x,y,z],[len,.09,.09],C.gold,undefined,.35);}
function girder(l,x,y,width,slope=0,z=0){l.group(transform([x,y-.095,z],[1,1,1],[0,0,slope]),()=>{l.box([0,-.15,0],[width,.33,1.85],C.steel,undefined,.54,0,6);l.box([0,.035,0],[width,.12,1.9],C.edge,undefined,.45,0,6);for(let z of [-.95,.95]){l.box([0,-.16,z],[width,.35,.08],C.rust,undefined,.7,0,6);for(let i=-width/2+.3;i<width/2;i+=.85){l.box([i,-.16,z+.01],[.5,.08,.09],C.gold,[0,0,.35]);bolt(l,i,-.15,z+.07);}}for(let x=-width/2+.15;x<width/2;x+=.8)l.box([x,.106,0],[.025,.014,1.82],C.dark);});}
export function makeStage(stage,profile='pc'){const l=new SceneList();l.lampHeights=[1,GAP*2+1,(stage.floors-1)*GAP+1];
 l.sphere([0,8,0],[65,65,65],'#234354',undefined,1,0,9);
 // Distant city: deterministic, fully local original geometry.
 for(let i=0;i<38;i++){let x=(i-19)*2.2,h=3+((i*17)%19)*.65,z=-10-(i%4)*3;l.box([x,h/2-3,z],[1.8,h,2.1],i%3?'#1b354a':'#274254');l.box([x,h-2.94,z],[1.95,.12,2.2],'#58747e');for(let row=0;row<h-1;row+=1.1)for(let col of [-.55,0,.55])if((i+Math.floor(row)*3+Math.floor(col*10))%4)l.box([x+col,row-2.1,z+1.06],[.19,.38,.035],(i+Math.floor(row))%2?'#cda15e':'#729ba8',undefined,1,.4);if(i%4===0)l.cylinder([x,h-1.7,z],[.04,2.5,.04],C.edge);}
 l.sphere([15,19,-37],[4.6,4.6,.6],'#f0a55a',undefined,1,.5);
 for(let i=0;i<35;i++)l.sphere([Math.sin(i*25)*40,10+(i*13%23),-42],[.035,.035,.035],'#eedc9f',undefined,.6,1);
 // Construction core, riveted columns and cross bracing.
 for(let x of [-9.8,9.8])for(let z of [-1.25,1.25]){l.box([x,7,z],[.22,16,.22],C.steel,undefined,.54,0,6);for(let y=0;y<16;y+=GAP){l.box([x,y,z],[.45,.2,.45],C.gold);for(let dy of [-.3,.3])bolt(l,x,y+dy,z+.15);}}
 for(let tier=0;tier<stage.floors;tier++){let y=tier*GAP,slope=stage.kind==='iron'?(tier%2===0?-.025:.025):0;
 if(stage.kind==='lift'&&tier>0){girder(l,-5.6,y,8.8);girder(l,5.6,y,8.8);}else girder(l,0,y,20,slope);
 for(let side of [-1,1]){rail(l,side*8.7,y+.8,2.3,-.96);for(let x of [side*7.6,side*9.7])l.box([x,y+.4,-.96],[.07,.8,.07],C.gold);}
 if(tier<stage.floors-1){for(let x of [-8.3,8.3]){l.box([x,y+GAP*.5,-1.3],[.09,3.8,.09],C.edge,[0,0,x<0?.55:-.55]);}l.cylinder([-9.2,y+1.3,-1.5],[.08,2.3,.08],C.rust,undefined,.7,0,6);l.torus([-9.2,y+2.4,-1.5],[.11,.11,.11],C.gold);}
 if(stage.kind==='conveyor'&&tier>0){l.box([0,y-.04,0],[17,.08,1.45],'#293e45');for(let x=-8.4;x<9;x+=.6){l.cylinder([x,y-.14,0],[.14,1.4,.14],C.gold,[Math.PI/2,0,0]);}let hx=tier%2?-1.5:3;l.cylinder([hx,y+.2,0],[.37,.3,.37],C.rust,undefined,.7,0,6);l.torus([hx,y+.36,0],[.38,.38,.38],C.gold);}
 if(stage.kind==='lift'&&tier<stage.floors-1){for(let x of [-1,1])l.cylinder([x,y+1.65,-.85],[.035,GAP,.035],C.gold);}
 }
 if(stage.kind==='conveyor'){l.box([5.5,GAP*2+2.7,-.9],[2,.24,.5],C.dark);for(let x of [4.8,6.2])l.box([x,GAP*2+1.3,-.95],[.12,2.7,.15],C.edge);}
 for(let ladder of stage.ladders){let b=floorY(stage,ladder.from,ladder.x),t=floorY(stage,ladder.to,ladder.x);for(let x of [-.34,.34]){l.cylinder([ladder.x+x,(b+t)*.5,.32],[.045,t-b+.5,.045],C.gold);l.box([ladder.x+x,b+.15,.12],[.18,.09,.45],C.dark);l.box([ladder.x+x,t-.2,.12],[.18,.09,.45],C.dark);}for(let y=b+.18;y<t+.1;y+=.29)l.cylinder([ladder.x,y,.32],[.035,.68,.035],C.ivory,[0,0,Math.PI/2],.3);}
 const top=(stage.floors-1)*GAP;
 for(let y of [1,GAP*2+1,top+1])for(let x of [-10.4,10.4]){l.box([x,y,-.3],[.4,.25,.35],C.dark,[0,0,x<0?-.4:.4]);l.box([x,y,.0],[.3,.17,.04],'#ffe9b0',undefined,.2,2);}
 // Crane silhouette and roof cables.
 l.box([-7,top+3,-2],[.28,5,.28],C.rust,undefined,.7,0,6);l.box([0,top+5.2,-2],[16,.3,.4],C.gold);for(let i=-7;i<7;i++)l.box([i,top+5.2,-1.99],[.7,.09,.43],C.dark,[0,0,.6]);l.cylinder([6,top+3.5,-2],[.025,3,.025],C.edge);l.torus([6,top+2,-2],[.18,.18,.18],C.gold,[Math.PI/2,0,0]);
 l.box([stage.goal[0],floorY(stage,stage.floors-1,stage.goal[0])+.02,0],[1.65,.04,1.6],'#73baa0',undefined,.5,.2);l.box([stage.goal[0],stage.goal[1]+1.35,-.8],[1.6,.7,.12],C.dark);l.box([stage.goal[0],stage.goal[1]+1.35,-.71],[1.3,.05,.02],C.gold,undefined,.3,1);
 dressWorkshop(l,stage,profile);return l;}
export function barrel(l,p,spin=0){l.group(transform(p,[1,1,1],[0,0,spin]),()=>{l.cylinder([0,0,0],[.42,.84,.42],C.wood,[Math.PI/2,0,0],.94,0,1);for(let z of [-.34,.34]){l.torus([0,0,z],[.425,.425,.425],C.dark,[Math.PI/2,0,0],.35,0,2);l.cylinder([0,0,z],[.405,.025,.405],'#9f622f',[Math.PI/2,0,0],.94,0,1);for(let i=0;i<6;i++){let a=i*Math.PI/3;l.sphere([Math.cos(a)*.35,Math.sin(a)*.35,z+.025],[.027,.027,.02],C.gold,undefined,.25);}}for(let a=0;a<Math.PI*2;a+=Math.PI/6)l.box([Math.cos(a)*.415,Math.sin(a)*.415,0],[.015,.015,.67],'#71451f',[0,0,a]);});}
export function makeDynamic(game,extra,visual=null){const l=new SceneList(),p=game.player,s=game.stage,t=game.elapsed+game.endingTime;let state=game.state==='ending'?'win':game.fallFade>0?'hurt':p.land>0?'land':p.ladder>=0?'ladder':!p.grounded?'jump':Math.abs(p.vx)>.1?'run':'idle';
 if(!(game.mode==='vr'&&game.save.settings.view==='first'))human(l,visual?.player.position||[p.x,p.y,p.z],p.anim+game.endingTime*4,state,p.facing,'hero',p.hammer>0,visual?.player.pose);
 l.sphere([p.x,(p.grounded?p.y:floorY(s,p.tier,p.x))+.006,p.z],[.36,.013,.24],'#15363e');
 const top=(s.floors-1)*GAP;beast(l,[-7.9,visual?.boss.rootY??floorY(s,s.floors-1,-7.9),-.1],t,game.spawnIn<1.1,game.state==='ending',game.enemyReaction,game.endingTime,visual?.boss);human(l,[s.goal[0],floorY(s,s.floors-1,s.goal[0])+.04,0],t,game.state==='ending'?'win':'idle',1,'rescue',false,visual?.rescue);
 if(game.warning){l.sphere([-8.9,top+2,1],[.13,.13,.13],Math.sin(t*18)>0?'#ff704d':C.gold,undefined,.2,1.4);if(visual?.boss.held)barrel(l,visual.boss.held,0);else if(!visual)barrel(l,[-8.2,top+3.6,.3],0);}
 for(const physical of game.barrels){const b={...physical,...interpolateBarrel(game,physical)};if(b.kind==='gear'){l.torus([b.x,b.y,b.z],[.4,.4,.4],C.gold,[Math.PI/2,0,b.spin]);for(let i=0;i<6;i++){let a=i*Math.PI/3+b.spin;l.box([b.x+Math.cos(a)*.35,b.y+Math.sin(a)*.35,0],[.25,.13,.15],C.edge,[0,0,a]);}}else barrel(l,[b.x,b.y,b.z],b.spin);}
 if(!game.powerTaken){let [x,y,z]=s.hammer;l.cylinder([x,y+.55,z],[.05,.6,.05],C.wood,undefined,.94,0,1);l.box([x,y+.9,z],[.56,.26,.26],C.gold,undefined,.3,.5);l.torus([x,y+.05,z],[.45,.45,.45],C.gold,undefined,.5,.8);}
 if(s.kind==='lift')for(let tier=0;tier<s.floors-1;tier++){let y=liftY(t,tier);l.box([0,y-.11,0],[2.2,.22,1.8],C.edge);l.box([0,y-.2,0],[1.8,.12,1.4],C.gold);for(let x of [-.9,.9])l.box([x,y+.04,0],[.08,.02,1.7],'#92d1ab',undefined,.5,.6);}
 if(s.kind==='conveyor')for(let tier=1;tier<5;tier++){let y=tier*GAP;for(let i=-8;i<=8;i++){let x=((i+t*(tier%2?1:-1)*1.1+40)%17)-8.5;l.box([x,y-.003,0],[.12,.006,1.4],C.gold);}if(tier<4){let hz=hazardAt(t,tier),x=tier%2?-1.5:3;l.sphere([x,y+.44,0],[.14,.08,.14],hz==='active'?'#ff6445':hz==='warning'?C.gold:'#4aab9b',undefined,.3,1);if(hz==='active')for(let j=0;j<5;j++)l.sphere([x+Math.sin(t*12+j)*.16,y+.5+((t*2+j*.35)%1.3),Math.cos(j)*.12],[.22,.28,.22],'#b8c8c5',undefined,1);}}
 if(s.kind==='conveyor'){let y=GAP*2+pressHeight(t);l.cylinder([5.5,(GAP*2+2.7+y)*.5,-.25],[.11,GAP*2+2.7-y,.11],C.ivory);l.box([5.5,y,0],[1.35,.3,1.65],C.rust,undefined,.7,0,6);for(let x of [-.4,0,.4])l.box([5.5+x,y+.17,0],[.14,.03,1.5],C.gold);l.sphere([5.5,GAP*2+2.95,-.5],[.14,.14,.14],pressState(t)==='safe'?C.edge:pressState(t)==='warning'?C.gold:'#fa6544',undefined,.25,1.3);}
 if(s.devices)s.devices.forEach(([x,y,z],i)=>{let done=game.devices.has(i);l.box([x,y+.45,-.45],[.7,.9,.45],C.dark);l.box([x,y+.6,-.2],[.46,.25,.04],done?'#70dba2':'#7fd9ee',undefined,.2,1);l.cylinder([x,y+.23,-.17],[.1,.06,.1],done?C.edge:C.gold,[Math.PI/2,0,0]);});
 if(game.flightWarningTier!==null)l.sphere([-9.5,game.flightWarningTier*GAP+.45,0],[.16,.16,.16],'#ffad54',undefined,.3,2);
 extra?.(l);return l;}
