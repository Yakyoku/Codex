// Original, resolution-independent material detail. All evaluation stays on GPU;
// fwidth filters frequencies that are smaller than a pixel in a distant view.
export const SURFACES=`
float hash3(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float filteredNoise(vec3 p){float footprint=max(length(fwidth(p)),.001);return mix(noise3(p),.5,smoothstep(.6,2.,footprint));}
vec3 reliefNormal(vec3 n,float height){vec3 a=dFdx(P),b=dFdy(P),r=cross(b,n),s=cross(n,a);float det=dot(a,r);vec3 gradient=dFdx(height)*r+dFdy(height)*s;return normalize(n-sign(det)*gradient/max(abs(det),.000001));}
vec3 environmentLight(vec3 ray,float rough){
 vec3 sky=mix(vec3(.055,.09,.15),vec3(.25,.39,.58),smoothstep(-.35,.8,ray.y));
 sky+=vec3(.48,.22,.08)*pow(max(0.,1.-abs(ray.y+.1)),8.);
 float sun=pow(max(dot(ray,normalize(vec3(-.5,.9,.6))),0.),mix(200.,4.,rough*rough));
 return sky+vec3(1.,.75,.43)*sun*(1.-rough*.65);
}
vec3 workshopSky(vec3 p){
 float up=smoothstep(-9.,38.,p.y);vec3 sky=mix(vec3(.065,.035,.035),vec3(.008,.018,.045),up);
 float halo=exp(-dot((p.xy-vec2(15.,19.))/vec2(13.,10.),(p.xy-vec2(15.,19.))/vec2(13.,10.))*2.);
 float cloud=noise3(vec3(p.x*.035,p.y*.14,2.));sky+=vec3(.12,.06,.025)*halo;
 sky+=vec3(.009,.008,.010)*smoothstep(.52,.80,cloud)*(1.-smoothstep(3.,30.,p.y));
 return sky;
}`;
