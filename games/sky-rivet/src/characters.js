import {transform,clamp,lerp} from './math.js';
import {solveTwoBone,humanPose,ease,blinkAt} from './motion.js';
const C={skin:'#efba98',shade:'#d28e72',ink:'#253a45',ivory:'#f3e3be',gold:'#e9b457',copper:'#b96c46',coral:'#c7664f',navy:'#344d61',teal:'#548f8c',hair:'#513d3b'};
function ell(l,p,s,c,rough=.8,material=3,r=[0,0,0],em=0){l.sphere(p,s,c,r,rough,em,material);}
function segment(l,a,b,r,c,material=3){const d=b.map((v,i)=>v-a[i]),length=Math.hypot(...d);if(length<1e-6)return;ell(l,a.map((v,i)=>(v+b[i])*.5),[r,length*.5+r*.15,r],c,.82,material,[Math.acos(clamp(d[1]/length,-1,1)),Math.atan2(d[0],d[2]),0]);}
function stitch(l,a,b,c=C.ivory){segment(l,a,b,.008,c,3);}
function badge(l,p,size=.07){for(let i=0;i<3;i++){const a=i*Math.PI*2/3,b=(i+1)*Math.PI*2/3;stitch(l,[p[0]+Math.sin(a)*size,p[1]+Math.cos(a)*size,p[2]],[p[0]+Math.sin(b)*size,p[1]+Math.cos(b)*size,p[2]],C.ivory);}}
function hand(l,p,grip=0,color=C.gold,side=1){
 const g=clamp(Number(grip),0,1);ell(l,[p[0],p[1]-.025,p[2]],[.077,.095,.055],color,.76,3);ell(l,[p[0],p[1]+.025,p[2]-.025],[.075,.043,.04],C.ink);
 for(let i=0;i<4;i++){const x=p[0]-.053+i*.035,y=p[1]-lerp(.10,.015,g),z=p[2]+lerp(.005,.045,g);segment(l,[x,y+.02,z],[x,y-lerp(.055,.035,g),z-.035*g],.018,C.ivory,3);}
 segment(l,[p[0]-side*.065,p[1]-.01,p[2]],[p[0]-side*.095,p[1]-.07,p[2]+.025],.025,C.ivory,3);
}
function face(l,pose,scale=1){
 for(const side of [-1,1]){
  const x=side*.10,open=Math.max(.055,1-pose.blink),ey=.075*open;
  ell(l,[x,.055,.214],[.072,ey,.031],C.ivory,.5,5);
  ell(l,[x+pose.gazeX,.055+pose.gazeY,.242],[.032,.045*open+.003,.014],C.ink,.32,5);
  ell(l,[x+pose.gazeX+.009,.072+pose.gazeY,.255],[.010,.012*open+.002,.005],'#ffffff',.25,5);
  ell(l,[x,.131-.072*pose.blink,.247],[.073,Math.max(.002,.077*pose.blink),.012],C.skin,.65,5);
  const brow=pose.hurt*.15+pose.air*.04-pose.win*.07;segment(l,[x-.065,.155-side*brow,.224],[x,.17,.232],.015,C.hair,4);segment(l,[x,.17,.232],[x+.062,.15+side*brow,.224],.015,C.hair,4);
  ell(l,[side*.155,-.055,.19],[.038,.022,.009],C.shade,.9,5);
  ell(l,[side*.232,.015,-.005],[.045,.080,.061],C.skin,.65,5);ell(l,[side*.247,.02,.035],[.019,.047,.018],C.shade,.8,5);
 }
 ell(l,[0,.008,.254],[.042,.052,.061],C.skin,.6,5);
 const smile=.014+.030*pose.smile+pose.air*.012;ell(l,[0,-.107,.222],[.060+pose.win*.010,smile,.013],C.ink,.8,5);ell(l,[0,-.096,.235],[.045,.008+.009*pose.win,.005],C.ivory,.65,5);
}
function shoe(l,ankle,pitch,yaw=0){l.group(transform(ankle,[1,1,1],[pitch,yaw,0]),()=>{ell(l,[0,-.023,.045],[.119,.105,.174],C.ink,.83,3);ell(l,[0,-.085,.078],[.126,.045,.207],'#172d38',.95,8);ell(l,[0,-.031,.182],[.121,.061,.086],C.copper,.7,3);for(let z of [.02,.07,.12])stitch(l,[-.065,.057,z],[.065,.057,z],C.ivory);});}
function hammer(l,wrist,angle){l.group(transform(wrist,[1,1,1],[angle,0,0]),()=>{l.cylinder([0,.19,0],[.034,.55,.034],'#a9794b',undefined,.9,0,1);ell(l,[0,.45,0],[.27,.095,.12],C.ink,.32,2);for(const x of [-.22,.22])ell(l,[x,.45,0],[.055,.105,.128],C.gold,.26,2);});}

// Articulated mechanic and aviator share proportions, with distinct costume and
// silhouette. Pose coordinates are meters; feet and grip targets are IK inputs.
export function human(l,p,time,state='idle',facing=1,role='hero',hasHammer=false,authored=null){
 const pose=authored||humanPose({time,phase:time,run:state==='run'?1:0,climb:state==='ladder'?1:0,air:state==='jump'?1:0,win:state==='win'?1:0,hurt:state==='hurt'?1:0,yaw:role==='hero'?facing*1.3:-.14,role});
 const start=l.items.length,pelvis=pose.pelvisX||0,offset=pose.hip-.76,shirt=role==='hero'?C.coral:C.teal,pants=role==='hero'?C.navy:'#514b60';
 l.group(transform(p,[1,1,1],[0,pose.yaw,0]),()=>{l.group(transform([pelvis,0,0]),()=>{
  ell(l,[0,.76+offset,.01],[.225,.17,.175],pants);ell(l,[0,1.005+offset,pose.lean*.52],[.247,.30*(1+(pose.breath||0)),.177*(1+(pose.breath||0))],shirt,.8,3,[pose.lean,pose.spineTwist||0,0]);
  ell(l,[0,1.14+offset,.015+pose.lean*.55],[.284,.115,.182],shirt);ell(l,[0,.80+offset,.015],[.25,.075,.185],C.ink,.8,3);
  ell(l,[0,.81+offset,.20],[.065,.052,.022],C.gold,.3,2);
  for(const side of [-1,1]){
   ell(l,[side*.17,1.02+offset,.162+pose.lean*.5],[.067,.082,.024],role==='hero'?C.copper:'#427576');stitch(l,[side*.17-.045,1.075+offset,.18+pose.lean*.5],[side*.17+.045,1.075+offset,.18+pose.lean*.5]);
   segment(l,[side*.19,1.21+offset,.13],[side*.13,.87+offset,.18],.023,C.gold);ell(l,[side*.245,.79+offset,-.045],[.065,.13,.08],C.copper);
  }
  stitch(l,[0,1.21+offset,.18],[0,.88+offset,.191]);badge(l,[-.11,1.17+offset,.192+pose.lean*.5],.036);
  const neck=[0,1.285+offset,pose.lean*.78];ell(l,neck,[.09,.105,.09],C.skin,.7,5);
  l.group(transform([0,1.465+offset,.018+pose.lean*.85],[1,1,1],[-pose.lean*.3-(pose.headLag||0)-(pose.lookPitch||0),-pose.yaw*.12+(pose.lookYaw||0)*.7-(pose.spineTwist||0)*.4,0]),()=>{
   ell(l,[0,0,0],[.237,.267,.217],C.skin,.67,5);ell(l,[0,.15,-.075],[.235,.15,.19],C.hair,.93,4);face(l,pose);
   if(role==='hero'){
    ell(l,[0,.238,-.025],[.278,.163,.259],C.gold,.41,6);l.cylinder([0,.168,.028],[.293,.029,.295],C.gold,undefined,.4,0,6);
    segment(l,[0,.365,-.17],[0,.37,.14],.025,C.ivory,0);ell(l,[0,.21,.25],[.095,.045,.023],C.ivory,.24,2);badge(l,[0,.225,.277],.03);
    ell(l,[-.253,.015,-.01],[.048,.095,.072],C.ink,.6,3);ell(l,[-.28,.015,-.01],[.022,.063,.05],C.copper,.4,2);
    segment(l,[-.275,-.015,.015],[-.20,-.13,.17],.012,C.ink,2);ell(l,[-.17,-.14,.20],[.034,.023,.019],C.ink);
   }else{
    for(const side of [-1,1]){ell(l,[side*.19,-.12,-.13],[.095,.19,.10],C.hair,.95,4,[0,0,side*.15]);l.torus([side*.103,.19,.18],[.083,.083,.083],C.gold,[Math.PI/2,0,0],.35,0,2);ell(l,[side*.103,.19,.182],[.062,.06,.012],'#678f9f',.15,7);}
    segment(l,[-.18,.20,.05],[.18,.20,.05],.020,C.copper,3);
   }
  });
  if(role==='rescue'){
   ell(l,[0,1.27+offset,.04],[.20,.069,.19],C.ivory,.9,3);
   segment(l,[.16,1.255+offset,-.12],[.25+pose.secondary,1.03+offset,-.24],.05,C.ivory,3);
   segment(l,[.25+pose.secondary,1.03+offset,-.24],[.34+pose.secondary*1.7,.88+offset,-.28],.045,C.ivory,3);
  }
  for(let i=0;i<2;i++){
   const side=i?1:-1,hip=[side*.145,pose.hip,.015],leg=solveTwoBone(hip,pose.feet[i].ankle.map((v,k)=>k===0?v-pelvis:v),.355,.355,[0,0,1]);
   segment(l,hip,leg.joint,.10,pants);ell(l,leg.joint,[.104,.104,.10],pants);segment(l,leg.joint,leg.end,.085,pants);ell(l,[leg.joint[0],leg.joint[1],leg.joint[2]+.07],[.066,.065,.022],role==='hero'?C.copper:C.teal);shoe(l,leg.end,pose.feet[i].pitch,pose.feet[i].yaw||0);
   const shoulder=[side*.285*Math.cos(pose.spineTwist||0),1.135+offset,.015+pose.lean*.65-side*.285*Math.sin(pose.spineTwist||0)],arm=solveTwoBone(shoulder,pose.hands[i].map((v,k)=>k===0&&pose.climb>.1?v-pelvis:v),.28,.285,[side*.7,0,-.6]);
   ell(l,shoulder,[.108,.12,.108],shirt);segment(l,shoulder,arm.joint,.083,shirt);ell(l,arm.joint,[.084,.084,.080],shirt);segment(l,arm.joint,arm.end,.066,shirt);ell(l,arm.end,[.084,.049,.075],C.copper);const d=arm.end.map((v,k)=>v-arm.joint[k]),length=Math.hypot(...d)||1,rotation=i===1&&hasHammer?[pose.tool.angle,0,0]:pose.climb>.3?[0,0,0]:[Math.atan2(-d[2],Math.hypot(d[0],d[1])),0,Math.atan2(d[0],-d[1])];l.group(transform(arm.end,[1,1,1],rotation),()=>hand(l,[0,0,0],i===1&&hasHammer?1:pose.handGrip?.[i]||0,C.gold,side));
   if(i===1&&hasHammer)hammer(l,arm.end,pose.tool.angle);
  }
  l.group(transform([0,.98+offset,-.185],[1,1,1],[pose.secondary,0,0]),()=>{ell(l,[0,0,-.025],[.17,.20,.071],C.ink);ell(l,[0,.11,-.09],[.18,.07,.027],C.copper);stitch(l,[-.12,-.08,-.097],[.12,-.08,-.097]);});
 });});
 if(pose.glow)for(let i=start;i<l.items.length;i++)l.items[i].em+=pose.glow;
}

export function beast(l,p,time,throwing=false,defeated=false,reaction=0,endingTime=0,visual=null){
 const load=visual?.load??(throwing?.5:0),defeat=visual?.defeat??(defeated?ease(endingTime/1.4):0),react=visual?.reaction??reaction,release=visual?Math.max(visual.releaseWind,1-ease(visual.throwAge/.55)):load;
 const off=[-.36*load-react*.055*(visual?.direction||1),-.23*load-.32*defeat,0],breath=Math.sin(time*1.7)*.014,roll=react*.08-.2*defeat;
 l.group(transform(p,[1.4,1.4,1.4],[0,0,0]),()=>{
  ell(l,[off[0],1.12+off[1],0],[.80+breath,.98-.22*defeat-.10*load,.56],'#795747',.93,4,[0,0,roll]);
  ell(l,[off[0],1.14+off[1],.42],[.61,.75,.18],'#c39b75',.88,4);
  ell(l,[off[0],.96+off[1],.59],[.56,.59,.043],'#395c60',.9,3);segment(l,[off[0]-.46,1.65+off[1],.39],[off[0]-.31,.76+off[1],.61],.045,C.copper);segment(l,[off[0]+.46,1.65+off[1],.39],[off[0]+.31,.76+off[1],.61],.045,C.copper);
  l.torus([off[0],.76+off[1],.08],[.64,.30,.60],C.ink,undefined,.85,0,3);l.torus([off[0],1.02+off[1],.653],[.105,.105,.105],C.gold,[Math.PI/2,0,0],.4,0,2);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;ell(l,[off[0]+Math.sin(a)*.11,1.02+off[1]+Math.cos(a)*.11,.66],[.028,.028,.016],C.gold,.35,2);}
  l.group(transform([off[0]-.05*load,2.17+off[1],.02],[1,1,1],[load*.12,0,react*.1]),()=>{
   ell(l,[0,0,0],[.69,.61,.52],'#926b50',.94,4);
   for(const side of [-1,1]){
    ell(l,[side*.58,.37,-.05],[.24,.25,.17],'#6a4e43',.96,4);ell(l,[side*.58,.39,.085],[.13,.14,.034],'#bc9278',.9,5);
    const open=Math.max(.08,1-blinkAt(time,2,4.9));ell(l,[side*.235,.09,.461],[.157,.155*open,.061],C.ivory,.7,5);ell(l,[side*.235+.015,.10,.514],[.057,.085*open,.024],C.ink,.5,5);
    segment(l,[side*.235-.15,.34+react*.04,.43],[side*.235+.14,.34-react*.06,.43],.045,'#4b3c38',4);
    ell(l,[side*.19,-.21,.49],[.275,.19,.16],'#d4b18b',.8,5);ell(l,[side*.30,-.05,.28],[.35,.29,.18],'#9c7456',.94,4);
   }
   ell(l,[0,-.06,.63],[.16,.115,.105],C.ink,.6,5);ell(l,[0,-.37,.51],[.19,.04+.04*defeat,.05],'#56423c',.8,5);
   for(const x of [-.075,.075])ell(l,[x,-.355,.555],[.063,.064,.018],C.ivory,.7,5);
   ell(l,[0,.51,-.025],[.64,.20,.47],C.gold,.5,6);l.cylinder([0,.415,.045],[.69,.055,.52],C.gold,undefined,.5,0,6);badge(l,[0,.55,.47],.08);
   for(let i=0;i<8;i++){const a=i*Math.PI/4;ell(l,[Math.cos(a)*.57,-.26+Math.sin(a)*.22,-.25],[.15,.24,.15],'#785747',.97,4,[0,0,a]);}
  });
  const center=visual?.held?visual.held.map((v,i)=>(v-p[i])/1.4):[lerp(0,-.64,release),lerp(1.5,.315,release),lerp(.58,.07,release)];
  for(const side of [-1,1]){
   const shoulder=[side*.75+off[0],1.64+off[1],0],idle=[side*.99+off[0],.66+off[1],.12],grip=[center[0]+side*.28,center[1],center[2]],hold=throwing||release>.02;
   const target=hold?grip:idle,arm=solveTwoBone(shoulder,target,.66,.71,[side,0,-.4]);segment(l,shoulder,arm.joint,.27,'#795747',4);ell(l,arm.joint,[.28,.27,.26],'#795747',.94,4);segment(l,arm.joint,arm.end,.25,'#795747',4);ell(l,arm.end,[.29,.22,.24],'#b48d6b',.88,5);
   for(let j=0;j<4;j++)ell(l,[arm.end[0]-.18+j*.12,arm.end[1]-.08,arm.end[2]+.16],[.048,.105,.06],C.ivory,.7,5);
   const hip=[side*.43+off[0],.65+off[1],0],foot=[side*.46,.17+(visual?.footY?.[side<0?0:1]||0)/1.4,.16+.22*defeat],leg=solveTwoBone(hip,foot,.41,.46,[0,0,1]);segment(l,hip,leg.joint,.31,'#6b5145',4);segment(l,leg.joint,leg.end,.29,'#6b5145',4);ell(l,[foot[0],.13+(visual?.footY?.[side<0?0:1]||0)/1.4,.24+.22*defeat],[.35,.13,.40],'#9f7f61',.93,4);
   for(let j=0;j<3;j++)ell(l,[foot[0]-.17+j*.17,.10,.59],[.045,.045,.07],C.ivory,.9,5);
  }
  // Distinct paddle-tail silhouette gives the workshop creature its own identity.
  ell(l,[.08,.50,-.77],[.36,.13,.52],'#5a4a40',.94,4,[.2,0,.12]);for(let j=-2;j<=2;j++)stitch(l,[-.20,.53,-.62+j*.12],[.30,.53,-.79+j*.12],'#896d51');
 });
}
export function glove(l,matrix,tool=false,side=1){l.group(matrix,()=>{hand(l,[0,0,0],tool,C.gold,side);if(tool)hammer(l,[0,0,0],-.28);});}
