export class FrameWindow {
  constructor(limit=360,minSamples=30){this.limit=limit;this.minSamples=minSamples;this.reset('');}
  reset(context){this.context=context;this.samples=[];this.frames=0;}
  sample(milliseconds,context){
    if(context!==this.context)this.reset(context);
    if(!Number.isFinite(milliseconds)||milliseconds<=0)return;
    this.samples.push(milliseconds);this.frames++;
    if(this.samples.length>this.limit)this.samples.shift();
  }
  get summary(){
    const a=[...this.samples].sort((x,y)=>x-y),ready=a.length>=this.minSamples;
    return {frameMedian:ready?a[Math.floor(a.length*.5)]:null,frameP95:ready?a[Math.min(a.length-1,Math.ceil(a.length*.95)-1)]:null,frames:this.frames,sampleCount:a.length,measurementContext:this.context};
  }
}
export function formatFrameStats(metrics){
  if(metrics.frameMedian===null||metrics.frameP95===null)return '描画間隔：未計測（30フレームから表示）';
  return `描画間隔：中央値 ${metrics.frameMedian.toFixed(1)}ms ／ p95 ${metrics.frameP95.toFixed(1)}ms（${metrics.sampleCount}標本）`;
}
