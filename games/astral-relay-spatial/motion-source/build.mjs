// Dependency-free static packaging. Existing rules/Three.js remain the published baseline.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mode=root.endsWith('arcade')?'2d':'3d',src=path.join(root,'motion-source');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const inputNames=fs.readdirSync(src).filter(n=>/\.(mjs|css)$/.test(n)).sort();
const inputHash=hash(inputNames.map(n=>n+'\0'+hash(fs.readFileSync(path.join(src,n)))+'\n').join(''));
const files={};
function emit(stem,source,ext="js"){const name=`${stem}-${hash(source).slice(0,12)}.${ext}`;fs.writeFileSync(path.join(root,'assets',name),source);files[stem]=name;return name}
const shared=emit('motion',fs.readFileSync(path.join(src,'motion.mjs'),'utf8'));
const adapter=emit('motion'+mode,fs.readFileSync(path.join(src,'motion'+mode+'.mjs'),'utf8').replaceAll('./motion.mjs','./'+shared));
const render=emit('view'+mode+'-motion',fs.readFileSync(path.join(src,'renderer.mjs'),'utf8').replaceAll('../motion-source/motion.mjs','./'+shared).replaceAll('../motion-source/motion'+mode+'.mjs','./'+adapter).replaceAll('../assets/','./'));
const oldView=mode==='2d'?'view2d-DmFbh6Bv.js':'view3d-5xJHh8Cr.js';
const touch=emit('touch',fs.readFileSync(path.join(src,'touch.mjs'),'utf8'));
const mobileCSS=emit('mobile',fs.readFileSync(path.join(src,'mobile.css'),'utf8'),'css');
const entry=emit('index-motion',fs.readFileSync(path.join(src,'entry.mjs'),'utf8').replaceAll(oldView,render).replaceAll('../assets/','./').replaceAll('./touch.mjs','./'+touch));
let html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/\.\/assets\/index-[\w-]+\.js/, './assets/'+entry);
html=html.replace(/<title>.*?<\/title>/,'<title>ASTRAL RELAY • MOBILE R06</title>').replace(/<link data-mobile[^>]*>\n?/g,'');html=html.replace('<body>',`<link data-mobile rel="stylesheet" href="./assets/${mobileCSS}">\n<body>`);fs.writeFileSync(path.join(root,'index.html'),html);
const distribution=['index.html','_headers','THREE-LICENSE.txt',...Object.values(files).map(n=>'assets/'+n),mode==='2d'?'assets/features-CDx28dQD.js':'assets/results-BmcsftrC.js','assets/index-thUveMIn.css'];
const manifest={release:'astral-relay-mobile-r06',mode,sourceRevision:process.env.ASTRAL_SOURCE_REVISION||'working-tree',baselinePublication:'cf150b2536706f7bb8c2d58d1af5b12b289b12ea',inputHash,buildUTC:new Date().toISOString(),site:JSON.parse(fs.readFileSync(path.join(root,'netlify-site.json'))),entry,renderer:render,files:Object.fromEntries(distribution.map(n=>{const b=fs.readFileSync(path.join(root,n));return[n,{bytes:b.length,sha256:hash(b)}]}))};
fs.writeFileSync(path.join(root,'motion-release.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({release:manifest.release,mode,inputHash,entry,renderer:render,files:distribution.length}));
