import {QUALITY,renderSize} from './quality.js';
import {I,mul,transform,lookAt,ortho} from './math.js';
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 pos;layout(location=1) in vec3 normal;layout(location=2) in mat4 model;layout(location=6) in vec4 color;layout(location=7) in vec3 props;
uniform mat4 vp;uniform mat4 lightVP;out vec3 N;out vec3 P;out vec3 L;out vec4 C;out vec3 M;out vec3 Q;out vec4 S;
void main(){vec4 w=model*vec4(pos,1.);P=w.xyz;L=pos;vec3 scales=vec3(dot(model[0].xyz,model[0].xyz),dot(model[1].xyz,model[1].xyz),dot(model[2].xyz,model[2].xyz));N=normalize(mat3(model)*(normal/scales));C=color;M=props;Q=normal;S=lightVP*w;gl_Position=vp*w;}`;
const FS=`#version 300 es
precision highp float;
in vec3 N;in vec3 P;in vec3 L;in vec4 C;in vec3 M;in vec3 Q;in vec4 S;
uniform vec3 eye;uniform sampler2D shadowMap;uniform bool shadows;uniform float shadowTexelSize;out vec4 frag;
const float PI=3.14159265359;
float wave(float phase){return sin(phase)*(1.-smoothstep(.7,3.,max(fwidth(phase),.001)));}
vec3 filmic(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){
 vec3 n=normalize(N),v=normalize(eye-P),l=normalize(vec3(-.5,.9,.6)),h=normalize(l+v);
 float nl=max(dot(n,l),0.),nv=max(dot(n,v),.001),nh=max(dot(n,h),0.),vh=max(dot(v,h),0.);
 float rough=clamp(M.x,.12,1.),em=M.y,material=M.z,metal=0.;
 vec3 base=pow(C.rgb,vec3(2.2));
 if(material>.5&&material<1.5){float angle=atan(L.z,L.x),radius=length(L.xz-vec2(.12,-.08));float grain=abs(Q.y)>.8?wave(radius*64.+sin(L.x*9.+L.z*7.)*.45):wave(angle*54.+sin(L.y*17.+angle*3.)*1.7);base*=.88+.12*grain;rough=max(rough,.78);}
 else if(material>1.5&&material<2.5){float brush=wave(L.y*180.);base*=.97+.03*brush;rough=clamp(rough+.025*brush,.18,.7);metal=1.;}
 else if(material>2.5&&material<3.5){float weave=wave(L.x*160.)*wave(L.y*160.);base*=.96+.04*weave;rough=.84+.04*weave;}
 else if(material>3.5&&material<4.5){float hair=wave((L.x+L.z*.4)*82.+sin(L.y*12.)*3.);base*=.965+.035*hair;rough=.88+.035*hair;}
 else if(material>4.5){base*=.99+.01*wave(dot(L,vec3(113.,79.,97.)));rough=max(rough,.55);}
 float shade=1.;
 if(shadows){vec3 sc=S.xyz/S.w*.5+.5;if(all(greaterThan(sc,vec3(0.)))&&all(lessThan(sc,vec3(1.)))){float result=0.;float bias=max(.00015,(1.-nl)*shadowTexelSize*.7);for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){float depth=texture(shadowMap,sc.xy+vec2(x,y)*shadowTexelSize).r;result+=sc.z-bias>depth?.28:1.;}shade=result/9.;}}
 float a=rough*rough,a2=a*a,denom=nh*nh*(a2-1.)+1.;float D=a2/max(PI*denom*denom,.0001);
 float k=(rough+1.)*(rough+1.)/8.,Gv=nv/(nv*(1.-k)+k),Gl=nl/(nl*(1.-k)+k);
 vec3 F0=mix(vec3(.04),base,metal),F=F0+(1.-F0)*pow(1.-vh,5.);
 vec3 specular=D*Gv*Gl*F/max(4.*nv*max(nl,.001),.001),diffuse=(1.-F)*(1.-metal)*base/PI;
 vec3 key=vec3(1.,.82,.61)*3.2*(diffuse+specular)*nl*shade;
 vec3 sky=mix(vec3(.10,.13,.19),vec3(.40,.52,.67),n.y*.5+.5);
 vec3 ambient=base*sky*(1.-metal*.75)+F0*sky*.5;
 float fill=max(dot(n,normalize(vec3(.8,.4,-.5))),0.);vec3 col=ambient+key+base*vec3(.10,.17,.25)*fill+base*em;
 if(material>4.5)col+=base*vec3(.08,.025,.012)*pow(1.-nv,3.);
 float fog=1.-exp(-length(eye-P)*.0055);col=mix(col,vec3(.045,.075,.13),fog);
 frag=vec4(pow(filmic(col),vec3(1./2.2)),C.a);
}`;
const DEPTH=`#version 300 es
precision highp float;layout(location=0) in vec3 pos;layout(location=2) in mat4 model;uniform mat4 vp;void main(){gl_Position=vp*model*vec4(pos,1.);}`;
const EMPTY=`#version 300 es
precision highp float;out vec4 frag;void main(){frag=vec4(1.);}`;
function geometry(kind,detail='standard'){let p=[],n=[],idx=[];function vertex(x,y,z,nx,ny,nz){p.push(x,y,z);n.push(nx,ny,nz);return p.length/3-1;}function quad(a,b,c,d){idx.push(a,b,c,a,c,d);}
 if(kind==='box'){for(const [axis,sign]of [[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]]){let u=(axis+1)%3,v=(axis+2)%3,verts=[];for(let [a,b]of [[-1,-1],[1,-1],[1,1],[-1,1]]){let pos=[0,0,0],norm=[0,0,0];pos[axis]=sign*.5;pos[u]=a*.5;pos[v]=b*.5;norm[axis]=sign;verts.push(vertex(...pos,...norm));}if(sign>0)quad(...verts);else quad(...verts.reverse());}}
 else if(kind==='sphere'){const rows=detail==='high'?32:14,cols=detail==='high'?48:20;for(let y=0;y<=rows;y++){let a=y/rows*Math.PI;for(let x=0;x<=cols;x++){let b=x/cols*Math.PI*2;let v=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];vertex(...v,...v);}}for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){let a=y*(cols+1)+x;quad(a,a+1,a+cols+2,a+cols+1);}}
 else if(kind==='cylinder'){let steps=detail==='high'?64:20;for(let y=0;y<2;y++)for(let i=0;i<=steps;i++){let a=i/steps*Math.PI*2;vertex(Math.cos(a),y-.5,Math.sin(a),Math.cos(a),0,Math.sin(a));}for(let i=0;i<steps;i++)quad(i,i+1,i+steps+2,i+steps+1);for(let s of [-1,1]){let center=vertex(0,s*.5,0,0,s,0);for(let i=0;i<=steps;i++){let a=i/steps*Math.PI*2;vertex(Math.cos(a),s*.5,Math.sin(a),0,s,0);if(i){let v=p.length/3-1;idx.push(center,...(s>0?[v,v-1]:[v-1,v]));}}}}
 else if(kind==='torus'){const rows=detail==='high'?64:20,cols=detail==='high'?16:8;for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){let a=i/rows*Math.PI*2,b=j/cols*Math.PI*2;vertex((1+.14*Math.cos(b))*Math.cos(a),.14*Math.sin(b),(1+.14*Math.cos(b))*Math.sin(a),Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a));}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){let a=i*(cols+1)+j;quad(a,a+cols+1,a+cols+2,a+1);}}
 return {p:new Float32Array(p),n:new Float32Array(n),idx:new Uint16Array(idx)};}
const colorCache=new Map();export function rgb(hex){if(Array.isArray(hex))return hex;if(!colorCache.has(hex)){let c=parseInt(hex.replace('#',''),16);colorCache.set(hex,[(c>>16&255)/255,(c>>8&255)/255,(c&255)/255,1]);}return colorCache.get(hex);}
export class SceneList{
 constructor(){this.items=[];this.stack=[I()];}
 add(kind,p,s,c,r=[0,0,0],rough=.65,em=0,material=0){const m=mul(this.stack.at(-1),transform(p,s,r));this.items.push({kind,m,c:rgb(c),rough,em,material});return m;}
 group(matrix,fn){this.stack.push(mul(this.stack.at(-1),matrix));fn();this.stack.pop();}
 box(p,s,c,r,rough,em,material){return this.add('box',p,s,c,r,rough,em,material)} sphere(p,s,c,r,rough,em,material){return this.add('sphere',p,s,c,r,rough,em,material)} cylinder(p,s,c,r,rough,em,material){return this.add('cylinder',p,s,c,r,rough,em,material)} torus(p,s,c,r,rough,em,material){return this.add('torus',p,s,c,r,rough,em,material)}
 beam(a,b,width,c){let d=b.map((v,i)=>v-a[i]),length=Math.hypot(...d),mid=b.map((v,i)=>(v+a[i])*.5);return this.cylinder(mid,[width,length,width],c,[Math.acos(d[1]/length),Math.atan2(d[0],d[2]),0]);}
}
export class Renderer{
 constructor(canvas){this.canvas=canvas;this.gl=canvas.getContext('webgl2',{antialias:true,alpha:false,xrCompatible:true,powerPreference:'high-performance'});if(!this.gl)throw Error('WebGL 2に対応したブラウザが必要です');const gl=this.gl;this.program=this.programOf(VS,FS);this.depthProgram=this.programOf(DEPTH,EMPTY);this.meshes={};for(const kind of ['box','sphere','cylinder','torus']){let g=geometry(kind),vao=gl.createVertexArray();gl.bindVertexArray(vao);for(let [loc,data]of [[0,g.p],[1,g.n]]){let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);}let e=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,e);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,g.idx,gl.STATIC_DRAW);this.meshes[kind]={vao,count:g.idx.length};}
 this.meshPools={standard:this.meshes};this.detailLevel='standard';this.shadowSize=1024;this.maxTargetSize=Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),...gl.getParameter(gl.MAX_VIEWPORT_DIMS));this.staticBatch={};this.dynamicBatch={};this.lightVP=mul(ortho(-20,20,-20,20,.1,90),lookAt([-18,36,24],[0,7,0]));const shadow=this.createDepthTarget();this.depthTex=shadow.texture;this.shadowFbo=shadow.framebuffer;this.shadowCache=null;this.shadowDirty=true;this.shadowStaticBuilds=0;this.shadowCacheReuses=0;this.shadows=true;
 this.panelProgram=this.programOf(`#version 300 es\nprecision highp float;uniform mat4 vp;out vec2 uv;void main(){vec2 q[6]=vec2[6](vec2(-.5,-.5),vec2(.5,-.5),vec2(.5,.5),vec2(-.5,-.5),vec2(.5,.5),vec2(-.5,.5));vec2 p=q[gl_VertexID];uv=p+.5;gl_Position=vp*vec4(p,0,1);}`,`#version 300 es\nprecision highp float;in vec2 uv;uniform sampler2D tex;out vec4 frag;void main(){frag=texture(tex,vec2(uv.x,1.-uv.y));}`);
 this.fadeProgram=this.programOf(`#version 300 es\nprecision highp float;out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0,1);}`,`#version 300 es\nprecision highp float;in vec2 uv;uniform float amount;uniform float fade;out vec4 frag;void main(){float edge=smoothstep(.2,.67,length(uv-.5))*amount;frag=vec4(.018,.027,.05,max(edge,fade));}`);
 this.panelTex=gl.createTexture();gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);this.drawCalls=0;}
 createDepthTarget(size=this.shadowSize||1024){const gl=this.gl,texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,size,size,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);for(const [key,value]of [[gl.TEXTURE_MIN_FILTER,gl.NEAREST],[gl.TEXTURE_MAG_FILTER,gl.NEAREST],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,key,value);const framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,texture,0);gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('影のフレームバッファーを作成できません');gl.bindFramebuffer(gl.FRAMEBUFFER,null);return {texture,framebuffer};}
 makeMeshPool(detail){const gl=this.gl,pool={};for(const kind of ['box','sphere','cylinder','torus']){const g=geometry(kind,detail),vao=gl.createVertexArray();gl.bindVertexArray(vao);for(const [location,data]of [[0,g.p],[1,g.n]]){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);}const indices=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,g.idx,gl.STATIC_DRAW);pool[kind]={vao,count:g.idx.length};}return pool;}
 setQuality(profile){const spec=QUALITY[profile]||QUALITY.pc;if(this.detailLevel!==spec.detail){this.meshPools[spec.detail]??=this.makeMeshPool(spec.detail);this.meshes=this.meshPools[spec.detail];this.detailLevel=spec.detail;this.shadowDirty=true;}const size=Math.min(spec.shadowSize,this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE));if(size!==this.shadowSize){this.gl.deleteTexture(this.depthTex);this.gl.deleteFramebuffer(this.shadowFbo);if(this.shadowCache){this.gl.deleteTexture(this.shadowCache.texture);this.gl.deleteFramebuffer(this.shadowCache.framebuffer);}this.shadowSize=size;const active=this.createDepthTarget();this.depthTex=active.texture;this.shadowFbo=active.framebuffer;this.shadowCache=null;this.shadowDirty=true;}this.shadows=profile!=='quest';}
 programOf(v,f){let gl=this.gl,p=gl.createProgram();for(const [type,src]of [[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
 upload(list,target,dynamic=false){let gl=this.gl;for(let kind of Object.keys(this.meshes)){let items=list.items.filter(i=>i.kind===kind);let data=new Float32Array(items.length*23);items.forEach((o,i)=>{data.set(o.m,i*23);data.set(o.c,i*23+16);data[i*23+20]=o.rough;data[i*23+21]=o.em;data[i*23+22]=o.material;});if(!target[kind])target[kind]={buffer:gl.createBuffer(),count:0};gl.bindBuffer(gl.ARRAY_BUFFER,target[kind].buffer);gl.bufferData(gl.ARRAY_BUFFER,data,dynamic?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);target[kind].count=items.length;} }
 setStatic(list){this.staticCount=list.items.length;this.shadowDirty=true;this.upload(list,this.staticBatch);}
 setDynamic(list){this.upload(list,this.dynamicBatch,true);}
 drawBatch(batch,program,vp){let gl=this.gl;gl.useProgram(program);gl.uniformMatrix4fv(gl.getUniformLocation(program,'vp'),false,vp);for(let [kind,m]of Object.entries(this.meshes)){let b=batch[kind];if(!b||!b.count)continue;gl.bindVertexArray(m.vao);gl.bindBuffer(gl.ARRAY_BUFFER,b.buffer);for(let j=0;j<4;j++){gl.enableVertexAttribArray(2+j);gl.vertexAttribPointer(2+j,4,gl.FLOAT,false,92,j*16);gl.vertexAttribDivisor(2+j,1);}gl.enableVertexAttribArray(6);gl.vertexAttribPointer(6,4,gl.FLOAT,false,92,64);gl.vertexAttribDivisor(6,1);gl.enableVertexAttribArray(7);gl.vertexAttribPointer(7,3,gl.FLOAT,false,92,80);gl.vertexAttribDivisor(7,1);gl.drawElementsInstanced(gl.TRIANGLES,m.count,gl.UNSIGNED_SHORT,0,b.count);this.drawCalls++;}}
 shadow(){const gl=this.gl,size=this.shadowSize||1024;this.drawCalls=0;if(!this.shadows)return;
  if(!this.shadowCache)this.shadowCache=this.createDepthTarget();
  if(this.shadowDirty){gl.bindFramebuffer(gl.FRAMEBUFFER,this.shadowCache.framebuffer);gl.viewport(0,0,size,size);gl.clear(gl.DEPTH_BUFFER_BIT);this.drawBatch(this.staticBatch,this.depthProgram,this.lightVP);this.shadowDirty=false;this.shadowStaticBuilds++;}else this.shadowCacheReuses++;
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER,this.shadowCache.framebuffer);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.shadowFbo);gl.blitFramebuffer(0,0,size,size,0,0,size,size,gl.DEPTH_BUFFER_BIT,gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER,this.shadowFbo);gl.viewport(0,0,size,size);this.drawBatch(this.dynamicBatch,this.depthProgram,this.lightVP);
 }
 draw(view,projection,eye,framebuffer=null,viewport=null){let gl=this.gl;gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.viewport(...(viewport||[0,0,this.canvas.width,this.canvas.height]));gl.clearColor(.035,.055,.095,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);let p=this.program;gl.useProgram(p);gl.uniform3fv(gl.getUniformLocation(p,'eye'),eye);gl.uniformMatrix4fv(gl.getUniformLocation(p,'lightVP'),false,this.lightVP);gl.uniform1i(gl.getUniformLocation(p,'shadows'),this.shadows?1:0);gl.uniform1f(gl.getUniformLocation(p,'shadowTexelSize'),1/this.shadowSize);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.depthTex);gl.uniform1i(gl.getUniformLocation(p,'shadowMap'),0);let vp=mul(projection,view);this.drawBatch(this.staticBatch,p,vp);this.drawBatch(this.dynamicBatch,p,vp);return vp;}
 updatePanel(canvas){let gl=this.gl;gl.bindTexture(gl.TEXTURE_2D,this.panelTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
 drawPanel(vp,matrix){let gl=this.gl,p=this.panelProgram;gl.useProgram(p);gl.uniformMatrix4fv(gl.getUniformLocation(p,'vp'),false,mul(vp,matrix));gl.bindTexture(gl.TEXTURE_2D,this.panelTex);gl.bindVertexArray(null);gl.drawArrays(gl.TRIANGLES,0,6);}
 fade(amount,fade){if(!amount&&!fade)return;let gl=this.gl,p=this.fadeProgram;gl.useProgram(p);gl.bindVertexArray(null);gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform1f(gl.getUniformLocation(p,'amount'),amount);gl.uniform1f(gl.getUniformLocation(p,'fade'),fade);gl.drawArrays(gl.TRIANGLES,0,3);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);}
 resize(profile='pc'){const plan=renderSize(this.canvas.clientWidth,this.canvas.clientHeight,globalThis.devicePixelRatio||1,profile,this.maxTargetSize);if(this.canvas.width!==plan.width||this.canvas.height!==plan.height){this.canvas.width=plan.width;this.canvas.height=plan.height;}this.setQuality(profile);this.renderPlan={...plan,shadowSize:this.shadowSize};}

}

// Exported for offline shader/geometry validation using the same source.
export {geometry,VS,FS};
