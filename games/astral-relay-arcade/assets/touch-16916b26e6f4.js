// Pointer ownership is independent per control. No UA sniffing or save access.
export function touchVisible(mode,source,coarse,xr=false){return !xr&&(mode==='on'||mode==='auto'&&(source==='touch'||source==='auto'&&coarse))}
export function createTouchInput(getState,paint=()=>{}){
 let move=null,fire=null,origin={x:0,y:0},radius=36;
 const releaseMove=()=>{move=null;getState().x=getState().y=0;paint(0,0)};
 return {
  down(kind,id,x=0,y=0,r=36){if(kind==='move'){if(move!==null)return false;move=id;origin={x,y};radius=Math.max(16,r);paint(0,0)}else{if(fire!==null)return false;fire=id;getState().fire=true}return true},
  move(id,x,y){if(id!==move)return;let dx=(x-origin.x)/radius,dy=(y-origin.y)/radius;const length=Math.hypot(dx,dy);if(length>1){dx/=length;dy/=length}getState().x=dx;getState().y=dy;paint(dx,dy)},
  up(kind,id){if(kind==='move'&&id===move)releaseMove();if(kind==='fire'&&id===fire){fire=null;getState().fire=false}},
  focus(){getState().focus=!getState().focus;return getState().focus},
  reset(){releaseMove();fire=null;getState().fire=false;getState().focus=false},
  get active(){return move!==null||fire!==null}
 }
}
export function installTouchControls({getState,doc=document,win=window}){
 const stick=doc.getElementById('stick'),fire=doc.getElementById('fire'),focus=doc.getElementById('focus'),tray=doc.getElementById('touch');
 const media=win.matchMedia('(pointer: coarse)'),root=doc.documentElement;
 let mode='auto',source='auto',xr=false,visible=false;
 const input=createTouchInput(getState,(x,y)=>{stick.style.setProperty('--stick-x',`${x*26}px`);stick.style.setProperty('--stick-y',`${y*26}px`)});
 const thumb=doc.createElement('span');thumb.className='touch-knob';thumb.setAttribute('aria-hidden','true');stick.append(thumb);stick.setAttribute('aria-label','移動用スティック');fire.setAttribute('aria-label','押している間、射撃');
 const row=doc.createElement('label');row.textContent='画面のタッチ操作';const select=doc.createElement('select');select.id='touch-mode';select.setAttribute('aria-label','タッチ操作の表示');
 for(const [value,label]of [['auto','自動（使用中の入力で切替）'],['on','表示'],['off','非表示']]){const option=doc.createElement('option');option.value=value;option.textContent=label;select.append(option)}row.append(select);doc.getElementById('options').append(row);
 const reset=()=>{input.reset();focus.setAttribute('aria-pressed','false');fire.classList.remove('pressed')};
 const refresh=()=>{const next=touchVisible(mode,source,media.matches,xr);if(visible!==next){reset();visible=next}root.dataset.touchVisible=String(visible);tray.setAttribute('aria-hidden',String(!visible));fire.tabIndex=focus.tabIndex=visible?0:-1};
 const use=type=>{source=type;refresh()};
 select.addEventListener('change',()=>{mode=select.value;refresh()});
 const bind=(el,kind)=>{
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();if(!visible)return;const accepted=input.down(kind,e.pointerId,e.clientX,e.clientY,stick.clientWidth*.36);if(!accepted)return;try{el.setPointerCapture(e.pointerId)}catch{input.up(kind,e.pointerId);return}if(kind==='fire')fire.classList.add('pressed')});
  if(kind==='move')el.addEventListener('pointermove',e=>{e.preventDefault();input.move(e.pointerId,e.clientX,e.clientY)});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,e=>{input.up(kind,e.pointerId);if(!getState().fire)fire.classList.remove('pressed')});
  el.addEventListener('contextmenu',e=>e.preventDefault());
 };bind(stick,'move');bind(fire,'fire');focus.onclick=()=>focus.setAttribute('aria-pressed',String(input.focus()));
 win.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')use('touch');else if(e.pointerType==='mouse'&&!tray.contains(e.target))use('mouse')},{capture:true});
 win.addEventListener('keydown',e=>{if(/^(Key[WASDZ]|Arrow|Space|Shift)/.test(e.code)&&!['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))use('keyboard')});
 win.addEventListener('blur',reset);win.addEventListener('resize',reset);doc.addEventListener('visibilitychange',()=>{if(doc.hidden)reset()});
 const changed=()=>{if(source==='auto')refresh()};media.addEventListener?.('change',changed);
 refresh();
 return {reset,setXR(value){if(value!==xr){xr=value;refresh()}},gamepadActivity(pads){if(mode==='auto'&&pads.some(p=>p.axes.some(v=>Math.abs(v)>.25)||p.buttons.some(b=>b.pressed)))use('gamepad')},get visible(){return visible}};
}
