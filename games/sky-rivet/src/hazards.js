import {hazardAt,pressState} from './stages.js';

// Read-only, shared warning labels. Neither view changes the simulation.
export function hazardStatus(game) {
  if (game.state==='ending') return {level:'safe',text:'救出成功！ 工房に灯りが戻りました'};
  const tier=game.player.tier, floor=`${tier+1}段目`;
  if(game.stage.kind==='conveyor' && tier>0) {
    const steam=tier<4?hazardAt(game.elapsed,tier):'safe';
    const press=tier===2?pressState(game.elapsed):'safe';
    if(press==='active') return {level:'danger',text:`${floor}：プレス作動中 — 黄色の装置から離れて待つ`};
    if(steam==='active') return {level:'danger',text:`${floor}：蒸気噴出中 — 赤い噴出口に注意`};
    if(press==='warning') return {level:'warning',text:`${floor}：プレス予告 — 押し板が下がります`};
    if(steam==='warning') return {level:'warning',text:`${floor}：蒸気予告 — 噴出口の手前で待つ`};
  }
  if(game.flightWarningTier!==null) return {level:'warning',text:`歯車予告：${game.flightWarningTier+1}段目 左から飛来`};
  const seconds=Math.max(0,game.spawnIn);
  return {level:seconds<=1.1?'warning':'safe',text:seconds<=1.1?`樽の投下予告：あと${seconds.toFixed(1)}秒 上段から`:`次の樽：あと${Math.ceil(seconds)}秒 — 進路を見て登ろう`};
}
