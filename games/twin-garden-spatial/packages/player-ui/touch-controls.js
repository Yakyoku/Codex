import {storage} from './storage.js';
                                        
export const touchVisible=(mode          ,coarse        )=>mode==='on'||(mode==='auto'&&coarse);
export function installTouchControls(clear         ){
 let mode          ='auto';try{const saved=storage.getItem('tg-touch-controls');if(saved==='on'||saved==='off')mode=saved;}catch{}
 const coarse=matchMedia('(pointer: coarse)');
 function refresh(){document.documentElement.dataset.touchControls=touchVisible(mode,coarse.matches)?'on':'off';clear();}
 coarse.addEventListener?.('change',refresh);refresh();
 return {get mode(){return mode;},bind(el                  ){el.value=mode;el.onchange=()=>{mode=['on','off'].includes(el.value)?el.value             :'auto';try{storage.setItem('tg-touch-controls',mode);}catch{}refresh();};},refresh};
}
export const touchOptions='<option value="auto">自動（スマホは表示）</option><option value="on">常に表示</option><option value="off">非表示（キー／パッド）</option>';
