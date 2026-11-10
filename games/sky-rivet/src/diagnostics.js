import {floorY} from './stages.js';

// Animation callback intervals, not GPU execution time or simulated-physics FPS.
// Quantiles use a bounded 0.1 ms histogram; no sorting of a full run each frame.
export class FrameProbe{
 constructor(){this.state='idle';this.reset();}
 reset(){this.count=0;this.elapsed=0;this.delayed=0;this.bins=new Map();this.last=null;this.context=null;this.reason='未開始';}
 start(context,{duration=60,targetHz=60,warmup=2000}={}){
  this.reset();this.context=JSON.parse(JSON.stringify(context));this.duration=Math.min(900,Math.max(1,duration));this.targetHz=targetHz>0&&Number.isFinite(targetHz)?targetHz:60;this.threshold=1500/this.targetHz;this.warmup=Math.max(0,warmup);this.warmStart=null;this.state='warming';this.reason='描画の準備中';
 }
 frame(time,context){
  if(!['warming','running'].includes(this.state))return;
  if(JSON.stringify(context)!==JSON.stringify(this.context)){this.stop('場面・画質・解像度の変更');return;}
  if(!Number.isFinite(time))return;
  if(this.state==='warming'){
   this.warmStart??=time;if(time-this.warmStart<this.warmup)return;
   this.state='running';this.reason='計測中';this.last=time;return;
  }
  const delta=time-this.last;if(delta<=0)return;this.last=time;
  this.elapsed+=delta;this.count++;if(delta>this.threshold)this.delayed++;
  const bin=Math.round(delta*10);this.bins.set(bin,(this.bins.get(bin)||0)+1);
  if(this.elapsed>=this.duration*1000)this.stop('指定時間に到達');
  else if(this.count>=180000)this.stop('標本上限に到達');
 }
 stop(reason='手動停止'){if(['warming','running'].includes(this.state)){this.state='stopped';this.reason=reason;this.last=null;}}
 get summary(){
  const entries=[...this.bins].sort((a,b)=>a[0]-b[0]);
  const percentile=p=>{if(this.count<30)return null;const rank=Math.ceil(this.count*p);let sum=0;for(const [bin,n]of entries){sum+=n;if(sum>=rank)return bin/10;}return null;};
  return {state:this.state,reason:this.reason,elapsedSeconds:this.elapsed/1000,samples:this.count,p50:percentile(.5),p95:percentile(.95),p99:percentile(.99),delayedFrames:this.delayed,lateThresholdMs:this.threshold,targetHz:this.targetHz,quantileResolutionMs:.1,context:this.context,metric:'animation_callback_interval_ms',gpuFrameTime:null};
 }
}

export function prepareScenario(game,{mode='2d',scene='normal'}={}){
 game.mode=mode==='2d'?'2d':'vr';game.save.settings.view='tabletop';game.start(scene==='load'?2:1);
 // Explicit benchmark-only invulnerability stabilizes the scene; physics and
 // collision checks still run. No normal-play or persistent save is modified.
 game.player.invincible=1000.12;maintainScenario(game,scene);
}
export function maintainScenario(game,scene){
 if(game.state!=='playing')return;
 game.player.invincible=1000.12;game.remaining=Math.max(game.remaining,game.rules.time);
 if(scene!=='load')return;
 // 24 moving barrels on the real conveyor/press stage, bounded and replenished.
 while(game.barrels.length<24){const i=game.barrels.length,tier=1+i%4,x=-8+(i%6)*3.1;game.barrels.push({id:game.nextId++,kind:'barrel',x,y:floorY(game.stage,tier,x)+.42,z:0,vx:game.rules.speed*(tier%2?1:-1),vy:0,tier,falling:false,spin:i});}
 if(game.barrels.length>24)game.barrels.length=24;
}

export class Diagnostics{
 constructor({search,game,onPrepare,onVR,onStart,download}){
  this.onStart=onStart;this.game=game;this.onPrepare=onPrepare;this.onVR=onVR;this.download=download;this.probe=new FrameProbe();this.build={release_id:'development',input_manifest_sha256:null};this.render={};this.lastUI=-Infinity;
  const q=new URLSearchParams(search);this.mode=q.get('mode')==='3d'?'3d':'2d';this.scene=q.get('scene')==='load'?'load':'normal';
  this.game.save.settings.quality=['pc','ipad','quest'].includes(q.get('quality'))?q.get('quality'):'auto';
  this.panel=document.createElement('section');this.panel.id='diagnostics';this.panel.setAttribute('aria-label','保存に触れない性能検証');
  this.panel.innerHTML=`<h2>性能検証 · セーブ非干渉</h2><p>既存セーブの読込・保存・削除なし。このページを閉じると検証設定は消えます。</p><label>描画 <select id="diagMode"><option value="2d">2D</option><option value="3d">3D PC俯瞰（非VR）</option></select></label> <label>場面 <select id="diagScene"><option value="normal">通常：鉄骨</option><option value="load">負荷：搬送設備＋24樽</option></select></label> <label>秒 <select id="diagDuration"><option>30</option><option selected>60</option><option>180</option><option>900</option></select></label> <label>判定基準Hz <select id="diagHz"><option selected>60</option><option>72</option><option>90</option><option>120</option></select></label><div class="diag-actions"><button id="diagPrepare">場面を準備</button><button id="diagStart">計測開始</button><button id="diagStop">停止</button><button id="diagRetry">再試行</button><button id="diagVR">VRで検証</button><button id="diagExport">結果JSON</button></div><pre id="diagReadout" role="status" aria-live="off"></pre><p>2秒の準備後に計測。検証用無敵・タイマー固定。実際の描画コール間隔で、GPU処理時間ではありません。非表示・ポーズ・設定変更で停止します。</p>`;
  document.body.append(this.panel);this.el=id=>this.panel.querySelector('#'+id);this.el('diagMode').value=this.mode;this.el('diagScene').value=this.scene;
  this.el('diagPrepare').onclick=()=>this.prepare();this.el('diagStart').onclick=()=>this.start();this.el('diagStop').onclick=()=>this.stop('手動停止');this.el('diagRetry').onclick=()=>{this.prepare();this.start();};this.el('diagVR').onclick=()=>{this.prepare();onVR();};
  for(const id of ['diagMode','diagScene'])this.el(id).onchange=()=>this.stop('選択変更。場面を準備してください');
  this.el('diagExport').onclick=()=>download('sky-rivet-performance.json',JSON.stringify(this.snapshot,null,2),'application/json');
  fetch('./build-info.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('metadata unavailable');return r.json();}).then(b=>{this.build=b;this.paint(0,true);}).catch(()=>{this.build.note='開発ソース。固定版メタデータなし';this.paint(0,true);});this.paint(0,true);
 }
 context(){return {mode:this.mode,scene:this.scene,stage:this.game.stageIndex,...this.render};}
 prepare(){this.stop('場面の再準備');this.mode=this.render.xr?'vr':this.el('diagMode').value;this.scene=this.el('diagScene').value;prepareScenario(this.game,this);this.onPrepare();this.paint(0,true);}
 start(){if(this.game.state!=='playing'){this.paint(0,true);return;}this.onStart?.();this.probe.start(this.context(),{duration:Number(this.el('diagDuration').value),targetHz:Number(this.el('diagHz').value)});this.paint(0,true);}
 stop(reason){this.probe.stop(reason);this.paint(0,true);}
 frame(time,render,pads){this.render=render;this.pads=pads;if(this.game.state!=='playing')this.probe.stop('ゲーム停止');this.probe.frame(time,this.context());this.paint(time);}
 get snapshot(){return {verification:true,storage:'isolated_memory_no_browser_storage_access',build:this.build,...this.probe.summary,current:this.context(),controllers:this.pads||[],scenario_notes:'検証用無敵・タイマー固定。負荷場面は搬送ステージ＋補充される24樽。3D PCは単眼透視投影で、VR両眼性能とは別。',hardware_validation:'この結果を取得した端末でのみ有効。ソフトウェア描画や模擬入力は実機GPU/コントローラー検証を意味しない。'};}
 paint(time,force=false){if(!force&&time-this.lastUI<1000)return;this.lastUI=time;const s=this.snapshot,c=s.context||s.current,fmt=x=>x===null?'未計測':x.toFixed(1)+'ms';this.lines=[`${s.build.release_id} · 入力 ${(s.build.input_manifest_sha256||'未固定').slice(0,16)}`,`${c.mode}/${c.scene} · ${c.width||'?'}×${c.height||'?'} · ${c.profile||'?'} / ${c.detail||'?'} · 影 ${c.shadowSize||'?'}`,`${s.state} · ${s.reason} · ${s.elapsedSeconds.toFixed(1)}秒 · ${s.samples}標本`,`p50 ${fmt(s.p50)} / p95 ${fmt(s.p95)} / p99 ${fmt(s.p99)}`,`遅延 ${s.delayedFrames}（>${s.lateThresholdMs?.toFixed(1)||'?'}ms / 基準${s.targetHz||'?'}Hz）`,`Pad: ${(s.controllers||[]).map(p=>p.mapping+' #'+p.index).join(', ')||'未検出'}`];this.el('diagReadout').textContent=this.lines.join('\n');this.el('diagStop').disabled=!['warming','running'].includes(s.state);this.el('diagStart').disabled=this.game.state!=='playing'||['warming','running'].includes(s.state);}
}
