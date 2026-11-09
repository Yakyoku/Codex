// Pixel budgets are output limits, not claims about measured device performance.
export const QUALITY={
 pc:{detail:'high',shadowSize:4096,maxPixels:3840*2160,maxScale:4,label:'PC 高精細 4K'},
 ipad:{detail:'standard',shadowSize:1536,maxPixels:2732*2048,maxScale:2,label:'iPad 高精細'},
 quest:{detail:'standard',shadowSize:1024,maxPixels:2048*2048,maxScale:1,label:'Quest 軽量'}
};
export function renderSize(width,height,dpr=1,profile='pc',limit=8192){
 const q=QUALITY[profile]||QUALITY.pc;
 width=Number.isFinite(width)&&width>0?width:1;height=Number.isFinite(height)&&height>0?height:1;
 dpr=Number.isFinite(dpr)&&dpr>0?dpr:1;
 const scale=Math.min(dpr,q.maxScale,limit/width,limit/height,Math.sqrt(q.maxPixels/(width*height)));
 return {width:Math.max(1,Math.floor(width*scale)),height:Math.max(1,Math.floor(height*scale)),profile,detail:q.detail,shadowSize:q.shadowSize};
}
