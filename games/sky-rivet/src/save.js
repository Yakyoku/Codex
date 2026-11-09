export const KEY='sky-rivet-save-v1';
export const BACKUP_KEY=KEY+'-backup';
export const DEFAULT_SETTINGS={difficulty:'normal',quality:'auto',view:'tabletop',posture:'seated',eyeHeight:1.5,vignette:true,music:.4,sfx:.7,voice:0,touch:'auto'};
export function fresh(){return {version:1,unlocked:1,settings:{...DEFAULT_SETTINGS},records:{},tutorial:false};}
export function validate(raw){if(!raw||raw.version!==1||!Number.isInteger(raw.unlocked)||raw.unlocked<1||raw.unlocked>4||!raw.settings||!raw.records||typeof raw.records!=='object'||Array.isArray(raw.records))throw Error('対応するSKY RIVETセーブではありません');const s=raw.settings;for(const k of ['music','sfx','voice'])if(!Number.isFinite(s[k])||s[k]<0||s[k]>1)throw Error('音量の値が不正です');if(!['easy','normal','hard'].includes(s.difficulty)||!['auto','pc','ipad','quest'].includes(s.quality)||!['tabletop','first'].includes(s.view)||!['seated','standing'].includes(s.posture)||typeof s.vignette!=='boolean'||!Number.isFinite(s.eyeHeight)||s.eyeHeight<1||s.eyeHeight>2)throw Error('設定が不正です');if(s.touch!==undefined&&!['auto','on','off'].includes(s.touch))throw Error('タッチ操作の設定が不正です');let records={};for(const [k,v]of Object.entries(raw.records)){if(!/^(2d|vr)-(easy|normal|hard)$/.test(k)||!Number.isSafeInteger(v)||v<0||v>1e9)throw Error('記録が不正です');records[k]=v;}return {version:1,unlocked:raw.unlocked,settings:{...DEFAULT_SETTINGS,...s},records,tutorial:raw.tutorial===true};}
export function readSaveResult(storage){
 try{return {data:validate(JSON.parse(storage.getItem(KEY))),recovered:false};}catch{}
 try{return {data:validate(JSON.parse(storage.getItem(BACKUP_KEY))),recovered:true};}catch{}
 return {data:fresh(),recovered:false};
}
export function readSave(storage){return readSaveResult(storage).data;}
export function writeSave(storage,data){
 try{const text=JSON.stringify(validate(data));storage.setItem(KEY,text);try{storage.setItem(BACKUP_KEY,text);}catch{}return true;}catch{return false;}
}
export function importSave(text){if(text.length>32000)throw Error('ファイルが大きすぎます');return validate(JSON.parse(text));}
