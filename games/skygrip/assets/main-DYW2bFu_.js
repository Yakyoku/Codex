var Ru=Object.defineProperty;var Cu=(i,t,e)=>t in i?Ru(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var dt=(i,t,e)=>Cu(i,typeof t!="symbol"?t+"":t,e);import"./index-BTwkDBX6.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ic="180",Pu=0,Oc=1,Lu=2,oh=1,Du=2,Fn=3,oi=0,Ne=1,Sn=2,ii=0,as=1,Bc=2,zc=3,Hc=4,Uu=5,yi=100,Iu=101,Nu=102,Fu=103,Ou=104,Bu=200,zu=201,Hu=202,Vu=203,sa=204,ra=205,Gu=206,ku=207,Wu=208,Xu=209,qu=210,Yu=211,$u=212,Ju=213,Zu=214,oa=0,aa=1,ca=2,ls=3,la=4,ha=5,ua=6,fa=7,sc=0,Ku=1,ju=2,si=0,Qu=1,tf=2,ef=3,ah=4,nf=5,sf=6,rf=7,ch=300,hs=301,us=302,da=303,pa=304,ao=306,qr=1e3,Ei=1001,ma=1002,tn=1003,of=1004,hr=1005,gn=1006,vo=1007,ni=1008,An=1009,lh=1010,hh=1011,Gs=1012,rc=1013,wi=1014,En=1015,nr=1016,oc=1017,ac=1018,ks=1020,uh=35902,fh=35899,dh=1021,ph=1022,_n=1023,Ws=1026,Xs=1027,cc=1028,lc=1029,mh=1030,hc=1031,uc=1033,zr=33776,Hr=33777,Vr=33778,Gr=33779,ga=35840,_a=35841,va=35842,xa=35843,Ma=36196,ya=37492,Sa=37496,Ea=37808,Ta=37809,ba=37810,wa=37811,Aa=37812,Ra=37813,Ca=37814,Pa=37815,La=37816,Da=37817,Ua=37818,Ia=37819,Na=37820,Fa=37821,Oa=36492,Ba=36494,za=36495,Ha=36283,Va=36284,Ga=36285,ka=36286,af=3200,cf=3201,fc=0,lf=1,Hn="",He="srgb",fs="srgb-linear",Yr="linear",he="srgb",Fi=7680,Vc=519,hf=512,uf=513,ff=514,gh=515,df=516,pf=517,mf=518,gf=519,Gc=35044,_h=35048,kc="300 es",Tn=2e3,$r=2001;class xs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wc=1234567;const Fs=Math.PI/180,qs=180/Math.PI;function Pi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function Jt(i,t,e){return Math.max(t,Math.min(e,i))}function dc(i,t){return(i%t+t)%t}function _f(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function vf(i,t,e){return i!==t?(e-i)/(t-i):0}function Os(i,t,e){return(1-e)*i+e*t}function xf(i,t,e,n){return Os(i,t,1-Math.exp(-e*n))}function Mf(i,t=1){return t-Math.abs(dc(i,t*2)-t)}function yf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Sf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ef(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Tf(i,t){return i+Math.random()*(t-i)}function bf(i){return i*(.5-Math.random())}function wf(i){i!==void 0&&(Wc=i);let t=Wc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Af(i){return i*Fs}function Rf(i){return i*qs}function Cf(i){return(i&i-1)===0&&i!==0}function Pf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Df(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),p=o((t-n)/2),d=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*p,a*c);break;case"YZY":i.set(l*p,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*p,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ji(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Be(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Se={DEG2RAD:Fs,RAD2DEG:qs,generateUUID:Pi,clamp:Jt,euclideanModulo:dc,mapLinear:_f,inverseLerp:vf,lerp:Os,damp:xf,pingpong:Mf,smoothstep:yf,smootherstep:Sf,randInt:Ef,randFloat:Tf,randFloatSpread:bf,seededRandom:wf,degToRad:Af,radToDeg:Rf,isPowerOfTwo:Cf,ceilPowerOfTwo:Pf,floorPowerOfTwo:Lf,setQuaternionFromProperEuler:Df,normalize:Be,denormalize:ji};class ot{constructor(t=0,e=0){ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const p=r[o+0],d=r[o+1],m=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=p,t[e+1]=d,t[e+2]=m,t[e+3]=_;return}if(u!==_||l!==p||c!==d||h!==m){let g=1-a;const f=l*p+c*d+h*m+u*_,T=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const R=Math.sqrt(v),A=Math.atan2(R,f*T);g=Math.sin(g*A)/R,a=Math.sin(a*A)/R}const x=a*T;if(l=l*g+p*x,c=c*g+d*x,h=h*g+m*x,u=u*g+_*x,g===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],p=r[o+1],d=r[o+2],m=r[o+3];return t[e]=a*m+h*u+l*d-c*p,t[e+1]=l*m+h*p+c*u-a*d,t[e+2]=c*m+h*d+a*p-l*u,t[e+3]=h*m-a*u-l*p-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),p=l(n/2),d=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=p*h*u+c*d*m,this._y=c*d*u-p*h*m,this._z=c*h*m+p*d*u,this._w=c*h*u-p*d*m;break;case"YXZ":this._x=p*h*u+c*d*m,this._y=c*d*u-p*h*m,this._z=c*h*m-p*d*u,this._w=c*h*u+p*d*m;break;case"ZXY":this._x=p*h*u-c*d*m,this._y=c*d*u+p*h*m,this._z=c*h*m+p*d*u,this._w=c*h*u-p*d*m;break;case"ZYX":this._x=p*h*u-c*d*m,this._y=c*d*u+p*h*m,this._z=c*h*m-p*d*u,this._w=c*h*u+p*d*m;break;case"YZX":this._x=p*h*u+c*d*m,this._y=c*d*u+p*h*m,this._z=c*h*m-p*d*u,this._w=c*h*u-p*d*m;break;case"XZY":this._x=p*h*u-c*d*m,this._y=c*d*u-p*h*m,this._z=c*h*m+p*d*u,this._w=c*h*u+p*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],p=n+a+u;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Jt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,p=Math.sin(e*h)/c;return this._w=o*u+this._w*p,this._x=n*u+this._x*p,this._y=s*u+this._y*p,this._z=r*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Xc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Xc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xo.copy(this).projectOnVector(t),this.sub(xo)}reflect(t){return this.sub(xo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xo=new C,Xc=new Wn;class qt{constructor(t,e,n,s,r,o,a,l,c){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],p=n[2],d=n[5],m=n[8],_=s[0],g=s[3],f=s[6],T=s[1],v=s[4],x=s[7],R=s[2],A=s[5],b=s[8];return r[0]=o*_+a*T+l*R,r[3]=o*g+a*v+l*A,r[6]=o*f+a*x+l*b,r[1]=c*_+h*T+u*R,r[4]=c*g+h*v+u*A,r[7]=c*f+h*x+u*b,r[2]=p*_+d*T+m*R,r[5]=p*g+d*v+m*A,r[8]=p*f+d*x+m*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,p=a*l-h*r,d=c*r-o*l,m=e*u+n*p+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=u*_,t[1]=(s*c-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=p*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Mo.makeScale(t,e)),this}rotate(t){return this.premultiply(Mo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Mo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Mo=new qt;function vh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Uf(){const i=Jr("canvas");return i.style.display="block",i}const qc={};function Ys(i){i in qc||(qc[i]=!0,console.warn(i))}function If(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Yc=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$c=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nf(){const i={enabled:!0,workingColorSpace:fs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===he&&(s.r=Gn(s.r),s.g=Gn(s.g),s.b=Gn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===he&&(s.r=cs(s.r),s.g=cs(s.g),s.b=cs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Hn?Yr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ys("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ys("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[fs]:{primaries:t,whitePoint:n,transfer:Yr,toXYZ:Yc,fromXYZ:$c,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:t,whitePoint:n,transfer:he,toXYZ:Yc,fromXYZ:$c,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:He}}}),i}const se=Nf();function Gn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Oi;class Ff{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Oi===void 0&&(Oi=Jr("canvas")),Oi.width=t.width,Oi.height=t.height;const s=Oi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Oi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Jr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Gn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Gn(e[n]/255)*255):e[n]=Gn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Of=0;class pc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(yo(s[o].image)):r.push(yo(s[o]))}else r=yo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function yo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ff.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Bf=0;const So=new C;class Fe extends xs{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=Ei,s=Ei,r=gn,o=ni,a=_n,l=An,c=Fe.DEFAULT_ANISOTROPY,h=Hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=Pi(),this.name="",this.source=new pc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(So).x}get height(){return this.source.getSize(So).y}get depth(){return this.source.getSize(So).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ch)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case qr:t.x=t.x-Math.floor(t.x);break;case Ei:t.x=t.x<0?0:1;break;case ma:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case qr:t.y=t.y-Math.floor(t.y);break;case Ei:t.y=t.y<0?0:1;break;case ma:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=ch;Fe.DEFAULT_ANISOTROPY=1;class ue{constructor(t=0,e=0,n=0,s=1){ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],p=l[1],d=l[5],m=l[9],_=l[2],g=l[6],f=l[10];if(Math.abs(h-p)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+p)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,x=(d+1)/2,R=(f+1)/2,A=(h+p)/4,b=(u+_)/4,P=(m+g)/4;return v>x&&v>R?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=b/n):x>R?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=P/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=b/r,s=P/r),this.set(n,s,r,e),this}let T=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(p-h)*(p-h));return Math.abs(T)<.001&&(T=1),this.x=(g-m)/T,this.y=(u-_)/T,this.z=(p-h)/T,this.w=Math.acos((c+d+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this.w=Jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this.w=Jt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zf extends xs{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Fe(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:gn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new pc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ai extends zf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class xh extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=tn,this.minFilter=tn,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hf extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=tn,this.minFilter=tn,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Li{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,un):un.fromBufferAttribute(r,o),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ur.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ur.copy(n.boundingBox)),ur.applyMatrix4(t.matrixWorld),this.union(ur)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ss),fr.subVectors(this.max,Ss),Bi.subVectors(t.a,Ss),zi.subVectors(t.b,Ss),Hi.subVectors(t.c,Ss),Yn.subVectors(zi,Bi),$n.subVectors(Hi,zi),fi.subVectors(Bi,Hi);let e=[0,-Yn.z,Yn.y,0,-$n.z,$n.y,0,-fi.z,fi.y,Yn.z,0,-Yn.x,$n.z,0,-$n.x,fi.z,0,-fi.x,-Yn.y,Yn.x,0,-$n.y,$n.x,0,-fi.y,fi.x,0];return!Eo(e,Bi,zi,Hi,fr)||(e=[1,0,0,0,1,0,0,0,1],!Eo(e,Bi,zi,Hi,fr))?!1:(dr.crossVectors(Yn,$n),e=[dr.x,dr.y,dr.z],Eo(e,Bi,zi,Hi,fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ln),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ln=[new C,new C,new C,new C,new C,new C,new C,new C],un=new C,ur=new Li,Bi=new C,zi=new C,Hi=new C,Yn=new C,$n=new C,fi=new C,Ss=new C,fr=new C,dr=new C,di=new C;function Eo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){di.fromArray(i,r);const a=s.x*Math.abs(di.x)+s.y*Math.abs(di.y)+s.z*Math.abs(di.z),l=t.dot(di),c=e.dot(di),h=n.dot(di);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Vf=new Li,Es=new C,To=new C;class Di{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Vf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Es.subVectors(t,this.center);const e=Es.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Es,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(To.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Es.copy(t.center).add(To)),this.expandByPoint(Es.copy(t.center).sub(To))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Dn=new C,bo=new C,pr=new C,Jn=new C,wo=new C,mr=new C,Ao=new C;class mc{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){bo.copy(t).add(e).multiplyScalar(.5),pr.copy(e).sub(t).normalize(),Jn.copy(this.origin).sub(bo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(pr),a=Jn.dot(this.direction),l=-Jn.dot(pr),c=Jn.lengthSq(),h=Math.abs(1-o*o);let u,p,d,m;if(h>0)if(u=o*l-a,p=o*a-l,m=r*h,u>=0)if(p>=-m)if(p<=m){const _=1/h;u*=_,p*=_,d=u*(u+o*p+2*a)+p*(o*u+p+2*l)+c}else p=r,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;else p=-r,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;else p<=-m?(u=Math.max(0,-(-o*r+a)),p=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+p*(p+2*l)+c):p<=m?(u=0,p=Math.min(Math.max(-r,-l),r),d=p*(p+2*l)+c):(u=Math.max(0,-(o*r+a)),p=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+p*(p+2*l)+c);else p=o>0?-r:r,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(bo).addScaledVector(pr,p),d}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const n=Dn.dot(this.direction),s=Dn.dot(Dn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,p=this.origin;return c>=0?(n=(t.min.x-p.x)*c,s=(t.max.x-p.x)*c):(n=(t.max.x-p.x)*c,s=(t.min.x-p.x)*c),h>=0?(r=(t.min.y-p.y)*h,o=(t.max.y-p.y)*h):(r=(t.max.y-p.y)*h,o=(t.min.y-p.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-p.z)*u,l=(t.max.z-p.z)*u):(a=(t.max.z-p.z)*u,l=(t.min.z-p.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,n,s,r){wo.subVectors(e,t),mr.subVectors(n,t),Ao.crossVectors(wo,mr);let o=this.direction.dot(Ao),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Jn.subVectors(this.origin,t);const l=a*this.direction.dot(mr.crossVectors(Jn,mr));if(l<0)return null;const c=a*this.direction.dot(wo.cross(Jn));if(c<0||l+c>o)return null;const h=-a*Jn.dot(Ao);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ce{constructor(t,e,n,s,r,o,a,l,c,h,u,p,d,m,_,g){ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,p,d,m,_,g)}set(t,e,n,s,r,o,a,l,c,h,u,p,d,m,_,g){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=p,f[3]=d,f[7]=m,f[11]=_,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ce().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Vi.setFromMatrixColumn(t,0).length(),r=1/Vi.setFromMatrixColumn(t,1).length(),o=1/Vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const p=o*h,d=o*u,m=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+m*c,e[5]=p-_*c,e[9]=-a*l,e[2]=_-p*c,e[6]=m+d*c,e[10]=o*l}else if(t.order==="YXZ"){const p=l*h,d=l*u,m=c*h,_=c*u;e[0]=p+_*a,e[4]=m*a-d,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-m,e[6]=_+p*a,e[10]=o*l}else if(t.order==="ZXY"){const p=l*h,d=l*u,m=c*h,_=c*u;e[0]=p-_*a,e[4]=-o*u,e[8]=m+d*a,e[1]=d+m*a,e[5]=o*h,e[9]=_-p*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const p=o*h,d=o*u,m=a*h,_=a*u;e[0]=l*h,e[4]=m*c-d,e[8]=p*c+_,e[1]=l*u,e[5]=_*c+p,e[9]=d*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const p=o*l,d=o*c,m=a*l,_=a*c;e[0]=l*h,e[4]=_-p*u,e[8]=m*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*u+m,e[10]=p-_*u}else if(t.order==="XZY"){const p=o*l,d=o*c,m=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=p*u+_,e[5]=o*h,e[9]=d*u-m,e[2]=m*u-d,e[6]=a*h,e[10]=_*u+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Gf,t,kf)}lookAt(t,e,n){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),Zn.crossVectors(n,Ze),Zn.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),Zn.crossVectors(n,Ze)),Zn.normalize(),gr.crossVectors(Ze,Zn),s[0]=Zn.x,s[4]=gr.x,s[8]=Ze.x,s[1]=Zn.y,s[5]=gr.y,s[9]=Ze.y,s[2]=Zn.z,s[6]=gr.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],p=n[9],d=n[13],m=n[2],_=n[6],g=n[10],f=n[14],T=n[3],v=n[7],x=n[11],R=n[15],A=s[0],b=s[4],P=s[8],y=s[12],S=s[1],D=s[5],O=s[9],z=s[13],k=s[2],q=s[6],W=s[10],et=s[14],G=s[3],ut=s[7],vt=s[11],yt=s[15];return r[0]=o*A+a*S+l*k+c*G,r[4]=o*b+a*D+l*q+c*ut,r[8]=o*P+a*O+l*W+c*vt,r[12]=o*y+a*z+l*et+c*yt,r[1]=h*A+u*S+p*k+d*G,r[5]=h*b+u*D+p*q+d*ut,r[9]=h*P+u*O+p*W+d*vt,r[13]=h*y+u*z+p*et+d*yt,r[2]=m*A+_*S+g*k+f*G,r[6]=m*b+_*D+g*q+f*ut,r[10]=m*P+_*O+g*W+f*vt,r[14]=m*y+_*z+g*et+f*yt,r[3]=T*A+v*S+x*k+R*G,r[7]=T*b+v*D+x*q+R*ut,r[11]=T*P+v*O+x*W+R*vt,r[15]=T*y+v*z+x*et+R*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],p=t[10],d=t[14],m=t[3],_=t[7],g=t[11],f=t[15];return m*(+r*l*u-s*c*u-r*a*p+n*c*p+s*a*d-n*l*d)+_*(+e*l*d-e*c*p+r*o*p-s*o*d+s*c*h-r*l*h)+g*(+e*c*u-e*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+f*(-s*a*h-e*l*u+e*a*p+s*o*u-n*o*p+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],p=t[10],d=t[11],m=t[12],_=t[13],g=t[14],f=t[15],T=u*g*c-_*p*c+_*l*d-a*g*d-u*l*f+a*p*f,v=m*p*c-h*g*c-m*l*d+o*g*d+h*l*f-o*p*f,x=h*_*c-m*u*c+m*a*d-o*_*d-h*a*f+o*u*f,R=m*u*l-h*_*l-m*a*p+o*_*p+h*a*g-o*u*g,A=e*T+n*v+s*x+r*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/A;return t[0]=T*b,t[1]=(_*p*r-u*g*r-_*s*d+n*g*d+u*s*f-n*p*f)*b,t[2]=(a*g*r-_*l*r+_*s*c-n*g*c-a*s*f+n*l*f)*b,t[3]=(u*l*r-a*p*r-u*s*c+n*p*c+a*s*d-n*l*d)*b,t[4]=v*b,t[5]=(h*g*r-m*p*r+m*s*d-e*g*d-h*s*f+e*p*f)*b,t[6]=(m*l*r-o*g*r-m*s*c+e*g*c+o*s*f-e*l*f)*b,t[7]=(o*p*r-h*l*r+h*s*c-e*p*c-o*s*d+e*l*d)*b,t[8]=x*b,t[9]=(m*u*r-h*_*r-m*n*d+e*_*d+h*n*f-e*u*f)*b,t[10]=(o*_*r-m*a*r+m*n*c-e*_*c-o*n*f+e*a*f)*b,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*d-e*a*d)*b,t[12]=R*b,t[13]=(h*_*s-m*u*s+m*n*p-e*_*p-h*n*g+e*u*g)*b,t[14]=(m*a*s-o*_*s-m*n*l+e*_*l+o*n*g-e*a*g)*b,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*p+e*a*p)*b,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,p=r*c,d=r*h,m=r*u,_=o*h,g=o*u,f=a*u,T=l*c,v=l*h,x=l*u,R=n.x,A=n.y,b=n.z;return s[0]=(1-(_+f))*R,s[1]=(d+x)*R,s[2]=(m-v)*R,s[3]=0,s[4]=(d-x)*A,s[5]=(1-(p+f))*A,s[6]=(g+T)*A,s[7]=0,s[8]=(m+v)*b,s[9]=(g-T)*b,s[10]=(1-(p+_))*b,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Vi.set(s[0],s[1],s[2]).length();const o=Vi.set(s[4],s[5],s[6]).length(),a=Vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);const c=1/r,h=1/o,u=1/a;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,e.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Tn,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-s),p=(e+t)/(e-t),d=(n+s)/(n-s);let m,_;if(l)m=r/(o-r),_=o*r/(o-r);else if(a===Tn)m=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===$r)m=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Tn,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-s),p=-(e+t)/(e-t),d=-(n+s)/(n-s);let m,_;if(l)m=1/(o-r),_=o/(o-r);else if(a===Tn)m=-2/(o-r),_=-(o+r)/(o-r);else if(a===$r)m=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Vi=new C,fn=new ce,Gf=new C(0,0,0),kf=new C(1,1,1),Zn=new C,gr=new C,Ze=new C,Jc=new ce,Zc=new Wn;class vn{constructor(t=0,e=0,n=0,s=vn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Jt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zc.setFromEuler(this),this.setFromQuaternion(Zc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vn.DEFAULT_ORDER="XYZ";class gc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Wf=0;const Kc=new C,Gi=new Wn,Un=new ce,_r=new C,Ts=new C,Xf=new C,qf=new Wn,jc=new C(1,0,0),Qc=new C(0,1,0),tl=new C(0,0,1),el={type:"added"},Yf={type:"removed"},ki={type:"childadded",child:null},Ro={type:"childremoved",child:null};class we extends xs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new C,e=new vn,n=new Wn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ce},normalMatrix:{value:new qt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gi.setFromAxisAngle(t,e),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(t,e){return Gi.setFromAxisAngle(t,e),this.quaternion.premultiply(Gi),this}rotateX(t){return this.rotateOnAxis(jc,t)}rotateY(t){return this.rotateOnAxis(Qc,t)}rotateZ(t){return this.rotateOnAxis(tl,t)}translateOnAxis(t,e){return Kc.copy(t).applyQuaternion(this.quaternion),this.position.add(Kc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(jc,t)}translateY(t){return this.translateOnAxis(Qc,t)}translateZ(t){return this.translateOnAxis(tl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?_r.copy(t):_r.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ts.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(Ts,_r,this.up):Un.lookAt(_r,Ts,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Gi.setFromRotationMatrix(Un),this.quaternion.premultiply(Gi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(el),ki.child=t,this.dispatchEvent(ki),ki.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yf),Ro.child=t,this.dispatchEvent(Ro),Ro.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Un.multiply(t.parent.matrixWorld)),t.applyMatrix4(Un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(el),ki.child=t,this.dispatchEvent(ki),ki.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ts,t,Xf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ts,qf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),p=o(t.skeletons),d=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}we.DEFAULT_UP=new C(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new C,In=new C,Co=new C,Nn=new C,Wi=new C,Xi=new C,nl=new C,Po=new C,Lo=new C,Do=new C,Uo=new ue,Io=new ue,No=new ue;class mn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),dn.subVectors(t,e),s.cross(dn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){dn.subVectors(s,e),In.subVectors(n,e),Co.subVectors(t,e);const o=dn.dot(dn),a=dn.dot(In),l=dn.dot(Co),c=In.dot(In),h=In.dot(Co),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const p=1/u,d=(c*l-a*h)*p,m=(o*h-a*l)*p;return r.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Nn.x),l.addScaledVector(o,Nn.y),l.addScaledVector(a,Nn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Uo.setScalar(0),Io.setScalar(0),No.setScalar(0),Uo.fromBufferAttribute(t,e),Io.fromBufferAttribute(t,n),No.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Uo,r.x),o.addScaledVector(Io,r.y),o.addScaledVector(No,r.z),o}static isFrontFacing(t,e,n,s){return dn.subVectors(n,e),In.subVectors(t,e),dn.cross(In).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),dn.cross(In).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return mn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Wi.subVectors(s,n),Xi.subVectors(r,n),Po.subVectors(t,n);const l=Wi.dot(Po),c=Xi.dot(Po);if(l<=0&&c<=0)return e.copy(n);Lo.subVectors(t,s);const h=Wi.dot(Lo),u=Xi.dot(Lo);if(h>=0&&u<=h)return e.copy(s);const p=l*u-h*c;if(p<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Wi,o);Do.subVectors(t,r);const d=Wi.dot(Do),m=Xi.dot(Do);if(m>=0&&d<=m)return e.copy(r);const _=d*c-l*m;if(_<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(Xi,a);const g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return nl.subVectors(r,s),a=(u-h)/(u-h+(d-m)),e.copy(s).addScaledVector(nl,a);const f=1/(g+_+p);return o=_*f,a=p*f,e.copy(n).addScaledVector(Wi,o).addScaledVector(Xi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},vr={h:0,s:0,l:0};function Fo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class $t{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=He){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=se.workingColorSpace){if(t=dc(t,1),e=Jt(e,0,1),n=Jt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Fo(o,r,t+1/3),this.g=Fo(o,r,t),this.b=Fo(o,r,t-1/3)}return se.colorSpaceToWorking(this,s),this}setStyle(t,e=He){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=He){const n=Mh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=cs(t.r),this.g=cs(t.g),this.b=cs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=He){return se.workingToColorSpace(Ie.copy(this),t),Math.round(Jt(Ie.r*255,0,255))*65536+Math.round(Jt(Ie.g*255,0,255))*256+Math.round(Jt(Ie.b*255,0,255))}getHexString(t=He){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(Ie.copy(this),e);const n=Ie.r,s=Ie.g,r=Ie.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=He){se.workingToColorSpace(Ie.copy(this),t);const e=Ie.r,n=Ie.g,s=Ie.b;return t!==He?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Kn),this.setHSL(Kn.h+t,Kn.s+e,Kn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Kn),t.getHSL(vr);const n=Os(Kn.h,vr.h,e),s=Os(Kn.s,vr.s,e),r=Os(Kn.l,vr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ie=new $t;$t.NAMES=Mh;let $f=0;class Ui extends xs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=Pi(),this.name="",this.type="Material",this.blending=as,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sa,this.blendDst=ra,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=ls,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fi,this.stencilZFail=Fi,this.stencilZPass=Fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==as&&(n.blending=this.blending),this.side!==oi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==sa&&(n.blendSrc=this.blendSrc),this.blendDst!==ra&&(n.blendDst=this.blendDst),this.blendEquation!==yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ls&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ri extends Ui{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new C,xr=new ot;let Jf=0;class ln{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Jf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Gc,this.updateRanges=[],this.gpuType=En,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)xr.fromBufferAttribute(this,e),xr.applyMatrix3(t),this.setXY(e,xr.x,xr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ji(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Be(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array),s=Be(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array),s=Be(s,this.array),r=Be(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gc&&(t.usage=this.usage),t}}class yh extends ln{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Sh extends ln{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class te extends ln{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Zf=0;const sn=new ce,Oo=new we,qi=new C,Ke=new Li,bs=new Li,De=new C;class Ce extends xs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vh(t)?Sh:yh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Oo.lookAt(t),Oo.updateMatrix(),this.applyMatrix4(Oo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qi).negate(),this.translate(qi.x,qi.y,qi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new te(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Di);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];bs.setFromBufferAttribute(a),this.morphTargetsRelative?(De.addVectors(Ke.min,bs.min),Ke.expandByPoint(De),De.addVectors(Ke.max,bs.max),Ke.expandByPoint(De)):(Ke.expandByPoint(bs.min),Ke.expandByPoint(bs.max))}Ke.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)De.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(De));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)De.fromBufferAttribute(a,c),l&&(qi.fromBufferAttribute(t,c),De.add(qi)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ln(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new C,l[P]=new C;const c=new C,h=new C,u=new C,p=new ot,d=new ot,m=new ot,_=new C,g=new C;function f(P,y,S){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,S),p.fromBufferAttribute(r,P),d.fromBufferAttribute(r,y),m.fromBufferAttribute(r,S),h.sub(c),u.sub(c),d.sub(p),m.sub(p);const D=1/(d.x*m.y-m.x*d.y);isFinite(D)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(D),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(D),a[P].add(_),a[y].add(_),a[S].add(_),l[P].add(g),l[y].add(g),l[S].add(g))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let P=0,y=T.length;P<y;++P){const S=T[P],D=S.start,O=S.count;for(let z=D,k=D+O;z<k;z+=3)f(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const v=new C,x=new C,R=new C,A=new C;function b(P){R.fromBufferAttribute(s,P),A.copy(R);const y=a[P];v.copy(y),v.sub(R.multiplyScalar(R.dot(y))).normalize(),x.crossVectors(A,y);const D=x.dot(l[P])<0?-1:1;o.setXYZW(P,v.x,v.y,v.z,D)}for(let P=0,y=T.length;P<y;++P){const S=T[P],D=S.start,O=S.count;for(let z=D,k=D+O;z<k;z+=3)b(t.getX(z+0)),b(t.getX(z+1)),b(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ln(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(t)for(let p=0,d=t.count;p<d;p+=3){const m=t.getX(p+0),_=t.getX(p+1),g=t.getX(p+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),o.fromBufferAttribute(e,p+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,p=new c.constructor(l.length*h);let d=0,m=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?d=l[_]*a.data.stride+a.offset:d=l[_]*h;for(let f=0;f<h;f++)p[m++]=c[d++]}return new ln(p,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const p=c[h],d=t(p,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,p=c.length;u<p;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let p=0,d=u.length;p<d;p++)h.push(u[p].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const il=new ce,pi=new mc,Mr=new Di,sl=new C,yr=new C,Sr=new C,Er=new C,Bo=new C,Tr=new C,rl=new C,br=new C;class Ut extends we{constructor(t=new Ce,e=new Ri){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Bo.fromBufferAttribute(u,t),o?Tr.addScaledVector(Bo,h):Tr.addScaledVector(Bo.sub(e),h))}e.add(Tr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Mr.copy(n.boundingSphere),Mr.applyMatrix4(r),pi.copy(t.ray).recast(t.near),!(Mr.containsPoint(pi.origin)===!1&&(pi.intersectSphere(Mr,sl)===null||pi.origin.distanceToSquared(sl)>(t.far-t.near)**2))&&(il.copy(r).invert(),pi.copy(t.ray).applyMatrix4(il),!(n.boundingBox!==null&&pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,pi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,p=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=p.length;m<_;m++){const g=p[m],f=o[g.materialIndex],T=Math.max(g.start,d.start),v=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let x=T,R=v;x<R;x+=3){const A=a.getX(x),b=a.getX(x+1),P=a.getX(x+2);s=wr(this,f,t,n,c,h,u,A,b,P),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let g=m,f=_;g<f;g+=3){const T=a.getX(g),v=a.getX(g+1),x=a.getX(g+2);s=wr(this,o,t,n,c,h,u,T,v,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=p.length;m<_;m++){const g=p[m],f=o[g.materialIndex],T=Math.max(g.start,d.start),v=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let x=T,R=v;x<R;x+=3){const A=x,b=x+1,P=x+2;s=wr(this,f,t,n,c,h,u,A,b,P),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let g=m,f=_;g<f;g+=3){const T=g,v=g+1,x=g+2;s=wr(this,o,t,n,c,h,u,T,v,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Kf(i,t,e,n,s,r,o,a){let l;if(t.side===Ne?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===oi,a),l===null)return null;br.copy(a),br.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(br);return c<e.near||c>e.far?null:{distance:c,point:br.clone(),object:i}}function wr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,yr),i.getVertexPosition(l,Sr),i.getVertexPosition(c,Er);const h=Kf(i,t,e,n,yr,Sr,Er,rl);if(h){const u=new C;mn.getBarycoord(rl,yr,Sr,Er,u),s&&(h.uv=mn.getInterpolatedAttribute(s,a,l,c,u,new ot)),r&&(h.uv1=mn.getInterpolatedAttribute(r,a,l,c,u,new ot)),o&&(h.normal=mn.getInterpolatedAttribute(o,a,l,c,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a,b:l,c,normal:new C,materialIndex:0};mn.getNormal(yr,Sr,Er,p.normal),h.face=p,h.barycoord=u}return h}class Xe extends Ce{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let p=0,d=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new te(c,3)),this.setAttribute("normal",new te(h,3)),this.setAttribute("uv",new te(u,2));function m(_,g,f,T,v,x,R,A,b,P,y){const S=x/b,D=R/P,O=x/2,z=R/2,k=A/2,q=b+1,W=P+1;let et=0,G=0;const ut=new C;for(let vt=0;vt<W;vt++){const yt=vt*D-z;for(let Wt=0;Wt<q;Wt++){const Qt=Wt*S-O;ut[_]=Qt*T,ut[g]=yt*v,ut[f]=k,c.push(ut.x,ut.y,ut.z),ut[_]=0,ut[g]=0,ut[f]=A>0?1:-1,h.push(ut.x,ut.y,ut.z),u.push(Wt/b),u.push(1-vt/P),et+=1}}for(let vt=0;vt<P;vt++)for(let yt=0;yt<b;yt++){const Wt=p+yt+q*vt,Qt=p+yt+q*(vt+1),ae=p+(yt+1)+q*(vt+1),ee=p+(yt+1)+q*vt;l.push(Wt,Qt,ee),l.push(Qt,ae,ee),G+=6}a.addGroup(d,G,y),d+=G,p+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ds(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=ds(i[e]);for(const s in n)t[s]=n[s]}return t}function jf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Eh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const Qf={clone:ds,merge:ze};var td=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ed=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xn extends Ui{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=td,this.fragmentShader=ed,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ds(t.uniforms),this.uniformsGroups=jf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Th extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=Tn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const jn=new C,ol=new ot,al=new ot;class Qe extends Th{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qs*2*Math.atan(Math.tan(Fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(jn.x,jn.y).multiplyScalar(-t/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-t/jn.z)}getViewSize(t,e){return this.getViewBounds(t,ol,al),e.subVectors(al,ol)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Fs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Yi=-90,$i=1;class nd extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(Yi,$i,t,e);s.layers=this.layers,this.add(s);const r=new Qe(Yi,$i,t,e);r.layers=this.layers,this.add(r);const o=new Qe(Yi,$i,t,e);o.layers=this.layers,this.add(o);const a=new Qe(Yi,$i,t,e);a.layers=this.layers,this.add(a);const l=new Qe(Yi,$i,t,e);l.layers=this.layers,this.add(l);const c=new Qe(Yi,$i,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===$r)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,p,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class bh extends Fe{constructor(t=[],e=hs,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class id extends Ai{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new bh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Xe(5,5,5),r=new Xn({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ne,blending:ii});r.uniforms.tEquirect.value=e;const o=new Ut(s,r),a=e.minFilter;return e.minFilter===ni&&(e.minFilter=gn),new nd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Te extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sd={type:"move"};class zo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Te,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Te,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Te,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,n),f=this._getHandJoint(c,_);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],p=h.position.distanceTo(u.position),d=.02,m=.005;c.inputState.pinching&&p>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&p<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sd)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Te;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class _c{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new $t(t),this.near=e,this.far=n}clone(){return new _c(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class wh extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Ah extends Fe{constructor(t=null,e=1,n=1,s,r,o,a,l,c=tn,h=tn,u,p){super(null,o,a,l,c,h,s,r,u,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cl extends ln{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ji=new ce,ll=new ce,Ar=[],hl=new Li,rd=new ce,ws=new Ut,As=new Di;class pn extends Ut{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new cl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,rd)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Li),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ji),hl.copy(t.boundingBox).applyMatrix4(Ji),this.boundingBox.union(hl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Di),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ji),As.copy(t.boundingSphere).applyMatrix4(Ji),this.boundingSphere.union(As)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ws.geometry=this.geometry,ws.material=this.material,ws.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),As.copy(this.boundingSphere),As.applyMatrix4(n),t.ray.intersectsSphere(As)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ji),ll.multiplyMatrices(n,Ji),ws.matrixWorld=ll,ws.raycast(t,Ar);for(let o=0,a=Ar.length;o<a;o++){const l=Ar[o];l.instanceId=r,l.object=this,e.push(l)}Ar.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new cl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ah(new Float32Array(s*this.count),s,this.count,cc,En));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ho=new C,od=new C,ad=new qt;class vi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ho.subVectors(n,e).cross(od.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ho),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ad.getNormalMatrix(t),s=this.coplanarPoint(Ho).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mi=new Di,cd=new ot(.5,.5),Rr=new C;class vc{constructor(t=new vi,e=new vi,n=new vi,s=new vi,r=new vi,o=new vi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Tn,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],p=r[6],d=r[7],m=r[8],_=r[9],g=r[10],f=r[11],T=r[12],v=r[13],x=r[14],R=r[15];if(s[0].setComponents(c-o,d-h,f-m,R-T).normalize(),s[1].setComponents(c+o,d+h,f+m,R+T).normalize(),s[2].setComponents(c+a,d+u,f+_,R+v).normalize(),s[3].setComponents(c-a,d-u,f-_,R-v).normalize(),n)s[4].setComponents(l,p,g,x).normalize(),s[5].setComponents(c-l,d-p,f-g,R-x).normalize();else if(s[4].setComponents(c-l,d-p,f-g,R-x).normalize(),e===Tn)s[5].setComponents(c+l,d+p,f+g,R+x).normalize();else if(e===$r)s[5].setComponents(l,p,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(mi)}intersectsSprite(t){mi.center.set(0,0,0);const e=cd.distanceTo(t.center);return mi.radius=.7071067811865476+e,mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(mi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Rr.x=s.normal.x>0?t.max.x:t.min.x,Rr.y=s.normal.y>0?t.max.y:t.min.y,Rr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Rh extends Ui{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Zr=new C,Kr=new C,ul=new ce,Rs=new mc,Cr=new Di,Vo=new C,fl=new C;class ld extends we{constructor(t=new Ce,e=new Rh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Zr.fromBufferAttribute(e,s-1),Kr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Zr.distanceTo(Kr);t.setAttribute("lineDistance",new te(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(s),Cr.radius+=r,t.ray.intersectsSphere(Cr)===!1)return;ul.copy(s).invert(),Rs.copy(t.ray).applyMatrix4(ul);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=d,g=m-1;_<g;_+=c){const f=h.getX(_),T=h.getX(_+1),v=Pr(this,t,Rs,l,f,T,_);v&&e.push(v)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(d),f=Pr(this,t,Rs,l,_,g,m-1);f&&e.push(f)}}else{const d=Math.max(0,o.start),m=Math.min(p.count,o.start+o.count);for(let _=d,g=m-1;_<g;_+=c){const f=Pr(this,t,Rs,l,_,_+1,_);f&&e.push(f)}if(this.isLineLoop){const _=Pr(this,t,Rs,l,m-1,d,m-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Pr(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(Zr.fromBufferAttribute(a,s),Kr.fromBufferAttribute(a,r),e.distanceSqToSegment(Zr,Kr,Vo,fl)>n)return;Vo.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Vo);if(!(c<t.near||c>t.far))return{distance:c,point:fl.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}class hd extends Fe{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ch extends Fe{constructor(t,e,n=wi,s,r,o,a=tn,l=tn,c,h=Ws,u=1){if(h!==Ws&&h!==Xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:t,height:e,depth:u};super(p,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new pc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ph extends Fe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class xc extends Ce{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const o=[],a=[],l=[],c=[],h=e/2,u=Math.PI/2*t,p=e,d=2*u+p,m=n*2+r,_=s+1,g=new C,f=new C;for(let T=0;T<=m;T++){let v=0,x=0,R=0,A=0;if(T<=n){const y=T/n,S=y*Math.PI/2;x=-h-t*Math.cos(S),R=t*Math.sin(S),A=-t*Math.cos(S),v=y*u}else if(T<=n+r){const y=(T-n)/r;x=-h+y*e,R=t,A=0,v=u+y*p}else{const y=(T-n-r)/n,S=y*Math.PI/2;x=h+t*Math.sin(S),R=t*Math.cos(S),A=t*Math.sin(S),v=u+p+y*u}const b=Math.max(0,Math.min(1,v/d));let P=0;T===0?P=.5/s:T===m&&(P=-.5/s);for(let y=0;y<=s;y++){const S=y/s,D=S*Math.PI*2,O=Math.sin(D),z=Math.cos(D);f.x=-R*z,f.y=x,f.z=R*O,a.push(f.x,f.y,f.z),g.set(-R*z,A,R*O),g.normalize(),l.push(g.x,g.y,g.z),c.push(S+P,b)}if(T>0){const y=(T-1)*_;for(let S=0;S<s;S++){const D=y+S,O=y+S+1,z=T*_+S,k=T*_+S+1;o.push(D,O,z),o.push(O,k,z)}}}this.setIndex(o),this.setAttribute("position",new te(a,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xc(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class ir extends Ce{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],p=[],d=[];let m=0;const _=[],g=n/2;let f=0;T(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(p,3)),this.setAttribute("uv",new te(d,2));function T(){const x=new C,R=new C;let A=0;const b=(e-t)/n;for(let P=0;P<=r;P++){const y=[],S=P/r,D=S*(e-t)+t;for(let O=0;O<=s;O++){const z=O/s,k=z*l+a,q=Math.sin(k),W=Math.cos(k);R.x=D*q,R.y=-S*n+g,R.z=D*W,u.push(R.x,R.y,R.z),x.set(q,b,W).normalize(),p.push(x.x,x.y,x.z),d.push(z,1-S),y.push(m++)}_.push(y)}for(let P=0;P<s;P++)for(let y=0;y<r;y++){const S=_[y][P],D=_[y+1][P],O=_[y+1][P+1],z=_[y][P+1];(t>0||y!==0)&&(h.push(S,D,z),A+=3),(e>0||y!==r-1)&&(h.push(D,O,z),A+=3)}c.addGroup(f,A,0),f+=A}function v(x){const R=m,A=new ot,b=new C;let P=0;const y=x===!0?t:e,S=x===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,g*S,0),p.push(0,S,0),d.push(.5,.5),m++;const D=m;for(let O=0;O<=s;O++){const k=O/s*l+a,q=Math.cos(k),W=Math.sin(k);b.x=y*W,b.y=g*S,b.z=y*q,u.push(b.x,b.y,b.z),p.push(0,S,0),A.x=q*.5+.5,A.y=W*.5*S+.5,d.push(A.x,A.y),m++}for(let O=0;O<s;O++){const z=R+O,k=D+O;x===!0?h.push(k,k+1,z):h.push(k+1,k,z),P+=3}c.addGroup(f,P,x===!0?1:2),f+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Mc extends ir{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Mc(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Cn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],p=n[s+1]-h,d=(o-h)/p;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ot:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new C,s=[],r=[],o=[],a=new C,l=new ce;for(let d=0;d<=t;d++){const m=d/t;s[d]=this.getTangentAt(m,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(Jt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,m))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Jt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],d*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class yc extends Cn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ot){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=l-this.aX,d=c-this.aY;l=p*h-d*u+this.aX,c=p*u+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class ud extends yc{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Sc(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let p=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;p*=h,d*=h,s(o,a,p,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Lr=new C,Go=new Sc,ko=new Sc,Wo=new Sc;class Lh extends Cn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Lr.subVectors(s[0],s[1]).add(s[0]),c=Lr);const u=s[a%r],p=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Lr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Lr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(p),d),g=Math.pow(p.distanceToSquared(h),d);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),Go.initNonuniformCatmullRom(c.x,u.x,p.x,h.x,m,_,g),ko.initNonuniformCatmullRom(c.y,u.y,p.y,h.y,m,_,g),Wo.initNonuniformCatmullRom(c.z,u.z,p.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(Go.initCatmullRom(c.x,u.x,p.x,h.x,this.tension),ko.initCatmullRom(c.y,u.y,p.y,h.y,this.tension),Wo.initCatmullRom(c.z,u.z,p.z,h.z,this.tension));return n.set(Go.calc(l),ko.calc(l),Wo.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function dl(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function fd(i,t){const e=1-i;return e*e*t}function dd(i,t){return 2*(1-i)*i*t}function pd(i,t){return i*i*t}function Bs(i,t,e,n){return fd(i,t)+dd(i,e)+pd(i,n)}function md(i,t){const e=1-i;return e*e*e*t}function gd(i,t){const e=1-i;return 3*e*e*i*t}function _d(i,t){return 3*(1-i)*i*i*t}function vd(i,t){return i*i*i*t}function zs(i,t,e,n,s){return md(i,t)+gd(i,e)+_d(i,n)+vd(i,s)}class Dh extends Cn{constructor(t=new ot,e=new ot,n=new ot,s=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ot){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(zs(t,s.x,r.x,o.x,a.x),zs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class xd extends Cn{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(zs(t,s.x,r.x,o.x,a.x),zs(t,s.y,r.y,o.y,a.y),zs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Uh extends Cn{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Md extends Cn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ih extends Cn{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Bs(t,s.x,r.x,o.x),Bs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nh extends Cn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Bs(t,s.x,r.x,o.x),Bs(t,s.y,r.y,o.y),Bs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fh extends Cn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(dl(a,l.x,c.x,h.x,u.x),dl(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ot().fromArray(s))}return this}}var jr=Object.freeze({__proto__:null,ArcCurve:ud,CatmullRomCurve3:Lh,CubicBezierCurve:Dh,CubicBezierCurve3:xd,EllipseCurve:yc,LineCurve:Uh,LineCurve3:Md,QuadraticBezierCurve:Ih,QuadraticBezierCurve3:Nh,SplineCurve:Fh});class yd extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jr[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new jr[s.type]().fromJSON(s))}return this}}class pl extends yd{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Uh(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Ih(this.currentPoint.clone(),new ot(t,e),new ot(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Dh(this.currentPoint.clone(),new ot(t,e),new ot(n,s),new ot(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Fh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new yc(t,e,n,s,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Oh extends pl{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new pl().fromJSON(s))}return this}}function Sd(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Bh(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Ad(i,t,r,e)),i.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let p=e;p<s;p+=e){const d=i[p],m=i[p+1];d<a&&(a=d),m<l&&(l=m),d>h&&(h=d),m>u&&(u=m)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return $s(r,o,e,a,l,c,0),o}function Bh(i,t,e,n,s){let r;if(s===Bd(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=ml(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=ml(o/n|0,i[o],i[o+1],r);return r&&ps(r,r.next)&&(Zs(r),r=r.next),r}function Ci(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ps(e,e.next)||ye(e.prev,e,e.next)===0)){if(Zs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function $s(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Dd(i,n,s,r);let a=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Td(i,n,s,r):Ed(i)){t.push(l.i,i.i,c.i),Zs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=bd(Ci(i),t),$s(i,t,e,n,s,r,2)):o===2&&wd(i,t,e,n,s,r):$s(Ci(i),t,e,n,s,r,1);break}}}function Ed(i){const t=i.prev,e=i,n=i.next;if(ye(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),p=Math.max(s,r,o),d=Math.max(a,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=p&&m.y>=u&&m.y<=d&&Ds(s,a,r,l,o,c,m.x,m.y)&&ye(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Td(i,t,e,n){const s=i.prev,r=i,o=i.next;if(ye(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,p=o.y,d=Math.min(a,l,c),m=Math.min(h,u,p),_=Math.max(a,l,c),g=Math.max(h,u,p),f=Wa(d,m,t,e,n),T=Wa(_,g,t,e,n);let v=i.prevZ,x=i.nextZ;for(;v&&v.z>=f&&x&&x.z<=T;){if(v.x>=d&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==o&&Ds(a,h,l,u,c,p,v.x,v.y)&&ye(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=d&&x.x<=_&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&Ds(a,h,l,u,c,p,x.x,x.y)&&ye(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=f;){if(v.x>=d&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==o&&Ds(a,h,l,u,c,p,v.x,v.y)&&ye(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=T;){if(x.x>=d&&x.x<=_&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&Ds(a,h,l,u,c,p,x.x,x.y)&&ye(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function bd(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ps(n,s)&&Hh(n,e,e.next,s)&&Js(n,s)&&Js(s,n)&&(t.push(n.i,e.i,s.i),Zs(e),Zs(e.next),e=i=s),e=e.next}while(e!==i);return Ci(e)}function wd(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Nd(o,a)){let l=Vh(o,a);o=Ci(o,o.next),l=Ci(l,l.next),$s(o,t,e,n,s,r,0),$s(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Ad(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Bh(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Id(c))}s.sort(Rd);for(let r=0;r<s.length;r++)e=Cd(s[r],e);return e}function Rd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Cd(i,t){const e=Pd(i,t);if(!e)return t;const n=Vh(e,i);return Ci(n,n.next),Ci(e,e.next)}function Pd(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(ps(i,e))return e;do{if(ps(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&zh(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Js(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&Ld(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function Ld(i,t){return ye(i.prev,i,t.prev)<0&&ye(t.next,i,i.next)<0}function Dd(i,t,e,n){let s=i;do s.z===0&&(s.z=Wa(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ud(s)}function Ud(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function Wa(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Id(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function zh(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Ds(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&zh(i,t,e,n,s,r,o,a)}function Nd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Fd(i,t)&&(Js(i,t)&&Js(t,i)&&Od(i,t)&&(ye(i.prev,i,t.prev)||ye(i,t.prev,t))||ps(i,t)&&ye(i.prev,i,i.next)>0&&ye(t.prev,t,t.next)>0)}function ye(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ps(i,t){return i.x===t.x&&i.y===t.y}function Hh(i,t,e,n){const s=Ur(ye(i,t,e)),r=Ur(ye(i,t,n)),o=Ur(ye(e,n,i)),a=Ur(ye(e,n,t));return!!(s!==r&&o!==a||s===0&&Dr(i,e,t)||r===0&&Dr(i,n,t)||o===0&&Dr(e,i,n)||a===0&&Dr(e,t,n))}function Dr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ur(i){return i>0?1:i<0?-1:0}function Fd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Hh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Js(i,t){return ye(i.prev,i,i.next)<0?ye(i,t,i.next)>=0&&ye(i,i.prev,t)>=0:ye(i,t,i.prev)<0||ye(i,i.next,t)<0}function Od(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Vh(i,t){const e=Xa(i.i,i.x,i.y),n=Xa(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ml(i,t,e,n){const s=Xa(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Zs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Xa(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Bd(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class zd{static triangulate(t,e,n=2){return Sd(t,e,n)}}class ns{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return ns.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];gl(t),_l(n,t);let o=t.length;e.forEach(gl);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,_l(n,e[l]);const a=zd.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function gl(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function _l(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ec extends Ce{constructor(t=new Oh([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new te(s,3)),this.setAttribute("uv",new te(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let p=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:d-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:Hd;let v,x=!1,R,A,b,P;f&&(v=f.getSpacedPoints(h),x=!0,p=!1,R=f.computeFrenetFrames(h,!1),A=new C,b=new C,P=new C),p||(g=0,d=0,m=0,_=0);const y=a.extractPoints(c);let S=y.shape;const D=y.holes;if(!ns.isClockWise(S)){S=S.reverse();for(let Q=0,Z=D.length;Q<Z;Q++){const J=D[Q];ns.isClockWise(J)&&(D[Q]=J.reverse())}}function z(Q){const J=10000000000000001e-36;let $=Q[0];for(let lt=1;lt<=Q.length;lt++){const nt=lt%Q.length,ht=Q[nt],Vt=ht.x-$.x,zt=ht.y-$.y,w=Vt*Vt+zt*zt,M=Math.max(Math.abs(ht.x),Math.abs(ht.y),Math.abs($.x),Math.abs($.y)),F=J*M*M;if(w<=F){Q.splice(nt,1),lt--;continue}$=ht}}z(S),D.forEach(z);const k=D.length,q=S;for(let Q=0;Q<k;Q++){const Z=D[Q];S=S.concat(Z)}function W(Q,Z,J){return Z||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(Z,J)}const et=S.length;function G(Q,Z,J){let $,lt,nt;const ht=Q.x-Z.x,Vt=Q.y-Z.y,zt=J.x-Q.x,w=J.y-Q.y,M=ht*ht+Vt*Vt,F=ht*w-Vt*zt;if(Math.abs(F)>Number.EPSILON){const V=Math.sqrt(M),j=Math.sqrt(zt*zt+w*w),X=Z.x-Vt/V,Rt=Z.y+ht/V,ct=J.x-w/j,bt=J.y+zt/j,wt=((ct-X)*w-(bt-Rt)*zt)/(ht*w-Vt*zt);$=X+ht*wt-Q.x,lt=Rt+Vt*wt-Q.y;const it=$*$+lt*lt;if(it<=2)return new ot($,lt);nt=Math.sqrt(it/2)}else{let V=!1;ht>Number.EPSILON?zt>Number.EPSILON&&(V=!0):ht<-Number.EPSILON?zt<-Number.EPSILON&&(V=!0):Math.sign(Vt)===Math.sign(w)&&(V=!0),V?($=-Vt,lt=ht,nt=Math.sqrt(M)):($=ht,lt=Vt,nt=Math.sqrt(M/2))}return new ot($/nt,lt/nt)}const ut=[];for(let Q=0,Z=q.length,J=Z-1,$=Q+1;Q<Z;Q++,J++,$++)J===Z&&(J=0),$===Z&&($=0),ut[Q]=G(q[Q],q[J],q[$]);const vt=[];let yt,Wt=ut.concat();for(let Q=0,Z=k;Q<Z;Q++){const J=D[Q];yt=[];for(let $=0,lt=J.length,nt=lt-1,ht=$+1;$<lt;$++,nt++,ht++)nt===lt&&(nt=0),ht===lt&&(ht=0),yt[$]=G(J[$],J[nt],J[ht]);vt.push(yt),Wt=Wt.concat(yt)}let Qt;if(g===0)Qt=ns.triangulateShape(q,D);else{const Q=[],Z=[];for(let J=0;J<g;J++){const $=J/g,lt=d*Math.cos($*Math.PI/2),nt=m*Math.sin($*Math.PI/2)+_;for(let ht=0,Vt=q.length;ht<Vt;ht++){const zt=W(q[ht],ut[ht],nt);Pt(zt.x,zt.y,-lt),$===0&&Q.push(zt)}for(let ht=0,Vt=k;ht<Vt;ht++){const zt=D[ht];yt=vt[ht];const w=[];for(let M=0,F=zt.length;M<F;M++){const V=W(zt[M],yt[M],nt);Pt(V.x,V.y,-lt),$===0&&w.push(V)}$===0&&Z.push(w)}}Qt=ns.triangulateShape(Q,Z)}const ae=Qt.length,ee=m+_;for(let Q=0;Q<et;Q++){const Z=p?W(S[Q],Wt[Q],ee):S[Q];x?(b.copy(R.normals[0]).multiplyScalar(Z.x),A.copy(R.binormals[0]).multiplyScalar(Z.y),P.copy(v[0]).add(b).add(A),Pt(P.x,P.y,P.z)):Pt(Z.x,Z.y,0)}for(let Q=1;Q<=h;Q++)for(let Z=0;Z<et;Z++){const J=p?W(S[Z],Wt[Z],ee):S[Z];x?(b.copy(R.normals[Q]).multiplyScalar(J.x),A.copy(R.binormals[Q]).multiplyScalar(J.y),P.copy(v[Q]).add(b).add(A),Pt(P.x,P.y,P.z)):Pt(J.x,J.y,u/h*Q)}for(let Q=g-1;Q>=0;Q--){const Z=Q/g,J=d*Math.cos(Z*Math.PI/2),$=m*Math.sin(Z*Math.PI/2)+_;for(let lt=0,nt=q.length;lt<nt;lt++){const ht=W(q[lt],ut[lt],$);Pt(ht.x,ht.y,u+J)}for(let lt=0,nt=D.length;lt<nt;lt++){const ht=D[lt];yt=vt[lt];for(let Vt=0,zt=ht.length;Vt<zt;Vt++){const w=W(ht[Vt],yt[Vt],$);x?Pt(w.x,w.y+v[h-1].y,v[h-1].x+J):Pt(w.x,w.y,u+J)}}}Y(),tt();function Y(){const Q=s.length/3;if(p){let Z=0,J=et*Z;for(let $=0;$<ae;$++){const lt=Qt[$];Tt(lt[2]+J,lt[1]+J,lt[0]+J)}Z=h+g*2,J=et*Z;for(let $=0;$<ae;$++){const lt=Qt[$];Tt(lt[0]+J,lt[1]+J,lt[2]+J)}}else{for(let Z=0;Z<ae;Z++){const J=Qt[Z];Tt(J[2],J[1],J[0])}for(let Z=0;Z<ae;Z++){const J=Qt[Z];Tt(J[0]+et*h,J[1]+et*h,J[2]+et*h)}}n.addGroup(Q,s.length/3-Q,0)}function tt(){const Q=s.length/3;let Z=0;Mt(q,Z),Z+=q.length;for(let J=0,$=D.length;J<$;J++){const lt=D[J];Mt(lt,Z),Z+=lt.length}n.addGroup(Q,s.length/3-Q,1)}function Mt(Q,Z){let J=Q.length;for(;--J>=0;){const $=J;let lt=J-1;lt<0&&(lt=Q.length-1);for(let nt=0,ht=h+g*2;nt<ht;nt++){const Vt=et*nt,zt=et*(nt+1),w=Z+$+Vt,M=Z+lt+Vt,F=Z+lt+zt,V=Z+$+zt;Kt(w,M,F,V)}}}function Pt(Q,Z,J){l.push(Q),l.push(Z),l.push(J)}function Tt(Q,Z,J){me(Q),me(Z),me(J);const $=s.length/3,lt=T.generateTopUV(n,s,$-3,$-2,$-1);L(lt[0]),L(lt[1]),L(lt[2])}function Kt(Q,Z,J,$){me(Q),me(Z),me($),me(Z),me(J),me($);const lt=s.length/3,nt=T.generateSideWallUV(n,s,lt-6,lt-3,lt-2,lt-1);L(nt[0]),L(nt[1]),L(nt[3]),L(nt[1]),L(nt[2]),L(nt[3])}function me(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function L(Q){r.push(Q.x),r.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Vd(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new jr[s.type]().fromJSON(s)),new Ec(n,t.options)}}const Hd={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ot(r,o),new ot(a,l),new ot(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],p=t[s*3],d=t[s*3+1],m=t[s*3+2],_=t[r*3],g=t[r*3+1],f=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ot(o,1-l),new ot(c,1-u),new ot(p,1-m),new ot(_,1-f)]:[new ot(a,1-l),new ot(h,1-u),new ot(d,1-m),new ot(g,1-f)]}};function Vd(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Tc extends Ce{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Jt(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/e,u=new C,p=new ot,d=new C,m=new C,_=new C;let g=0,f=0;for(let T=0;T<=t.length-1;T++)switch(T){case 0:g=t[T+1].x-t[T].x,f=t[T+1].y-t[T].y,d.x=f*1,d.y=-g,d.z=f*0,_.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:g=t[T+1].x-t[T].x,f=t[T+1].y-t[T].y,d.x=f*1,d.y=-g,d.z=f*0,m.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),l.push(d.x,d.y,d.z),_.copy(m)}for(let T=0;T<=e;T++){const v=n+T*h*s,x=Math.sin(v),R=Math.cos(v);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*x,u.y=t[A].y,u.z=t[A].x*R,o.push(u.x,u.y,u.z),p.x=T/e,p.y=A/(t.length-1),a.push(p.x,p.y);const b=l[3*A+0]*x,P=l[3*A+1],y=l[3*A+0]*R;c.push(b,P,y)}}for(let T=0;T<e;T++)for(let v=0;v<t.length-1;v++){const x=v+T*t.length,R=x,A=x+t.length,b=x+t.length+1,P=x+1;r.push(R,A,P),r.push(b,P,A)}this.setIndex(r),this.setAttribute("position",new te(o,3)),this.setAttribute("uv",new te(a,2)),this.setAttribute("normal",new te(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tc(t.points,t.segments,t.phiStart,t.phiLength)}}class Ii extends Ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,p=e/l,d=[],m=[],_=[],g=[];for(let f=0;f<h;f++){const T=f*p-o;for(let v=0;v<c;v++){const x=v*u-r;m.push(x,-T,0),_.push(0,0,1),g.push(v/a),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let T=0;T<a;T++){const v=T+c*f,x=T+c*(f+1),R=T+1+c*(f+1),A=T+1+c*f;d.push(v,x,A),d.push(x,R,A)}this.setIndex(d),this.setAttribute("position",new te(m,3)),this.setAttribute("normal",new te(_,3)),this.setAttribute("uv",new te(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.width,t.height,t.widthSegments,t.heightSegments)}}class ri extends Ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new C,p=new C,d=[],m=[],_=[],g=[];for(let f=0;f<=n;f++){const T=[],v=f/n;let x=0;f===0&&o===0?x=.5/e:f===n&&l===Math.PI&&(x=-.5/e);for(let R=0;R<=e;R++){const A=R/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+v*a),m.push(u.x,u.y,u.z),p.copy(u).normalize(),_.push(p.x,p.y,p.z),g.push(A+x,1-v),T.push(c++)}h.push(T)}for(let f=0;f<n;f++)for(let T=0;T<e;T++){const v=h[f][T+1],x=h[f][T],R=h[f+1][T],A=h[f+1][T+1];(f!==0||o>0)&&d.push(v,x,A),(f!==n-1||l<Math.PI)&&d.push(x,R,A)}this.setIndex(d),this.setAttribute("position",new te(m,3)),this.setAttribute("normal",new te(_,3)),this.setAttribute("uv",new te(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ri(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ms extends Ce{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new C,u=new C,p=new C;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){const _=m/s*r,g=d/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(_),u.y=(t+e*Math.cos(g))*Math.sin(_),u.z=e*Math.sin(g),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),p.subVectors(u,h).normalize(),l.push(p.x,p.y,p.z),c.push(m/s),c.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){const _=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,f=(s+1)*(d-1)+m,T=(s+1)*d+m;o.push(_,g,T),o.push(g,f,T)}this.setIndex(o),this.setAttribute("position",new te(a,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ms(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class bc extends Ce{constructor(t=new Nh(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new C,l=new C,c=new ot;let h=new C;const u=[],p=[],d=[],m=[];_(),this.setIndex(m),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(p,3)),this.setAttribute("uv",new te(d,2));function _(){for(let v=0;v<e;v++)g(v);g(r===!1?e:0),T(),f()}function g(v){h=t.getPointAt(v/e,h);const x=o.normals[v],R=o.binormals[v];for(let A=0;A<=s;A++){const b=A/s*Math.PI*2,P=Math.sin(b),y=-Math.cos(b);l.x=y*x.x+P*R.x,l.y=y*x.y+P*R.y,l.z=y*x.z+P*R.z,l.normalize(),p.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function f(){for(let v=1;v<=e;v++)for(let x=1;x<=s;x++){const R=(s+1)*(v-1)+(x-1),A=(s+1)*v+(x-1),b=(s+1)*v+x,P=(s+1)*(v-1)+x;m.push(R,A,P),m.push(A,b,P)}}function T(){for(let v=0;v<=e;v++)for(let x=0;x<=s;x++)c.x=v/e,c.y=x/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new bc(new jr[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class hn extends Ui{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fc,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Gd extends Ui{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fc,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class kd extends Ui{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Wd extends Ui{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class wc extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Xd extends wc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Xo=new ce,vl=new C,xl=new C;class Gh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vc,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;vl.setFromMatrixPosition(t.matrixWorld),e.position.copy(vl),xl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(xl),e.updateMatrixWorld(),Xo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xo,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Xo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ml=new ce,Cs=new C,qo=new C;class qd extends Gh{constructor(){super(new Qe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new ue(2,1,1,1),new ue(0,1,1,1),new ue(3,1,1,1),new ue(1,1,1,1),new ue(3,0,1,1),new ue(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Cs.setFromMatrixPosition(t.matrixWorld),n.position.copy(Cs),qo.copy(n.position),qo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(qo),n.updateMatrixWorld(),s.makeTranslation(-Cs.x,-Cs.y,-Cs.z),Ml.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ml,n.coordinateSystem,n.reversedDepth)}}class Yd extends wc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new qd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class kh extends Th{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class $d extends Gh{constructor(){super(new kh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Jd extends wc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new $d}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Zd extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const yl=new ce;class Kd{constructor(t,e,n=0,s=1/0){this.ray=new mc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new gc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return yl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(yl),this}intersectObject(t,e=!0,n=[]){return qa(t,this,n,e),n.sort(Sl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)qa(t[s],this,n,e);return n.sort(Sl),n}}function Sl(i,t){return i.distance-t.distance}function qa(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)qa(r[o],t,e,!0)}}function El(i,t,e,n){const s=jd(n);switch(e){case dh:return i*t;case cc:return i*t/s.components*s.byteLength;case lc:return i*t/s.components*s.byteLength;case mh:return i*t*2/s.components*s.byteLength;case hc:return i*t*2/s.components*s.byteLength;case ph:return i*t*3/s.components*s.byteLength;case _n:return i*t*4/s.components*s.byteLength;case uc:return i*t*4/s.components*s.byteLength;case zr:case Hr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Vr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _a:case xa:return Math.max(i,16)*Math.max(t,8)/4;case ga:case va:return Math.max(i,8)*Math.max(t,8)/2;case Ma:case ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Sa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ea:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ba:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case wa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Aa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ra:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ca:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case La:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Da:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Na:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Fa:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Oa:case Ba:case za:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ha:case Va:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ga:case ka:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function jd(i){switch(i){case An:case lh:return{byteLength:1,components:1};case Gs:case hh:case nr:return{byteLength:2,components:1};case oc:case ac:return{byteLength:2,components:4};case wi:case rc:case En:return{byteLength:4,components:1};case uh:case fh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ic}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ic);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Wh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Qd(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((d,m)=>d.start-m.start);let p=0;for(let d=1;d<u.length;d++){const m=u[p],_=u[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++p,u[p]=_)}u.length=p+1;for(let d=0,m=u.length;d<m;d++){const _=u[d];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var tp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ep=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,np=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ip=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,op=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ap=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,lp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,up=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,dp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,pp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,mp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,gp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ep=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,wp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ap=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Rp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Up=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ip=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Np=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Op=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Gp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,qp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Yp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$p=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Qp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,tm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,em=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,im=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,om=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,lm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,um=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,gm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_m=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,vm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ym=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Em=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Am=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Cm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Um=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Im=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Nm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Om=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Bm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,zm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Vm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,km=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ym=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$m=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,jm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ng=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,og=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ag=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,cg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ug=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,pg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,vg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Mg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Tg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ag=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Lg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yt={alphahash_fragment:tp,alphahash_pars_fragment:ep,alphamap_fragment:np,alphamap_pars_fragment:ip,alphatest_fragment:sp,alphatest_pars_fragment:rp,aomap_fragment:op,aomap_pars_fragment:ap,batching_pars_vertex:cp,batching_vertex:lp,begin_vertex:hp,beginnormal_vertex:up,bsdfs:fp,iridescence_fragment:dp,bumpmap_pars_fragment:pp,clipping_planes_fragment:mp,clipping_planes_pars_fragment:gp,clipping_planes_pars_vertex:_p,clipping_planes_vertex:vp,color_fragment:xp,color_pars_fragment:Mp,color_pars_vertex:yp,color_vertex:Sp,common:Ep,cube_uv_reflection_fragment:Tp,defaultnormal_vertex:bp,displacementmap_pars_vertex:wp,displacementmap_vertex:Ap,emissivemap_fragment:Rp,emissivemap_pars_fragment:Cp,colorspace_fragment:Pp,colorspace_pars_fragment:Lp,envmap_fragment:Dp,envmap_common_pars_fragment:Up,envmap_pars_fragment:Ip,envmap_pars_vertex:Np,envmap_physical_pars_fragment:qp,envmap_vertex:Fp,fog_vertex:Op,fog_pars_vertex:Bp,fog_fragment:zp,fog_pars_fragment:Hp,gradientmap_pars_fragment:Vp,lightmap_pars_fragment:Gp,lights_lambert_fragment:kp,lights_lambert_pars_fragment:Wp,lights_pars_begin:Xp,lights_toon_fragment:Yp,lights_toon_pars_fragment:$p,lights_phong_fragment:Jp,lights_phong_pars_fragment:Zp,lights_physical_fragment:Kp,lights_physical_pars_fragment:jp,lights_fragment_begin:Qp,lights_fragment_maps:tm,lights_fragment_end:em,logdepthbuf_fragment:nm,logdepthbuf_pars_fragment:im,logdepthbuf_pars_vertex:sm,logdepthbuf_vertex:rm,map_fragment:om,map_pars_fragment:am,map_particle_fragment:cm,map_particle_pars_fragment:lm,metalnessmap_fragment:hm,metalnessmap_pars_fragment:um,morphinstance_vertex:fm,morphcolor_vertex:dm,morphnormal_vertex:pm,morphtarget_pars_vertex:mm,morphtarget_vertex:gm,normal_fragment_begin:_m,normal_fragment_maps:vm,normal_pars_fragment:xm,normal_pars_vertex:Mm,normal_vertex:ym,normalmap_pars_fragment:Sm,clearcoat_normal_fragment_begin:Em,clearcoat_normal_fragment_maps:Tm,clearcoat_pars_fragment:bm,iridescence_pars_fragment:wm,opaque_fragment:Am,packing:Rm,premultiplied_alpha_fragment:Cm,project_vertex:Pm,dithering_fragment:Lm,dithering_pars_fragment:Dm,roughnessmap_fragment:Um,roughnessmap_pars_fragment:Im,shadowmap_pars_fragment:Nm,shadowmap_pars_vertex:Fm,shadowmap_vertex:Om,shadowmask_pars_fragment:Bm,skinbase_vertex:zm,skinning_pars_vertex:Hm,skinning_vertex:Vm,skinnormal_vertex:Gm,specularmap_fragment:km,specularmap_pars_fragment:Wm,tonemapping_fragment:Xm,tonemapping_pars_fragment:qm,transmission_fragment:Ym,transmission_pars_fragment:$m,uv_pars_fragment:Jm,uv_pars_vertex:Zm,uv_vertex:Km,worldpos_vertex:jm,background_vert:Qm,background_frag:tg,backgroundCube_vert:eg,backgroundCube_frag:ng,cube_vert:ig,cube_frag:sg,depth_vert:rg,depth_frag:og,distanceRGBA_vert:ag,distanceRGBA_frag:cg,equirect_vert:lg,equirect_frag:hg,linedashed_vert:ug,linedashed_frag:fg,meshbasic_vert:dg,meshbasic_frag:pg,meshlambert_vert:mg,meshlambert_frag:gg,meshmatcap_vert:_g,meshmatcap_frag:vg,meshnormal_vert:xg,meshnormal_frag:Mg,meshphong_vert:yg,meshphong_frag:Sg,meshphysical_vert:Eg,meshphysical_frag:Tg,meshtoon_vert:bg,meshtoon_frag:wg,points_vert:Ag,points_frag:Rg,shadow_vert:Cg,shadow_frag:Pg,sprite_vert:Lg,sprite_frag:Dg},pt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},Mn={basic:{uniforms:ze([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:ze([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new $t(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:ze([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:ze([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:ze([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new $t(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:ze([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:ze([pt.points,pt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:ze([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:ze([pt.common,pt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:ze([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:ze([pt.sprite,pt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:ze([pt.common,pt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:ze([pt.lights,pt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Mn.physical={uniforms:ze([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const Ir={r:0,b:0,g:0},gi=new vn,Ug=new ce;function Ig(i,t,e,n,s,r,o){const a=new $t(0);let l=r===!0?0:1,c,h,u=null,p=0,d=null;function m(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?e:t).get(x)),x}function _(v){let x=!1;const R=m(v);R===null?f(a,l):R&&R.isColor&&(f(R,1),x=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,x){const R=m(x);R&&(R.isCubeTexture||R.mapping===ao)?(h===void 0&&(h=new Ut(new Xe(1,1,1),new Xn({name:"BackgroundCubeMaterial",uniforms:ds(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Ne,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,b,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),gi.copy(x.backgroundRotation),gi.x*=-1,gi.y*=-1,gi.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ug.makeRotationFromEuler(gi)),h.material.toneMapped=se.getTransfer(R.colorSpace)!==he,(u!==R||p!==R.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,p=R.version,d=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new Ut(new Ii(2,2),new Xn({name:"BackgroundMaterial",uniforms:ds(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=se.getTransfer(R.colorSpace)!==he,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||p!==R.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,p=R.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function f(v,x){v.getRGB(Ir,Eh(i)),n.buffers.color.setClear(Ir.r,Ir.g,Ir.b,x,o)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),l=x,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,f(a,l)},render:_,addToRenderList:g,dispose:T}}function Ng(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,o=!1;function a(S,D,O,z,k){let q=!1;const W=u(z,O,D);r!==W&&(r=W,c(r.object)),q=d(S,z,O,k),q&&m(S,z,O,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,x(S,D,O,z),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function u(S,D,O){const z=O.wireframe===!0;let k=n[S.id];k===void 0&&(k={},n[S.id]=k);let q=k[D.id];q===void 0&&(q={},k[D.id]=q);let W=q[z];return W===void 0&&(W=p(l()),q[z]=W),W}function p(S){const D=[],O=[],z=[];for(let k=0;k<e;k++)D[k]=0,O[k]=0,z[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:O,attributeDivisors:z,object:S,attributes:{},index:null}}function d(S,D,O,z){const k=r.attributes,q=D.attributes;let W=0;const et=O.getAttributes();for(const G in et)if(et[G].location>=0){const vt=k[G];let yt=q[G];if(yt===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(yt=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(yt=S.instanceColor)),vt===void 0||vt.attribute!==yt||yt&&vt.data!==yt.data)return!0;W++}return r.attributesNum!==W||r.index!==z}function m(S,D,O,z){const k={},q=D.attributes;let W=0;const et=O.getAttributes();for(const G in et)if(et[G].location>=0){let vt=q[G];vt===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(vt=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(vt=S.instanceColor));const yt={};yt.attribute=vt,vt&&vt.data&&(yt.data=vt.data),k[G]=yt,W++}r.attributes=k,r.attributesNum=W,r.index=z}function _(){const S=r.newAttributes;for(let D=0,O=S.length;D<O;D++)S[D]=0}function g(S){f(S,0)}function f(S,D){const O=r.newAttributes,z=r.enabledAttributes,k=r.attributeDivisors;O[S]=1,z[S]===0&&(i.enableVertexAttribArray(S),z[S]=1),k[S]!==D&&(i.vertexAttribDivisor(S,D),k[S]=D)}function T(){const S=r.newAttributes,D=r.enabledAttributes;for(let O=0,z=D.length;O<z;O++)D[O]!==S[O]&&(i.disableVertexAttribArray(O),D[O]=0)}function v(S,D,O,z,k,q,W){W===!0?i.vertexAttribIPointer(S,D,O,k,q):i.vertexAttribPointer(S,D,O,z,k,q)}function x(S,D,O,z){_();const k=z.attributes,q=O.getAttributes(),W=D.defaultAttributeValues;for(const et in q){const G=q[et];if(G.location>=0){let ut=k[et];if(ut===void 0&&(et==="instanceMatrix"&&S.instanceMatrix&&(ut=S.instanceMatrix),et==="instanceColor"&&S.instanceColor&&(ut=S.instanceColor)),ut!==void 0){const vt=ut.normalized,yt=ut.itemSize,Wt=t.get(ut);if(Wt===void 0)continue;const Qt=Wt.buffer,ae=Wt.type,ee=Wt.bytesPerElement,Y=ae===i.INT||ae===i.UNSIGNED_INT||ut.gpuType===rc;if(ut.isInterleavedBufferAttribute){const tt=ut.data,Mt=tt.stride,Pt=ut.offset;if(tt.isInstancedInterleavedBuffer){for(let Tt=0;Tt<G.locationSize;Tt++)f(G.location+Tt,tt.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Tt=0;Tt<G.locationSize;Tt++)g(G.location+Tt);i.bindBuffer(i.ARRAY_BUFFER,Qt);for(let Tt=0;Tt<G.locationSize;Tt++)v(G.location+Tt,yt/G.locationSize,ae,vt,Mt*ee,(Pt+yt/G.locationSize*Tt)*ee,Y)}else{if(ut.isInstancedBufferAttribute){for(let tt=0;tt<G.locationSize;tt++)f(G.location+tt,ut.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let tt=0;tt<G.locationSize;tt++)g(G.location+tt);i.bindBuffer(i.ARRAY_BUFFER,Qt);for(let tt=0;tt<G.locationSize;tt++)v(G.location+tt,yt/G.locationSize,ae,vt,yt*ee,yt/G.locationSize*tt*ee,Y)}}else if(W!==void 0){const vt=W[et];if(vt!==void 0)switch(vt.length){case 2:i.vertexAttrib2fv(G.location,vt);break;case 3:i.vertexAttrib3fv(G.location,vt);break;case 4:i.vertexAttrib4fv(G.location,vt);break;default:i.vertexAttrib1fv(G.location,vt)}}}}T()}function R(){P();for(const S in n){const D=n[S];for(const O in D){const z=D[O];for(const k in z)h(z[k].object),delete z[k];delete D[O]}delete n[S]}}function A(S){if(n[S.id]===void 0)return;const D=n[S.id];for(const O in D){const z=D[O];for(const k in z)h(z[k].object),delete z[k];delete D[O]}delete n[S.id]}function b(S){for(const D in n){const O=n[D];if(O[S.id]===void 0)continue;const z=O[S.id];for(const k in z)h(z[k].object),delete z[k];delete O[S.id]}}function P(){y(),o=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:y,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:b,initAttributes:_,enableAttribute:g,disableUnusedAttributes:T}}function Fg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let m=0;m<u;m++)d+=h[m];e.update(d,n,1)}function l(c,h,u,p){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<c.length;m++)o(c[m],h[m],p[m]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_]*p[_];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Og(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(b){return!(b!==_n&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(b){const P=b===nr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==An&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==En&&!P)}function l(b){if(b==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,p=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=m>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:T,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:R,maxSamples:A}}function Bg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new vi,a=new qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const d=u.length!==0||p||n!==0||s;return s=p,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){e=h(u,p,0)},this.setState=function(u,p,d){const m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,f=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const T=r?0:n,v=T*4;let x=f.clippingState||null;l.value=x,x=h(m,p,v,d);for(let R=0;R!==v;++R)x[R]=e[R];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,p,d,m){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const f=d+_*4,T=p.matrixWorldInverse;a.getNormalMatrix(T),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,x=d;v!==_;++v,x+=4)o.copy(u[v]).applyMatrix4(T,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function zg(i){let t=new WeakMap;function e(o,a){return a===da?o.mapping=hs:a===pa&&(o.mapping=us),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===da||a===pa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new id(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const is=4,Tl=[.125,.215,.35,.446,.526,.582],Si=20,Yo=new kh,bl=new $t;let $o=null,Jo=0,Zo=0,Ko=!1;const xi=(1+Math.sqrt(5))/2,Zi=1/xi,wl=[new C(-xi,Zi,0),new C(xi,Zi,0),new C(-Zi,0,xi),new C(Zi,0,xi),new C(0,xi,-Zi),new C(0,xi,Zi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],Hg=new C;class Ya{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=Hg}=r;$o=this._renderer.getRenderTarget(),Jo=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel(),Ko=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget($o,Jo,Zo),this._renderer.xr.enabled=Ko,t.scissorTest=!1,Nr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===hs||t.mapping===us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$o=this._renderer.getRenderTarget(),Jo=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel(),Ko=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:nr,format:_n,colorSpace:fs,depthBuffer:!1},s=Al(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Al(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Vg(r)),this._blurMaterial=Gg(r,t,e)}return s}_compileMaterial(t){const e=new Ut(this._lodPlanes[0],t);this._renderer.compile(e,Yo)}_sceneToCubeUV(t,e,n,s,r){const l=new Qe(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,d=u.toneMapping;u.getClearColor(bl),u.toneMapping=si,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const _=new Ri({name:"PMREM.Background",side:Ne,depthWrite:!1,depthTest:!1}),g=new Ut(new Xe,_);let f=!1;const T=t.background;T?T.isColor&&(_.color.copy(T),t.background=null,f=!0):(_.color.copy(bl),f=!0);for(let v=0;v<6;v++){const x=v%3;x===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):x===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));const R=this._cubeSize;Nr(s,x*R,v>2?R:0,R,R),u.setRenderTarget(s),f&&u.render(g,l),u.render(t,l)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=p,t.background=T}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===hs||t.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rl());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ut(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Nr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Yo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=wl[(s-r-1)%wl.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ut(this._lodPlanes[s],c),p=c.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Si-1),_=r/m,g=isFinite(r)?1+Math.floor(h*_):Si;g>Si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Si}`);const f=[];let T=0;for(let b=0;b<Si;++b){const P=b/_,y=Math.exp(-P*P/2);f.push(y),b===0?T+=y:b<g&&(T+=2*y)}for(let b=0;b<f.length;b++)f[b]=f[b]/T;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=f,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:v}=this;p.dTheta.value=m,p.mipInt.value=v-n;const x=this._sizeLods[s],R=3*x*(s>v-is?s-v+is:0),A=4*(this._cubeSize-x);Nr(e,R,A,3*x,2*x),l.setRenderTarget(e),l.render(u,Yo)}}function Vg(i){const t=[],e=[],n=[];let s=i;const r=i-is+1+Tl.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-is?l=Tl[o-i+is-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,p=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,_=3,g=2,f=1,T=new Float32Array(_*m*d),v=new Float32Array(g*m*d),x=new Float32Array(f*m*d);for(let A=0;A<d;A++){const b=A%3*2/3-1,P=A>2?0:-1,y=[b,P,0,b+2/3,P,0,b+2/3,P+1,0,b,P,0,b+2/3,P+1,0,b,P+1,0];T.set(y,_*m*A),v.set(p,g*m*A);const S=[A,A,A,A,A,A];x.set(S,f*m*A)}const R=new Ce;R.setAttribute("position",new ln(T,_)),R.setAttribute("uv",new ln(v,g)),R.setAttribute("faceIndex",new ln(x,f)),t.push(R),s>is&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Al(i,t,e){const n=new Ai(i,t,e);return n.texture.mapping=ao,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Nr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Gg(i,t,e){const n=new Float32Array(Si),s=new C(0,1,0);return new Xn({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ac(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Rl(){return new Xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ac(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Cl(){return new Xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ac(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Ac(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function kg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===da||l===pa,h=l===hs||l===us;if(c||h){let u=t.get(a);const p=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return e===null&&(e=new Ya(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return c&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new Ya(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Wg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ys("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Xg(i,t,e,n){const s={},r=new WeakMap;function o(u){const p=u.target;p.index!==null&&t.remove(p.index);for(const m in p.attributes)t.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete s[p.id];const d=r.get(p);d&&(t.remove(d),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function a(u,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,e.memory.geometries++),p}function l(u){const p=u.attributes;for(const d in p)t.update(p[d],i.ARRAY_BUFFER)}function c(u){const p=[],d=u.index,m=u.attributes.position;let _=0;if(d!==null){const T=d.array;_=d.version;for(let v=0,x=T.length;v<x;v+=3){const R=T[v+0],A=T[v+1],b=T[v+2];p.push(R,A,A,b,b,R)}}else if(m!==void 0){const T=m.array;_=m.version;for(let v=0,x=T.length/3-1;v<x;v+=3){const R=v+0,A=v+1,b=v+2;p.push(R,A,A,b,b,R)}}else return;const g=new(vh(p)?Sh:yh)(p,1);g.version=_;const f=r.get(u);f&&t.remove(f),r.set(u,g)}function h(u){const p=r.get(u);if(p){const d=u.index;d!==null&&p.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function qg(i,t,e){let n;function s(p){n=p}let r,o;function a(p){r=p.type,o=p.bytesPerElement}function l(p,d){i.drawElements(n,d,r,p*o),e.update(d,n,1)}function c(p,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,p*o,m),e.update(d,n,m))}function h(p,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,p,0,m);let g=0;for(let f=0;f<m;f++)g+=d[f];e.update(g,n,1)}function u(p,d,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<p.length;f++)c(p[f]/o,d[f],_[f]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,p,0,_,0,m);let f=0;for(let T=0;T<m;T++)f+=d[T]*_[T];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Yg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function $g(i,t,e){const n=new WeakMap,s=new ue;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let p=n.get(a);if(p===void 0||p.count!==u){let y=function(){b.dispose(),n.delete(a),a.removeEventListener("dispose",y)};p!==void 0&&p.texture.dispose();const d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let v=0;d===!0&&(v=1),m===!0&&(v=2),_===!0&&(v=3);let x=a.attributes.position.count*v,R=1;x>t.maxTextureSize&&(R=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const A=new Float32Array(x*R*4*u),b=new xh(A,x,R,u);b.type=En,b.needsUpdate=!0;const P=v*4;for(let S=0;S<u;S++){const D=g[S],O=f[S],z=T[S],k=x*R*4*S;for(let q=0;q<D.count;q++){const W=q*P;d===!0&&(s.fromBufferAttribute(D,q),A[k+W+0]=s.x,A[k+W+1]=s.y,A[k+W+2]=s.z,A[k+W+3]=0),m===!0&&(s.fromBufferAttribute(O,q),A[k+W+4]=s.x,A[k+W+5]=s.y,A[k+W+6]=s.z,A[k+W+7]=0),_===!0&&(s.fromBufferAttribute(z,q),A[k+W+8]=s.x,A[k+W+9]=s.y,A[k+W+10]=s.z,A[k+W+11]=z.itemSize===4?s.w:1)}}p={count:u,texture:b,size:new ot(x,R)},n.set(a,p),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const m=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function Jg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const Xh=new Fe,Pl=new Ch(1,1),qh=new xh,Yh=new Hf,$h=new bh,Ll=[],Dl=[],Ul=new Float32Array(16),Il=new Float32Array(9),Nl=new Float32Array(4);function Ms(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ll[s];if(r===void 0&&(r=new Float32Array(s),Ll[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Pe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function co(i,t){let e=Dl[t];e===void 0&&(e=new Int32Array(t),Dl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Zg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function t0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,n))return;Nl.set(n),i.uniformMatrix2fv(this.addr,!1,Nl),Le(e,n)}}function e0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,n))return;Il.set(n),i.uniformMatrix3fv(this.addr,!1,Il),Le(e,n)}}function n0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,n))return;Ul.set(n),i.uniformMatrix4fv(this.addr,!1,Ul),Le(e,n)}}function i0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function s0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function o0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function a0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function c0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function l0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function h0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function u0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Pl.compareFunction=gh,r=Pl):r=Xh,e.setTexture2D(t||r,s)}function f0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Yh,s)}function d0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||$h,s)}function p0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||qh,s)}function m0(i){switch(i){case 5126:return Zg;case 35664:return Kg;case 35665:return jg;case 35666:return Qg;case 35674:return t0;case 35675:return e0;case 35676:return n0;case 5124:case 35670:return i0;case 35667:case 35671:return s0;case 35668:case 35672:return r0;case 35669:case 35673:return o0;case 5125:return a0;case 36294:return c0;case 36295:return l0;case 36296:return h0;case 35678:case 36198:case 36298:case 36306:case 35682:return u0;case 35679:case 36299:case 36307:return f0;case 35680:case 36300:case 36308:case 36293:return d0;case 36289:case 36303:case 36311:case 36292:return p0}}function g0(i,t){i.uniform1fv(this.addr,t)}function _0(i,t){const e=Ms(t,this.size,2);i.uniform2fv(this.addr,e)}function v0(i,t){const e=Ms(t,this.size,3);i.uniform3fv(this.addr,e)}function x0(i,t){const e=Ms(t,this.size,4);i.uniform4fv(this.addr,e)}function M0(i,t){const e=Ms(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function y0(i,t){const e=Ms(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function S0(i,t){const e=Ms(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function E0(i,t){i.uniform1iv(this.addr,t)}function T0(i,t){i.uniform2iv(this.addr,t)}function b0(i,t){i.uniform3iv(this.addr,t)}function w0(i,t){i.uniform4iv(this.addr,t)}function A0(i,t){i.uniform1uiv(this.addr,t)}function R0(i,t){i.uniform2uiv(this.addr,t)}function C0(i,t){i.uniform3uiv(this.addr,t)}function P0(i,t){i.uniform4uiv(this.addr,t)}function L0(i,t,e){const n=this.cache,s=t.length,r=co(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Xh,r[o])}function D0(i,t,e){const n=this.cache,s=t.length,r=co(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Yh,r[o])}function U0(i,t,e){const n=this.cache,s=t.length,r=co(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||$h,r[o])}function I0(i,t,e){const n=this.cache,s=t.length,r=co(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||qh,r[o])}function N0(i){switch(i){case 5126:return g0;case 35664:return _0;case 35665:return v0;case 35666:return x0;case 35674:return M0;case 35675:return y0;case 35676:return S0;case 5124:case 35670:return E0;case 35667:case 35671:return T0;case 35668:case 35672:return b0;case 35669:case 35673:return w0;case 5125:return A0;case 36294:return R0;case 36295:return C0;case 36296:return P0;case 35678:case 36198:case 36298:case 36306:case 35682:return L0;case 35679:case 36299:case 36307:return D0;case 35680:case 36300:case 36308:case 36293:return U0;case 36289:case 36303:case 36311:case 36292:return I0}}class F0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=m0(e.type)}}class O0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=N0(e.type)}}class B0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const jo=/(\w+)(\])?(\[|\.)?/g;function Fl(i,t){i.seq.push(t),i.map[t.id]=t}function z0(i,t,e){const n=i.name,s=n.length;for(jo.lastIndex=0;;){const r=jo.exec(n),o=jo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Fl(e,c===void 0?new F0(a,i,t):new O0(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new B0(a),Fl(e,u)),e=u}}}class kr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);z0(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Ol(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const H0=37297;let V0=0;function G0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Bl=new qt;function k0(i){se._getMatrix(Bl,se.workingColorSpace,i);const t=`mat3( ${Bl.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(i)){case Yr:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function zl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+G0(i.getShaderSource(t),a)}else return r}function W0(i,t){const e=k0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function X0(i,t){let e;switch(t){case Qu:e="Linear";break;case tf:e="Reinhard";break;case ef:e="Cineon";break;case ah:e="ACESFilmic";break;case sf:e="AgX";break;case rf:e="Neutral";break;case nf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Fr=new C;function q0(){se.getLuminanceCoefficients(Fr);const i=Fr.x.toFixed(4),t=Fr.y.toFixed(4),e=Fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Y0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function $0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function J0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Us(i){return i!==""}function Hl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Z0=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(i){return i.replace(Z0,j0)}const K0=new Map;function j0(i,t){let e=Yt[t];if(e===void 0){const n=K0.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return $a(e)}const Q0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gl(i){return i.replace(Q0,t_)}function t_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function kl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function e_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===oh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Du?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function n_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case hs:case us:t="ENVMAP_TYPE_CUBE";break;case ao:t="ENVMAP_TYPE_CUBE_UV";break}return t}function i_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case us:t="ENVMAP_MODE_REFRACTION";break}return t}function s_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case sc:t="ENVMAP_BLENDING_MULTIPLY";break;case Ku:t="ENVMAP_BLENDING_MIX";break;case ju:t="ENVMAP_BLENDING_ADD";break}return t}function r_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function o_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=e_(e),c=n_(e),h=i_(e),u=s_(e),p=r_(e),d=Y0(e),m=$0(r),_=s.createProgram();let g,f,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Us).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Us).join(`
`),f.length>0&&(f+=`
`)):(g=[kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),f=[kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==si?"#define TONE_MAPPING":"",e.toneMapping!==si?Yt.tonemapping_pars_fragment:"",e.toneMapping!==si?X0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,W0("linearToOutputTexel",e.outputColorSpace),q0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Us).join(`
`)),o=$a(o),o=Hl(o,e),o=Vl(o,e),a=$a(a),a=Hl(a,e),a=Vl(a,e),o=Gl(o),a=Gl(a),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",e.glslVersion===kc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===kc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=T+g+o,x=T+f+a,R=Ol(s,s.VERTEX_SHADER,v),A=Ol(s,s.FRAGMENT_SHADER,x);s.attachShader(_,R),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function b(D){if(i.debug.checkShaderErrors){const O=s.getProgramInfoLog(_)||"",z=s.getShaderInfoLog(R)||"",k=s.getShaderInfoLog(A)||"",q=O.trim(),W=z.trim(),et=k.trim();let G=!0,ut=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,R,A);else{const vt=zl(s,R,"vertex"),yt=zl(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+q+`
`+vt+`
`+yt)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(W===""||et==="")&&(ut=!1);ut&&(D.diagnostics={runnable:G,programLog:q,vertexShader:{log:W,prefix:g},fragmentShader:{log:et,prefix:f}})}s.deleteShader(R),s.deleteShader(A),P=new kr(s,_),y=J0(s,_)}let P;this.getUniforms=function(){return P===void 0&&b(this),P};let y;this.getAttributes=function(){return y===void 0&&b(this),y};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,H0)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=V0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}let a_=0;class c_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new l_(t),e.set(t,n)),n}}class l_{constructor(t){this.id=a_++,this.code=t,this.usedTimes=0}}function h_(i,t,e,n,s,r,o){const a=new gc,l=new c_,c=new Set,h=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function g(y,S,D,O,z){const k=O.fog,q=z.geometry,W=y.isMeshStandardMaterial?O.environment:null,et=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),G=et&&et.mapping===ao?et.image.height:null,ut=m[y.type];y.precision!==null&&(d=s.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const vt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,yt=vt!==void 0?vt.length:0;let Wt=0;q.morphAttributes.position!==void 0&&(Wt=1),q.morphAttributes.normal!==void 0&&(Wt=2),q.morphAttributes.color!==void 0&&(Wt=3);let Qt,ae,ee,Y;if(ut){const re=Mn[ut];Qt=re.vertexShader,ae=re.fragmentShader}else Qt=y.vertexShader,ae=y.fragmentShader,l.update(y),ee=l.getVertexShaderID(y),Y=l.getFragmentShaderID(y);const tt=i.getRenderTarget(),Mt=i.state.buffers.depth.getReversed(),Pt=z.isInstancedMesh===!0,Tt=z.isBatchedMesh===!0,Kt=!!y.map,me=!!y.matcap,L=!!et,Q=!!y.aoMap,Z=!!y.lightMap,J=!!y.bumpMap,$=!!y.normalMap,lt=!!y.displacementMap,nt=!!y.emissiveMap,ht=!!y.metalnessMap,Vt=!!y.roughnessMap,zt=y.anisotropy>0,w=y.clearcoat>0,M=y.dispersion>0,F=y.iridescence>0,V=y.sheen>0,j=y.transmission>0,X=zt&&!!y.anisotropyMap,Rt=w&&!!y.clearcoatMap,ct=w&&!!y.clearcoatNormalMap,bt=w&&!!y.clearcoatRoughnessMap,wt=F&&!!y.iridescenceMap,it=F&&!!y.iridescenceThicknessMap,_t=V&&!!y.sheenColorMap,Ot=V&&!!y.sheenRoughnessMap,Ct=!!y.specularMap,mt=!!y.specularColorMap,Xt=!!y.specularIntensityMap,U=j&&!!y.transmissionMap,at=j&&!!y.thicknessMap,ft=!!y.gradientMap,St=!!y.alphaMap,st=y.alphaTest>0,K=!!y.alphaHash,At=!!y.extensions;let Gt=si;y.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Gt=i.toneMapping);const ge={shaderID:ut,shaderType:y.type,shaderName:y.name,vertexShader:Qt,fragmentShader:ae,defines:y.defines,customVertexShaderID:ee,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Tt,batchingColor:Tt&&z._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&z.instanceColor!==null,instancingMorph:Pt&&z.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:tt===null?i.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:fs,alphaToCoverage:!!y.alphaToCoverage,map:Kt,matcap:me,envMap:L,envMapMode:L&&et.mapping,envMapCubeUVHeight:G,aoMap:Q,lightMap:Z,bumpMap:J,normalMap:$,displacementMap:p&&lt,emissiveMap:nt,normalMapObjectSpace:$&&y.normalMapType===lf,normalMapTangentSpace:$&&y.normalMapType===fc,metalnessMap:ht,roughnessMap:Vt,anisotropy:zt,anisotropyMap:X,clearcoat:w,clearcoatMap:Rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:bt,dispersion:M,iridescence:F,iridescenceMap:wt,iridescenceThicknessMap:it,sheen:V,sheenColorMap:_t,sheenRoughnessMap:Ot,specularMap:Ct,specularColorMap:mt,specularIntensityMap:Xt,transmission:j,transmissionMap:U,thicknessMap:at,gradientMap:ft,opaque:y.transparent===!1&&y.blending===as&&y.alphaToCoverage===!1,alphaMap:St,alphaTest:st,alphaHash:K,combine:y.combine,mapUv:Kt&&_(y.map.channel),aoMapUv:Q&&_(y.aoMap.channel),lightMapUv:Z&&_(y.lightMap.channel),bumpMapUv:J&&_(y.bumpMap.channel),normalMapUv:$&&_(y.normalMap.channel),displacementMapUv:lt&&_(y.displacementMap.channel),emissiveMapUv:nt&&_(y.emissiveMap.channel),metalnessMapUv:ht&&_(y.metalnessMap.channel),roughnessMapUv:Vt&&_(y.roughnessMap.channel),anisotropyMapUv:X&&_(y.anisotropyMap.channel),clearcoatMapUv:Rt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:ct&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:bt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:it&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&_(y.sheenRoughnessMap.channel),specularMapUv:Ct&&_(y.specularMap.channel),specularColorMapUv:mt&&_(y.specularColorMap.channel),specularIntensityMapUv:Xt&&_(y.specularIntensityMap.channel),transmissionMapUv:U&&_(y.transmissionMap.channel),thicknessMapUv:at&&_(y.thicknessMap.channel),alphaMapUv:St&&_(y.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&($||zt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(Kt||St),fog:!!k,useFog:y.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Mt,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Wt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Gt,decodeVideoTexture:Kt&&y.map.isVideoTexture===!0&&se.getTransfer(y.map.colorSpace)===he,decodeVideoTextureEmissive:nt&&y.emissiveMap.isVideoTexture===!0&&se.getTransfer(y.emissiveMap.colorSpace)===he,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Sn,flipSided:y.side===Ne,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:At&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&y.extensions.multiDraw===!0||Tt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ge.vertexUv1s=c.has(1),ge.vertexUv2s=c.has(2),ge.vertexUv3s=c.has(3),c.clear(),ge}function f(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)S.push(D),S.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(T(S,y),v(S,y),S.push(i.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function T(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function v(y,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),y.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),y.push(a.mask)}function x(y){const S=m[y.type];let D;if(S){const O=Mn[S];D=Qf.clone(O.uniforms)}else D=y.uniforms;return D}function R(y,S){let D;for(let O=0,z=h.length;O<z;O++){const k=h[O];if(k.cacheKey===S){D=k,++D.usedTimes;break}}return D===void 0&&(D=new o_(i,S,y,r),h.push(D)),D}function A(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function b(y){l.remove(y)}function P(){l.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:x,acquireProgram:R,releaseProgram:A,releaseShaderCache:b,programs:h,dispose:P}}function u_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function f_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Wl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Xl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,p,d,m,_,g){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:p,material:d,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},i[t]=f):(f.id=u.id,f.object=u,f.geometry=p,f.material=d,f.groupOrder=m,f.renderOrder=u.renderOrder,f.z=_,f.group=g),t++,f}function a(u,p,d,m,_,g){const f=o(u,p,d,m,_,g);d.transmission>0?n.push(f):d.transparent===!0?s.push(f):e.push(f)}function l(u,p,d,m,_,g){const f=o(u,p,d,m,_,g);d.transmission>0?n.unshift(f):d.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,p){e.length>1&&e.sort(u||f_),n.length>1&&n.sort(p||Wl),s.length>1&&s.sort(p||Wl)}function h(){for(let u=t,p=i.length;u<p;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function d_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Xl,i.set(n,[o])):s>=r.length?(o=new Xl,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function p_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new $t};break;case"SpotLight":e={position:new C,direction:new C,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function m_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let g_=0;function __(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function v_(i){const t=new p_,e=m_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const s=new C,r=new ce,o=new ce;function a(c){let h=0,u=0,p=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let d=0,m=0,_=0,g=0,f=0,T=0,v=0,x=0,R=0,A=0,b=0;c.sort(__);for(let y=0,S=c.length;y<S;y++){const D=c[y],O=D.color,z=D.intensity,k=D.distance,q=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=O.r*z,u+=O.g*z,p+=O.b*z;else if(D.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(D.sh.coefficients[W],z);b++}else if(D.isDirectionalLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const et=D.shadow,G=e.get(D);G.shadowIntensity=et.intensity,G.shadowBias=et.bias,G.shadowNormalBias=et.normalBias,G.shadowRadius=et.radius,G.shadowMapSize=et.mapSize,n.directionalShadow[d]=G,n.directionalShadowMap[d]=q,n.directionalShadowMatrix[d]=D.shadow.matrix,T++}n.directional[d]=W,d++}else if(D.isSpotLight){const W=t.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(O).multiplyScalar(z),W.distance=k,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,n.spot[_]=W;const et=D.shadow;if(D.map&&(n.spotLightMap[R]=D.map,R++,et.updateMatrices(D),D.castShadow&&A++),n.spotLightMatrix[_]=et.matrix,D.castShadow){const G=e.get(D);G.shadowIntensity=et.intensity,G.shadowBias=et.bias,G.shadowNormalBias=et.normalBias,G.shadowRadius=et.radius,G.shadowMapSize=et.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=q,x++}_++}else if(D.isRectAreaLight){const W=t.get(D);W.color.copy(O).multiplyScalar(z),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),n.rectArea[g]=W,g++}else if(D.isPointLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const et=D.shadow,G=e.get(D);G.shadowIntensity=et.intensity,G.shadowBias=et.bias,G.shadowNormalBias=et.normalBias,G.shadowRadius=et.radius,G.shadowMapSize=et.mapSize,G.shadowCameraNear=et.camera.near,G.shadowCameraFar=et.camera.far,n.pointShadow[m]=G,n.pointShadowMap[m]=q,n.pointShadowMatrix[m]=D.shadow.matrix,v++}n.point[m]=W,m++}else if(D.isHemisphereLight){const W=t.get(D);W.skyColor.copy(D.color).multiplyScalar(z),W.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[f]=W,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pt.LTC_FLOAT_1,n.rectAreaLTC2=pt.LTC_FLOAT_2):(n.rectAreaLTC1=pt.LTC_HALF_1,n.rectAreaLTC2=pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=p;const P=n.hash;(P.directionalLength!==d||P.pointLength!==m||P.spotLength!==_||P.rectAreaLength!==g||P.hemiLength!==f||P.numDirectionalShadows!==T||P.numPointShadows!==v||P.numSpotShadows!==x||P.numSpotMaps!==R||P.numLightProbes!==b)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=b,P.directionalLength=d,P.pointLength=m,P.spotLength=_,P.rectAreaLength=g,P.hemiLength=f,P.numDirectionalShadows=T,P.numPointShadows=v,P.numSpotShadows=x,P.numSpotMaps=R,P.numLightProbes=b,n.version=g_++)}function l(c,h){let u=0,p=0,d=0,m=0,_=0;const g=h.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){const v=c[f];if(v.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(v.isSpotLight){const x=n.spot[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),d++}else if(v.isRectAreaLight){const x=n.rectArea[m];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),o.identity(),r.copy(v.matrixWorld),r.premultiply(g),o.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),m++}else if(v.isPointLight){const x=n.point[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(g),_++}}}return{setup:a,setupView:l,state:n}}function ql(i){const t=new v_(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function x_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ql(i),t.set(s,[a])):r>=o.length?(a=new ql(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const M_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,y_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function S_(i,t,e){let n=new vc;const s=new ot,r=new ot,o=new ue,a=new kd({depthPacking:cf}),l=new Wd,c={},h=e.maxTextureSize,u={[oi]:Ne,[Ne]:oi,[Sn]:Sn},p=new Xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:M_,fragmentShader:y_}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const m=new Ce;m.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ut(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oh;let f=this.type;this.render=function(A,b,P){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const y=i.getRenderTarget(),S=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),O=i.state;O.setBlending(ii),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const z=f!==Fn&&this.type===Fn,k=f===Fn&&this.type!==Fn;for(let q=0,W=A.length;q<W;q++){const et=A[q],G=et.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const ut=G.getFrameExtents();if(s.multiply(ut),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ut.x),s.x=r.x*ut.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ut.y),s.y=r.y*ut.y,G.mapSize.y=r.y)),G.map===null||z===!0||k===!0){const yt=this.type!==Fn?{minFilter:tn,magFilter:tn}:{};G.map!==null&&G.map.dispose(),G.map=new Ai(s.x,s.y,yt),G.map.texture.name=et.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const vt=G.getViewportCount();for(let yt=0;yt<vt;yt++){const Wt=G.getViewport(yt);o.set(r.x*Wt.x,r.y*Wt.y,r.x*Wt.z,r.y*Wt.w),O.viewport(o),G.updateMatrices(et,yt),n=G.getFrustum(),x(b,P,G.camera,et,this.type)}G.isPointLightShadow!==!0&&this.type===Fn&&T(G,P),G.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(y,S,D)};function T(A,b){const P=t.update(_);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Ai(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(b,null,P,p,_,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(b,null,P,d,_,null)}function v(A,b,P,y){let S=null;const D=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)S=D;else if(S=P.isPointLight===!0?l:a,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0||b.alphaToCoverage===!0){const O=S.uuid,z=b.uuid;let k=c[O];k===void 0&&(k={},c[O]=k);let q=k[z];q===void 0&&(q=S.clone(),k[z]=q,b.addEventListener("dispose",R)),S=q}if(S.visible=b.visible,S.wireframe=b.wireframe,y===Fn?S.side=b.shadowSide!==null?b.shadowSide:b.side:S.side=b.shadowSide!==null?b.shadowSide:u[b.side],S.alphaMap=b.alphaMap,S.alphaTest=b.alphaToCoverage===!0?.5:b.alphaTest,S.map=b.map,S.clipShadows=b.clipShadows,S.clippingPlanes=b.clippingPlanes,S.clipIntersection=b.clipIntersection,S.displacementMap=b.displacementMap,S.displacementScale=b.displacementScale,S.displacementBias=b.displacementBias,S.wireframeLinewidth=b.wireframeLinewidth,S.linewidth=b.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const O=i.properties.get(S);O.light=P}return S}function x(A,b,P,y,S){if(A.visible===!1)return;if(A.layers.test(b.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===Fn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const z=t.update(A),k=A.material;if(Array.isArray(k)){const q=z.groups;for(let W=0,et=q.length;W<et;W++){const G=q[W],ut=k[G.materialIndex];if(ut&&ut.visible){const vt=v(A,ut,y,S);A.onBeforeShadow(i,A,b,P,z,vt,G),i.renderBufferDirect(P,null,z,vt,A,G),A.onAfterShadow(i,A,b,P,z,vt,G)}}}else if(k.visible){const q=v(A,k,y,S);A.onBeforeShadow(i,A,b,P,z,q,null),i.renderBufferDirect(P,null,z,q,A,null),A.onAfterShadow(i,A,b,P,z,q,null)}}const O=A.children;for(let z=0,k=O.length;z<k;z++)x(O[z],b,P,y,S)}function R(A){A.target.removeEventListener("dispose",R);for(const P in c){const y=c[P],S=A.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}const E_={[oa]:aa,[ca]:ua,[la]:fa,[ls]:ha,[aa]:oa,[ua]:ca,[fa]:la,[ha]:ls};function T_(i,t){function e(){let U=!1;const at=new ue;let ft=null;const St=new ue(0,0,0,0);return{setMask:function(st){ft!==st&&!U&&(i.colorMask(st,st,st,st),ft=st)},setLocked:function(st){U=st},setClear:function(st,K,At,Gt,ge){ge===!0&&(st*=Gt,K*=Gt,At*=Gt),at.set(st,K,At,Gt),St.equals(at)===!1&&(i.clearColor(st,K,At,Gt),St.copy(at))},reset:function(){U=!1,ft=null,St.set(-1,0,0,0)}}}function n(){let U=!1,at=!1,ft=null,St=null,st=null;return{setReversed:function(K){if(at!==K){const At=t.get("EXT_clip_control");K?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),at=K;const Gt=st;st=null,this.setClear(Gt)}},getReversed:function(){return at},setTest:function(K){K?tt(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(K){ft!==K&&!U&&(i.depthMask(K),ft=K)},setFunc:function(K){if(at&&(K=E_[K]),St!==K){switch(K){case oa:i.depthFunc(i.NEVER);break;case aa:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case ls:i.depthFunc(i.LEQUAL);break;case la:i.depthFunc(i.EQUAL);break;case ha:i.depthFunc(i.GEQUAL);break;case ua:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}St=K}},setLocked:function(K){U=K},setClear:function(K){st!==K&&(at&&(K=1-K),i.clearDepth(K),st=K)},reset:function(){U=!1,ft=null,St=null,st=null,at=!1}}}function s(){let U=!1,at=null,ft=null,St=null,st=null,K=null,At=null,Gt=null,ge=null;return{setTest:function(re){U||(re?tt(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(re){at!==re&&!U&&(i.stencilMask(re),at=re)},setFunc:function(re,Pn,xn){(ft!==re||St!==Pn||st!==xn)&&(i.stencilFunc(re,Pn,xn),ft=re,St=Pn,st=xn)},setOp:function(re,Pn,xn){(K!==re||At!==Pn||Gt!==xn)&&(i.stencilOp(re,Pn,xn),K=re,At=Pn,Gt=xn)},setLocked:function(re){U=re},setClear:function(re){ge!==re&&(i.clearStencil(re),ge=re)},reset:function(){U=!1,at=null,ft=null,St=null,st=null,K=null,At=null,Gt=null,ge=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},u={},p=new WeakMap,d=[],m=null,_=!1,g=null,f=null,T=null,v=null,x=null,R=null,A=null,b=new $t(0,0,0),P=0,y=!1,S=null,D=null,O=null,z=null,k=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,et=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(G)[1]),W=et>=1):G.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),W=et>=2);let ut=null,vt={};const yt=i.getParameter(i.SCISSOR_BOX),Wt=i.getParameter(i.VIEWPORT),Qt=new ue().fromArray(yt),ae=new ue().fromArray(Wt);function ee(U,at,ft,St){const st=new Uint8Array(4),K=i.createTexture();i.bindTexture(U,K),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let At=0;At<ft;At++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(at,0,i.RGBA,1,1,St,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(at+At,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return K}const Y={};Y[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),tt(i.DEPTH_TEST),o.setFunc(ls),J(!1),$(Oc),tt(i.CULL_FACE),Q(ii);function tt(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function Mt(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Pt(U,at){return u[U]!==at?(i.bindFramebuffer(U,at),u[U]=at,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=at),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=at),!0):!1}function Tt(U,at){let ft=d,St=!1;if(U){ft=p.get(at),ft===void 0&&(ft=[],p.set(at,ft));const st=U.textures;if(ft.length!==st.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let K=0,At=st.length;K<At;K++)ft[K]=i.COLOR_ATTACHMENT0+K;ft.length=st.length,St=!0}}else ft[0]!==i.BACK&&(ft[0]=i.BACK,St=!0);St&&i.drawBuffers(ft)}function Kt(U){return m!==U?(i.useProgram(U),m=U,!0):!1}const me={[yi]:i.FUNC_ADD,[Iu]:i.FUNC_SUBTRACT,[Nu]:i.FUNC_REVERSE_SUBTRACT};me[Fu]=i.MIN,me[Ou]=i.MAX;const L={[Bu]:i.ZERO,[zu]:i.ONE,[Hu]:i.SRC_COLOR,[sa]:i.SRC_ALPHA,[qu]:i.SRC_ALPHA_SATURATE,[Wu]:i.DST_COLOR,[Gu]:i.DST_ALPHA,[Vu]:i.ONE_MINUS_SRC_COLOR,[ra]:i.ONE_MINUS_SRC_ALPHA,[Xu]:i.ONE_MINUS_DST_COLOR,[ku]:i.ONE_MINUS_DST_ALPHA,[Yu]:i.CONSTANT_COLOR,[$u]:i.ONE_MINUS_CONSTANT_COLOR,[Ju]:i.CONSTANT_ALPHA,[Zu]:i.ONE_MINUS_CONSTANT_ALPHA};function Q(U,at,ft,St,st,K,At,Gt,ge,re){if(U===ii){_===!0&&(Mt(i.BLEND),_=!1);return}if(_===!1&&(tt(i.BLEND),_=!0),U!==Uu){if(U!==g||re!==y){if((f!==yi||x!==yi)&&(i.blendEquation(i.FUNC_ADD),f=yi,x=yi),re)switch(U){case as:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bc:i.blendFunc(i.ONE,i.ONE);break;case zc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Hc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case as:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case zc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Hc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}T=null,v=null,R=null,A=null,b.set(0,0,0),P=0,g=U,y=re}return}st=st||at,K=K||ft,At=At||St,(at!==f||st!==x)&&(i.blendEquationSeparate(me[at],me[st]),f=at,x=st),(ft!==T||St!==v||K!==R||At!==A)&&(i.blendFuncSeparate(L[ft],L[St],L[K],L[At]),T=ft,v=St,R=K,A=At),(Gt.equals(b)===!1||ge!==P)&&(i.blendColor(Gt.r,Gt.g,Gt.b,ge),b.copy(Gt),P=ge),g=U,y=!1}function Z(U,at){U.side===Sn?Mt(i.CULL_FACE):tt(i.CULL_FACE);let ft=U.side===Ne;at&&(ft=!ft),J(ft),U.blending===as&&U.transparent===!1?Q(ii):Q(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);const St=U.stencilWrite;a.setTest(St),St&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),nt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?tt(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function J(U){S!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),S=U)}function $(U){U!==Pu?(tt(i.CULL_FACE),U!==D&&(U===Oc?i.cullFace(i.BACK):U===Lu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),D=U}function lt(U){U!==O&&(W&&i.lineWidth(U),O=U)}function nt(U,at,ft){U?(tt(i.POLYGON_OFFSET_FILL),(z!==at||k!==ft)&&(i.polygonOffset(at,ft),z=at,k=ft)):Mt(i.POLYGON_OFFSET_FILL)}function ht(U){U?tt(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function Vt(U){U===void 0&&(U=i.TEXTURE0+q-1),ut!==U&&(i.activeTexture(U),ut=U)}function zt(U,at,ft){ft===void 0&&(ut===null?ft=i.TEXTURE0+q-1:ft=ut);let St=vt[ft];St===void 0&&(St={type:void 0,texture:void 0},vt[ft]=St),(St.type!==U||St.texture!==at)&&(ut!==ft&&(i.activeTexture(ft),ut=ft),i.bindTexture(U,at||Y[U]),St.type=U,St.texture=at)}function w(){const U=vt[ut];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function M(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function F(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function V(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Rt(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ct(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function bt(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function wt(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function it(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _t(U){Qt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Qt.copy(U))}function Ot(U){ae.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),ae.copy(U))}function Ct(U,at){let ft=c.get(at);ft===void 0&&(ft=new WeakMap,c.set(at,ft));let St=ft.get(U);St===void 0&&(St=i.getUniformBlockIndex(at,U.name),ft.set(U,St))}function mt(U,at){const St=c.get(at).get(U);l.get(at)!==St&&(i.uniformBlockBinding(at,St,U.__bindingPointIndex),l.set(at,St))}function Xt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ut=null,vt={},u={},p=new WeakMap,d=[],m=null,_=!1,g=null,f=null,T=null,v=null,x=null,R=null,A=null,b=new $t(0,0,0),P=0,y=!1,S=null,D=null,O=null,z=null,k=null,Qt.set(0,0,i.canvas.width,i.canvas.height),ae.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:tt,disable:Mt,bindFramebuffer:Pt,drawBuffers:Tt,useProgram:Kt,setBlending:Q,setMaterial:Z,setFlipSided:J,setCullFace:$,setLineWidth:lt,setPolygonOffset:nt,setScissorTest:ht,activeTexture:Vt,bindTexture:zt,unbindTexture:w,compressedTexImage2D:M,compressedTexImage3D:F,texImage2D:wt,texImage3D:it,updateUBOMapping:Ct,uniformBlockBinding:mt,texStorage2D:ct,texStorage3D:bt,texSubImage2D:V,texSubImage3D:j,compressedTexSubImage2D:X,compressedTexSubImage3D:Rt,scissor:_t,viewport:Ot,reset:Xt}}function b_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap;let u;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(w,M){return d?new OffscreenCanvas(w,M):Jr("canvas")}function _(w,M,F){let V=1;const j=zt(w);if((j.width>F||j.height>F)&&(V=F/Math.max(j.width,j.height)),V<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const X=Math.floor(V*j.width),Rt=Math.floor(V*j.height);u===void 0&&(u=m(X,Rt));const ct=M?m(X,Rt):u;return ct.width=X,ct.height=Rt,ct.getContext("2d").drawImage(w,0,0,X,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+X+"x"+Rt+")."),ct}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function g(w){return w.generateMipmaps}function f(w){i.generateMipmap(w)}function T(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,M,F,V,j=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let X=M;if(M===i.RED&&(F===i.FLOAT&&(X=i.R32F),F===i.HALF_FLOAT&&(X=i.R16F),F===i.UNSIGNED_BYTE&&(X=i.R8)),M===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.R8UI),F===i.UNSIGNED_SHORT&&(X=i.R16UI),F===i.UNSIGNED_INT&&(X=i.R32UI),F===i.BYTE&&(X=i.R8I),F===i.SHORT&&(X=i.R16I),F===i.INT&&(X=i.R32I)),M===i.RG&&(F===i.FLOAT&&(X=i.RG32F),F===i.HALF_FLOAT&&(X=i.RG16F),F===i.UNSIGNED_BYTE&&(X=i.RG8)),M===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RG8UI),F===i.UNSIGNED_SHORT&&(X=i.RG16UI),F===i.UNSIGNED_INT&&(X=i.RG32UI),F===i.BYTE&&(X=i.RG8I),F===i.SHORT&&(X=i.RG16I),F===i.INT&&(X=i.RG32I)),M===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGB8UI),F===i.UNSIGNED_SHORT&&(X=i.RGB16UI),F===i.UNSIGNED_INT&&(X=i.RGB32UI),F===i.BYTE&&(X=i.RGB8I),F===i.SHORT&&(X=i.RGB16I),F===i.INT&&(X=i.RGB32I)),M===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),F===i.UNSIGNED_INT&&(X=i.RGBA32UI),F===i.BYTE&&(X=i.RGBA8I),F===i.SHORT&&(X=i.RGBA16I),F===i.INT&&(X=i.RGBA32I)),M===i.RGB&&(F===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),F===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),M===i.RGBA){const Rt=j?Yr:se.getTransfer(V);F===i.FLOAT&&(X=i.RGBA32F),F===i.HALF_FLOAT&&(X=i.RGBA16F),F===i.UNSIGNED_BYTE&&(X=Rt===he?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function x(w,M){let F;return w?M===null||M===wi||M===ks?F=i.DEPTH24_STENCIL8:M===En?F=i.DEPTH32F_STENCIL8:M===Gs&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===wi||M===ks?F=i.DEPTH_COMPONENT24:M===En?F=i.DEPTH_COMPONENT32F:M===Gs&&(F=i.DEPTH_COMPONENT16),F}function R(w,M){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==tn&&w.minFilter!==gn?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function A(w){const M=w.target;M.removeEventListener("dispose",A),P(M),M.isVideoTexture&&h.delete(M)}function b(w){const M=w.target;M.removeEventListener("dispose",b),S(M)}function P(w){const M=n.get(w);if(M.__webglInit===void 0)return;const F=w.source,V=p.get(F);if(V){const j=V[M.__cacheKey];j.usedTimes--,j.usedTimes===0&&y(w),Object.keys(V).length===0&&p.delete(F)}n.remove(w)}function y(w){const M=n.get(w);i.deleteTexture(M.__webglTexture);const F=w.source,V=p.get(F);delete V[M.__cacheKey],o.memory.textures--}function S(w){const M=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(M.__webglFramebuffer[V]))for(let j=0;j<M.__webglFramebuffer[V].length;j++)i.deleteFramebuffer(M.__webglFramebuffer[V][j]);else i.deleteFramebuffer(M.__webglFramebuffer[V]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[V])}else{if(Array.isArray(M.__webglFramebuffer))for(let V=0;V<M.__webglFramebuffer.length;V++)i.deleteFramebuffer(M.__webglFramebuffer[V]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let V=0;V<M.__webglColorRenderbuffer.length;V++)M.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[V]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const F=w.textures;for(let V=0,j=F.length;V<j;V++){const X=n.get(F[V]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),o.memory.textures--),n.remove(F[V])}n.remove(w)}let D=0;function O(){D=0}function z(){const w=D;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),D+=1,w}function k(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function q(w,M){const F=n.get(w);if(w.isVideoTexture&&ht(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&F.__version!==w.version){const V=w.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(F,w,M);return}}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+M)}function W(w,M){const F=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){Y(F,w,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+M)}function et(w,M){const F=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){Y(F,w,M);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+M)}function G(w,M){const F=n.get(w);if(w.version>0&&F.__version!==w.version){tt(F,w,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+M)}const ut={[qr]:i.REPEAT,[Ei]:i.CLAMP_TO_EDGE,[ma]:i.MIRRORED_REPEAT},vt={[tn]:i.NEAREST,[of]:i.NEAREST_MIPMAP_NEAREST,[hr]:i.NEAREST_MIPMAP_LINEAR,[gn]:i.LINEAR,[vo]:i.LINEAR_MIPMAP_NEAREST,[ni]:i.LINEAR_MIPMAP_LINEAR},yt={[hf]:i.NEVER,[gf]:i.ALWAYS,[uf]:i.LESS,[gh]:i.LEQUAL,[ff]:i.EQUAL,[mf]:i.GEQUAL,[df]:i.GREATER,[pf]:i.NOTEQUAL};function Wt(w,M){if(M.type===En&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===gn||M.magFilter===vo||M.magFilter===hr||M.magFilter===ni||M.minFilter===gn||M.minFilter===vo||M.minFilter===hr||M.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,ut[M.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,ut[M.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,ut[M.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,vt[M.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,vt[M.minFilter]),M.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,yt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===tn||M.minFilter!==hr&&M.minFilter!==ni||M.type===En&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Qt(w,M){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",A));const V=M.source;let j=p.get(V);j===void 0&&(j={},p.set(V,j));const X=k(M);if(X!==w.__cacheKey){j[X]===void 0&&(j[X]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),j[X].usedTimes++;const Rt=j[w.__cacheKey];Rt!==void 0&&(j[w.__cacheKey].usedTimes--,Rt.usedTimes===0&&y(M)),w.__cacheKey=X,w.__webglTexture=j[X].texture}return F}function ae(w,M,F){return Math.floor(Math.floor(w/F)/M)}function ee(w,M,F,V){const X=w.updateRanges;if(X.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,F,V,M.data);else{X.sort((it,_t)=>it.start-_t.start);let Rt=0;for(let it=1;it<X.length;it++){const _t=X[Rt],Ot=X[it],Ct=_t.start+_t.count,mt=ae(Ot.start,M.width,4),Xt=ae(_t.start,M.width,4);Ot.start<=Ct+1&&mt===Xt&&ae(Ot.start+Ot.count-1,M.width,4)===mt?_t.count=Math.max(_t.count,Ot.start+Ot.count-_t.start):(++Rt,X[Rt]=Ot)}X.length=Rt+1;const ct=i.getParameter(i.UNPACK_ROW_LENGTH),bt=i.getParameter(i.UNPACK_SKIP_PIXELS),wt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let it=0,_t=X.length;it<_t;it++){const Ot=X[it],Ct=Math.floor(Ot.start/4),mt=Math.ceil(Ot.count/4),Xt=Ct%M.width,U=Math.floor(Ct/M.width),at=mt,ft=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xt),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),e.texSubImage2D(i.TEXTURE_2D,0,Xt,U,at,ft,F,V,M.data)}w.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,bt),i.pixelStorei(i.UNPACK_SKIP_ROWS,wt)}}function Y(w,M,F){let V=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(V=i.TEXTURE_3D);const j=Qt(w,M),X=M.source;e.bindTexture(V,w.__webglTexture,i.TEXTURE0+F);const Rt=n.get(X);if(X.version!==Rt.__version||j===!0){e.activeTexture(i.TEXTURE0+F);const ct=se.getPrimaries(se.workingColorSpace),bt=M.colorSpace===Hn?null:se.getPrimaries(M.colorSpace),wt=M.colorSpace===Hn||ct===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);let it=_(M.image,!1,s.maxTextureSize);it=Vt(M,it);const _t=r.convert(M.format,M.colorSpace),Ot=r.convert(M.type);let Ct=v(M.internalFormat,_t,Ot,M.colorSpace,M.isVideoTexture);Wt(V,M);let mt;const Xt=M.mipmaps,U=M.isVideoTexture!==!0,at=Rt.__version===void 0||j===!0,ft=X.dataReady,St=R(M,it);if(M.isDepthTexture)Ct=x(M.format===Xs,M.type),at&&(U?e.texStorage2D(i.TEXTURE_2D,1,Ct,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Ct,it.width,it.height,0,_t,Ot,null));else if(M.isDataTexture)if(Xt.length>0){U&&at&&e.texStorage2D(i.TEXTURE_2D,St,Ct,Xt[0].width,Xt[0].height);for(let st=0,K=Xt.length;st<K;st++)mt=Xt[st],U?ft&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,mt.width,mt.height,_t,Ot,mt.data):e.texImage2D(i.TEXTURE_2D,st,Ct,mt.width,mt.height,0,_t,Ot,mt.data);M.generateMipmaps=!1}else U?(at&&e.texStorage2D(i.TEXTURE_2D,St,Ct,it.width,it.height),ft&&ee(M,it,_t,Ot)):e.texImage2D(i.TEXTURE_2D,0,Ct,it.width,it.height,0,_t,Ot,it.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){U&&at&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,Ct,Xt[0].width,Xt[0].height,it.depth);for(let st=0,K=Xt.length;st<K;st++)if(mt=Xt[st],M.format!==_n)if(_t!==null)if(U){if(ft)if(M.layerUpdates.size>0){const At=El(mt.width,mt.height,M.format,M.type);for(const Gt of M.layerUpdates){const ge=mt.data.subarray(Gt*At/mt.data.BYTES_PER_ELEMENT,(Gt+1)*At/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,Gt,mt.width,mt.height,1,_t,ge)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,mt.width,mt.height,it.depth,_t,mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,st,Ct,mt.width,mt.height,it.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ft&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,mt.width,mt.height,it.depth,_t,Ot,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,st,Ct,mt.width,mt.height,it.depth,0,_t,Ot,mt.data)}else{U&&at&&e.texStorage2D(i.TEXTURE_2D,St,Ct,Xt[0].width,Xt[0].height);for(let st=0,K=Xt.length;st<K;st++)mt=Xt[st],M.format!==_n?_t!==null?U?ft&&e.compressedTexSubImage2D(i.TEXTURE_2D,st,0,0,mt.width,mt.height,_t,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,st,Ct,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ft&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,mt.width,mt.height,_t,Ot,mt.data):e.texImage2D(i.TEXTURE_2D,st,Ct,mt.width,mt.height,0,_t,Ot,mt.data)}else if(M.isDataArrayTexture)if(U){if(at&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,Ct,it.width,it.height,it.depth),ft)if(M.layerUpdates.size>0){const st=El(it.width,it.height,M.format,M.type);for(const K of M.layerUpdates){const At=it.data.subarray(K*st/it.data.BYTES_PER_ELEMENT,(K+1)*st/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,it.width,it.height,1,_t,Ot,At)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,_t,Ot,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ct,it.width,it.height,it.depth,0,_t,Ot,it.data);else if(M.isData3DTexture)U?(at&&e.texStorage3D(i.TEXTURE_3D,St,Ct,it.width,it.height,it.depth),ft&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,_t,Ot,it.data)):e.texImage3D(i.TEXTURE_3D,0,Ct,it.width,it.height,it.depth,0,_t,Ot,it.data);else if(M.isFramebufferTexture){if(at)if(U)e.texStorage2D(i.TEXTURE_2D,St,Ct,it.width,it.height);else{let st=it.width,K=it.height;for(let At=0;At<St;At++)e.texImage2D(i.TEXTURE_2D,At,Ct,st,K,0,_t,Ot,null),st>>=1,K>>=1}}else if(Xt.length>0){if(U&&at){const st=zt(Xt[0]);e.texStorage2D(i.TEXTURE_2D,St,Ct,st.width,st.height)}for(let st=0,K=Xt.length;st<K;st++)mt=Xt[st],U?ft&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,_t,Ot,mt):e.texImage2D(i.TEXTURE_2D,st,Ct,_t,Ot,mt);M.generateMipmaps=!1}else if(U){if(at){const st=zt(it);e.texStorage2D(i.TEXTURE_2D,St,Ct,st.width,st.height)}ft&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,_t,Ot,it)}else e.texImage2D(i.TEXTURE_2D,0,Ct,_t,Ot,it);g(M)&&f(V),Rt.__version=X.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function tt(w,M,F){if(M.image.length!==6)return;const V=Qt(w,M),j=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+F);const X=n.get(j);if(j.version!==X.__version||V===!0){e.activeTexture(i.TEXTURE0+F);const Rt=se.getPrimaries(se.workingColorSpace),ct=M.colorSpace===Hn?null:se.getPrimaries(M.colorSpace),bt=M.colorSpace===Hn||Rt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const wt=M.isCompressedTexture||M.image[0].isCompressedTexture,it=M.image[0]&&M.image[0].isDataTexture,_t=[];for(let K=0;K<6;K++)!wt&&!it?_t[K]=_(M.image[K],!0,s.maxCubemapSize):_t[K]=it?M.image[K].image:M.image[K],_t[K]=Vt(M,_t[K]);const Ot=_t[0],Ct=r.convert(M.format,M.colorSpace),mt=r.convert(M.type),Xt=v(M.internalFormat,Ct,mt,M.colorSpace),U=M.isVideoTexture!==!0,at=X.__version===void 0||V===!0,ft=j.dataReady;let St=R(M,Ot);Wt(i.TEXTURE_CUBE_MAP,M);let st;if(wt){U&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,St,Xt,Ot.width,Ot.height);for(let K=0;K<6;K++){st=_t[K].mipmaps;for(let At=0;At<st.length;At++){const Gt=st[At];M.format!==_n?Ct!==null?U?ft&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,0,0,Gt.width,Gt.height,Ct,Gt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,Xt,Gt.width,Gt.height,0,Gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,0,0,Gt.width,Gt.height,Ct,mt,Gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,Xt,Gt.width,Gt.height,0,Ct,mt,Gt.data)}}}else{if(st=M.mipmaps,U&&at){st.length>0&&St++;const K=zt(_t[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,St,Xt,K.width,K.height)}for(let K=0;K<6;K++)if(it){U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,_t[K].width,_t[K].height,Ct,mt,_t[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Xt,_t[K].width,_t[K].height,0,Ct,mt,_t[K].data);for(let At=0;At<st.length;At++){const ge=st[At].image[K].image;U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,0,0,ge.width,ge.height,Ct,mt,ge.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,Xt,ge.width,ge.height,0,Ct,mt,ge.data)}}else{U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ct,mt,_t[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Xt,Ct,mt,_t[K]);for(let At=0;At<st.length;At++){const Gt=st[At];U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,0,0,Ct,mt,Gt.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,Xt,Ct,mt,Gt.image[K])}}}g(M)&&f(i.TEXTURE_CUBE_MAP),X.__version=j.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function Mt(w,M,F,V,j,X){const Rt=r.convert(F.format,F.colorSpace),ct=r.convert(F.type),bt=v(F.internalFormat,Rt,ct,F.colorSpace),wt=n.get(M),it=n.get(F);if(it.__renderTarget=M,!wt.__hasExternalTextures){const _t=Math.max(1,M.width>>X),Ot=Math.max(1,M.height>>X);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?e.texImage3D(j,X,bt,_t,Ot,M.depth,0,Rt,ct,null):e.texImage2D(j,X,bt,_t,Ot,0,Rt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),nt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,j,it.__webglTexture,0,lt(M)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,j,it.__webglTexture,X),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Pt(w,M,F){if(i.bindRenderbuffer(i.RENDERBUFFER,w),M.depthBuffer){const V=M.depthTexture,j=V&&V.isDepthTexture?V.type:null,X=x(M.stencilBuffer,j),Rt=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=lt(M);nt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,X,M.width,M.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,X,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,X,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Rt,i.RENDERBUFFER,w)}else{const V=M.textures;for(let j=0;j<V.length;j++){const X=V[j],Rt=r.convert(X.format,X.colorSpace),ct=r.convert(X.type),bt=v(X.internalFormat,Rt,ct,X.colorSpace),wt=lt(M);F&&nt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,bt,M.width,M.height):nt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt,bt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,bt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(M.depthTexture);V.__renderTarget=M,(!V.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),q(M.depthTexture,0);const j=V.__webglTexture,X=lt(M);if(M.depthTexture.format===Ws)nt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(M.depthTexture.format===Xs)nt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Kt(w){const M=n.get(w),F=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const V=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),V){const j=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,V.removeEventListener("dispose",j)};V.addEventListener("dispose",j),M.__depthDisposeCallback=j}M.__boundDepthTexture=V}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const V=w.texture.mipmaps;V&&V.length>0?Tt(M.__webglFramebuffer[0],w):Tt(M.__webglFramebuffer,w)}else if(F){M.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[V]),M.__webglDepthbuffer[V]===void 0)M.__webglDepthbuffer[V]=i.createRenderbuffer(),Pt(M.__webglDepthbuffer[V],w,!1);else{const j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=M.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,X)}}else{const V=w.texture.mipmaps;if(V&&V.length>0?e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),Pt(M.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,X)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function me(w,M,F){const V=n.get(w);M!==void 0&&Mt(V.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Kt(w)}function L(w){const M=w.texture,F=n.get(w),V=n.get(M);w.addEventListener("dispose",b);const j=w.textures,X=w.isWebGLCubeRenderTarget===!0,Rt=j.length>1;if(Rt||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=M.version,o.memory.textures++),X){F.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer[ct]=[];for(let bt=0;bt<M.mipmaps.length;bt++)F.__webglFramebuffer[ct][bt]=i.createFramebuffer()}else F.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer=[];for(let ct=0;ct<M.mipmaps.length;ct++)F.__webglFramebuffer[ct]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Rt)for(let ct=0,bt=j.length;ct<bt;ct++){const wt=n.get(j[ct]);wt.__webglTexture===void 0&&(wt.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&nt(w)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ct=0;ct<j.length;ct++){const bt=j[ct];F.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ct]);const wt=r.convert(bt.format,bt.colorSpace),it=r.convert(bt.type),_t=v(bt.internalFormat,wt,it,bt.colorSpace,w.isXRRenderTarget===!0),Ot=lt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ot,_t,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,F.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Pt(F.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,M);for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0)for(let bt=0;bt<M.mipmaps.length;bt++)Mt(F.__webglFramebuffer[ct][bt],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt);else Mt(F.__webglFramebuffer[ct],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);g(M)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let ct=0,bt=j.length;ct<bt;ct++){const wt=j[ct],it=n.get(wt);let _t=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_t=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(_t,it.__webglTexture),Wt(_t,wt),Mt(F.__webglFramebuffer,w,wt,i.COLOR_ATTACHMENT0+ct,_t,0),g(wt)&&f(_t)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ct=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,V.__webglTexture),Wt(ct,M),M.mipmaps&&M.mipmaps.length>0)for(let bt=0;bt<M.mipmaps.length;bt++)Mt(F.__webglFramebuffer[bt],w,M,i.COLOR_ATTACHMENT0,ct,bt);else Mt(F.__webglFramebuffer,w,M,i.COLOR_ATTACHMENT0,ct,0);g(M)&&f(ct),e.unbindTexture()}w.depthBuffer&&Kt(w)}function Q(w){const M=w.textures;for(let F=0,V=M.length;F<V;F++){const j=M[F];if(g(j)){const X=T(w),Rt=n.get(j).__webglTexture;e.bindTexture(X,Rt),f(X),e.unbindTexture()}}}const Z=[],J=[];function $(w){if(w.samples>0){if(nt(w)===!1){const M=w.textures,F=w.width,V=w.height;let j=i.COLOR_BUFFER_BIT;const X=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Rt=n.get(w),ct=M.length>1;if(ct)for(let wt=0;wt<M.length;wt++)e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);const bt=w.texture.mipmaps;bt&&bt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let wt=0;wt<M.length;wt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[wt]);const it=n.get(M[wt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,it,0)}i.blitFramebuffer(0,0,F,V,0,0,F,V,j,i.NEAREST),l===!0&&(Z.length=0,J.length=0,Z.push(i.COLOR_ATTACHMENT0+wt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Z.push(X),J.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,J)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Z))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let wt=0;wt<M.length;wt++){e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[wt]);const it=n.get(M[wt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,it,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const M=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function lt(w){return Math.min(s.maxSamples,w.samples)}function nt(w){const M=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ht(w){const M=o.render.frame;h.get(w)!==M&&(h.set(w,M),w.update())}function Vt(w,M){const F=w.colorSpace,V=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==fs&&F!==Hn&&(se.getTransfer(F)===he?(V!==_n||j!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),M}function zt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=O,this.setTexture2D=q,this.setTexture2DArray=W,this.setTexture3D=et,this.setTextureCube=G,this.rebindTextures=me,this.setupRenderTarget=L,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=$,this.setupDepthRenderbuffer=Kt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=nt}function w_(i,t){function e(n,s=Hn){let r;const o=se.getTransfer(s);if(n===An)return i.UNSIGNED_BYTE;if(n===oc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ac)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lh)return i.BYTE;if(n===hh)return i.SHORT;if(n===Gs)return i.UNSIGNED_SHORT;if(n===rc)return i.INT;if(n===wi)return i.UNSIGNED_INT;if(n===En)return i.FLOAT;if(n===nr)return i.HALF_FLOAT;if(n===dh)return i.ALPHA;if(n===ph)return i.RGB;if(n===_n)return i.RGBA;if(n===Ws)return i.DEPTH_COMPONENT;if(n===Xs)return i.DEPTH_STENCIL;if(n===cc)return i.RED;if(n===lc)return i.RED_INTEGER;if(n===mh)return i.RG;if(n===hc)return i.RG_INTEGER;if(n===uc)return i.RGBA_INTEGER;if(n===zr||n===Hr||n===Vr||n===Gr)if(o===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ga||n===_a||n===va||n===xa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ga)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===_a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===va)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ma||n===ya||n===Sa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ma||n===ya)return o===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Sa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ea||n===Ta||n===ba||n===wa||n===Aa||n===Ra||n===Ca||n===Pa||n===La||n===Da||n===Ua||n===Ia||n===Na||n===Fa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ea)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ta)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ba)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===wa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Aa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ra)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ca)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Pa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===La)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Da)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ua)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ia)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Na)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Fa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Oa||n===Ba||n===za)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Oa)return o===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ba)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ha||n===Va||n===Ga||n===ka)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ha)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Va)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ga)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ka)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ks?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const A_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,R_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class C_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Ph(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Xn({vertexShader:A_,fragmentShader:R_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ut(new Ii(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class P_ extends xs{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,p=null,d=null,m=null;const _=typeof XRWebGLBinding<"u",g=new C_,f={},T=e.getContextAttributes();let v=null,x=null;const R=[],A=[],b=new ot;let P=null;const y=new Qe;y.viewport=new ue;const S=new Qe;S.viewport=new ue;const D=[y,S],O=new Zd;let z=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=R[Y];return tt===void 0&&(tt=new zo,R[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=R[Y];return tt===void 0&&(tt=new zo,R[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=R[Y];return tt===void 0&&(tt=new zo,R[Y]=tt),tt.getHandSpace()};function q(Y){const tt=A.indexOf(Y.inputSource);if(tt===-1)return;const Mt=R[tt];Mt!==void 0&&(Mt.update(Y.inputSource,Y.frame,c||o),Mt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",et);for(let Y=0;Y<R.length;Y++){const tt=A[Y];tt!==null&&(A[Y]=null,R[Y].disconnect(tt))}z=null,k=null,g.reset();for(const Y in f)delete f[Y];t.setRenderTarget(v),d=null,p=null,u=null,s=null,x=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",W),s.addEventListener("inputsourceschange",et),T.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(b),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,Pt=null,Tt=null;T.depth&&(Tt=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Mt=T.stencil?Xs:Ws,Pt=T.stencil?ks:wi);const Kt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};u=this.getBinding(),p=u.createProjectionLayer(Kt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),x=new Ai(p.textureWidth,p.textureHeight,{format:_n,type:An,depthTexture:new Ch(p.textureWidth,p.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const Mt={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,Mt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Ai(d.framebufferWidth,d.framebufferHeight,{format:_n,type:An,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ee.setContext(s),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function et(Y){for(let tt=0;tt<Y.removed.length;tt++){const Mt=Y.removed[tt],Pt=A.indexOf(Mt);Pt>=0&&(A[Pt]=null,R[Pt].disconnect(Mt))}for(let tt=0;tt<Y.added.length;tt++){const Mt=Y.added[tt];let Pt=A.indexOf(Mt);if(Pt===-1){for(let Kt=0;Kt<R.length;Kt++)if(Kt>=A.length){A.push(Mt),Pt=Kt;break}else if(A[Kt]===null){A[Kt]=Mt,Pt=Kt;break}if(Pt===-1)break}const Tt=R[Pt];Tt&&Tt.connect(Mt)}}const G=new C,ut=new C;function vt(Y,tt,Mt){G.setFromMatrixPosition(tt.matrixWorld),ut.setFromMatrixPosition(Mt.matrixWorld);const Pt=G.distanceTo(ut),Tt=tt.projectionMatrix.elements,Kt=Mt.projectionMatrix.elements,me=Tt[14]/(Tt[10]-1),L=Tt[14]/(Tt[10]+1),Q=(Tt[9]+1)/Tt[5],Z=(Tt[9]-1)/Tt[5],J=(Tt[8]-1)/Tt[0],$=(Kt[8]+1)/Kt[0],lt=me*J,nt=me*$,ht=Pt/(-J+$),Vt=ht*-J;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Vt),Y.translateZ(ht),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const zt=me+ht,w=L+ht,M=lt-Vt,F=nt+(Pt-Vt),V=Q*L/w*zt,j=Z*L/w*zt;Y.projectionMatrix.makePerspective(M,F,V,j,zt,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function yt(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let tt=Y.near,Mt=Y.far;g.texture!==null&&(g.depthNear>0&&(tt=g.depthNear),g.depthFar>0&&(Mt=g.depthFar)),O.near=S.near=y.near=tt,O.far=S.far=y.far=Mt,(z!==O.near||k!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),z=O.near,k=O.far),O.layers.mask=Y.layers.mask|6,y.layers.mask=O.layers.mask&3,S.layers.mask=O.layers.mask&5;const Pt=Y.parent,Tt=O.cameras;yt(O,Pt);for(let Kt=0;Kt<Tt.length;Kt++)yt(Tt[Kt],Pt);Tt.length===2?vt(O,y,S):O.projectionMatrix.copy(y.projectionMatrix),Wt(Y,O,Pt)};function Wt(Y,tt,Mt){Mt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(Mt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=qs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(p===null&&d===null))return l},this.setFoveation=function(Y){l=Y,p!==null&&(p.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(O)},this.getCameraTexture=function(Y){return f[Y]};let Qt=null;function ae(Y,tt){if(h=tt.getViewerPose(c||o),m=tt,h!==null){const Mt=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let Pt=!1;Mt.length!==O.cameras.length&&(O.cameras.length=0,Pt=!0);for(let L=0;L<Mt.length;L++){const Q=Mt[L];let Z=null;if(d!==null)Z=d.getViewport(Q);else{const $=u.getViewSubImage(p,Q);Z=$.viewport,L===0&&(t.setRenderTargetTextures(x,$.colorTexture,$.depthStencilTexture),t.setRenderTarget(x))}let J=D[L];J===void 0&&(J=new Qe,J.layers.enable(L),J.viewport=new ue,D[L]=J),J.matrix.fromArray(Q.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Q.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Z.x,Z.y,Z.width,Z.height),L===0&&(O.matrix.copy(J.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pt===!0&&O.cameras.push(J)}const Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const L=u.getDepthInformation(Mt[0]);L&&L.isValid&&L.texture&&g.init(L,s.renderState)}if(Tt&&Tt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let L=0;L<Mt.length;L++){const Q=Mt[L].camera;if(Q){let Z=f[Q];Z||(Z=new Ph,f[Q]=Z);const J=u.getCameraImage(Q);Z.sourceTexture=J}}}}for(let Mt=0;Mt<R.length;Mt++){const Pt=A[Mt],Tt=R[Mt];Pt!==null&&Tt!==void 0&&Tt.update(Pt,tt,c||o)}Qt&&Qt(Y,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),m=null}const ee=new Wh;ee.setAnimationLoop(ae),this.setAnimationLoop=function(Y){Qt=Y},this.dispose=function(){}}}const _i=new vn,L_=new ce;function D_(i,t){function e(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,Eh(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,T,v,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(g,f):f.isMeshToonMaterial?(r(g,f),u(g,f)):f.isMeshPhongMaterial?(r(g,f),h(g,f)):f.isMeshStandardMaterial?(r(g,f),p(g,f),f.isMeshPhysicalMaterial&&d(g,f,x)):f.isMeshMatcapMaterial?(r(g,f),m(g,f)):f.isMeshDepthMaterial?r(g,f):f.isMeshDistanceMaterial?(r(g,f),_(g,f)):f.isMeshNormalMaterial?r(g,f):f.isLineBasicMaterial?(o(g,f),f.isLineDashedMaterial&&a(g,f)):f.isPointsMaterial?l(g,f,T,v):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,e(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===Ne&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,e(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===Ne&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,e(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,e(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const T=t.get(f),v=T.envMap,x=T.envMapRotation;v&&(g.envMap.value=v,_i.copy(x),_i.x*=-1,_i.y*=-1,_i.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),g.envMapRotation.value.setFromMatrix4(L_.makeRotationFromEuler(_i)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,g.aoMapTransform))}function o(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform))}function a(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,T,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*T,g.scale.value=v*.5,f.map&&(g.map.value=f.map,e(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function p(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function d(g,f,T){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ne&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=T.texture,g.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function _(g,f){const T=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(T.matrixWorld),g.nearDistance.value=T.shadow.camera.near,g.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function U_(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,v){const x=v.program;n.uniformBlockBinding(T,x)}function c(T,v){let x=s[T.id];x===void 0&&(m(T),x=h(T),s[T.id]=x,T.addEventListener("dispose",g));const R=v.program;n.updateUBOMapping(T,R);const A=t.render.frame;r[T.id]!==A&&(p(T),r[T.id]=A)}function h(T){const v=u();T.__bindingPointIndex=v;const x=i.createBuffer(),R=T.__size,A=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,R,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function u(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(T){const v=s[T.id],x=T.uniforms,R=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,b=x.length;A<b;A++){const P=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,S=P.length;y<S;y++){const D=P[y];if(d(D,A,y,R)===!0){const O=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let k=0;for(let q=0;q<z.length;q++){const W=z[q],et=_(W);typeof W=="number"||typeof W=="boolean"?(D.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,O+k,D.__data)):W.isMatrix3?(D.__data[0]=W.elements[0],D.__data[1]=W.elements[1],D.__data[2]=W.elements[2],D.__data[3]=0,D.__data[4]=W.elements[3],D.__data[5]=W.elements[4],D.__data[6]=W.elements[5],D.__data[7]=0,D.__data[8]=W.elements[6],D.__data[9]=W.elements[7],D.__data[10]=W.elements[8],D.__data[11]=0):(W.toArray(D.__data,k),k+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(T,v,x,R){const A=T.value,b=v+"_"+x;if(R[b]===void 0)return typeof A=="number"||typeof A=="boolean"?R[b]=A:R[b]=A.clone(),!0;{const P=R[b];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return R[b]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function m(T){const v=T.uniforms;let x=0;const R=16;for(let b=0,P=v.length;b<P;b++){const y=Array.isArray(v[b])?v[b]:[v[b]];for(let S=0,D=y.length;S<D;S++){const O=y[S],z=Array.isArray(O.value)?O.value:[O.value];for(let k=0,q=z.length;k<q;k++){const W=z[k],et=_(W),G=x%R,ut=G%et.boundary,vt=G+ut;x+=ut,vt!==0&&R-vt<et.storage&&(x+=R-vt),O.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=x,x+=et.storage}}}const A=x%R;return A>0&&(x+=R-A),T.__size=x,T.__cache={},this}function _(T){const v={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(v.boundary=4,v.storage=4):T.isVector2?(v.boundary=8,v.storage=8):T.isVector3||T.isColor?(v.boundary=16,v.storage=12):T.isVector4?(v.boundary=16,v.storage=16):T.isMatrix3?(v.boundary=48,v.storage=48):T.isMatrix4?(v.boundary=64,v.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),v}function g(T){const v=T.target;v.removeEventListener("dispose",g);const x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const T in s)i.deleteBuffer(s[T]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class I_{constructor(t={}){const{canvas:e=Uf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,f=null;const T=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let R=!1;this._outputColorSpace=He;let A=0,b=0,P=null,y=-1,S=null;const D=new ue,O=new ue;let z=null;const k=new $t(0);let q=0,W=e.width,et=e.height,G=1,ut=null,vt=null;const yt=new ue(0,0,W,et),Wt=new ue(0,0,W,et);let Qt=!1;const ae=new vc;let ee=!1,Y=!1;const tt=new ce,Mt=new C,Pt=new ue,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Kt=!1;function me(){return P===null?G:1}let L=n;function Q(E,I){return e.getContext(E,I)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ic}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",st,!1),L===null){const I="webgl2";if(L=Q(I,E),L===null)throw Q(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Z,J,$,lt,nt,ht,Vt,zt,w,M,F,V,j,X,Rt,ct,bt,wt,it,_t,Ot,Ct,mt,Xt;function U(){Z=new Wg(L),Z.init(),Ct=new w_(L,Z),J=new Og(L,Z,t,Ct),$=new T_(L,Z),J.reversedDepthBuffer&&p&&$.buffers.depth.setReversed(!0),lt=new Yg(L),nt=new u_,ht=new b_(L,Z,$,nt,J,Ct,lt),Vt=new zg(x),zt=new kg(x),w=new Qd(L),mt=new Ng(L,w),M=new Xg(L,w,lt,mt),F=new Jg(L,M,w,lt),it=new $g(L,J,ht),ct=new Bg(nt),V=new h_(x,Vt,zt,Z,J,mt,ct),j=new D_(x,nt),X=new d_,Rt=new x_(Z),wt=new Ig(x,Vt,zt,$,F,d,l),bt=new S_(x,F,J),Xt=new U_(L,lt,J,$),_t=new Fg(L,Z,lt),Ot=new qg(L,Z,lt),lt.programs=V.programs,x.capabilities=J,x.extensions=Z,x.properties=nt,x.renderLists=X,x.shadowMap=bt,x.state=$,x.info=lt}U();const at=new P_(x,L);this.xr=at,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=Z.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Z.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(E){E!==void 0&&(G=E,this.setSize(W,et,!1))},this.getSize=function(E){return E.set(W,et)},this.setSize=function(E,I,B=!0){if(at.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=E,et=I,e.width=Math.floor(E*G),e.height=Math.floor(I*G),B===!0&&(e.style.width=E+"px",e.style.height=I+"px"),this.setViewport(0,0,E,I)},this.getDrawingBufferSize=function(E){return E.set(W*G,et*G).floor()},this.setDrawingBufferSize=function(E,I,B){W=E,et=I,G=B,e.width=Math.floor(E*B),e.height=Math.floor(I*B),this.setViewport(0,0,E,I)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(yt)},this.setViewport=function(E,I,B,H){E.isVector4?yt.set(E.x,E.y,E.z,E.w):yt.set(E,I,B,H),$.viewport(D.copy(yt).multiplyScalar(G).round())},this.getScissor=function(E){return E.copy(Wt)},this.setScissor=function(E,I,B,H){E.isVector4?Wt.set(E.x,E.y,E.z,E.w):Wt.set(E,I,B,H),$.scissor(O.copy(Wt).multiplyScalar(G).round())},this.getScissorTest=function(){return Qt},this.setScissorTest=function(E){$.setScissorTest(Qt=E)},this.setOpaqueSort=function(E){ut=E},this.setTransparentSort=function(E){vt=E},this.getClearColor=function(E){return E.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor(...arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha(...arguments)},this.clear=function(E=!0,I=!0,B=!0){let H=0;if(E){let N=!1;if(P!==null){const rt=P.texture.format;N=rt===uc||rt===hc||rt===lc}if(N){const rt=P.texture.type,gt=rt===An||rt===wi||rt===Gs||rt===ks||rt===oc||rt===ac,Et=wt.getClearColor(),xt=wt.getClearAlpha(),Ft=Et.r,Bt=Et.g,Lt=Et.b;gt?(m[0]=Ft,m[1]=Bt,m[2]=Lt,m[3]=xt,L.clearBufferuiv(L.COLOR,0,m)):(_[0]=Ft,_[1]=Bt,_[2]=Lt,_[3]=xt,L.clearBufferiv(L.COLOR,0,_))}else H|=L.COLOR_BUFFER_BIT}I&&(H|=L.DEPTH_BUFFER_BIT),B&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",st,!1),wt.dispose(),X.dispose(),Rt.dispose(),nt.dispose(),Vt.dispose(),zt.dispose(),F.dispose(),mt.dispose(),Xt.dispose(),V.dispose(),at.dispose(),at.removeEventListener("sessionstart",xn),at.removeEventListener("sessionend",Lc),hi.stop()};function ft(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=lt.autoReset,I=bt.enabled,B=bt.autoUpdate,H=bt.needsUpdate,N=bt.type;U(),lt.autoReset=E,bt.enabled=I,bt.autoUpdate=B,bt.needsUpdate=H,bt.type=N}function st(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function K(E){const I=E.target;I.removeEventListener("dispose",K),At(I)}function At(E){Gt(E),nt.remove(E)}function Gt(E){const I=nt.get(E).programs;I!==void 0&&(I.forEach(function(B){V.releaseProgram(B)}),E.isShaderMaterial&&V.releaseShaderCache(E))}this.renderBufferDirect=function(E,I,B,H,N,rt){I===null&&(I=Tt);const gt=N.isMesh&&N.matrixWorld.determinant()<0,Et=Su(E,I,B,H,N);$.setMaterial(H,gt);let xt=B.index,Ft=1;if(H.wireframe===!0){if(xt=M.getWireframeAttribute(B),xt===void 0)return;Ft=2}const Bt=B.drawRange,Lt=B.attributes.position;let jt=Bt.start*Ft,le=(Bt.start+Bt.count)*Ft;rt!==null&&(jt=Math.max(jt,rt.start*Ft),le=Math.min(le,(rt.start+rt.count)*Ft)),xt!==null?(jt=Math.max(jt,0),le=Math.min(le,xt.count)):Lt!=null&&(jt=Math.max(jt,0),le=Math.min(le,Lt.count));const Ee=le-jt;if(Ee<0||Ee===1/0)return;mt.setup(N,H,Et,B,xt);let _e,fe=_t;if(xt!==null&&(_e=w.get(xt),fe=Ot,fe.setIndex(_e)),N.isMesh)H.wireframe===!0?($.setLineWidth(H.wireframeLinewidth*me()),fe.setMode(L.LINES)):fe.setMode(L.TRIANGLES);else if(N.isLine){let It=H.linewidth;It===void 0&&(It=1),$.setLineWidth(It*me()),N.isLineSegments?fe.setMode(L.LINES):N.isLineLoop?fe.setMode(L.LINE_LOOP):fe.setMode(L.LINE_STRIP)}else N.isPoints?fe.setMode(L.POINTS):N.isSprite&&fe.setMode(L.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Ys("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),fe.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Z.get("WEBGL_multi_draw"))fe.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const It=N._multiDrawStarts,ve=N._multiDrawCounts,ie=N._multiDrawCount,$e=xt?w.get(xt).bytesPerElement:1,Ni=nt.get(H).currentProgram.getUniforms();for(let Je=0;Je<ie;Je++)Ni.setValue(L,"_gl_DrawID",Je),fe.render(It[Je]/$e,ve[Je])}else if(N.isInstancedMesh)fe.renderInstances(jt,Ee,N.count);else if(B.isInstancedBufferGeometry){const It=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,ve=Math.min(B.instanceCount,It);fe.renderInstances(jt,Ee,ve)}else fe.render(jt,Ee)};function ge(E,I,B){E.transparent===!0&&E.side===Sn&&E.forceSinglePass===!1?(E.side=Ne,E.needsUpdate=!0,lr(E,I,B),E.side=oi,E.needsUpdate=!0,lr(E,I,B),E.side=Sn):lr(E,I,B)}this.compile=function(E,I,B=null){B===null&&(B=E),f=Rt.get(B),f.init(I),v.push(f),B.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),E!==B&&E.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const H=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const rt=N.material;if(rt)if(Array.isArray(rt))for(let gt=0;gt<rt.length;gt++){const Et=rt[gt];ge(Et,B,N),H.add(Et)}else ge(rt,B,N),H.add(rt)}),f=v.pop(),H},this.compileAsync=function(E,I,B=null){const H=this.compile(E,I,B);return new Promise(N=>{function rt(){if(H.forEach(function(gt){nt.get(gt).currentProgram.isReady()&&H.delete(gt)}),H.size===0){N(E);return}setTimeout(rt,10)}Z.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let re=null;function Pn(E){re&&re(E)}function xn(){hi.stop()}function Lc(){hi.start()}const hi=new Wh;hi.setAnimationLoop(Pn),typeof self<"u"&&hi.setContext(self),this.setAnimationLoop=function(E){re=E,at.setAnimationLoop(E),E===null?hi.stop():hi.start()},at.addEventListener("sessionstart",xn),at.addEventListener("sessionend",Lc),this.render=function(E,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(at.cameraAutoUpdate===!0&&at.updateCamera(I),I=at.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,I,P),f=Rt.get(E,v.length),f.init(I),v.push(f),tt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),ae.setFromProjectionMatrix(tt,Tn,I.reversedDepth),Y=this.localClippingEnabled,ee=ct.init(this.clippingPlanes,Y),g=X.get(E,T.length),g.init(),T.push(g),at.enabled===!0&&at.isPresenting===!0){const rt=x.xr.getDepthSensingMesh();rt!==null&&go(rt,I,-1/0,x.sortObjects)}go(E,I,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(ut,vt),Kt=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,Kt&&wt.addToRenderList(g,E),this.info.render.frame++,ee===!0&&ct.beginShadows();const B=f.state.shadowsArray;bt.render(B,E,I),ee===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=g.opaque,N=g.transmissive;if(f.setupLights(),I.isArrayCamera){const rt=I.cameras;if(N.length>0)for(let gt=0,Et=rt.length;gt<Et;gt++){const xt=rt[gt];Uc(H,N,E,xt)}Kt&&wt.render(E);for(let gt=0,Et=rt.length;gt<Et;gt++){const xt=rt[gt];Dc(g,E,xt,xt.viewport)}}else N.length>0&&Uc(H,N,E,I),Kt&&wt.render(E),Dc(g,E,I);P!==null&&b===0&&(ht.updateMultisampleRenderTarget(P),ht.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(x,E,I),mt.resetDefaultState(),y=-1,S=null,v.pop(),v.length>0?(f=v[v.length-1],ee===!0&&ct.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,T.pop(),T.length>0?g=T[T.length-1]:g=null};function go(E,I,B,H){if(E.visible===!1)return;if(E.layers.test(I.layers)){if(E.isGroup)B=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(I);else if(E.isLight)f.pushLight(E),E.castShadow&&f.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ae.intersectsSprite(E)){H&&Pt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(tt);const gt=F.update(E),Et=E.material;Et.visible&&g.push(E,gt,Et,B,Pt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ae.intersectsObject(E))){const gt=F.update(E),Et=E.material;if(H&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Pt.copy(E.boundingSphere.center)):(gt.boundingSphere===null&&gt.computeBoundingSphere(),Pt.copy(gt.boundingSphere.center)),Pt.applyMatrix4(E.matrixWorld).applyMatrix4(tt)),Array.isArray(Et)){const xt=gt.groups;for(let Ft=0,Bt=xt.length;Ft<Bt;Ft++){const Lt=xt[Ft],jt=Et[Lt.materialIndex];jt&&jt.visible&&g.push(E,gt,jt,B,Pt.z,Lt)}}else Et.visible&&g.push(E,gt,Et,B,Pt.z,null)}}const rt=E.children;for(let gt=0,Et=rt.length;gt<Et;gt++)go(rt[gt],I,B,H)}function Dc(E,I,B,H){const N=E.opaque,rt=E.transmissive,gt=E.transparent;f.setupLightsView(B),ee===!0&&ct.setGlobalState(x.clippingPlanes,B),H&&$.viewport(D.copy(H)),N.length>0&&cr(N,I,B),rt.length>0&&cr(rt,I,B),gt.length>0&&cr(gt,I,B),$.buffers.depth.setTest(!0),$.buffers.depth.setMask(!0),$.buffers.color.setMask(!0),$.setPolygonOffset(!1)}function Uc(E,I,B,H){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new Ai(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")||Z.has("EXT_color_buffer_float")?nr:An,minFilter:ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const rt=f.state.transmissionRenderTarget[H.id],gt=H.viewport||D;rt.setSize(gt.z*x.transmissionResolutionScale,gt.w*x.transmissionResolutionScale);const Et=x.getRenderTarget(),xt=x.getActiveCubeFace(),Ft=x.getActiveMipmapLevel();x.setRenderTarget(rt),x.getClearColor(k),q=x.getClearAlpha(),q<1&&x.setClearColor(16777215,.5),x.clear(),Kt&&wt.render(B);const Bt=x.toneMapping;x.toneMapping=si;const Lt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),ee===!0&&ct.setGlobalState(x.clippingPlanes,H),cr(E,B,H),ht.updateMultisampleRenderTarget(rt),ht.updateRenderTargetMipmap(rt),Z.has("WEBGL_multisampled_render_to_texture")===!1){let jt=!1;for(let le=0,Ee=I.length;le<Ee;le++){const _e=I[le],fe=_e.object,It=_e.geometry,ve=_e.material,ie=_e.group;if(ve.side===Sn&&fe.layers.test(H.layers)){const $e=ve.side;ve.side=Ne,ve.needsUpdate=!0,Ic(fe,B,H,It,ve,ie),ve.side=$e,ve.needsUpdate=!0,jt=!0}}jt===!0&&(ht.updateMultisampleRenderTarget(rt),ht.updateRenderTargetMipmap(rt))}x.setRenderTarget(Et,xt,Ft),x.setClearColor(k,q),Lt!==void 0&&(H.viewport=Lt),x.toneMapping=Bt}function cr(E,I,B){const H=I.isScene===!0?I.overrideMaterial:null;for(let N=0,rt=E.length;N<rt;N++){const gt=E[N],Et=gt.object,xt=gt.geometry,Ft=gt.group;let Bt=gt.material;Bt.allowOverride===!0&&H!==null&&(Bt=H),Et.layers.test(B.layers)&&Ic(Et,I,B,xt,Bt,Ft)}}function Ic(E,I,B,H,N,rt){E.onBeforeRender(x,I,B,H,N,rt),E.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(x,I,B,H,E,rt),N.transparent===!0&&N.side===Sn&&N.forceSinglePass===!1?(N.side=Ne,N.needsUpdate=!0,x.renderBufferDirect(B,I,H,N,E,rt),N.side=oi,N.needsUpdate=!0,x.renderBufferDirect(B,I,H,N,E,rt),N.side=Sn):x.renderBufferDirect(B,I,H,N,E,rt),E.onAfterRender(x,I,B,H,N,rt)}function lr(E,I,B){I.isScene!==!0&&(I=Tt);const H=nt.get(E),N=f.state.lights,rt=f.state.shadowsArray,gt=N.state.version,Et=V.getParameters(E,N.state,rt,I,B),xt=V.getProgramCacheKey(Et);let Ft=H.programs;H.environment=E.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(E.isMeshStandardMaterial?zt:Vt).get(E.envMap||H.environment),H.envMapRotation=H.environment!==null&&E.envMap===null?I.environmentRotation:E.envMapRotation,Ft===void 0&&(E.addEventListener("dispose",K),Ft=new Map,H.programs=Ft);let Bt=Ft.get(xt);if(Bt!==void 0){if(H.currentProgram===Bt&&H.lightsStateVersion===gt)return Fc(E,Et),Bt}else Et.uniforms=V.getUniforms(E),E.onBeforeCompile(Et,x),Bt=V.acquireProgram(Et,xt),Ft.set(xt,Bt),H.uniforms=Et.uniforms;const Lt=H.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Lt.clippingPlanes=ct.uniform),Fc(E,Et),H.needsLights=Tu(E),H.lightsStateVersion=gt,H.needsLights&&(Lt.ambientLightColor.value=N.state.ambient,Lt.lightProbe.value=N.state.probe,Lt.directionalLights.value=N.state.directional,Lt.directionalLightShadows.value=N.state.directionalShadow,Lt.spotLights.value=N.state.spot,Lt.spotLightShadows.value=N.state.spotShadow,Lt.rectAreaLights.value=N.state.rectArea,Lt.ltc_1.value=N.state.rectAreaLTC1,Lt.ltc_2.value=N.state.rectAreaLTC2,Lt.pointLights.value=N.state.point,Lt.pointLightShadows.value=N.state.pointShadow,Lt.hemisphereLights.value=N.state.hemi,Lt.directionalShadowMap.value=N.state.directionalShadowMap,Lt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Lt.spotShadowMap.value=N.state.spotShadowMap,Lt.spotLightMatrix.value=N.state.spotLightMatrix,Lt.spotLightMap.value=N.state.spotLightMap,Lt.pointShadowMap.value=N.state.pointShadowMap,Lt.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=Bt,H.uniformsList=null,Bt}function Nc(E){if(E.uniformsList===null){const I=E.currentProgram.getUniforms();E.uniformsList=kr.seqWithValue(I.seq,E.uniforms)}return E.uniformsList}function Fc(E,I){const B=nt.get(E);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function Su(E,I,B,H,N){I.isScene!==!0&&(I=Tt),ht.resetTextureUnits();const rt=I.fog,gt=H.isMeshStandardMaterial?I.environment:null,Et=P===null?x.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:fs,xt=(H.isMeshStandardMaterial?zt:Vt).get(H.envMap||gt),Ft=H.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Bt=!!B.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Lt=!!B.morphAttributes.position,jt=!!B.morphAttributes.normal,le=!!B.morphAttributes.color;let Ee=si;H.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Ee=x.toneMapping);const _e=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,fe=_e!==void 0?_e.length:0,It=nt.get(H),ve=f.state.lights;if(ee===!0&&(Y===!0||E!==S)){const Oe=E===S&&H.id===y;ct.setState(H,E,Oe)}let ie=!1;H.version===It.__version?(It.needsLights&&It.lightsStateVersion!==ve.state.version||It.outputColorSpace!==Et||N.isBatchedMesh&&It.batching===!1||!N.isBatchedMesh&&It.batching===!0||N.isBatchedMesh&&It.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&It.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&It.instancing===!1||!N.isInstancedMesh&&It.instancing===!0||N.isSkinnedMesh&&It.skinning===!1||!N.isSkinnedMesh&&It.skinning===!0||N.isInstancedMesh&&It.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&It.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&It.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&It.instancingMorph===!1&&N.morphTexture!==null||It.envMap!==xt||H.fog===!0&&It.fog!==rt||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==ct.numPlanes||It.numIntersection!==ct.numIntersection)||It.vertexAlphas!==Ft||It.vertexTangents!==Bt||It.morphTargets!==Lt||It.morphNormals!==jt||It.morphColors!==le||It.toneMapping!==Ee||It.morphTargetsCount!==fe)&&(ie=!0):(ie=!0,It.__version=H.version);let $e=It.currentProgram;ie===!0&&($e=lr(H,I,N));let Ni=!1,Je=!1,ys=!1;const xe=$e.getUniforms(),en=It.uniforms;if($.useProgram($e.program)&&(Ni=!0,Je=!0,ys=!0),H.id!==y&&(y=H.id,Je=!0),Ni||S!==E){$.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),xe.setValue(L,"projectionMatrix",E.projectionMatrix),xe.setValue(L,"viewMatrix",E.matrixWorldInverse);const Ge=xe.map.cameraPosition;Ge!==void 0&&Ge.setValue(L,Mt.setFromMatrixPosition(E.matrixWorld)),J.logarithmicDepthBuffer&&xe.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&xe.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,Je=!0,ys=!0)}if(N.isSkinnedMesh){xe.setOptional(L,N,"bindMatrix"),xe.setOptional(L,N,"bindMatrixInverse");const Oe=N.skeleton;Oe&&(Oe.boneTexture===null&&Oe.computeBoneTexture(),xe.setValue(L,"boneTexture",Oe.boneTexture,ht))}N.isBatchedMesh&&(xe.setOptional(L,N,"batchingTexture"),xe.setValue(L,"batchingTexture",N._matricesTexture,ht),xe.setOptional(L,N,"batchingIdTexture"),xe.setValue(L,"batchingIdTexture",N._indirectTexture,ht),xe.setOptional(L,N,"batchingColorTexture"),N._colorsTexture!==null&&xe.setValue(L,"batchingColorTexture",N._colorsTexture,ht));const nn=B.morphAttributes;if((nn.position!==void 0||nn.normal!==void 0||nn.color!==void 0)&&it.update(N,B,$e),(Je||It.receiveShadow!==N.receiveShadow)&&(It.receiveShadow=N.receiveShadow,xe.setValue(L,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(en.envMap.value=xt,en.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&I.environment!==null&&(en.envMapIntensity.value=I.environmentIntensity),Je&&(xe.setValue(L,"toneMappingExposure",x.toneMappingExposure),It.needsLights&&Eu(en,ys),rt&&H.fog===!0&&j.refreshFogUniforms(en,rt),j.refreshMaterialUniforms(en,H,G,et,f.state.transmissionRenderTarget[E.id]),kr.upload(L,Nc(It),en,ht)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(kr.upload(L,Nc(It),en,ht),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&xe.setValue(L,"center",N.center),xe.setValue(L,"modelViewMatrix",N.modelViewMatrix),xe.setValue(L,"normalMatrix",N.normalMatrix),xe.setValue(L,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Oe=H.uniformsGroups;for(let Ge=0,_o=Oe.length;Ge<_o;Ge++){const ui=Oe[Ge];Xt.update(ui,$e),Xt.bind(ui,$e)}}return $e}function Eu(E,I){E.ambientLightColor.needsUpdate=I,E.lightProbe.needsUpdate=I,E.directionalLights.needsUpdate=I,E.directionalLightShadows.needsUpdate=I,E.pointLights.needsUpdate=I,E.pointLightShadows.needsUpdate=I,E.spotLights.needsUpdate=I,E.spotLightShadows.needsUpdate=I,E.rectAreaLights.needsUpdate=I,E.hemisphereLights.needsUpdate=I}function Tu(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,I,B){const H=nt.get(E);H.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),nt.get(E.texture).__webglTexture=I,nt.get(E.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:B,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,I){const B=nt.get(E);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0};const bu=L.createFramebuffer();this.setRenderTarget=function(E,I=0,B=0){P=E,A=I,b=B;let H=!0,N=null,rt=!1,gt=!1;if(E){const xt=nt.get(E);if(xt.__useDefaultFramebuffer!==void 0)$.bindFramebuffer(L.FRAMEBUFFER,null),H=!1;else if(xt.__webglFramebuffer===void 0)ht.setupRenderTarget(E);else if(xt.__hasExternalTextures)ht.rebindTextures(E,nt.get(E.texture).__webglTexture,nt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Lt=E.depthTexture;if(xt.__boundDepthTexture!==Lt){if(Lt!==null&&nt.has(Lt)&&(E.width!==Lt.image.width||E.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ht.setupDepthRenderbuffer(E)}}const Ft=E.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(gt=!0);const Bt=nt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Bt[I])?N=Bt[I][B]:N=Bt[I],rt=!0):E.samples>0&&ht.useMultisampledRTT(E)===!1?N=nt.get(E).__webglMultisampledFramebuffer:Array.isArray(Bt)?N=Bt[B]:N=Bt,D.copy(E.viewport),O.copy(E.scissor),z=E.scissorTest}else D.copy(yt).multiplyScalar(G).floor(),O.copy(Wt).multiplyScalar(G).floor(),z=Qt;if(B!==0&&(N=bu),$.bindFramebuffer(L.FRAMEBUFFER,N)&&H&&$.drawBuffers(E,N),$.viewport(D),$.scissor(O),$.setScissorTest(z),rt){const xt=nt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+I,xt.__webglTexture,B)}else if(gt){const xt=I;for(let Ft=0;Ft<E.textures.length;Ft++){const Bt=nt.get(E.textures[Ft]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Ft,Bt.__webglTexture,B,xt)}}else if(E!==null&&B!==0){const xt=nt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,xt.__webglTexture,B)}y=-1},this.readRenderTargetPixels=function(E,I,B,H,N,rt,gt,Et=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&gt!==void 0&&(xt=xt[gt]),xt){$.bindFramebuffer(L.FRAMEBUFFER,xt);try{const Ft=E.textures[Et],Bt=Ft.format,Lt=Ft.type;if(!J.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=E.width-H&&B>=0&&B<=E.height-N&&(E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Et),L.readPixels(I,B,H,N,Ct.convert(Bt),Ct.convert(Lt),rt))}finally{const Ft=P!==null?nt.get(P).__webglFramebuffer:null;$.bindFramebuffer(L.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=async function(E,I,B,H,N,rt,gt,Et=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xt=nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&gt!==void 0&&(xt=xt[gt]),xt)if(I>=0&&I<=E.width-H&&B>=0&&B<=E.height-N){$.bindFramebuffer(L.FRAMEBUFFER,xt);const Ft=E.textures[Et],Bt=Ft.format,Lt=Ft.type;if(!J.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const jt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,jt),L.bufferData(L.PIXEL_PACK_BUFFER,rt.byteLength,L.STREAM_READ),E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Et),L.readPixels(I,B,H,N,Ct.convert(Bt),Ct.convert(Lt),0);const le=P!==null?nt.get(P).__webglFramebuffer:null;$.bindFramebuffer(L.FRAMEBUFFER,le);const Ee=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await If(L,Ee,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,jt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,rt),L.deleteBuffer(jt),L.deleteSync(Ee),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,I=null,B=0){const H=Math.pow(2,-B),N=Math.floor(E.image.width*H),rt=Math.floor(E.image.height*H),gt=I!==null?I.x:0,Et=I!==null?I.y:0;ht.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,B,0,0,gt,Et,N,rt),$.unbindTexture()};const wu=L.createFramebuffer(),Au=L.createFramebuffer();this.copyTextureToTexture=function(E,I,B=null,H=null,N=0,rt=null){rt===null&&(N!==0?(Ys("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),rt=N,N=0):rt=0);let gt,Et,xt,Ft,Bt,Lt,jt,le,Ee;const _e=E.isCompressedTexture?E.mipmaps[rt]:E.image;if(B!==null)gt=B.max.x-B.min.x,Et=B.max.y-B.min.y,xt=B.isBox3?B.max.z-B.min.z:1,Ft=B.min.x,Bt=B.min.y,Lt=B.isBox3?B.min.z:0;else{const nn=Math.pow(2,-N);gt=Math.floor(_e.width*nn),Et=Math.floor(_e.height*nn),E.isDataArrayTexture?xt=_e.depth:E.isData3DTexture?xt=Math.floor(_e.depth*nn):xt=1,Ft=0,Bt=0,Lt=0}H!==null?(jt=H.x,le=H.y,Ee=H.z):(jt=0,le=0,Ee=0);const fe=Ct.convert(I.format),It=Ct.convert(I.type);let ve;I.isData3DTexture?(ht.setTexture3D(I,0),ve=L.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(ht.setTexture2DArray(I,0),ve=L.TEXTURE_2D_ARRAY):(ht.setTexture2D(I,0),ve=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const ie=L.getParameter(L.UNPACK_ROW_LENGTH),$e=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ni=L.getParameter(L.UNPACK_SKIP_PIXELS),Je=L.getParameter(L.UNPACK_SKIP_ROWS),ys=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,_e.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,_e.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ft),L.pixelStorei(L.UNPACK_SKIP_ROWS,Bt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Lt);const xe=E.isDataArrayTexture||E.isData3DTexture,en=I.isDataArrayTexture||I.isData3DTexture;if(E.isDepthTexture){const nn=nt.get(E),Oe=nt.get(I),Ge=nt.get(nn.__renderTarget),_o=nt.get(Oe.__renderTarget);$.bindFramebuffer(L.READ_FRAMEBUFFER,Ge.__webglFramebuffer),$.bindFramebuffer(L.DRAW_FRAMEBUFFER,_o.__webglFramebuffer);for(let ui=0;ui<xt;ui++)xe&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,nt.get(E).__webglTexture,N,Lt+ui),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,nt.get(I).__webglTexture,rt,Ee+ui)),L.blitFramebuffer(Ft,Bt,gt,Et,jt,le,gt,Et,L.DEPTH_BUFFER_BIT,L.NEAREST);$.bindFramebuffer(L.READ_FRAMEBUFFER,null),$.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(N!==0||E.isRenderTargetTexture||nt.has(E)){const nn=nt.get(E),Oe=nt.get(I);$.bindFramebuffer(L.READ_FRAMEBUFFER,wu),$.bindFramebuffer(L.DRAW_FRAMEBUFFER,Au);for(let Ge=0;Ge<xt;Ge++)xe?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,nn.__webglTexture,N,Lt+Ge):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,nn.__webglTexture,N),en?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Oe.__webglTexture,rt,Ee+Ge):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Oe.__webglTexture,rt),N!==0?L.blitFramebuffer(Ft,Bt,gt,Et,jt,le,gt,Et,L.COLOR_BUFFER_BIT,L.NEAREST):en?L.copyTexSubImage3D(ve,rt,jt,le,Ee+Ge,Ft,Bt,gt,Et):L.copyTexSubImage2D(ve,rt,jt,le,Ft,Bt,gt,Et);$.bindFramebuffer(L.READ_FRAMEBUFFER,null),$.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else en?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(ve,rt,jt,le,Ee,gt,Et,xt,fe,It,_e.data):I.isCompressedArrayTexture?L.compressedTexSubImage3D(ve,rt,jt,le,Ee,gt,Et,xt,fe,_e.data):L.texSubImage3D(ve,rt,jt,le,Ee,gt,Et,xt,fe,It,_e):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,rt,jt,le,gt,Et,fe,It,_e.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,rt,jt,le,_e.width,_e.height,fe,_e.data):L.texSubImage2D(L.TEXTURE_2D,rt,jt,le,gt,Et,fe,It,_e);L.pixelStorei(L.UNPACK_ROW_LENGTH,ie),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,$e),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ni),L.pixelStorei(L.UNPACK_SKIP_ROWS,Je),L.pixelStorei(L.UNPACK_SKIP_IMAGES,ys),rt===0&&I.generateMipmaps&&L.generateMipmap(ve),$.unbindTexture()},this.initRenderTarget=function(E){nt.get(E).__webglFramebuffer===void 0&&ht.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?ht.setTextureCube(E,0):E.isData3DTexture?ht.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ht.setTexture2DArray(E,0):ht.setTexture2D(E,0),$.unbindTexture()},this.resetState=function(){A=0,b=0,P=null,$.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}const Vn=[{name:"練習壁",height:7,color:13155228,sky:10275800,seed:11},{name:"01 / 青空の市街地",height:48,color:12433574,sky:10144218,seed:120},{name:"02 / 黄昏の商業地区",height:56,color:11696473,sky:13340025,seed:220},{name:"03 / ネオンの夜",height:64,color:3492184,sky:1121592,seed:320},{name:"04 / 雲上の塔",height:76,color:8623516,sky:11058120,seed:420}];function Ks(i){return()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Jh(i){const t=[];for(let e=.8;e<i+1;e+=.4)for(let n=-3;n<=3;n+=.6)t.push({id:t.length,p:new C(n,e,.17),kind:Math.abs(n)<.1?"concrete":"metal",window:Math.round(e*10)%12===0&&Math.abs(n)>1});return t}const Ps=i=>Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z);class N_{constructor(){dt(this,"rig",new C(0,0,.76));dt(this,"anchors",{})}grab(t,e,n){return!Ps(e)||!Ps(n.p)||!Ps(this.rig)?!1:(this.anchors[t]={target:e.clone().add(this.rig),previous:e.clone(),hold:n},!0)}release(t){delete this.anchors[t]}reset(t=0){this.anchors={},this.rig.set(0,t,.76)}solve(t,e){if(!Number.isFinite(e)||e<0||!Ps(this.rig))return this.anchors={},!1;const n=new C;let s=0;for(const r of["left","right"]){const o=this.anchors[r],a=t[r];if(o&&!a)return this.anchors={},!1;if(o&&a){if(!Ps(a)||a.distanceTo(o.previous)>.35)return this.anchors={},!1;o.previous.copy(a),n.add(o.target.clone().sub(a).sub(this.rig)),s++}}if(s){if(n.divideScalar(s),n.length()>.25)return this.anchors={},!1;n.clampLength(0,Math.max(.001,e)*1.8),n.z=0,this.rig.add(n),this.rig.x=Math.max(-3.2,Math.min(3.2,this.rig.x))}return!0}}function Zh(i,t){const e=[];for(let n=7;n<t-2;n+=9){const s=(Math.floor(n)%2?1:-1)*2.2;e.push({x:s,y:n,width:1.25,height:.65}),i>1&&e.push({x:-s,y:n+2,width:1.5,height:.55})}return e}function F_(i,t,e=.15){return t.some(n=>Math.abs(i.x-n.x)<n.width/2+e&&Math.abs(i.y-n.y)<n.height/2+e)}function O_(i,t,e){return i.distanceTo(t)<e}class B_{constructor(){dt(this,"armed",!1);dt(this,"unsupportedSeconds",0)}reset(){this.armed=!1,this.unsupportedSeconds=0}update(t,e){return t?(this.armed=!0,this.unsupportedSeconds=0,!1):this.armed?(this.unsupportedSeconds+=Math.max(0,Math.min(e,.05)),this.unsupportedSeconds>=.4):!1}}class z_{constructor(){dt(this,"highest",0);dt(this,"combo",0);dt(this,"lastHand")}reset(t=0){this.highest=t,this.combo=0,this.lastHand=void 0}breakCombo(){this.combo=0,this.lastHand=void 0}claim(t,e){return!Number.isFinite(e)||e<this.highest+.3?0:(this.highest=e,this.combo=this.lastHand!==t?this.combo+1:1,this.lastHand=t,10+Math.min(this.combo,20))}}function H_(i,t,e){const n=i===0?t:Math.max(0,t-1);return{lives:n,height:i===0?0:Math.max(0,e),phase:n===0?"over":"paused"}}function V_(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Ce;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let p=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const u=[];for(let p=0;p<i.length;++p){const d=i[p].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=i[p].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Yl(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<u;++p){const d=[];for(let _=0;_<o[h].length;++_)d.push(o[h][_][p]);const m=Yl(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Yl(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new ln(o,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let p=0,d=h.count;p<d;p++)for(let m=0;m<e;m++){const _=h.getComponent(p,m);a.setComponent(p+u,m,_)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const Ls=new C;function rn(i,t,e,n,s,r){const o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Ls.copy(t),Ls[n]=0,Ls.normalize();const c=.5*o/(o+a),h=1-Ls.angleTo(i)/l;return Math.sign(Ls[e])===1?h*c:a/(o+a)+c+c*(1-h)}class lo extends Xe{constructor(t=1,e=1,n=1,s=2,r=.1){const o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new C,c=new C,h=new C(t,e,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,p=this.attributes.normal.array,d=this.attributes.uv.array,m=u.length/6,_=new C,g=.5/o;for(let f=0,T=0;f<u.length;f+=3,T+=2)switch(l.fromArray(u,f),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),u[f+0]=h.x*Math.sign(l.x)+c.x*r,u[f+1]=h.y*Math.sign(l.y)+c.y*r,u[f+2]=h.z*Math.sign(l.z)+c.z*r,p[f+0]=c.x,p[f+1]=c.y,p[f+2]=c.z,Math.floor(f/m)){case 0:_.set(1,0,0),d[T+0]=rn(_,c,"z","y",r,n),d[T+1]=1-rn(_,c,"y","z",r,e);break;case 1:_.set(-1,0,0),d[T+0]=1-rn(_,c,"z","y",r,n),d[T+1]=1-rn(_,c,"y","z",r,e);break;case 2:_.set(0,1,0),d[T+0]=1-rn(_,c,"x","z",r,t),d[T+1]=rn(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),d[T+0]=1-rn(_,c,"x","z",r,t),d[T+1]=1-rn(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),d[T+0]=1-rn(_,c,"x","y",r,t),d[T+1]=1-rn(_,c,"y","x",r,e);break;case 5:_.set(0,0,-1),d[T+0]=rn(_,c,"x","y",r,t),d[T+1]=1-rn(_,c,"y","x",r,e);break}}static fromJSON(t){return new lo(t.width,t.height,t.depth,t.segments,t.radius)}}const $l=new Map;function Kh(i,t=256){const e=i+t,n=$l.get(e);if(n)return n;const s=t/256,r=Ks(81+i.length*19),o=new Float32Array(t*t),a=new Uint8Array(t*t*4),l=new Uint8Array(t*t*4),c=new Uint8Array(t*t*4);for(let p=0;p<t;p++)for(let d=0;d<t;d++){const m=p*t+d,_=r(),g=r();let f=.5+(_-.5)*.12,T=.91+(g-.5)*.08,v=.84;if(i==="concrete"||i==="plaster"){const x=_>.982?.2:0,R=Math.pow((Math.sin(d/s*.147)+1)/2,14)*(.5+.5*Math.cos(p*Math.PI*2/t));f-=x,T-=x*.55+R*.055,v=.8+_*.15,i==="plaster"&&(f=.5+(_-.5)*.035,T=.96+(g-.5)*.035,v=.91)}else if(i==="cloth"){const x=Math.sin(d/s*Math.PI/2)*Math.cos(p/s*Math.PI/2);f=.5+x*.13+(t===1024?Math.sin(d*1.7+p*.07)*.009:0),T=.91+x*.055,v=.96}else i==="metal"?(f=.5+Math.sin(p/s*2.7)*.012,T=.92+Math.sin(p/s*2.7)*.025,v=.32+g*.12):(f=.5+(_-.5)*.025,T=.93+(g-.5)*.04,v=.26+g*.08);o[m]=f;for(let x=0;x<3;x++)a[m*4+x]=Math.round(T*255),l[m*4+x]=Math.round(v*255);a[m*4+3]=l[m*4+3]=255}for(let p=0;p<t;p++)for(let d=0;d<t;d++){const m=(v,x)=>o[(x+t)%t*t+(v+t)%t],_=(m(d-1,p)-m(d+1,p))*1.8,g=(m(d,p-1)-m(d,p+1))*1.8,f=Math.hypot(_,g,1),T=(p*t+d)*4;c[T]=(_/f*.5+.5)*255,c[T+1]=(g/f*.5+.5)*255,c[T+2]=(.5/f+.5)*255,c[T+3]=255}const h=(p,d=!1)=>{const m=new Ah(p,t,t);return m.wrapS=m.wrapT=qr,m.generateMipmaps=!0,m.minFilter=ni,m.magFilter=gn,m.colorSpace=d?He:Hn,m.needsUpdate=!0,m},u={map:h(a,!0),normalMap:h(c),roughnessMap:h(l)};return $l.set(e,u),u}function yn(i,t,e=!1){const n=i==="metal",s=new hn({color:t,...Kh(i),metalness:n?.78:0,roughness:e?.3:1,normalScale:new ot(e?.22:.55,e?.22:.55),envMapIntensity:e?.8:n?.65:.22});return s.userData.surfaceKind=i,s}function Jl(i,t,e){const n=new Xe(i,t,e),s=n.getAttribute("uv"),r=n.getAttribute("normal");for(let o=0;o<s.count;o++){const a=Math.abs(r.getX(o))>.5,l=Math.abs(r.getY(o))>.5;s.setXY(o,s.getX(o)*(a?e:i)/1.8,s.getY(o)*(l?e:t)/1.8)}return n}function G_(i,t,e=8){const n=t==="4k"?1024:256,s=Math.max(1,Math.min(e,t==="4k"?8:t==="high"?4:2)),r=new Set;i.traverse(o=>{if(o instanceof Ut)for(const a of Array.isArray(o.material)?o.material:[o.material])a instanceof hn&&a.userData.surfaceKind&&r.add(a)});for(const o of r){const a=Kh(o.userData.surfaceKind,n);for(const l of["map","normalMap","roughnessMap"]){const c=a[l];c.anisotropy!==s&&(c.anisotropy=s,c.needsUpdate=!0),o[l]=c}}return{materials:r.size,textureSize:n,anisotropy:s}}class k_{constructor(){dt(this,"shards",Array.from({length:16},()=>({position:new C,velocity:new C,rotation:new C,spin:new C})));dt(this,"age",2);dt(this,"lifetime",1.2)}reset(){this.age=this.lifetime}burst(t){const e=Ks(97);this.age=0;for(const n of this.shards)n.position.copy(t),n.velocity.set((e()-.5)*1.8,.4+e()*1.1,.25+e()*.8),n.rotation.set(e()*3,e()*3,e()*3),n.spin.set(e()*5,e()*6,e()*4)}update(t){if(this.age>=this.lifetime)return;const e=Math.max(0,Math.min(t,.05));this.age=Math.min(this.lifetime,this.age+e);for(const n of this.shards)n.velocity.y-=4*e,n.position.addScaledVector(n.velocity,e),n.rotation.addScaledVector(n.spin,e)}get active(){return this.age<this.lifetime}get scale(){return this.active?Math.min(1,(this.lifetime-this.age)/.3):0}}class W_{constructor(){dt(this,"active",!1);dt(this,"age",0);dt(this,"notified",!1);dt(this,"position",new C)}start(t){this.active=!0,this.age=0,this.notified=!1,this.position.set(8,t+5,-2)}reset(){this.active=!1,this.age=0,this.notified=!1}update(t,e){if(!this.active)return!1;this.age=Math.min(12,this.age+Math.max(0,Math.min(t,.05)));const n=Se.smoothstep(this.age,0,3.2);return this.position.set(Se.lerp(8,0,n),Se.lerp(e+5,e+2.8,n)+Math.sin(this.age*2)*.035,Se.lerp(-2,-.6,n)),this.age>=3.2&&!this.notified?(this.notified=!0,!0):!1}}function X_(){const i=new Te,t=new hn({color:13357510,roughness:.85}),e=new hn({color:3161671,roughness:.8}),n=new hn({color:13936218,roughness:.7}),s=(l,c,h,u,p,d,m,_)=>{const g=new Ut(new ri(1,12,8),c);return g.position.set(h,u,p),g.scale.set(d,m,_),l.add(g),g};s(i,t,0,0,0,.085,.075,.19),s(i,t,0,.08,-.16,.065,.066,.075);const r=new Ut(new Mc(.025,.09,8),n);r.rotation.x=-Math.PI/2,r.position.set(0,.075,-.255),i.add(r);for(const l of[-1,1])s(i,e,l*.053,.097,-.191,.008,.009,.009);const o=[],a=[];for(const l of[-1,1]){const c=new Te;c.position.set(l*.065,.025,0),c.userData.side=l,i.add(c),o.push(c);const h=new Oh;h.moveTo(0,-.13),h.quadraticCurveTo(.13,-.18,.29,-.04),h.quadraticCurveTo(.27,.08,.16,.12),h.lineTo(0,.1),h.closePath();const u=new Ut(new Ec(h,{depth:.012,bevelEnabled:!0,bevelSegments:1,steps:1,bevelSize:.007,bevelThickness:.004,curveSegments:7}),t);u.rotation.x=Math.PI/2,u.scale.x=l,c.add(u);const p=new Te;p.position.x=l*.25,c.add(p),a.push(p);for(let d=0;d<6;d++){const m=s(p,d<2?t:e,l*(.035+d*.017),-.008,.02+d*.024,.025,.008,.13-d*.008);m.rotation.y=-l*(.35+d*.08)}}for(let l=0;l<5;l++){const c=s(i,t,(l-2)*.018,-.015,.2,.018,.009,.095);c.rotation.y=(l-2)*.12}return i.userData.wings=o,i.userData.wingTips=a,i}function q_(i,t){i.userData.wings.forEach((e,n)=>{const s=e.userData.side;e.rotation.z=s*(Math.sin(t*8)*.38+.06),i.userData.wingTips[n].rotation.z=s*Math.sin(t*8-.55)*.24})}function Y_(i,t,e){const n=e==="4k"?32:e==="high"?22:e==="low"?7:12;return i?t<n+2:t<n}function Rc(i,t,e,n=0){const s=Number.isFinite(i)?Math.max(0,i):0,r=Se.clamp(Number.isFinite(t)?t:0,0,90)/90,o=(s+(n>>>0)%13)%19/19,a=Se.smoothstep(o,.12,.38)*(1-Se.smoothstep(o,.55,.93));return{strength:e?.24+.34*r+a*(.15+.24*r):.16+.18*r,gust:e?a:0,direction:.28+Math.sin(s*.09+(n>>>0)%7)*.18}}class $_{constructor(){dt(this,"root",new Te);dt(this,"socks",[]);dt(this,"cloth",yn("cloth",16777215));dt(this,"metal",yn("metal",8229786));dt(this,"bracketGeometry",new ir(.024,.024,.62,8));dt(this,"hoopGeometry",new ms(.15,.018,6,16));dt(this,"seed",0);dt(this,"lastUpdate","");this.cloth.vertexColors=!0,this.cloth.side=Sn;for(let t=0;t<12;t++){const e=new Ce,n=[],s=[],r=[],o=[];for(let u=0;u<=10;u++)for(let p=0;p<=10;p++){const d=u/10,m=p/10*Math.PI*2,_=.15*(1-d*.62);n.push(d*.95,Math.cos(m)*_,Math.sin(m)*_),s.push(d,p/10);const g=new $t(u%4<2?14853209:14870484);if(r.push(g.r,g.g,g.b),u<10&&p<10){const f=u*11+p;o.push(f,f+11,f+1,f+1,f+11,f+12)}}e.setAttribute("position",new te(n,3).setUsage(_h)),e.setAttribute("uv",new te(s,2)),e.setAttribute("color",new te(r,3)),e.setIndex(o),e.computeVertexNormals(),e.boundingSphere=new Di(new C(.48,-.15,0),.85);const a=new Ut(e,this.cloth),l=new Te;l.add(a);const c=new Ut(this.bracketGeometry,this.metal);c.position.y=-.31,l.add(c);const h=new Ut(this.hoopGeometry,this.metal);h.rotation.y=Math.PI/2,l.add(h),this.root.add(l),this.socks.push(a)}this.root.visible=!1}configure(t,e,n){this.root.visible=t,this.seed=n,this.lastUpdate="",this.root.children.forEach((s,r)=>{s.position.set(r%2?3.9:-3.9,3+r*(e-5)/11,.85),s.visible=!1})}update(t,e,n){if(!this.root.visible)return;const s=`${t}/${e}/${n}`;if(s===this.lastUpdate)return;this.lastUpdate=s;const r=n==="4k"?36:n==="high"?28:n==="low"?10:18;for(const o of this.socks){const a=o.parent;if(a.visible=Math.abs(a.position.y-e)<r,!a.visible)continue;const l=Rc(t,a.position.y,!0,this.seed),c=o.geometry.getAttribute("position");a.rotation.y=l.direction;for(let h=0;h<=10;h++)for(let u=0;u<=10;u++){const p=h/10,d=u/10*Math.PI*2,m=.15*(1-p*.62),_=Math.sin(t*(3+l.strength*3)-p*9+a.position.y)*p*.055*l.strength;c.setXYZ(h*11+u,p*(.45+.5*l.strength),Math.cos(d)*m-p*p*(1-l.strength)*.32+_,Math.sin(d)*m+_*.7)}c.needsUpdate=!0,o.geometry.computeVertexNormals()}}dispose(){for(const t of this.socks)t.geometry.dispose();this.bracketGeometry.dispose(),this.hoopGeometry.dispose(),this.cloth.dispose(),this.metal.dispose(),this.root.removeFromParent()}}const je=(i,t=0,e=.7)=>new hn({color:i,metalness:t,roughness:e}),Is=new Xe(1,1,1),Qi=new lo(1,1,1,2,.1),Qo=new lo(1,1,1,5,.1);function oe(i,t,e,n,s,r,o,a,l=!1){const c=new Ut(l?Qi:Is,t);return c.position.set(e,n,s),c.scale.set(r,o,a),i.add(c),c}function ai(i,t=3,e=.4){const n=document.createElement("canvas");n.width=1024,n.height=256;const s=n.getContext("2d");s.fillStyle="#142b36",s.fillRect(0,0,1024,256),s.strokeStyle="#ccf77a",s.lineWidth=8,s.strokeRect(5,5,1014,246),s.fillStyle="#e5f6dd",s.font="bold 65px sans-serif",s.measureText(i).width>950&&(s.font=`bold ${Math.max(32,Math.floor(65*950/s.measureText(i).width))}px sans-serif`),s.textAlign="center",s.textBaseline="middle",s.fillText(i,512,128,950);const r=new hd(n);return r.colorSpace=He,new Ut(new Ii(t,e),new Ri({map:r}))}class J_{constructor(t){dt(this,"group",new Te);dt(this,"windows",[]);dt(this,"birds",[]);dt(this,"signs",[]);dt(this,"pot");dt(this,"city");dt(this,"stage",Vn[0]);dt(this,"debris",new k_);dt(this,"shards");dt(this,"shardDummy",new we);dt(this,"quality","quest");dt(this,"rescue",new W_);dt(this,"drone",new Te);dt(this,"rotors",[]);dt(this,"roofSound",new C);dt(this,"trafficPositions",[]);dt(this,"cars",[]);dt(this,"carBody");dt(this,"carCabin");dt(this,"windowProxy");dt(this,"sceneTime",0);dt(this,"wind",new $_);dt(this,"tower",!1);this.scene=t,t.add(this.group,this.wind.root),this.pot=new Te;const e=yn("ceramic",12084802),n=[new ot(.1,0),new ot(.115,.02),new ot(.16,.22),new ot(.175,.225),new ot(.175,.25),new ot(.145,.25),new ot(.14,.22),new ot(.1,.04)],s=new Ut(new Tc(n,24),e);this.pot.add(s);const r=new Ut(new ir(.14,.14,.015,16),je(3353120));r.position.y=.225,this.pot.add(r);const o=yn("cloth",4425298);for(let v=0;v<7;v++){const x=new Ut(new ri(1,10,6),o);x.scale.set(.045,.13,.018),x.position.set(Math.sin(v*2.4)*.07,.32,Math.cos(v*2.4)*.07),x.rotation.set(.25,v*2.4,Math.sin(v*2.4)*.6),this.pot.add(x)}const a=new Ce;a.setAttribute("position",new te([-.04,0,0,.04,0,0,.01,.08,.015,-.04,0,-.012,.04,0,-.012,.01,.08,.003],3)),a.setIndex([0,1,2,5,4,3,0,3,4,0,4,1,1,4,5,1,5,2,2,5,3,2,3,0]),a.computeVertexNormals(),this.shards=new pn(a,e,16),this.shards.visible=!1,this.shards.frustumCulled=!1,t.add(this.shards),t.add(this.pot),this.pot.visible=!1;const l=je(6586763);this.city=new pn(Is,l,220);const c=Ks(489),h=new we;for(let v=0;v<220;v++){const x=(c()-.5)*220,R=12+c()*210,A=3+c()*36;h.position.set(x,A/2-7,R),h.scale.set(5+c()*8,A,5+c()*8),h.updateMatrix(),this.city.setMatrixAt(v,h.matrix),this.city.setColorAt(v,new $t().setHSL(.54+c()*.08,.12,.23+c()*.3))}t.add(this.city);const u=new Te;t.add(u);const p=je(3688270),d=je(13419423);oe(u,je(2571333),0,-7,90,450,.4,450);for(let v=15;v<220;v+=25){oe(u,p,0,-6.7,v,250,.05,7);for(let x=-110;x<110;x+=8)oe(u,d,x,-6.65,v,2,.02,.12)}const m=new Map;for(const v of u.children){const x=v.material;m.set(x,[...m.get(x)||[],v])}for(const v of m.values()){const x=new pn(Is,v[0].material,v.length);v.forEach((R,A)=>{R.updateMatrix(),x.setMatrixAt(A,R.matrix),u.remove(R)}),x.computeBoundingSphere(),u.add(x)}this.carBody=new pn(Qi,je(16777215,.3),50),this.carCabin=new pn(Qi,je(2309194,.5,.2),50),this.carBody.frustumCulled=this.carCabin.frustumCulled=!1,t.add(this.carBody,this.carCabin);for(let v=0;v<50;v++)this.cars.push({x:-100+v*4,z:14+v%7*25,direction:v%2?1:-1}),this.trafficPositions.push(new C),this.carBody.setColorAt(v,new $t(v%3===0?13152895:v%3===1?7048347:11758680));this.updateTraffic();const _=new pn(new xc(.14,.85,3,6),je(2700348),70);for(let v=0;v<70;v++)h.position.set(-95+c()*190,-6.07,10+v%7*25),h.scale.setScalar(.8+c()*.3),h.updateMatrix(),_.setMatrixAt(v,h.matrix);t.add(_);for(let v=0;v<3;v++){const x=X_();t.add(x),this.birds.push(x)}const g=je(14278351,.45,.35),f=je(2242112,.35,.65),T=new hn({color:9556923,emissive:7122835,emissiveIntensity:.3});oe(this.drone,g,0,0,0,.54,.2,.38,!0),oe(this.drone,f,0,-.13,-.15,.13,.12,.13,!0);for(const v of[-.38,.38])for(const x of[-.3,.3]){oe(this.drone,f,v*.5,0,x*.5,.48,.04,.04,!0).rotation.y=x>0?-v:v;const R=new Te;R.position.set(v,.07,x),oe(R,f,0,0,0,.55,.015,.035,!0),oe(R,f,0,0,0,.035,.015,.55,!0),this.drone.add(R),this.rotors.push(R),oe(this.drone,T,v,-.03,x,.07,.04,.07,!0)}for(const v of[-.2,.2])oe(this.drone,f,v,-.19,0,.035,.035,.52,!0);this.drone.visible=!1,t.add(this.drone)}build(t){this.group.traverse(b=>{b instanceof pn&&b.dispose()}),this.pot.rotation.set(0,0,0);const e=new Set;this.group.traverse(b=>{var P;b instanceof Ut&&(b.geometry!==Is&&b.geometry!==Qi&&b.geometry!==Qo&&e.add(b.geometry),b.material instanceof Ri&&((P=b.material.map)==null||P.dispose()))}),e.forEach(b=>b.dispose());const n=new Set;this.group.traverse(b=>{if(b instanceof Ut){const P=b.material;Array.isArray(P)?P.forEach(y=>n.add(y)):n.add(P)}}),n.forEach(b=>b.dispose()),this.group.clear(),this.rescue.reset(),this.drone.visible=!1,this.resetDebris(),this.windows=[],this.signs=[],this.stage=Vn[t],this.sceneTime=0,this.tower=t===4,this.wind.configure(this.tower,this.stage.height,this.stage.seed),this.roofSound.set(2,this.stage.height+1,-3);const s=this.stage,r=Ks(s.seed);this.scene.background=new $t(s.sky),this.scene.fog=new _c(s.sky,60,270);const o=yn("concrete",s.color,t===3),a=yn("metal",8886685),l=je(1979712,.15,.55),c=new hn({color:t===3?5995665:7904421,metalness:.7,roughness:t===3?.12:.24,envMapIntensity:.85}),h=yn("cloth",13152129),u=yn("plaster",10130561),p=je(2769226,.8,.3),d=new hn({color:15120733,emissive:15115074,emissiveIntensity:t===3?.45:.12}),m=new Ut(Jl(7.5,s.height+2,1),o);m.position.set(0,s.height/2,-1.1),this.group.add(m);for(const[b,P]of[[-3.65,.2],[-2.25,.34],[-.75,.34],[0,1.16],[.75,.34],[2.25,.34],[3.65,.2]]){const y=new Ut(Jl(P,s.height+2,.6),o);y.position.set(b,s.height/2,-.3),this.group.add(y)}const _=[new Xe(1,.035,.035).translate(.475,-.365,.02),new Xe(1,.035,.035).translate(.475,.365,.02),new Xe(.035,.73,.035).translate(0,0,.02),new Xe(.035,.73,.035).translate(.95,0,.02),new Xe(.025,.09,.025).translate(.87,0,.05)],g=V_(_);_.forEach(b=>b.dispose());const f=new Ii(.4,.73,12,1),T=f.getAttribute("position");for(let b=0;b<T.count;b++)T.setZ(b,Math.sin(T.getX(b)*85)*.018);f.computeVertexNormals();for(let b=0;b<s.height+2;b+=1.2){oe(this.group,o,0,b+.11,-.27,7.5,.22,.6),oe(this.group,l,0,b,.04,7.5,.022,.02);for(const P of[-3,-1.5,0,1.5,3]){if(oe(this.group,l,P,b+.6,.012,.018,1.2,.025),P===0)continue;oe(this.group,u,P,b+.65,-.56,1.16,.88,.07),oe(this.group,u,P,b+.22,-.25,1.16,.045,.65);for(const S of[-.56,.56])oe(this.group,u,P+S,b+.65,-.28,.045,.88,.6);for(const S of[-.34,.34]){const D=new Ut(f,h);D.position.set(P+S,b+.67,-.28),this.group.add(D)}oe(this.group,l,P,b+.36,-.38,.44,.035,.18,!0);const y=new Te;y.position.set(P-.475,b+.65,.085),this.group.add(y),oe(y,c,.475,0,0,.95,.73,.025),y.add(new Ut(g,a)),y.rotation.y=.65,this.windows.push({o:y,x:P,y:b+.65,phase:r()*15,closed:!1,detail:!0}),oe(this.group,a,P,b+.22,.14,1.24,.09,.19,!0),oe(this.group,a,P,b+1.08,.12,1.24,.07,.14,!0);for(const S of[-.59,.59])oe(this.group,a,P+S,b+.65,.12,.07,.88,.14,!0),oe(this.group,p,P+S,b+.28,.22,.025,.025,.015);r()<.22&&oe(this.group,d,P,b+.95,-.47,.5,.06,.02)}}for(const b of[-3,-2.4,-1.8,-1.2,-.6,0,.6,1.2,1.8,2.4,3]){oe(this.group,a,b,s.height/2,.14,.045,s.height,.07,!0);for(let P=.8;P<s.height+1;P+=.4)oe(this.group,a,b,P,.18,.22,.045,.14,!0)}for(let b=7;b<s.height-2;b+=9){const P=(Math.floor(b)%2?1:-1)*2.2;oe(this.group,l,P,b,.45,1.25,.65,.7,!0);for(let y=0;y<5;y++)oe(this.group,a,P,b-.2+y*.1,.81,1.1,.025,.02);if(t>1){const y=ai(t===3?"夜 空 / SKY":"SKYGRIP",1.5,.55);y.position.set(-P,b+2,.4),this.group.add(y),this.signs.push(y)}}oe(this.group,a,0,s.height+.5,0,8,.3,1.5,!0),oe(this.group,je(4216923),0,s.height+.4,-4,8,.25,8);const v=ai("ROOFTOP / 到達",3,.5);v.position.set(0,s.height+1.2,.3),this.group.add(v),oe(this.group,l,2,s.height+1,-3,1.6,1.2,1.6,!0),this.windowProxy=new pn(Is,c,this.windows.length),this.windowProxy.instanceMatrix.setUsage(_h),this.windowProxy.frustumCulled=!1;const x=new ce().makeScale(0,0,0);for(let b=0;b<this.windows.length;b++)this.windowProxy.setMatrixAt(b,x);this.group.add(this.windowProxy);const R=new Set([...this.windows.map(b=>b.o),...this.signs,v,this.windowProxy]),A=new Map;for(const b of[...this.group.children])if(b instanceof Ut&&!R.has(b)){const P=b.geometry.uuid+":"+b.material.uuid,y=A.get(P)||[];y.push(b),A.set(P,y)}for(const b of A.values()){const P=new pn(b[0].geometry,b[0].material,b.length);b.forEach((y,S)=>{y.updateMatrix(),P.setMatrixAt(S,y.matrix),this.group.remove(y)}),P.computeBoundingSphere(),this.group.add(P)}}setQuality(t){this.quality=t,this.scene.traverse(e=>{e instanceof Ut&&(e.geometry===Qi||e.geometry===Qo)&&(e.geometry=t==="4k"?Qo:Qi)}),this.shards.count=t==="low"?8:16}resetDebris(){this.debris.reset(),this.shards.visible=!1}breakPot(t){this.debris.burst(t),this.shards.visible=!0}updateTraffic(){const t=this.shardDummy;this.cars.forEach((e,n)=>{const s=(e.x+e.direction*this.sceneTime*2.8+330)%220-110,r=this.trafficPositions[n];r.set(s,-6.05,e.z),t.position.copy(r),t.rotation.set(0,0,0),t.scale.set(1.7,.55,.8),t.updateMatrix(),this.carBody.setMatrixAt(n,t.matrix),t.position.y+=.35,t.scale.set(.85,.35,.72),t.updateMatrix(),this.carCabin.setMatrixAt(n,t.matrix)}),this.carBody.instanceMatrix.needsUpdate=this.carCabin.instanceMatrix.needsUpdate=!0}windAt(t){return Rc(this.sceneTime,t,this.tower,this.stage.seed)}updateDetail(t){if(this.wind.update(this.sceneTime,t,this.quality),!this.windowProxy)return;let e=!1;this.windows.forEach((n,s)=>{const r=Y_(n.detail,Math.abs(n.y-t),this.quality);r!==n.detail&&(e=!0,n.detail=r,n.o.visible=r,this.shardDummy.position.set(n.x,n.y,.085),this.shardDummy.rotation.set(0,0,0),this.shardDummy.scale.set(r?0:.95,r?0:.73,r?0:.025),this.shardDummy.updateMatrix(),this.windowProxy.setMatrixAt(s,this.shardDummy.matrix))}),e&&(this.windowProxy.instanceMatrix.needsUpdate=!0)}startRescue(){this.rescue.start(this.stage.height),this.drone.visible=!0}animate(t,e=0){if(e<=0)return!1;this.sceneTime+=e,this.updateTraffic();const n=this.rescue.update(e,this.stage.height);this.drone.visible=this.rescue.active,this.rescue.active&&(this.drone.position.copy(this.rescue.position),this.rotors.forEach((s,r)=>s.rotation.y=this.sceneTime*(r%2?-35:35))),this.debris.update(e),this.shards.visible=this.debris.active,this.debris.active&&(this.debris.shards.forEach((s,r)=>{this.shardDummy.position.copy(s.position),this.shardDummy.rotation.set(s.rotation.x,s.rotation.y,s.rotation.z),this.shardDummy.scale.setScalar(this.debris.scale),this.shardDummy.updateMatrix(),this.shards.setMatrixAt(r,this.shardDummy.matrix)}),this.shards.instanceMatrix.needsUpdate=!0);for(const s of this.birds)q_(s,this.sceneTime);return this.signs.forEach((s,r)=>s.rotation.z=Math.sin(this.sceneTime*1.2+r)*(.015+this.windAt(s.position.y).strength*.055)),n}}function ta(i,t=16){const e=[],n=[],s=[];for(let o=0;o<i.length;o++){const a=i[o];for(let l=0;l<=t;l++){const c=l/t*Math.PI*2;e.push((a.cx||0)+Math.cos(c)*a.x,a.y,Math.sin(c)*a.z),n.push(l/t,o/(i.length-1))}}for(let o=0;o<i.length-1;o++)for(let a=0;a<t;a++){const l=o*(t+1)+a,c=l+t+1;s.push(l,c,l+1,c,c+1,l+1)}for(const[o,a]of[[0,!0],[i.length-1,!1]]){const l=i[o],c=e.length/3;e.push(l.cx||0,l.y,0),n.push(.5,.5);for(let h=0;h<t;h++){const u=o*(t+1)+h;s.push(c,a?u:u+1,a?u+1:u)}}const r=new Ce;return r.setAttribute("position",new te(e,3)),r.setAttribute("uv",new te(n,2)),r.setIndex(s),r.computeVertexNormals(),r.computeBoundingBox(),r}function Ja(i,t=!1){const e=new Te,n=i==="left"?1:-1,s=yn("cloth",i==="left"?14133325:5749167),r=yn("cloth",2374466),o=new hn({color:15259812,roughness:.85}),a=new Ut(ta([{y:-.075,x:.032,z:.021},{y:-.045,x:.039,z:.024},{y:0,x:.045,z:.025},{y:.035,x:.043,z:.021},{y:.052,x:.036,z:.015}],t?32:16),s);e.add(a);const l=new Ut(new ri(1,t?24:16,t?16:10),r);l.position.set(0,-.004,-.021),l.scale.set(.035,.045,.007),e.add(l);const c=new Ut(ta([{y:-.095,x:.035,z:.024},{y:-.088,x:.037,z:.026},{y:-.067,x:.035,z:.024}],t?32:16),r);e.add(c);const h=new Ut(new ms(.035,.002,5,24),o);h.rotation.x=Math.PI/2,h.scale.y=.68,h.position.y=-.077,e.add(h);const u=[],p=[],d=[.072,.083,.078,.061];for(let m=0;m<5;m++){const _=m===4,g=new Te;g.position.set(_?n*.037:n*(.032-m*.021),_?-.025:.04+(m===1?.009:m===3?-.007:0),_?-.002:0),g.rotation.z=_?-n*.83:n*(m-1.5)*.035,e.add(g);let f=g;const T=_?.06:d[m],v=_?.014:.0105-(m===3?.001:0),x=_?2:3;for(let R=0;R<x;R++){const A=new Te;f.add(A);const b=T*(_?.5:[.43,.32,.25][R]),P=new Ut(ta([{y:0,x:v*(1-R*.12),z:v*.91},{y:b*.18,x:v*(1.03-R*.12),z:v*.95},{y:b*.78,x:v*(.9-R*.12),z:v*.82},{y:b,x:v*(.74-R*.12),z:v*.65}],t?24:12),s);A.add(P);const y=new Ut(new ri(1,t?20:12,t?12:8),r);y.position.set(0,b*.56,-v*.78),y.scale.set(v*.76,b*.35,.003),A.add(y);const S=new Ut(new ri(1,t?20:12,t?12:8),s);S.scale.set(v*.96,v*.64,v*.9),A.add(S),u.push({node:A,open:_?-.16:-.1-R*.07,closed:_?-.85:R===0?-1.12:R===1?-1.4:-.9});const D=new Te;D.position.y=b,A.add(D),f=D,R===x-1&&p.push(D)}}for(const m of[-.021,0,.021]){const _=new Lh([new C(m,-.043,.023),new C(m*1.1,-.01,.026),new C(m,.032,.021)]);e.add(new Ut(new bc(_,5,9e-4,4,!1),o))}return e.userData.joints=u,e.userData.tipNodes=p,e.userData.curl=0,jh(e,!1,1),e}function jh(i,t,e){const n=t?1:0,s=Se.damp(i.userData.curl||0,n,24,Math.min(e,.05));i.userData.curl=s;for(const r of i.userData.joints)r.node.rotation.x=Se.lerp(r.open,r.closed,s)}const ea=(i,t,e,n)=>Number.isFinite(i)?Se.clamp(i,e,n):t;function Qh(i){return{eyeHeight:ea(i.eyeHeight,1.6,.8,1.95),armLength:ea(i.armLength,.64,.45,.85),handSize:ea(i.handSize,1,.8,1.2)}}function ho(i){return 1.6-i.eyeHeight}function Z_(i){return Se.clamp(.64/i.armLength,.85,1.3)}function tu(i,t){const e=new C(0,t.eyeHeight-.3,0);return i.clone().sub(e).multiplyScalar(Z_(t)).add(e).add(new C(0,ho(t),0))}function K_(i,t){const e=i.distanceTo(new C(i.x<0?-.18:.18,t-.25,0));return Number.isFinite(e)&&e>=.3&&e<=.95?Se.clamp(e,.45,.85):null}class j_ extends wh{constructor(){super();const t=new Xe;t.deleteAttribute("uv");const e=new hn({side:Ne}),n=new hn,s=new Yd(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Ut(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const o=new pn(t,n,6),a=new we;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);const l=new Ut(t,Ki(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Ut(t,Ki(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Ut(t,Ki(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new Ut(t,Ki(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const p=new Ut(t,Ki(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const d=new Ut(t,Ki(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Ki(i){return new Gd({color:0,emissive:16777215,emissiveIntensity:i})}function Q_(i,t,e,n){const s=r=>Number.isFinite(r)?Se.clamp(r,0,1):0;return{effects:e?s(i):0,music:e?s(t)*(n?.22:1):0}}class tv{constructor(t=()=>new AudioContext){dt(this,"ctx");dt(this,"master");dt(this,"effects");dt(this,"music");dt(this,"vol",.6);dt(this,"musicVol",.15);dt(this,"lastBeat",-1);dt(this,"alertUntil",0);dt(this,"wind",[]);dt(this,"traffic",[]);dt(this,"roof");dt(this,"rotor");dt(this,"noise");dt(this,"ambientCount",0);dt(this,"shots",new Set);this.createContext=t}position(t,e){t.positionX.value=e.x,t.positionY.value=e.y,t.positionZ.value=e.z}panner(t=2){const e=this.ctx,n=e.createPanner();return n.panningModel="HRTF",n.distanceModel="inverse",n.refDistance=t,n.rolloffFactor=.8,n.maxDistance=300,n}ambient(t,e,n){const s=this.ctx,r=s.createBufferSource(),o=s.createBiquadFilter(),a=s.createGain(),l=this.panner(e);r.buffer=this.noise,r.loop=!0,o.type="lowpass",o.frequency.value=t,a.gain.value=0,r.connect(o),o.connect(a),a.connect(l),l.connect(this.effects),r.start(0,this.ambientCount++*.41%2);let c;if(n){c=s.createOscillator(),c.type="triangle",c.frequency.value=n;const h=s.createGain();h.gain.value=.12,c.connect(h),h.connect(o),c.start()}return{gain:a,pan:l,filter:o,motor:c}}async start(){if(!this.ctx){const t=this.ctx=this.createContext();this.master=t.createGain(),this.master.gain.value=.65;const e=t.createDynamicsCompressor();e.threshold.value=-18,e.knee.value=20,e.ratio.value=8,e.attack.value=.006,e.release.value=.15,this.master.connect(e),e.connect(t.destination),this.effects=t.createGain(),this.effects.gain.value=0,this.effects.connect(this.master),this.music=t.createGain(),this.music.gain.value=0,this.music.connect(this.master),this.noise=t.createBuffer(1,t.sampleRate*2,t.sampleRate);const n=this.noise.getChannelData(0),s=Ks(804);let r=0;for(let o=0;o<n.length;o++)r=(r+(s()*2-1)*.04)/1.04,n[o]=r*3;this.wind=[this.ambient(600,6),this.ambient(950,6)],this.traffic=[this.ambient(220,12,58),this.ambient(280,12,71),this.ambient(180,12,49)],this.roof=this.ambient(180,3,43),this.rotor=this.ambient(330,5,92)}await this.ctx.resume()}resetStage(){for(const t of[...this.shots])t();this.lastBeat=-1,this.alertUntil=0}diagnostics(){var t;return{contexts:this.ctx?1:0,ambientSources:this.ambientCount,activeOneShots:this.shots.size,state:((t=this.ctx)==null?void 0:t.state)??"not-started"}}note(t,e,n,s,r,o,a){const l=this.ctx;if(!l||this.shots.size>=24)return;const c=l.createOscillator(),h=l.createGain(),u=a?this.panner():void 0;c.type=r,c.frequency.setValueAtTime(t,e),c.frequency.exponentialRampToValueAtTime(t*.72,e+n),h.gain.setValueAtTime(0,e),h.gain.linearRampToValueAtTime(Se.clamp(s,0,.35),e+.008),h.gain.exponentialRampToValueAtTime(1e-4,e+n),c.connect(h),u&&a?(this.position(u,a),h.connect(u),u.connect(o)):h.connect(o);let p=!1;const d=()=>{p||(p=!0,c.disconnect(),h.disconnect(),u==null||u.disconnect(),this.shots.delete(m))},m=()=>{try{c.stop()}catch{}d()};this.shots.add(m),c.onended=d,c.start(e),c.stop(e+n+.02)}tone(t,e,n=.25){const s=this.ctx;if(!s||s.state!=="running")return;t==="warning"&&(this.alertUntil=s.currentTime+1.2);const r=t==="metal"?720:t==="glass"?1400:t==="warning"?440:t==="bird"?1800:170;this.note(r*(.96+Math.random()*.08),s.currentTime,.23,n,t==="bird"?"sine":"triangle",this.effects,e)}rescueChime(t){const e=this.ctx;!e||e.state!=="running"||[523.25,659.25,783.99,1046.5].forEach((n,s)=>this.note(n,e.currentTime+s*.16,.5,.13,"sine",this.music,t))}update(t,e,n,s,r,o){const a=this.ctx;if(!a)return;const l=a.currentTime,c=Q_(this.vol,this.musicVol,r,l<this.alertUntil);this.effects.gain.setTargetAtTime(c.effects,l,.035),this.music.gain.setTargetAtTime(c.music,l,.045);const h=a.listener,u=new C(0,0,-1).applyQuaternion(e),p=new C(0,1,0).applyQuaternion(e);h.positionX.value=t.x,h.positionY.value=t.y,h.positionZ.value=t.z,h.forwardX.value=u.x,h.forwardY.value=u.y,h.forwardZ.value=u.z,h.upX.value=p.x,h.upY.value=p.y,h.upZ.value=p.z;const d=(o==null?void 0:o.wind)??Rc(s,n,(o==null?void 0:o.tower)??!1),m=.65+d.strength*.6;this.wind.forEach((g,f)=>{this.position(g.pan,new C((f?-5:5)*Math.cos(d.direction),t.y+2,3+Math.sin(d.direction)*5)),g.gain.gain.setTargetAtTime((.07+Se.clamp(n,0,80)*.002)*m,l,.3),g.filter.frequency.setTargetAtTime(480+d.strength*650+f*140,l,.3)}),this.traffic.forEach((g,f)=>{var v;const T=o==null?void 0:o.vehicles[f];T&&this.position(g.pan,T),g.gain.gain.setTargetAtTime(T?.35:0,l,.25),(v=g.motor)==null||v.frequency.setTargetAtTime(48+f*13+Math.sin(s*.3+f)*6,l,.2)}),o&&(this.position(this.roof.pan,o.roof),this.position(this.rotor.pan,o.drone)),this.roof.gain.gain.setTargetAtTime(o?.12:0,l,.3),this.rotor.gain.gain.setTargetAtTime(o!=null&&o.rescuing?.32:0,l,.3);const _=Math.floor(s*3);if(r&&_!==this.lastBeat){this.lastBeat=_;const g=[220,330,440,330,261.63,392,523.25,392];this.note(g[(_%8+8)%8],l,.25,.1,"triangle",this.music)}}}const ev=.32,nv=.7;function iv(){const i=new Xn({uniforms:{strength:{value:0}},transparent:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 screenUV; void main(){screenUV=uv;gl_Position=vec4(position.xy,0.0,1.0);}",fragmentShader:`varying vec2 screenUV; uniform float strength; void main(){float radius=length(screenUV-vec2(.5));gl_FragColor=vec4(0.0,0.0,0.0,smoothstep(${ev},${nv},radius)*strength);}`}),t=new Ut(new Ii(2,2),i);return t.frustumCulled=!1,t.renderOrder=900,t}function sv(i,t){const e=Math.max(0,Number.isFinite(i)?i:0),n=t==="brief";return{drop:n?-.2*Se.smoothstep(e,0,.3):0,opacity:Se.clamp((e-(n?.12:0))/.3,0,1),done:e>=(n?.85:.65)}}function rv(i,t){if(!i)return null;const e=Array.from(i).filter(Number.isFinite);return t===90&&e.includes(90)?90:e.includes(72)?72:null}async function ov(i,t){const e=rv(i.supportedFrameRates,t);if(e===null||!i.updateTargetFrameRate)return{requested:null,actual:i.frameRate??null,status:"default"};try{return await i.updateTargetFrameRate(e),{requested:e,actual:i.frameRate??null,status:"accepted"}}catch{return{requested:e,actual:i.frameRate??null,status:"rejected"}}}const av={speed:[.7,.4,1],assist:[.28,.16,.38],music:[.15,0,1],sfx:[.6,0,1],eyeHeight:[1.6,.8,1.95],armLength:[.64,.45,.85],handSize:[1,.8,1.2]},cv={quality:["auto","4k","quest","high","low"],posture:["stand","sit"],difficulty:["1","0","2"],mode:["physical","classic"],fallStyle:["fade","brief"],refreshRate:["72","90"]},na=i=>!!i&&typeof i=="object"&&!Array.isArray(i);function Za(i){const t=na(i)?i:{},e=na(t.settings)?t.settings:{},n={};for(const[o,[a,l,c]]of Object.entries(av)){const h=typeof e[o]=="number"||typeof e[o]=="string"?Number(e[o]):NaN;n[o]=Number.isFinite(h)?Math.max(l,Math.min(c,h)):o==="eyeHeight"&&e.posture==="sit"?1.15:a}for(const[o,a]of Object.entries(cv))n[o]=a.includes(String(e[o]))?String(e[o]):a[0];for(const[o,a]of Object.entries({toggle:!1,vignette:!0}))n[o]=typeof e[o]=="boolean"?e[o]:a;const s={};if(na(t.best))for(let o=0;o<5;o++){const a=t.best[String(o)];typeof a=="number"&&Number.isFinite(a)&&a>=0&&(s[String(o)]=Math.min(1e8,Math.floor(a)))}const r=typeof t.unlocked=="number"&&Number.isFinite(t.unlocked)?Math.min(5,Math.max(1,Math.floor(t.unlocked))):1;return{version:2,settings:n,best:s,unlocked:r}}function Ka(i){try{return Za(i===null?null:JSON.parse(i))}catch{return Za(null)}}function lv(i){return JSON.stringify(Za(i))}function hv(i){try{return Ka(i().getItem("skygrip-v1"))}catch{return Ka(null)}}function uv(i,t){try{return i().setItem("skygrip-v1",lv(t)),!0}catch{return!1}}function fv(i,t){return{read:()=>t?Ka(null):hv(i),write:e=>t?!0:uv(i,e)}}function Zl(i,t){const e=i.filter(s=>Number.isFinite(s)&&s>=0).sort((s,r)=>s-r),n=s=>e.length?e[Math.min(e.length-1,Math.ceil(e.length*s)-1)]:null;return{count:e.length,p50:n(.5),p95:n(.95),p99:n(.99),max:e.at(-1)??null,budgetMs:t,overBudget:e.filter(s=>s>t).length,overOneAndHalfBudget:e.filter(s=>s>t*1.5).length,over50ms:e.filter(s=>s>50).length}}class eu{constructor(){dt(this,"intervals",[]);dt(this,"cpu",[]);dt(this,"cursor",0);dt(this,"total",0);dt(this,"startedAt",null);dt(this,"lastAt",null)}add(t,e,n){this.startedAt===null&&(this.startedAt=t),this.lastAt=t;const s=this.cursor++%18e3;this.intervals[s]=e,this.cpu[s]=n,this.total++}reset(){this.intervals.length=0,this.cpu.length=0,this.cursor=0,this.total=0,this.startedAt=this.lastAt=null}snapshot(t){return{totalFrames:this.total,sampledFrames:this.intervals.length,windowLimit:18e3,startedAtMs:this.startedAt,lastAtMs:this.lastAt,durationMs:this.startedAt===null?0:this.lastAt-this.startedAt,animationIntervalsMs:Zl(this.intervals,t),cpuSubmissionMs:Zl(this.cpu,t),gpuTimeMs:null}}}const ja={"3d-normal":"3D 通常・昼のビル","3d-load":"3D 負荷・超高層／風・鳥・落下物","2d-normal":"2D UI通常・メニュー（3D描画なし）","2d-load":"2D UI負荷・HUD更新（合成負荷／3D描画なし）"};function dv(i){const t=new URLSearchParams(i),e=t.get("scenario")??"";return{enabled:t.get("verify")==="1",scenario:Object.hasOwn(ja,e)?e:"3d-normal"}}class pv{constructor(){dt(this,"metrics",new eu);dt(this,"running",!1);dt(this,"previous",null);dt(this,"started",null);dt(this,"ended",null);dt(this,"phases",{});dt(this,"reason","未計測");dt(this,"duration",60)}start(t){this.duration=Number.isFinite(t)?Math.max(10,Math.min(120,t)):60,this.metrics.reset(),this.previous=this.started=this.ended=null,this.phases={},this.reason="計測中",this.running=!0}stop(t="手動停止"){this.running&&(this.running=!1,this.reason=t,this.ended=this.previous)}frame(t,e,n){if(!this.running||!Number.isFinite(t))return;if(this.previous===null){this.previous=this.started=t;return}const s=t-this.previous;s<=0||(this.previous=t,this.metrics.add(t,s,e),this.phases[n]=(this.phases[n]??0)+1,t-this.started>=this.duration*1e3&&this.stop("時間完了"))}report(){return{...this.metrics.snapshot(1e3/60),captureDurationMs:this.started===null?0:(this.ended??this.previous)-this.started,running:this.running,reason:this.reason,requestedSeconds:this.duration,phases:{...this.phases}}}}const ts="skygrip-20261110-r011";function mv(i,t,e){const n=v=>document.getElementById(v),s=n("verifyScenario"),r=new pv;let o=i,a=i,l=!1,c=-1/0,h=null,u=null,p={release:ts,inputHash:null,status:"配信メタデータを確認中"};s.value=o,n("verification").hidden=!1,typeof window.fetch=="function"?window.fetch("./release-info.json",{cache:"no-store"}).then(v=>{if(!v.ok)throw Error("HTTP "+v.status);return v.json()}).then(v=>{if(v.release_id!==ts||!/^[a-f0-9]{64}$/.test(v.source_input_sha256))throw Error("版または入力hashが不一致");p={release:ts,inputHash:v.source_input_sha256,status:"配信版一致"},_()}).catch(()=>{p.status="配信版照合失敗・この結果を受入証拠にしない",_()}):p.status="メタデータ未取得（実ブラウザーで照合が必要）";const d=()=>({release:ts,identity:{...p},saveIsolation:!0,scenario:a,scenarioLabel:ja[a],...r.report(),baseline:h,current:u??e(),note:"animationIntervalsMs はブラウザー描画ループ間隔。cpuSubmissionMs はJS更新・描画命令発行時間（診断パネル更新を除く）。GPU処理時間・GPU FPSではありません。2DはUI専用検査であり2Dゲームではありません。"}),m=v=>v===null?"—":v.toFixed(2);function _(){var P,y,S;const v=d(),x=v.current,R=h??x,A=v.animationIntervalsMs,b=v.cpuSubmissionMs;n("verifyStats").textContent=[`${ts} / ${p.status}`,`入力hash: ${p.inputHash??"未取得"}`,`保存: 非干渉（読込・書込・削除なし） / ${ja[a]}`,`状態: ${v.reason} / ゲーム ${x.phase} / ${x.gamepad??"未接続"}`,`描画バッファ: ${R.viewport.drawingBufferWidth??"未取得"} × ${R.viewport.drawingBufferHeight??"未取得"} / 画質 ${R.quality} → ${R.effectiveQuality}`,`画面CSS: ${R.viewport.width} × ${R.viewport.height} / DPR ${R.viewport.pixelRatio}`,`計測 ${m(v.captureDurationMs/1e3)} / ${v.requestedSeconds} 秒 / 標本 ${v.sampledFrames} / 総数 ${v.totalFrames}`,`ループ間隔 ms  p50 ${m(A.p50)} / p95 ${m(A.p95)} / p99 ${m(A.p99)}`,`遅延 >16.67ms ${A.overBudget} / >25ms ${A.overOneAndHalfBudget} / >50ms ${A.over50ms}`,`CPU命令発行 ms  p50 ${m(b.p50)} / p95 ${m(b.p95)} / p99 ${m(b.p99)}`,`draw calls ${x.drawCalls} / triangles ${x.triangles} / geometry ${x.resources.geometries} / texture ${x.resources.textures}`,`mesh ${x.resources.meshes} / 音源 ${((P=x.resources.audio)==null?void 0:P.ambientSources)??0} / 単発音 ${((y=x.resources.audio)==null?void 0:y.activeOneShots)??0} / heap ${((S=x.heap)==null?void 0:S.usedJSHeapSize)??"未提供"}`,"GPU時間: 未取得 / GPU FPS: 未計測 / 結果はJSONでコピー可能"].join(`
`),n("verifyJson").value=JSON.stringify(v,null,2)}const g=v=>{r.stop(v),u=e(),_()},f=()=>{g("場面を準備"),o=s.value,t(o),l=!0,u=null,_()},T=()=>{l||f(),u=null,a=o,h=e(),r.start(Number(n("verifySeconds").value)),_()};s.addEventListener("change",()=>{g("場面変更"),l=!1,o=s.value,_()}),n("verifyPrepare").onclick=f,n("verifyStart").onclick=T,n("verifyStop").onclick=()=>g("手動停止"),n("verifyRetry").onclick=()=>{f(),T()},n("verifyExport").onclick=()=>{const v=n("verifyJson");v.hidden=!v.hidden,_()},document.addEventListener("visibilitychange",()=>{document.hidden&&g("非表示で停止（復帰後に再計測）")}),window.addEventListener("blur",()=>g("フォーカス喪失で停止")),window.addEventListener("resize",()=>g("解像度変更で停止"));for(const v of["quality","speed","difficulty","posture","mode"])n(v).addEventListener("change",()=>g("条件変更で停止"));return _(),{capture:r,report:d,frame(v,x,R){const A=r.running;r.frame(v,x,R),A&&!r.running&&(u=e()),(v-c>=500||A&&!r.running)&&(c=v,_())}}}class gv{constructor(){dt(this,"id",null);dt(this,"armed",!1);dt(this,"latch",new Set);dt(this,"status","ゲームパッド未接続")}reset(){this.armed=!1,this.latch.clear()}update(t,e,n,s){var h;const r=t.find(u=>(u==null?void 0:u.connected)!==!1&&(u==null?void 0:u.mapping)==="standard");if(!r){this.id!==null&&e&&s(),this.id=null,this.reset(),this.status="ゲームパッド未接続";return}const o=`${r.index}:${r.id}`;o!==this.id&&(this.id!==null&&e&&s(),this.id=o,this.reset());const a=u=>Number.isFinite(r.axes[u])?r.axes[u]:0,l=[a(0),a(1),a(2),a(3)],c=!!((h=r.buttons[9])!=null&&h.pressed);if(!this.armed){this.status="ゲームパッド: 両スティックを中央へ",l.every(u=>Math.abs(u)<.25)&&!c&&(this.armed=!0);return}this.status="標準ゲームパッド接続 / 左右スティック / Startで停止",c&&!this.latch.has("pause")&&s(),c?this.latch.add("pause"):this.latch.delete("pause");for(const[u,p]of[["left",0],["right",2]])for(const[d,m]of[["up",l[p+1]<-.65],["down",l[p+1]>.65],["left",l[p]<-.65],["right",l[p]>.65]]){const _=u+d;e&&!c&&m&&!this.latch.has(_)&&n(u,d),m?this.latch.add(_):this.latch.delete(_)}}}const _v=["left","right"];function vv(i,t,e,n,s){const r=_v.filter(l=>e[l]);if(!r.length)return!1;let o=0,a=0;for(const l of r)o+=t[l].x,a+=t[l].y-1.2;return i.y+=Se.clamp(a/r.length-i.y,-n,n*s*2),i.x+=(o/r.length-i.x)*Math.min(1,n*5),!0}function xv(i,t,e,n,s,r){if(t==="down")return s[i]=!1,"released";if(!["up","left","right"].includes(t))return"ignored";const o=n[i],a=o.clone();if(s[i]||(a.y=Se.clamp(a.y,e.y+.8,e.y+2.2)),t==="up"&&(a.y=Math.min(a.y+.4,e.y+2.2)),t==="left"&&(a.x=Math.max(-3,a.x-.6)),t==="right"&&(a.x=Math.min(3,a.x+.6)),r(a))return"blocked";const l=a.y>o.y;return o.copy(a),s[i]=!0,l&&t==="up"?"raised":"moved"}function nu(i,t){return i==="clear"&&t<4?t+1:null}function Kl(i,t){const e=((i+t)%14+14)%14,n=e>=11,s=n?0:e<.4?.65*e/.4:e>10.6?.65*(11-e)/.4:.65;return{cycle:e,closed:n,angle:s}}function Mv(i,t,e,n,s){return Math.abs(i.x-t)<.3&&Math.abs(i.z-e)<.45&&i.y>=Math.min(n,s)-.25&&i.y<=Math.max(n,s)+.25}function iu(i,t,e,n,s=!1,r=!1){const o=Math.max(1,Number.isFinite(t)?t:1),a=Math.max(1,Number.isFinite(e)?e:1),l=Number.isFinite(n)&&n>0?n:1,c=s?"quest":i==="auto"?r?"quest":"4k":i,h=c==="4k"?l:c==="high"?Math.min(l,2):c==="low"?1:Math.min(l,1.5),u=c==="4k"?Math.min(h,Math.sqrt(3840*2160/(o*a))):h;return{profile:c,pixelRatio:u,width:Math.floor(o*u),height:Math.floor(a*u),textureSize:c==="4k"?1024:256,anisotropy:c==="4k"?8:c==="high"?4:2}}const Dt=i=>document.getElementById(i),Ye=new wh,qe=new Qe(72,innerWidth/innerHeight,.04,320),qn=new Te,ci=new Te;Ye.add(qn);qn.add(ci);ci.add(qe);qe.position.set(0,1.6,0);qe.rotation.x=.22;window.dispatchEvent(new CustomEvent("skygrip:boot",{detail:"WebGL2と描画環境を準備しています…"}));const Zt=new I_({canvas:Dt("game"),antialias:!0,powerPreference:"high-performance"});Zt.setSize(innerWidth,innerHeight);Zt.setPixelRatio(Math.min(devicePixelRatio,1.5));Zt.xr.enabled=!0;Zt.xr.setReferenceSpaceType("local-floor");Zt.outputColorSpace=He;Zt.toneMapping=ah;Zt.toneMappingExposure=1.15;const su=new Xd(14939391,5395787,2.3);Ye.add(su);const Qr=new Jd(16769199,2.5);Qr.position.set(-10,30,20);Ye.add(Qr);const ru=new Ya(Zt),ou=new j_,yv=ru.fromScene(ou,.04);Ye.environment=yv.texture;Ye.environmentIntensity=.55;ou.dispose();ru.dispose();const kt=new J_(Ye),Nt=new N_,Me=new tv,gs=new B_,_s=new z_;let ne=0,au=Jh(7),Ht="title",Re=0,ss=3,kn=0,bi=0,Wr=0,es=6,On=0,jl=0,Ql=0,ia=!1,Mi=14,on=0,Or=new C,Xr=!1,to=0,cu=0,Cc=0,Hs=.22;var rh;const eo=dv(((rh=window.location)==null?void 0:rh.search)??""),lu=fv(()=>localStorage,eo.enabled);let ke=null,ti=null;const uo=new gv;let rs=lu.read(),bn=rs.settings,be=Qh({eyeHeight:Number(bn.eyeHeight??(bn.posture==="sit"?1.15:1.6)),armLength:Number(bn.armLength??.64),handSize:Number(bn.handSize??1)}),wn=!1,li=!1,hu=0,uu="fade",Ti={requested:null,actual:null,status:"not-in-vr"};async function fu(){const i=Zt.xr.getSession();if(!i)return;Ti=await ov(i,Number(pe("refreshRate")));const t=Ti.status==="rejected"?"Hz変更を適用できません。既定値で続行します":`VR Hz: ${Ti.actual??"未取得"} / 要求 ${Ti.requested??"既定"}`;Dt("refreshStatus").textContent=t,de(t)}function Qn(i,t){const e=Dt(i);e.type==="checkbox"?e.checked=!!t:e.value=String(t),e.dispatchEvent(new Event("change")),de(`BGM ${Math.round(Number(pe("music"))*100)}% / 効果音 ${Math.round(Number(pe("sfx"))*100)}% / 周辺 ${js("vignette")?"ON":"OFF"} / 落下 ${pe("fallStyle")==="fade"?"フェード":"短い降下"}`)}function zn(i){be=Qh({...be,...i});for(const e of["eyeHeight","armLength","handSize"])Dt(e).value=String(be[e]),bn[e]=be[e];ci.position.y=ho(be),Nt.anchors={},gs.reset(),Pc();const t=`目の高さ ${be.eyeHeight.toFixed(2)}m / リーチ ${be.armLength.toFixed(2)}m / 手 ${Math.round(be.handSize*100)}%`;Dt("fitSummary").textContent=t,wn&&de(t)}for(const i of["speed","assist","quality","posture","toggle","vignette","music","sfx","difficulty","mode","eyeHeight","armLength","handSize","fallStyle","refreshRate"]){const t=Dt(i);bn[i]!==void 0&&(t.type==="checkbox"?t.checked=bn[i]:t.value=bn[i]),t.addEventListener("change",()=>{bn[i]=t.type==="checkbox"?t.checked:t.value,Pc(),i==="refreshRate"&&fu(),i==="posture"&&zn({eyeHeight:pe("posture")==="sit"?1.15:1.6}),["eyeHeight","armLength","handSize"].includes(i)&&(zn({[i]:Number(t.value)}),Ve("体格設定を変更しました。再開してください。")),(i==="mode"||i==="posture")&&(Nt.anchors={},Ve("操作設定を変更しました。再開してください。")),sr()})}function pe(i){return Dt(i).value}function js(i){return Dt(i).checked}function Pc(){lu.write({...rs,settings:bn})||de("保存できません。このプレイは続けられます。")}function sr(){var e,n,s;const i=iu(pe("quality"),innerWidth,innerHeight,devicePixelRatio,Zt.xr.isPresenting,((e=globalThis.matchMedia)==null?void 0:e.call(globalThis,"(pointer: coarse)").matches)??!1);Zt.setPixelRatio(i.pixelRatio),kt.city.count=i.profile==="low"?90:220,kt.setQuality(i.profile);const t=i.profile==="4k";if(th!==t){th=t;for(const r of["left","right"]){const o=cn[r];cn[r]=Ja(r,t),cn[r].position.copy(o.position),cn[r].quaternion.copy(o.quaternion),Ye.add(cn[r]),o.removeFromParent();const a=new Set,l=new Set;o.traverse(c=>{c instanceof Ut&&(a.add(c.geometry),(Array.isArray(c.material)?c.material:[c.material]).forEach(h=>l.add(h)))}),a.forEach(c=>c.dispose()),l.forEach(c=>c.dispose())}}G_(Ye,i.profile,((s=(n=Zt.capabilities)==null?void 0:n.getMaxAnisotropy)==null?void 0:s.call(n))??1),Dt("resolutionStatus").textContent=`描画 ${i.width} × ${i.height} / ${i.profile==="4k"?"PC 4K・高精細":i.profile}（VRは専用解像度）`}Dt("use4k").onclick=()=>Qn("quality","4k");Dt("fullscreen").onclick=()=>{var t,e;const i=(e=(t=document.documentElement)==null?void 0:t.requestFullscreen)==null?void 0:e.call(t);i&&i.catch(()=>de("全画面にできませんでした。ブラウザーの全画面操作も利用できます"))};Vn.forEach((i,t)=>{const e=document.createElement("option");e.value=String(t),e.textContent=i.name,Dt("stage").append(e)});const cn={left:Ja("left"),right:Ja("right")};let th=!1;Ye.add(cn.left,cn.right);const We={left:new C(-.3,1.2,.17),right:new C(.3,1.2,.17)};let an={left:!0,right:!0};const Vs={left:new Ut(new ms(.065,.007,6,24),new Ri({color:15255151})),right:new Ut(new ms(.065,.007,6,24),new Ri({color:7922130}))};Ye.add(Vs.left,Vs.right);const no=[Zt.xr.getController(0),Zt.xr.getController(1)],Qs=[Zt.xr.getControllerGrip(0),Zt.xr.getControllerGrip(1)],ei=new Map,eh=new Kd,Rn=new Te;qn.add(Rn);Rn.position.set(0,1.5,-1.5);const du=[["再開 / RESUME",()=>po()],["再挑戦 / RETRY",()=>or(ne)],["次のビル / NEXT",()=>Mu()],["体格調整 / FIT",()=>{wn=!0,de("楽な姿勢で目の高さを測定。その後、片手を胸の高さで前へ")}],["音・快適性 / OPTIONS",()=>{li=!0}],["VRを終了 / EXIT",()=>{var i;return(i=Zt.xr.getSession())==null?void 0:i.end()}]],tr=[];du.forEach(([i],t)=>{const e=ai(i,1.15,.19);e.position.y=.45-t*.24,Rn.add(e),tr.push(e)});const vs=ai("Ⅱ メニュー",.42,.1);vs.position.set(.6,1.03,-1.1);qn.add(vs);const rr=ai("左右の縁をつかんでください",1.4,.18);rr.position.set(0,.7,-1.5);qn.add(rr);const er=ai("SKYGRIP",1,.16);er.position.set(0,2.03,-1.5);qn.add(er);const pu=[["目の高さを測定",()=>{const i=qe.position.y;if(i<.8||i>1.95){de("追跡高さを確認できません。高さ±で調整してください");return}zn({eyeHeight:i}),de(`目の高さ ${be.eyeHeight.toFixed(2)}m を保存`)}],["伸ばした手の届く長さを測定",()=>{const i=no.findIndex(e=>{var n;return((n=ei.get(e))==null?void 0:n.handedness)===mu}),t=i<0?null:K_(Qs[i].position,be.eyeHeight);if(t===null){de("楽に片手を前へ伸ばし、その手のトリガーで選択");return}zn({armLength:t}),de(`リーチ ${be.armLength.toFixed(2)}m を保存。無理に伸ばさないでください`)}],["目の高さ −5cm",()=>zn({eyeHeight:be.eyeHeight-.05})],["目の高さ ＋5cm",()=>zn({eyeHeight:be.eyeHeight+.05})],["手の大きさ − / 小さく",()=>zn({handSize:be.handSize-.05})],["手の大きさ ＋ / 大きく",()=>zn({handSize:be.handSize+.05})],["戻る / BACK",()=>{wn=!1}]];let mu="right";const io=pu.map(([i],t)=>{const e=ai(i,1.6,.18);return e.position.y=.56-t*.2,Rn.add(e),e}),gu=[["BGM −",()=>Qn("music",Math.max(0,Number(pe("music"))-.1))],["BGM ＋",()=>Qn("music",Math.min(1,Number(pe("music"))+.1))],["効果音 −",()=>Qn("sfx",Math.max(0,Number(pe("sfx"))-.1))],["効果音 ＋",()=>Qn("sfx",Math.min(1,Number(pe("sfx"))+.1))],["周辺ビネット 切替",()=>Qn("vignette",!js("vignette"))],["落下 フェード / 短い降下",()=>Qn("fallStyle",pe("fallStyle")==="fade"?"brief":"fade")],["VR 72 / 90 Hz",()=>Qn("refreshRate",pe("refreshRate")==="72"?"90":"72")],["戻る / BACK",()=>{li=!1}]],so=gu.map(([i],t)=>{const e=ai(i,1.6,.17);return e.position.y=.65-t*.19,Rn.add(e),e});for(const i of[...tr,...io,...so,vs,er,rr])i.material.depthTest=!1,i.renderOrder=1e3;const os=new Ut(new ri(.075,16,10),new Ri({color:0,side:Ne,transparent:!0,opacity:0,depthTest:!1}));os.renderOrder=9999;qe.add(os);const Qa=iv();Ye.add(Qa);let Br=0;no.forEach((i,t)=>{ci.add(i),ci.add(Qs[t]);const e=new ld(new Ce().setFromPoints([new C,new C(0,0,-2)]),new Rh({color:13302380}));i.add(e),i.addEventListener("connected",n=>ei.set(i,n.data)),i.addEventListener("disconnected",()=>{ei.delete(i),Nt.anchors={},Ve("コントローラーが切断されました")}),i.addEventListener("squeezestart",()=>{const n=ei.get(i),s=n==null?void 0:n.handedness;if(s!=="left"&&s!=="right"||pe("mode")==="classic"||Ht!=="playing")return;if(js("toggle")&&Nt.anchors[s]){Nt.release(s);return}const r=tu(Qs[t].position,be);Sv(s,r,n)}),i.addEventListener("squeezeend",()=>{var s;const n=(s=ei.get(i))==null?void 0:s.handedness;js("toggle")||Nt.release(n)}),i.addEventListener("selectstart",()=>{var o;const n=i.getWorldPosition(new C),s=new C(0,0,-1).applyQuaternion(i.getWorldQuaternion(new Wn));eh.set(n,s);const r=eh.intersectObjects(Rn.visible?(wn?io:li?so:tr).filter(a=>a.visible):[vs]);if(r.length)if(r[0].object===vs)Ve("一時停止");else if(wn){const a=(o=ei.get(i))==null?void 0:o.handedness;(a==="left"||a==="right")&&(mu=a),pu[io.indexOf(r[0].object)][1]()}else li?gu[so.indexOf(r[0].object)][1]():du[tr.indexOf(r[0].object)][1]()})});function de(i){Dt("caption").textContent=i,cu=performance.now()+5e3;const t=rr.material.map,e=t.image.getContext("2d");e.fillStyle="#142b36",e.fillRect(0,0,1024,256),e.fillStyle="#e5f6dd",e.font="bold 42px sans-serif",e.textAlign="center";const n=[...i];for(let s=0;s<3&&s*22<n.length;s++){const r=n.slice(s*22,(s+1)*22).join("")+(s===2&&n.length>66?"…":"");e.fillText(r,512,n.length<=22?140:76+s*56,980)}t.needsUpdate=!0}function _u(i){let t,e=Number(pe("assist"));if(!(i.z<.015||i.z>.65)){for(const n of au){const s=n.p.distanceTo(i);s<e&&!ro(n.p)&&(t=n,e=s)}return t}}let vu=Zh(0,7);function ro(i){return F_(i,vu)||kt.windows.some(t=>t.closed&&Math.abs(i.x-t.x)<.45&&Math.abs(i.y-t.y)<.25)}function Sv(i,t,e){var o,a;const n=t.clone().add(Nt.rig),s=_u(n);if(!s||!Nt.grab(i,t,s))return;Me.tone(s.kind,s.p);const r=(a=(o=e==null?void 0:e.gamepad)==null?void 0:o.hapticActuators)==null?void 0:a[0];r!=null&&r.pulse&&Promise.resolve(r.pulse(.18,35)).catch(()=>{}),xu(i,s.p.y)}function xu(i,t){kn+=_s.claim(i,t),bi=_s.combo}function Bn(){return Zt.xr.isPresenting&&pe("mode")==="physical"}let fo="playing";function Mu(){const i=nu(Ht,ne);i!==null&&or(i)}function or(i){uo.reset(),Me.resetStage(),ne=Se.clamp(Math.floor(i),0,4),vu=Zh(ne,Vn[ne].height),oo.clear(),fo="playing",kt.build(ne),sr(),Qr.color.setHex(ne===3?9218533:ne===2?16755830:16769199),Qr.intensity=ne===3?.7:2.5,su.intensity=ne===3?.85:ne===2?1.6:2.3,Ye.environmentIntensity=ne===3?.3:.55,au=Jh(Vn[ne].height),Nt.reset(),ci.position.y=Zt.xr.isPresenting?ho(be):0,wn=!1,li=!1,We.left.set(-.3,1.2,.17),We.right.set(.3,1.2,.17),an={left:!0,right:!0},Ht="playing",Re=0,ss=pe("difficulty")==="0"?5:3,kn=0,bi=0,Wr=0,es=6,On=0,Mi=14,on=0,Xr=!1,kt.resetDebris(),kt.pot.visible=!1,gs.reset(),_s.reset(),to=0,Dt("result").textContent="",Dt("next").hidden=!0,Dt("resume").hidden=!0,Dt("stage").value=String(ne),Dt("menu").hidden=!0,Rn.visible=!1,Cc=0,Hs=.22,Me.start().catch(()=>de("音声を有効にできませんでした")),de(ne===0?"左と右を交互に。片手を残し、次の縁へ。":"上階の予告に注意。左右の進路を選ぼう。")}function Ve(i){["playing","clear","recovering"].includes(Ht)&&(fo=Ht,Ht="paused",Me.resetStage(),gs.reset(),Nt.anchors={},an={left:!0,right:!0},Dt("menu").hidden=!1,Dt("resume").hidden=!1,de(i))}function po(){Ht==="paused"&&(uo.reset(),Ht=fo,wn=!1,li=!1,Nt.anchors={},an={left:!0,right:!0},gs.reset(),oo.clear(),Rn.visible=!1,Dt("menu").hidden=Ht!=="clear",Me.start().catch(()=>de("音声を有効にできませんでした")),de("安全に再開。左右の縁をつかんでください。"))}function nh(){Ht==="playing"&&(Nt.anchors={},bi=0,_s.breakCombo(),Ht="recovering",hu=Nt.rig.y,uu=pe("fallStyle"),to=0,Me.tone("warning",Nt.rig.clone().add(new C(0,1,0)),.2),de("安全ロープで復帰します"))}function Ev(){if(Ht!=="playing")return;Ht="clear",Nt.anchors={},kt.startRescue(),kt.pot.visible=!1,On=0,on=0,kn+=Math.max(0,Math.floor(3e3-Re*5));const i=rs.best||{};i[ne]=Math.max(i[ne]||0,kn),rs.best=i,rs.unlocked=Math.max(rs.unlocked||1,ne+1),Pc(),Dt("result").textContent=`屋上到達！ ${kn}点 / ${Re.toFixed(1)}秒 / BEST ${i[ne]}`,Dt("menu").hidden=!1,Dt("resume").hidden=!0,Dt("next").hidden=ne===4,ne===4&&(Dt("result").textContent="最終棟クリア！ "+Dt("result").textContent),de(ne===4?"最終棟クリア！救助ドローンが到着します。":"屋上到達！救助ドローンが到着します。")}function mo(i,t){if(Ht!=="playing"||Bn())return;const e=xv(i,t,Nt.rig,We,an,ro);e==="blocked"?de("窓や設備で進めません。隣のレールへ！"):(e==="raised"||e==="moved")&&(e==="raised"&&xu(i,We[i].y),Me.tone("metal",We[i]))}const ih={w:["left","up"],a:["left","left"],s:["left","down"],d:["left","right"],ArrowUp:["right","up"],ArrowLeft:["right","left"],ArrowDown:["right","down"],ArrowRight:["right","right"]};window.addEventListener("keydown",i=>{if(i.key==="Escape"){Ht==="paused"?po():Ve("一時停止");return}i.target instanceof HTMLSelectElement||i.target instanceof HTMLInputElement||ih[i.key]&&(i.preventDefault(),i.repeat||mo(...ih[i.key]))});document.querySelectorAll("#touch button").forEach(i=>i.addEventListener("pointerdown",t=>{t.preventDefault();const e=i;mo(e.parentElement.dataset.hand,e.dataset.dir)}));let ar=!1,tc=0,ec=0;Dt("game").addEventListener("pointerdown",i=>{ar=!0,tc=i.clientX,ec=i.clientY,Dt("game").setPointerCapture(i.pointerId)});Dt("game").addEventListener("pointermove",i=>{!ar||Zt.xr.isPresenting||(Cc-=(i.clientX-tc)*.004,Hs-=(i.clientY-ec)*.004,Hs=Se.clamp(Hs,-1.2,1.2),tc=i.clientX,ec=i.clientY)});Dt("game").addEventListener("pointerup",()=>ar=!1);Dt("game").addEventListener("pointercancel",()=>ar=!1);Dt("game").addEventListener("lostpointercapture",()=>ar=!1);Dt("next").onclick=Mu;Dt("play").onclick=()=>or(Number(pe("stage")));Dt("resume").onclick=po;Dt("pause").onclick=()=>Ht==="paused"?po():Ve("一時停止");document.addEventListener("visibilitychange",()=>{var i;document.hidden?(Ve("ブラウザーが非表示になりました"),(i=Me.ctx)==null||i.suspend()):(Ht==="playing"||Ht==="clear")&&Me.start().catch(()=>de("音の再開にはメニュー操作が必要です"))});window.addEventListener("blur",()=>Ve("操作を中断しました"));async function Tv(){var t;const i=Dt("vr");try{const e=await((t=navigator.xr)==null?void 0:t.isSessionSupported("immersive-vr"));i.disabled=!e,i.textContent=e?"VRで遊ぶ ↗":"この環境は没入型VR非対応"}catch{i.disabled=!0,i.textContent="VR対応の確認に失敗"}i.onclick=async()=>{try{await Me.start();const e=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]});await Zt.xr.setSession(e),Zt.xr.setFoveation(1),await fu(),e.addEventListener("visibilitychange",()=>{e.visibilityState!=="visible"&&Ve("ヘッドセットの追跡を中断しました")}),e.addEventListener("end",()=>{Ve("VRを終了しました"),qe.position.set(0,1.6,0),ci.position.y=0,Ti={requested:null,actual:null,status:"not-in-vr"},sr()}),or(Number(pe("stage")))}catch(e){de(`VRを開始できません: ${e instanceof Error?e.message:String(e)}`)}}}Tv();kt.build(0);zn(be);sr();qn.position.copy(Nt.rig);let Ns=0,sh=0;const nc=new eu,oo=new Map;function bv(i,t,e){for(const[n,s]of[["up",e<-.65],["down",e>.65],["left",t<-.65],["right",t>.65]]){const r=i+n;s&&!oo.get(r)&&mo(i,n),oo.set(r,s)}}Zt.setAnimationLoop((i,t)=>{var d;const e=performance.now();if(ke!=null&&ke.startsWith("2d-")){ke==="2d-load"&&(Dt("verifyLoad").textContent=Array.from({length:60},(m,_)=>`SKYGRIP HUD ${_+1} | ${(i/1e3).toFixed(2)} s | 高度 ${(_+i/100)%100|0} m`).join(`
`)),ti==null||ti.frame(i,performance.now()-e,"2D-UI"),Ns=i;return}const n=Ns?(i-Ns)/1e3:1/72,s=Math.min(n,.04);Ns=i;const r=Zt.xr.isPresenting;if(ci.position.y=r?ho(be):0,tr.forEach((m,_)=>m.visible=!wn&&!li&&(_!==0||Ht==="paused")&&(_!==2||nu(Ht,ne)!==null)),io.forEach(m=>m.visible=wn),so.forEach(m=>m.visible=li&&!wn),Rn.visible=r&&Ht!=="playing"&&Ht!=="recovering",vs.visible=r&&!Rn.visible,er.visible=r,rr.visible=r,Dt("touch").hidden=r||Ht!=="playing",r&&Ht==="playing"){const m=Zt.xr.getReferenceSpace(),_=t&&m?t.getViewerPose(m):null,f=[...Zt.xr.getSession().inputSources].filter(T=>T.handedness==="left"||T.handedness==="right");(!_||f.length<2||f.some(T=>!T.gripSpace||!t.getPose(T.gripSpace,m)))&&Ve("追跡を確認できません。コントローラーを戻して再開してください。")}r||(qe.rotation.set(Hs,Cc,0,"YXZ"),qe.position.set(0,1.6,0));const o={};if(no.forEach((m,_)=>{var T;const g=ei.get(m),f=g==null?void 0:g.handedness;if(!(f!=="left"&&f!=="right")&&(o[f]=tu(Qs[_].position,be),r&&pe("mode")==="classic"&&((T=g==null?void 0:g.gamepad)==null?void 0:T.mapping)==="xr-standard")){const v=g.gamepad.axes;v.length>=4&&bv(f,v[2],v[3])}}),r||uo.update(((d=navigator.getGamepads)==null?void 0:d.call(navigator))||[],Ht==="playing",mo,()=>Ve("ゲームパッド操作を停止しました")),Ht==="playing"){if(Re+=s,Bn()?(Nt.solve(o,s*Number(pe("speed")))||Ve("追跡位置が変化しました。再開してください。"),Ht==="playing"&&gs.update(Object.keys(Nt.anchors).length>0,s)&&nh()):vv(Nt.rig,We,an,s,Number(pe("speed")))||nh(),Ht==="playing"&&(Wr=Math.max(Wr,Math.floor(Nt.rig.y/6)*6),Nt.rig.y>=Vn[ne].height-.8&&Ev()),Ht==="playing"&&ne>0&&Re>es&&On===0&&(On=1,ia=!1,jl=Nt.rig.x,Ql=Nt.rig.y+5,es=Re+2.4,kt.pot.visible=!0,kt.pot.position.set(jl,Ql,.55),de("上から植木鉢！ 左右の縁へ避けよう"),Me.tone("warning",kt.pot.position,.5)),Ht==="playing"&&On===1&&Re>es&&(On=2),Ht==="playing"&&On===2){const m=kt.pot.position.y;if(kt.pot.position.y-=s*3,kt.pot.rotation.x+=s*3,kt.pot.rotation.z+=s*2,!ia){const _=["left","right"].find(g=>{var v;const f=Bn()?(v=o[g])==null?void 0:v.clone().add(Nt.rig):We[g];return(Bn()?!!Nt.anchors[g]:an[g])&&f&&Mv(f,kt.pot.position.x,kt.pot.position.z,m,kt.pot.position.y)});_&&(ia=!0,Nt.release(_),an[_]=!1,bi=0,_s.breakCombo(),de("手が外れた！ もう一方の手で持ち直そう"))}kt.pot.position.y<Nt.rig.y-.8&&(kt.breakPot(kt.pot.position),kt.pot.visible=!1,On=0,es=Re+(pe("difficulty")==="2"?5:9),Me.tone("concrete",kt.pot.position))}if(Ht==="playing"&&ne>=3&&Re>Mi&&on===0&&(on=1,Xr=!1,Or.copy(Nt.rig).add(new C(0,1.5,-.45)),Mi=Re+2.5,de("左から鳥！ 手を下げるか隣の縁へ"),Me.tone("bird",Or.clone().add(new C(-4,0,0)),.3)),on===1&&Re>=Mi&&(on=2),on>0){const m=kt.birds[0];if(m.position.copy(Or),m.position.x+=on===1?-4:-4+(Re-Mi)*2.5,m.rotation.y=-Math.PI/2,on===2&&!Xr)for(const _ of["left","right"]){const g=Bn()&&o[_]?o[_].clone().add(Nt.rig):We[_];if(O_(g,m.position,.3)){Xr=!0,Nt.release(_),an[_]=!1,bi=0,_s.breakCombo(),de("鳥に手が当たった！ 持ち直そう"),Me.tone("bird",m.position);break}}m.position.x>Or.x+4&&(on=0,Mi=Re+12)}for(const m of kt.windows){if(Ht!=="playing"||ne<2)continue;const _=Math.abs(m.y-Nt.rig.y-1.4)<2,g=Kl(Re,m.phase),f=Kl(Re-s,m.phase);if(_&&g.cycle>=9&&f.cycle<9&&(de("窓が閉まります。中央のレールは安全です"),Me.tone("warning",new C(m.x,m.y,.2),.12)),g.closed!==m.closed&&(m.closed=g.closed,_&&Me.tone("glass",new C(m.x,m.y,.2),.12),g.closed))for(const T of["left","right"]){const v=Nt.anchors[T];v&&ro(v.hold.p)&&Nt.release(T),!Bn()&&ro(We[T])&&(an[T]=!1)}m.o.rotation.y=g.angle}}if(Ht==="recovering"){to+=s;const m=sv(to,uu);if(Nt.rig.y=hu+m.drop,os.material.opacity=m.opacity,Dt("fade").style.opacity=String(m.opacity),m.done){const _=H_(ne,ss,Wr);ss=_.lives,Nt.reset(_.height),gs.reset(),On=0,on=0,kt.pot.visible=!1,kt.resetDebris(),es=Re+6,Mi=Re+10,We.left.set(-.3,Nt.rig.y+1.2,.17),We.right.set(.3,Nt.rig.y+1.2,.17),an={left:!0,right:!0},_.phase==="over"?(Ht="over",Dt("resume").hidden=!0,Dt("result").textContent=`挑戦終了 / ${kn}点 / ${Re.toFixed(1)}秒`,Dt("menu").hidden=!1):(Ht="paused",fo="playing",Dt("resume").hidden=!1,Dt("menu").hidden=!1,de("復帰地点へ戻りました。再開を選んでください"))}}else os.material.opacity=0,Dt("fade").style.opacity="0";const a=Nt.rig.distanceTo(qn.position)>.002;Br=Se.damp(Br,js("vignette")&&Ht==="playing"&&a?.75:0,10,s),Qa.material.uniforms.strength.value=Br,Qa.visible=Br>.001,qn.position.copy(Nt.rig);for(const m of["left","right"]){let _;if(r&&o[m]&&Bn()){_=o[m].clone().add(Nt.rig);const T=no.findIndex(v=>{var x;return((x=ei.get(v))==null?void 0:x.handedness)===m});T>=0&&cn[m].quaternion.copy(Qs[T].getWorldQuaternion(new Wn))}else _=We[m].clone(),cn[m].rotation.set(0,0,m==="left"?-.1:.1);cn[m].position.copy(_);const g=_u(_);Vs[m].visible=Ht==="playing"&&!!g,Vs[m].position.copy((g==null?void 0:g.p)||_),Vs[m].position.z+=.025;const f=Bn()?!!Nt.anchors[m]:an[m];cn[m].scale.setScalar(be.handSize),jh(cn[m],f,Ht==="paused"?0:s)}kt.animate(i/1e3,Ht==="playing"||Ht==="clear"?s:0)&&(Me.rescueChime(kt.drone.position),de("救助到着！屋上クリア。次のビルへ挑戦しよう。")),kt.updateDetail(Nt.rig.y+1.6),kt.birds.forEach((m,_)=>{_===0&&on>0||(m.position.set(Math.sin(kt.sceneTime*.3+_*2)*12,Nt.rig.y+4+_,4+_*3),m.rotation.y=Math.cos(kt.sceneTime*.3+_*2)>0?-Math.PI/2:Math.PI/2)});const c=r?Zt.xr.getCamera():qe,h=c.getWorldPosition(new C),u=c.getWorldQuaternion(new Wn);if(r&&h.z<.18&&(os.material.opacity=Math.max(os.material.opacity,Se.clamp((.18-h.z)/.12,0,1))),Me.vol=Number(pe("sfx")),Me.musicVol=Number(pe("music")),Me.update(h,u,Nt.rig.y,kt.sceneTime,Ht==="playing"||Ht==="clear",{vehicles:[kt.trafficPositions[0],kt.trafficPositions[17],kt.trafficPositions[34]],roof:kt.roofSound,drone:kt.drone.position,rescuing:kt.rescue.active,tower:ne===4,wind:kt.windAt(Nt.rig.y)}),i-sh>250){sh=i;const m=`${Vn[ne].name}
${Math.max(0,Nt.rig.y).toFixed(1)} / ${Vn[ne].height} m
${kn} pts   ×${bi}
♥ ${ss}   ${Re.toFixed(0)} s`;Dt("hud").textContent=m;const _=er.material.map,g=_.image,f=g.getContext("2d");f.fillStyle="#142b36",f.fillRect(0,0,1024,256),f.fillStyle="#ddf4b3",f.font="bold 64px sans-serif",f.textAlign="center",f.fillText(`${Nt.rig.y.toFixed(1)}m / ${Vn[ne].height}m   ♥${ss}   ${kn}点`,512,145),_.needsUpdate=!0}i>cu&&(Dt("caption").textContent=""),Zt.render(Ye,qe);const p=performance.now()-e;nc.add(i,n*1e3,p),ti==null||ti.frame(i,p,Ht)});window.addEventListener("skygrip:graphicslost",()=>{var i,t;Ve("描画が中断されました"),(i=Me.ctx)==null||i.suspend(),(t=Zt.xr.getSession())==null||t.end().catch(()=>{})});window.addEventListener("resize",()=>{qe.aspect=innerWidth/innerHeight,qe.updateProjectionMatrix(),Zt.setSize(innerWidth,innerHeight),sr()});function yu(i=!1){var o,a;i&&nc.reset();const t=Zt.xr.isPresenting,e=Zt.getContext(),n=e.getExtension("WEBGL_debug_renderer_info");let s=0,r=0;return Ye.traverse(l=>{l instanceof Ut&&s++,l instanceof pn&&(r+=l.count)}),{release:ts,verification:eo.enabled,gamepad:uo.status,capturedAt:new Date().toISOString(),userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,pixelRatio:Zt.getPixelRatio(),drawingBufferWidth:e.drawingBufferWidth??null,drawingBufferHeight:e.drawingBufferHeight??null},quality:pe("quality"),effectiveQuality:iu(pe("quality"),innerWidth,innerHeight,devicePixelRatio,t,((o=globalThis.matchMedia)==null?void 0:o.call(globalThis,"(pointer: coarse)").matches)??!1).profile,mode:ke!=null&&ke.startsWith("2d-")?"2D-UI":t?"VR":"normal3D",phase:Ht,stage:ne,height:Nt.rig.y,score:kn,lives:ss,combo:bi,elapsed:Re,hands:{left:We.left.toArray(),right:We.right.toArray()},held:Bn()?Object.keys(Nt.anchors):an,frameRate:Ti,drawCalls:ke!=null&&ke.startsWith("2d-")?0:Zt.info.render.calls,triangles:ke!=null&&ke.startsWith("2d-")?0:Zt.info.render.triangles,resources:{meshes:s,instances:r,geometries:Zt.info.memory.geometries,textures:Zt.info.memory.textures,programs:((a=Zt.info.programs)==null?void 0:a.length)??null,audio:Me.diagnostics()},heap:performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize}:null,graphics:{vendor:e.getParameter((n==null?void 0:n.UNMASKED_VENDOR_WEBGL)??e.VENDOR),renderer:e.getParameter((n==null?void 0:n.UNMASKED_RENDERER_WEBGL)??e.RENDERER)},...nc.snapshot(1e3/(t?Ti.actual??72:60)),note:"Animation intervals and CPU submission time, NOT GPU time. Hardware performance requires a measured device."}}window.skygripDiagnostics=yu;eo.enabled&&(Dt("vr").hidden=!0,ti=mv(eo.scenario,i=>{ke=i,or(i==="3d-load"?4:1),i.startsWith("2d-")&&(Ve("UI専用検査：3D描画は停止しています"),Me.update(qe.getWorldPosition(new C),qe.getWorldQuaternion(new Wn),Nt.rig.y,kt.sceneTime,!1)),Dt("game").hidden=i.startsWith("2d-"),Dt("verifyLoad").hidden=i!=="2d-load",Dt("touch").hidden=i.startsWith("2d-"),Ns=0},yu),window.skygripVerification=()=>ti.report());
