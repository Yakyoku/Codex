import {verification} from './storage.js';
                                        
export class FrameMeter {
  samples         =[];active=false;last            =null;elapsed=0;warmUntil            =null;status='未開始';
  duration       ;targetHz       ;
  constructor(duration=60,targetHz=60){this.duration=duration;this.targetHz=targetHz;}
  start(){this.samples=[];this.elapsed=0;this.last=null;this.warmUntil=null;this.active=true;this.status='準備中（2秒）';}
  stop(reason='停止'){this.active=false;this.last=null;this.status=reason;}
  frame(ms       ){
    if(!this.active||!Number.isFinite(ms))return;
    if(this.warmUntil===null)this.warmUntil=ms+2000;
    if(ms<this.warmUntil){this.last=null;return;}
    this.status='計測中';
    if(this.last!==null){const dt=ms-this.last;if(dt<=0){this.stop('中断：時刻の逆転');return;}this.samples.push(dt);this.elapsed+=dt;}
    this.last=ms;
    if(this.elapsed>=this.duration*1000||this.samples.length>=120000)this.stop('完了');
  }
  summary(){const sorted=[...this.samples].sort((a,b)=>a-b);const p=(q       )=>sorted.length?sorted[Math.max(0,Math.ceil(sorted.length*q)-1)]:null;const threshold=1500/this.targetHz;return {status:this.status,seconds:this.elapsed/1000,samples:sorted.length,p50:p(.5),p95:p(.95),p99:p(.99),lateFrames:this.samples.filter(v=>v>threshold).length,lateThresholdMs:threshold,targetHz:this.targetHz};}
}
export function configureScene(g    ,scene          ){
  g.difficulty='standard';g.lives=3;g.bonus=0;g.powered=0;g.stage=scene==='stress'?12:1;g.loadStage();
  if(scene==='stress'){
    const flowers=g.targets.filter((t    )=>t.kind==='flower');
    for(let i=0;i<48;i++){const t=flowers[i%flowers.length];g.targets.push({...t,id:1000+i,x:60+(i*137)%880,y:60+(i*89)%540,active:true});}
    const enemy=g.enemies[0];if(enemy)for(let i=0;i<18;i++)g.enemies.push({...enemy,id:2000+i,x:80+(i*97)%840,y:80+(i*71)%500,origin:{x:80+(i*97)%840,y:80+(i*71)%500},phase:i});
  }
}
export function installDiagnostics(options                                                                                                                          ) {
  if(!verification)return null;
  const meter=new FrameMeter();let scene          ='normal',auto=true,baseline='',build    =null,nextPaint=0,finished=false;let runInfo                            =null;let run=0;
  const panel=document.createElement('section');panel.id='diagnostics';panel.setAttribute('aria-label','保存非干渉の性能検証');
  panel.style.cssText='position:fixed;z-index:100;right:12px;top:100px;width:min(440px,94vw);max-height:75vh;overflow:auto;padding:16px;background:#071b27f5;color:#e9f7e6;border:1px solid #93bbae;border-radius:12px;font:14px/1.5 system-ui;box-shadow:0 8px 30px #0008';
  panel.innerHTML='<strong>性能検証 · セーブ読込／保存なし</strong><p>描画コールバック間隔を計測します。GPU処理時間・実機FPSの保証ではありません。</p><label>場面 <select id="perf-scene"><option value="normal">通常：庭1</option><option value="stress">負荷：庭12＋花48／敵18</option></select></label><label> 秒 <select id="perf-duration"><option>30</option><option selected>60</option><option>120</option><option>600</option></select></label><label> 目標Hz <select id="perf-hz"><option selected>60</option><option>72</option><option>90</option><option>120</option><option>144</option></select></label><label><input id="perf-auto" type="checkbox" checked> 自動操作</label><div><button id="perf-start" disabled>開始</button><button id="perf-stop">停止</button><button id="perf-retry" disabled>再試行</button><button id="perf-export">結果JSON</button></div><pre id="perf-report" style="white-space:pre-wrap;font:12px/1.5 monospace">版を照合中…</pre>';
  document.body.append(panel);document.querySelectorAll                   ('a[href]').forEach(a=>{const url=new URL(a.href,location.href);if(url.origin===location.origin||a.id==='other'){url.searchParams.set('verify','1');a.href=url.href;}});const el=(id       )=>panel.querySelector('#'+id)       ;
  const spec=()=>({width:options.canvas.width,height:options.canvas.height,dpr:devicePixelRatio,...options.info()});
  const report=()=>({schema:1,run,build,scene,automaticInput:auto,measurement:'render callback intervals, NOT GPU execution time',...meter.summary(),rendering:runInfo??spec(),persistentSaveAccess:'disabled',userAgent:navigator.userAgent});
  function paint(){const r=report(),n=(v            )=>v===null?'—':v.toFixed(2);el('perf-report').textContent=`BUILD ${build?.build_id??'取得失敗'}\n入力hash ${build?.input_spec_sha256??'—'}\n描画 ${r.rendering.width} × ${r.rendering.height} / DPR ${r.rendering.dpr}\n画質 ${r.rendering.quality} / ${scene} / 試行${run} / ${r.status}\n計測 ${r.seconds.toFixed(1)} / ${meter.duration}秒 · 標本 ${r.samples}\np50 ${n(r.p50)} / p95 ${n(r.p95)} / p99 ${n(r.p99)} ms\n遅延 ${r.lateFrames}（>${n(r.lateThresholdMs)} ms、目標 ${r.targetHz}Hzの1.5倍）\nゲームパッド ${r.rendering.gamepad??'未接続'}\n背景化・設定変更・停止は自動的に計測終了`;}
  function stop(reason       ){meter.stop(reason);options.stop();finished=true;paint();}
  function start(){if(!build)return;run++;scene=el('perf-scene').value;auto=el('perf-auto').checked;meter.duration=Number(el('perf-duration').value);meter.targetHz=Number(el('perf-hz').value);options.start(scene);runInfo=spec();baseline=JSON.stringify(runInfo);meter.start();finished=false;paint();}
  el('perf-start').onclick=start;el('perf-retry').onclick=start;el('perf-stop').onclick=()=>stop('手動停止');
  el('perf-export').onclick=()=>{const blob=new Blob([JSON.stringify(report(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`twin-garden-${build?.app??'unknown'}-${scene}-measurement.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  for(const name of ['perf-scene','perf-duration','perf-hz','perf-auto'])el(name).onchange=()=>{if(meter.active)stop('中断：計測条件変更');};
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&meter.active)stop('中断：背景化');});
  window.addEventListener('blur',()=>{if(meter.active)stop('中断：フォーカス喪失');});
  window.addEventListener('gamepaddisconnected',()=>{if(meter.active)stop('中断：ゲームパッド切断');});
  fetch('./build.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('build metadata');return r.json();}).then(v=>{if(!v.build_id||!v.input_spec_sha256)throw Error('build metadata');build=v;el('perf-start').disabled=el('perf-retry').disabled=false;paint();}).catch(()=>{el('perf-report').textContent='版の取得に失敗。再読込してください。計測は開始できません。';});
  return {
    meter,report,
    input(tick       ){if(!meter.active||!auto)return null;return {red:{x:Math.cos(tick/83),y:Math.sin(tick/109)},blue:{x:Math.sin(tick/131),y:Math.cos(tick/97)},reset:tick%240===239};},
    maintain(g    ){if(meter.active&&g.status!=='playing'){configureScene(g,scene);} },
    frame(ms       ){if(meter.active){if(!options.active())stop('中断：ゲーム一時停止');else if(baseline!==JSON.stringify(spec()))stop('中断：解像度・画質・入力環境変更');else meter.frame(ms);if(!meter.active&&!finished){options.stop();finished=true;paint();}}if(ms>nextPaint){paint();nextPaint=ms+500;}},
  };
}
