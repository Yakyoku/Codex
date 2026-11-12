// Resolve once, before any audio/UI constructor can consult persistent data.
export const verification = new URLSearchParams(globalThis.location?.search || '').get('verify') === '1';
export function isolatedStorage(isolated        , persistent            ) {
  const memory=new Map               ();
  return {
    getItem(key       )             { return isolated ? memory.get(key)??null : persistent().getItem(key); },
    setItem(key       ,value       ) { if(isolated)memory.set(key,String(value));else persistent().setItem(key,value); }
  };
}
export const storage=isolatedStorage(verification,()=>globalThis.localStorage);
