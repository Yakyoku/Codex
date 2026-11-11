import {STAGES} from './stages.js';
import {hazardStatus} from './hazards.js';
import {I,transform,mul,inverse,point,clamp,lerp} from './math.js';
import {glove} from './art.js';
export const XR_BUTTONS={trigger:0,squeeze:1,stick:3,a:4,b:5};
export function xrControls(sources){let input={x:0,y:0,z:0,jump:false,action:false,grip:false},turn=0,pause=false;for(const source of sources){const gp=source.gamepad;if(!gp||gp.mapping!=='xr-standard')continue;const a=gp.axes,b=gp.buttons;const stickX=a.length>=4?a[2]:0,stickY=a.length>=4?a[3]:0;const dead=x=>Math.abs(x)>.2?x:0;if(source.handedness==='left'){input.x=dead(stickX);input.y=-dead(stickY);input.z=dead(stickY);input.grip||=!!b[1]?.pressed;}if(source.handedness==='right'){turn=dead(stickX);input.jump=!!b[4]?.pressed;input.action=!!b[0]?.pressed;input.grip||=!!b[1]?.pressed;pause=!!b[5]?.pressed;}}return {input,turn,pause};}
export class XRManager{
 constructor(renderer,game,sound,callbacks){this.r=renderer;this.g=game;this.sound=sound;this.callbacks=callbacks;this.session=null;this.supported=false;this.status='確認中';this.yaw=0;this.turnHeld=false;this.pauseHeld=false;this.selectHeld=false;this.baseHead=[0,1.6,0];this.rig=I();this.viewY=0;this.menuCanvas=document.createElement('canvas');this.menuCanvas.width=900;this.menuCanvas.height=900;this.menuMatrix=null;this.menuHash='';this.menuPage='main';this.hover=-1;this.lastControllerCount=0;this.profileNames=[];this.eyeMeasured=1.6;this.ready=this.check();}
 resetControls(){this.turnHeld=true;this.pauseHeld=true;this.selectHeld=true;this.gameplayBlocked=true;}
 captureProfiles(session){this.lastControllerCount=session.inputSources.length;this.profileNames=[...session.inputSources].map(source=>({hand:source.handedness,profiles:[...(source.profiles||[])],mapping:source.gamepad?.mapping,buttons:source.gamepad?.buttons.length,axes:source.gamepad?.axes.length}));}
 sampleControls(sources){const ctl=xrControls(sources);if(this.gameplayBlocked){if(!ctl.input.jump&&!ctl.input.action&&!ctl.input.grip)this.gameplayBlocked=false;else ctl.input=xrControls([]).input;}return ctl;}
 async check(){
  this.supported=false;
  if(!isSecureContext){this.status='VRはHTTPSまたはlocalhostで開いてください。2Dはそのまま遊べます。';return false;}
  if(!navigator.xr){this.status='このブラウザはWebXRに非対応です。2Dで遊ぶか、Quest Browserで開いてください。';return false;}
  try{
   const supported=await navigator.xr.isSessionSupported('immersive-vr');
   if(supported)await this.r.gl.makeXRCompatible();
   this.supported=supported;
   this.status=supported?'Quest BrowserからVRを開始できます。':'この端末はimmersive-vr非対応です。2Dをご利用ください。';
   return supported;
  }catch(e){this.status=`VR確認失敗：${e.name}。2Dで遊べます。`;return false;}
 }
 async enter(){
  if(this.session||this.pending)return;
  if(!this.supported){this.callbacks.error(this.status);return;}
  let requested,session,ended=false;
  const attempt=(this.enterAttempt||0)+1;this.enterAttempt=attempt;
  this.pending=true;
  // Keep requestSession in the click handler's activation, before any await.
  try{requested=navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']});}
  catch(e){this.pending=false;this.callbacks.error(this.error(e));return;}
  try{
   session=await requested;this.pending=session;
   session.addEventListener('end',()=>{ended=true;if(this.session===session)this.onEnd();else if(this.pending===session)this.pending=false;},{once:true});
   session.updateRenderState({baseLayer:new XRWebGLLayer(session,this.r.gl,{alpha:false,depth:true,antialias:true,framebufferScaleFactor:1}),depthNear:.05,depthFar:120});
   let space;
   try{space=await session.requestReferenceSpace('local-floor');}
   catch(e){if(ended)throw e;space=await session.requestReferenceSpace('local');}
   if(ended||attempt!==this.enterAttempt){if(this.pending===session)this.pending=false;if(attempt===this.enterAttempt)this.callbacks.error('VRの準備中にセッションが終了しました。2Dで遊ぶか、もう一度開始できます。');return;}
   this.space=space;
   space.addEventListener('reset',()=>{if(this.session!==session)return;this.resetControls();this.recenterPending=true;this.g.pause('tracking');});
   session.addEventListener('visibilitychange',()=>{if(this.session!==session)return;this.resetControls();if(session.visibilityState!=='visible'){this.g.pause('visibility');this.sound.suspend();}});
   session.addEventListener('inputsourceschange',event=>{if(this.session!==session)return;if(event?.removed?.length||this.lastControllerCount&&session.inputSources.length<this.lastControllerCount)this.g.pause('controller');this.resetControls();this.captureProfiles(session);});
   this.captureProfiles(session);this.resetControls();this.session=session;this.pending=false;
   this.g.switchMode('vr');if(this.g.state==='title')this.g.start(1);
   this.recenterPending=true;this.menuMatrix=null;this.menuPage='main';this.menuHash='';this.hudHash='';this.yaw=0;this.viewY=this.g.player.y;
   this.callbacks.started();this.selectRefreshRate();
  }catch(e){
   if(attempt!==this.enterAttempt){if(session&&!ended)await session.end().catch(()=>{});return;}
   if(this.session===session)this.session=null;
   this.pending=false;this.resetControls();
   if(session&&!ended)await session.end().catch(()=>{});
   this.callbacks.error(this.error(e));
  }
 }
 error(e){return `VRを開始できませんでした（${e.name||'Error'}）。Quest Browserの権限を確認し、「2Dで遊ぶ」へ戻れます。`;}
 async selectRefreshRate(){const s=this.session;if(!s)return;this.refreshRates=Array.from(s.supportedFrameRates||[]).sort((a,b)=>a-b);if(s.updateTargetFrameRate){const target=this.refreshRates.includes(72)?72:this.refreshRates.find(v=>v>=72);if(target)try{await s.updateTargetFrameRate(target);}catch{}}}
 onEnd(){this.session=null;this.space=null;this.pose=null;this.resetControls();this.g.pause('vr-exit');this.menuMatrix=null;this.callbacks.ended();}
 async exit(){if(this.session)await this.session.end();}
 recenter(){this.recenterPending=true;this.menuMatrix=null;}
 update(frame,dt){const session=this.session,pose=frame.getViewerPose(this.space);if(!pose){this.resetControls();this.pose=null;this.g.pause('tracking');return null;}if(session.visibilityState!=='visible'){this.resetControls();this.g.pause('visibility');return null;}this.pose=pose;if(this.g.state==='playing'){const tracked=[...session.inputSources].filter(s=>s.gamepad?.mapping==='xr-standard');if(!tracked.some(s=>s.handedness==='left')||!tracked.some(s=>s.handedness==='right')||tracked.some(s=>!frame.getPose(s.targetRaySpace,this.space))){this.resetControls();this.g.pause('controller');}}let head=pose.transform.position;if(this.recenterPending){this.baseHead=[head.x,head.y,head.z];this.eyeMeasured=head.y;this.recenterPending=false;this.yaw=-Math.atan2(pose.transform.matrix[8],pose.transform.matrix[10]);}
 const ctl=this.sampleControls(session.inputSources);if(ctl.pause&&!this.pauseHeld){this.callbacks.pause();}this.pauseHeld=ctl.pause;let snap=Math.abs(ctl.turn)>.65;if(snap&&!this.turnHeld&&this.g.save.settings.view==='first'&&this.g.state==='playing')this.yaw-=Math.sign(ctl.turn)*Math.PI/6;this.turnHeld=snap;
 let input=ctl.input;if(this.g.save.settings.view==='first'&&this.g.player.ladder<0){const m=pose.transform.matrix;let angle=this.yaw;const f=-input.z,side=input.x;let rx=Math.cos(angle)*m[0]+Math.sin(angle)*m[2],rz=-Math.sin(angle)*m[0]+Math.cos(angle)*m[2],fx=-Math.cos(angle)*m[8]-Math.sin(angle)*m[10],fz=Math.sin(angle)*m[8]-Math.cos(angle)*m[10];input.x=clamp(fx*f+rx*side,-1,1);input.z=clamp(fz*f+rz*side,-1,1);}
 const p=this.g.player;const first=this.g.save.settings.view==='first';this.viewY=lerp(this.viewY,p.y,Math.min(1,dt*7));let scale=first?1:12;let goal=first?[p.x,this.viewY+this.g.save.settings.eyeHeight,p.z]:[0,8.5,20];const ry=transform([0,0,0],[scale,scale,scale],[0,this.yaw,0]);const offset=point(ry,this.baseHead);this.rig=mul(transform(goal.map((v,i)=>v-offset[i])),ry);this.headMatrix=mul(this.rig,pose.transform.matrix);this.wallFade=first&&(Math.abs(this.headMatrix[14]-p.z)>.8||Math.abs(this.headMatrix[12]-p.x)>1.1)?.97:0;
 const paused=this.g.state!=='playing';if(paused){if(!this.menuMatrix)this.menuMatrix=mul(new Float32Array(pose.transform.matrix),transform([0,0,-1.45],[1.12,1.12,1]));let hover=-1;for(const source of session.inputSources){if(source.handedness!=='right')continue;let ray=frame.getPose(source.targetRaySpace,this.space);if(!ray)continue;let inv=inverse(this.menuMatrix),o=point(inv,[ray.transform.matrix[12],ray.transform.matrix[13],ray.transform.matrix[14]]),end=point(inv,point(ray.transform.matrix,[0,0,-1])),d=end.map((x,i)=>x-o[i]);let t=-o[2]/d[2];if(t>0){let x=o[0]+d[0]*t,y=o[1]+d[1]*t;if(Math.abs(x)<.48&&Math.abs(y)<.49){let py=(.5-y)*900;hover=this.menuButtons().findIndex(b=>py>=b.y&&py<=b.y+56);}}}
 this.hover=hover;if(input.action&&!this.selectHeld&&hover>=0)this.activate(hover);this.selectHeld=input.action;this.drawMenu();}else{this.menuMatrix=null;this.selectHeld=input.action;this.drawHUD();}
 return {pose,input:paused?{...input,x:0,y:0,z:0,jump:false,action:false,grip:false}:input};}
 menuButtons(){let g=this.g,s=g.save.settings;if(this.menuPage==='stages'){const choices=STAGES.slice(0,g.save.unlocked+1).map((stage,i)=>[(i?'STAGE '+i+' ':'練習 ')+stage.name,()=>{this.menuPage='main';g.start(i);this.viewY=g.player.y;g.fallFade=.4;this.recenter();this.sound.unlock().then(()=>this.sound.start()).catch(()=>{});}]);choices.push(['ポーズへ戻る',()=>{this.menuPage='main';}]);return choices.map(([label,fn],i)=>({label,fn,y:220+i*64}));}let arr=g.state==='clear'?[['次のステージへ',()=>g.next()]]:g.state==='ending'?[['もう一度遊ぶ',()=>g.start(1)]]:g.state==='gameover'?[['再挑戦',()=>g.retry()]]:[['ゲームを再開',()=>{g.resume();this.sound.unlock().then(()=>this.sound.start());}]];arr.push(['視点：'+(s.view==='first'?'体験視点':'俯瞰視点'),()=>{s.view=s.view==='first'?'tabletop':'first';this.recenter();}],['目線：'+(s.posture==='seated'?'座位':'立位'),()=>{s.posture=s.posture==='seated'?'standing':'seated';s.eyeHeight=s.posture==='seated'?1.45:1.65;this.recenter();}],['リセンター',()=>this.recenter()],['周辺減光：'+(s.vignette?'入':'切'),()=>s.vignette=!s.vignette],['BGM：'+(s.music?'入':'切'),()=>{s.music=s.music?0:.4;this.sound.updateVolumes();}],['2Dで遊ぶ（面の最初から）',async()=>{g.switchMode('2d');await this.exit();}],['現在のステージをやり直す',()=>g.retry()],['ステージ選択（解放済み）',()=>{this.menuPage='stages';}]);const d=this.callbacks.diagnostics?.();if(d)arr=[['計測開始（2秒準備）',()=>{g.resume();this.sound.unlock().then(()=>this.sound.start()).catch(()=>{});d.start();}],['計測を停止',()=>d.stop('VRメニューから停止')],['再準備して再試行',()=>{d.prepare();d.start();}],['場面：'+(d.scene==='load'?'負荷→通常':'通常→負荷'),()=>{d.el('diagScene').value=d.scene==='load'?'normal':'load';d.prepare();}],['リセンター',()=>this.recenter()],['VRを終了',()=>this.exit()]];return arr.map(([label,fn],i)=>({label,fn,y:220+i*64}));}
 activate(i){this.menuButtons()[i]?.fn();this.gameplayBlocked=true;this.g.emit('save');this.sound.play('ui');this.haptic(.2);this.menuHash='';}
 drawMenu(){let g=this.g,hash=[this.menuPage,g.state,g.stageIndex,this.hover,JSON.stringify(g.save.settings)].join('|');if(hash===this.menuHash)return;this.menuHash=hash;this.hudHash='';let c=this.menuCanvas.getContext('2d');c.fillStyle='#102832';c.fillRect(0,0,900,900);c.strokeStyle='#dbae58';c.lineWidth=6;c.strokeRect(4,4,892,892);c.textAlign='center';c.fillStyle='#f5d184';c.font='bold 44px sans-serif';c.fillText('SKY RIVET',450,65);c.font='28px sans-serif';c.fillStyle='#e7eee4';c.fillText(this.menuPage==='stages'?'ステージ選択':g.state==='clear'?'ステージクリア':g.state==='ending'?'救出成功！':g.state==='gameover'?'ゲームオーバー':'ポーズ',450,115);c.font='22px sans-serif';c.fillText(`SCORE ${g.score}　 残機 ${g.lives}　${g.stage.name}`,450,157);c.fillText('右のレイで照準 → 右トリガーで決定',450,192);for(const [i,b]of this.menuButtons().entries()){c.fillStyle=i===this.hover?'#b66c32':'#25434b';c.fillRect(38,b.y,824,56);c.font='27px sans-serif';c.fillStyle='#ffffff';c.fillText(b.label,450,b.y+38);}c.font='19px sans-serif';c.fillStyle='#bacac5';c.fillText('モード切替は面の最初から。解放・設定を保持。',450,865);this.r.updatePanel(this.menuCanvas);}
 drawHUD(){const d=this.callbacks.diagnostics?.(),g=this.g,hazard=hazardStatus(g),hash=[hazard.text,g.score,g.lives,Math.ceil(g.remaining),g.stageIndex,Math.ceil(g.player.hammer),d?.lines?.join('|')].join('|');if(hash===this.hudHash)return;this.hudHash=hash;this.menuHash='';if(!this.hudCanvas){this.hudCanvas=document.createElement('canvas');this.hudCanvas.width=900;this.hudCanvas.height=d?410:210;}let c=this.hudCanvas.getContext('2d');c.fillStyle='#102832';c.fillRect(0,0,900,this.hudCanvas.height);c.fillStyle='#edc26f';c.font='bold 30px sans-serif';c.textAlign='center';c.fillText(`${g.stage.name}　 SCORE ${g.score}　 残機 ${g.lives}　${Math.ceil(g.remaining)}秒`,450,58);c.fillStyle='#c7d6ce';c.font='25px sans-serif';c.fillText(g.stage.devices?`制御器 ${g.devices.size}/3　右トリガーで解除　B：ポーズ`:'A：ジャンプ　グリップ：はしご　B：ポーズ',450,112);c.font='22px sans-serif';c.fillStyle=hazard.level==='danger'?'#ffb291':hazard.level==='warning'?'#ffe0a0':'#b9d6d1';c.fillText(hazard.text,450,172);if(d){c.font='19px sans-serif';c.fillStyle='#f6d79d';for(const [i,line]of (d.lines||[]).entries())c.fillText(line,450,218+i*29);}this.r.updatePanel(this.hudCanvas);}
 extra(l,frame){for(const s of this.session.inputSources){let pose=frame.getPose(s.gripSpace||s.targetRaySpace,this.space);if(pose)glove(l,mul(this.rig,pose.transform.matrix),s.handedness==='right'&&this.g.player.hammer>0,s.handedness==='right'?1:-1);if(this.g.state!=='playing'&&s.handedness==='right'){let ray=frame.getPose(s.targetRaySpace,this.space);if(ray){let m=mul(this.rig,ray.transform.matrix);l.group(m,()=>l.cylinder([0,0,-.6],[.003,1.2,.003],'#f0c273',[Math.PI/2,0,0],.2,1));}}}}
 draw(frame,pose){const gl=this.r.gl,layer=this.session.renderState.baseLayer;let invRig=inverse(this.rig);for(const view of pose.views){const v=layer.getViewport(view),viewMatrix=mul(view.transform.inverse.matrix,invRig);let eye=point(this.rig,[view.transform.position.x,view.transform.position.y,view.transform.position.z]);this.r.draw(viewMatrix,view.projectionMatrix,eye,layer.framebuffer,[v.x,v.y,v.width,v.height]);if(this.g.state!=='playing'&&this.menuMatrix)this.r.drawPanel(mul(view.projectionMatrix,view.transform.inverse.matrix),this.menuMatrix);if(this.g.state==='playing')this.r.drawPanel(mul(view.projectionMatrix,view.transform.inverse.matrix),mul(new Float32Array(pose.transform.matrix),transform([0,-.43,-1.45],[.92,this.hudCanvas?.height===410?.42:.215,1])));this.r.fade(this.g.save.settings.vignette&&this.g.save.settings.view==='first'&&Math.abs(this.g.player.vx)>.1?.42:0,Math.max(this.wallFade||0,this.g.fallFade*1.8));}this.sound.listener(this.headMatrix);}
 haptic(strength=.3){for(const s of this.session?.inputSources||[]){const a=s.gamepad?.hapticActuators?.[0];if(a?.pulse)a.pulse(strength,65).catch(()=>{});}}
}
