export const STEP=1/120, GAP=3.25, WIDTH=20, DEPTH=1.8;
export const DIFFICULTY={easy:{label:'やさしい',lives:5,speed:2.25,interval:5.1,time:240},normal:{label:'標準',lives:3,speed:2.8,interval:4.2,time:200},hard:{label:'むずかしい',lives:3,speed:3.7,interval:3.1,time:165}};
const standard=[{x:7.4,from:0,to:1},{x:-7.4,from:1,to:2},{x:7.4,from:2,to:3},{x:-7.4,from:3,to:4}];
export const STAGES=[
{id:'tutorial',name:'はじめての工房',caption:'歩く、跳ぶ、つかむ。',kind:'tutorial',floors:2,ladders:[{x:6,from:0,to:1}],goal:[-6,GAP,0],tip:'→で右へ。Spaceで樽を跳ぶ。黄色のはしごで↑。VRはグリップでつかむ。',hammer:[0,0,0]},
{id:'iron',name:'鉄骨の夕暮れ',caption:'樽のリズムを見抜け。',kind:'iron',floors:5,ladders:[...standard,{x:-2,from:0,to:1},{x:2,from:2,to:3}],goal:[7.7,GAP*4,0],tip:'樽は端から一段ずつ落下。警告灯が点滅したら次の樽が来る。',hammer:[-1,GAP,0]},
{id:'conveyor',name:'蒸気の搬送路',caption:'止まる勇気も、進む力。',kind:'conveyor',floors:5,ladders:[...standard,{x:0,from:1,to:2}],goal:[7.7,GAP*4,0],tip:'ベルトに流されないように。蒸気は黄色の予告から赤い噴出へ。',hammer:[1,GAP*2,0]},
{id:'lift',name:'空をつなぐ昇降機',caption:'巡る足場へ、飛び移れ。',kind:'lift',floors:5,ladders:[...standard],goal:[7.7,GAP*4,0],tip:'中央の緑の足場は上昇・下降を繰り返す。飛来する歯車は灯りで予告。',hammer:[-3,GAP,0]},
{id:'summit',name:'星灯りの最上階',caption:'三つの制御器を止めよう。',kind:'summit',floors:5,ladders:standard,goal:[7.7,GAP*4,0],devices:[[-4,GAP,0],[4,GAP*2,0],[-3,GAP*3,0]],tip:'青い制御器の近くでE／アクション。三つ解除して飛行士ルカを救出。',hammer:[0,GAP*2,0]}
];
export function floorY(stage,tier,x){return tier*GAP+(stage.kind==='iron'?(tier%2===0?-1:1)*x*.025:0);}
export function liftY(time,tier){return tier*GAP+(Math.sin(time*.7+tier*.9)+1)*GAP*.5;}
export function solidAt(stage,tier,x){return stage.kind!=='lift'||tier===0||Math.abs(x)>1.2;}
export function hazardAt(time,tier){const phase=(time+tier*1.7)%7.5;return phase>5.5?'active':phase>4.1?'warning':'safe';}

export function pressState(time){const phase=time%6;return phase>4.5?'active':phase>3?'warning':'safe';}
export function pressHeight(time){const phase=time%6;return phase>4.5?.5:phase>4?2.5-(phase-4)*4:phase<.4?.5+phase*5:2.5;}
