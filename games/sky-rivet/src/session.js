import {fresh,readSaveResult,writeSave} from './save.js';

// Decide before even resolving the browser's storage getter. In verification,
// all settings/progression live only in this document's fresh memory object.
export function createSaveSession(search,storageProvider=()=>globalThis.localStorage){
 const verification=new URLSearchParams(search).get('verify')==='1';
 if(verification){const data=fresh();data.unlocked=4;return {verification,data,recovered:false,persist:()=>true};}
 let storage;try{storage=storageProvider();}catch{storage={getItem:()=>null,setItem:()=>{throw Error('denied');}};}
 const read=readSaveResult(storage);
 return {verification,...read,persist:data=>writeSave(storage,data)};
}
