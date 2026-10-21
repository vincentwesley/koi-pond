(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Math.PI*2,t=t=>t-e*Math.floor((t+Math.PI)/e);function n(e,n,r,i){let a=t(n-e),o=r*i;return t(e+Math.max(-o,Math.min(o,a)))}function r(e,n,r=.3){for(let i=1;i<e.length;i++){let a=e[i-1],o=e[i],s=Math.atan2(o.y-a.y,o.x-a.x);if(Math.hypot(o.x-a.x,o.y-a.y)<1e-6&&(s=Math.PI),i>1){let n=e[i-2],o=Math.atan2(a.y-n.y,a.x-n.x),c=t(s-o);s=o+Math.max(-r,Math.min(r,c))}o.x=a.x+Math.cos(s)*n,o.y=a.y+Math.sin(s)*n}}function i(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var a=class{pts;heading;speed;segLen;phase=0;t=0;depth;depthTarget;rand;boost=0;length;variety;p;constructor(e,t,n,r,a,o){this.length=r,this.variety=a,this.p=o,this.rand=i(o.seed),this.heading=n,this.speed=o.speed*r,this.segLen=r/11,this.pts=Array.from({length:12},(r,i)=>({x:e-Math.cos(n)*this.segLen*i,y:t-Math.sin(n)*this.segLen*i})),this.depth=this.depthTarget=this.rand()*.7}get head(){return this.pts[0]}startle(e){this.boost=Math.max(this.boost,e)}update(e,i){let{p:a}=this,o=this.head;this.t+=e;let s=this.length,c=a.seed*.001,l=(Math.sin(this.t*.37*a.wander+c*7)+.6*Math.sin(this.t*.91*a.wander+c*13))*.9,u=Math.cos(this.heading+l*.6),d=Math.sin(this.heading+l*.6),f=Math.min(i.w,i.h)*.18+s*.5,p=e=>e<f?((f-Math.max(e,0))/f)**1.5*4:0,m=p(o.x)-p(i.w-o.x),h=p(o.y)-p(i.h-o.y);u+=m,d+=h;let g=Math.min(2,Math.hypot(m,h)),_=0;if(i.pointer){let e=o.x-i.pointer.x,t=o.y-i.pointer.y,n=Math.hypot(e,t),r=s*1.6;n<r&&n>.001&&(_=(r-n)/r*a.shy,u+=e/n*_*3,d+=t/n*_*3)}for(let e of i.others){if(e===this)continue;let t=o.x-e.head.x,n=o.y-e.head.y,r=Math.hypot(t,n),i=(s+e.length)*.45;r<i&&r>.001&&(u+=t/r*((i-r)/i)*.8,d+=n/r*((i-r)/i)*.8)}let v=Math.atan2(d,u),y=this.heading,b=Math.min(3,this.speed/s/.4*a.turn)*(1+_+g);this.heading=n(this.heading,v,b,e);let x=Math.abs(t(this.heading-y))/Math.max(e,1e-4);this.boost=Math.max(0,this.boost-e*.8);let S=a.speed*s*(1+_*2.2+this.boost*2);this.speed+=(S-this.speed)*Math.min(1,e*1.5),o.x+=Math.cos(this.heading)*this.speed*e,o.y+=Math.sin(this.heading)*this.speed*e,o.x=Math.min(i.w-2,Math.max(2,o.x)),o.y=Math.min(i.h-2,Math.max(2,o.y)),r(this.pts,this.segLen),this.phase+=e*(2.2+this.speed/s*6+x*.8),this.rand()<e*.08&&(this.depthTarget=this.rand()*.8),this.depth+=(this.depthTarget-this.depth)*e*.15}bodyPoints(){let e=this.pts.length,t=this.length*(.02+Math.min(.03,this.speed/this.length*.025));return this.pts.map((n,r)=>{let i=this.pts[Math.max(0,r-1)],a=this.pts[Math.min(e-1,r+1)],o=i.x-a.x,s=i.y-a.y,c=Math.hypot(o,s)||1,l=t*(r/(e-1))**1.6*Math.sin(this.phase-r*.32);return{x:n.x-s/c*l,y:n.y+o/c*l}})}},o=class{data=new Float32Array(81920);n=0;v(e,t,n,r,i,a,o){if((this.n+1)*10>this.data.length){let e=new Float32Array(this.data.length*2);e.set(this.data),this.data=e}let s=this.n++*10,c=this.data;c[s]=e,c[s+1]=t,c[s+2]=n,c[s+3]=r,c[s+4]=i,c[s+5]=a,c[s+6]=o[0],c[s+7]=o[1],c[s+8]=o[2],c[s+9]=o[3]}quad(e,t,n,r,i){for(let a of[0,1,2,0,2,3])this.v(e[a].x,e[a].y,t[a][0],t[a][1],n,r,i)}sprite(e,t,n,r,i){let a=Math.cos(r)*n,o=Math.sin(r)*n,s=[[-1,-1],[1,-1],[1,1],[-1,1]];this.quad(s.map(([n,r])=>({x:e+n*a-r*o,y:t+n*o+r*a})),s,e,t,i)}ribbon(e,t,n,r,i){let a=e.length,o=e.map((t,n)=>{let r=e[Math.max(0,n-1)],i=e[Math.min(a-1,n+1)],o=i.x-r.x,s=i.y-r.y,c=Math.hypot(o,s)||1;return{x:-s/c,y:o/c}});for(let s=0;s<a-1;s++){let c=(n,r)=>({x:e[n].x+o[n].x*t[n]*r,y:e[n].y+o[n].y*t[n]*r}),l=s/(a-1),u=(s+1)/(a-1);this.quad([c(s,-1),c(s+1,-1),c(s+1,1),c(s,1)],[[l,-1],[u,-1],[u,1],[l,1]],n,r,i)}}fin(e,t,n,r,i){let a=-t.y*r,o=t.x*r,s=e.x+t.x*n,c=e.y+t.y*n;this.quad([{x:e.x-a,y:e.y-o},{x:s-a,y:c-o},{x:s+a,y:c+o},{x:e.x+a,y:e.y+o}],[[0,-1],[1,-1],[1,1],[0,1]],0,0,i)}},s=[0,1,2,3,4,5,0,2,5],c=e=>e<.28?.72+.28*Math.sin(e/.28*Math.PI*.5):1-.85*((e-.28)/.72)**1.3,l=class{w=0;h=0;t=0;fish=[];pads=[];petals=[];plants=[];under=new o;surface=new o;pointer=null;drops=[];rand;fishCount;constructor(e,t=8){this.rand=i(e),this.fishCount=Math.max(6,Math.min(9,t))}get unit(){return Math.min(this.w,this.h)}resize(e,t){let n=this.w===0,i=n?1:e/this.w,a=n?1:t/this.h;if(this.w=e,this.h=t,n)return this.populate();for(let e of this.fish){for(let t of e.pts)t.x*=i,t.y*=a;e.length=this.unit*this.fishLen(e),e.segLen=e.length/(e.pts.length-1),r(e.pts,e.segLen)}for(let e of this.petals)e.x*=i,e.y*=a}fishLen(e){return .17+.07*(e.p.seed%97/97)}populate(){let e=this.rand;for(let t=0;t<this.fishCount;t++){let n=Math.floor(e()*1e6),i={speed:.28+e()*.22,turn:.8+e()*.4,wander:.6+e()*.8,shy:.7+e()*.6,seed:n},o=new a(this.w*(.2+e()*.6),this.h*(.2+e()*.6),e()*Math.PI*2,1,s[t],i);o.length=this.unit*this.fishLen(o),o.segLen=o.length/(o.pts.length-1),r(o.pts,o.segLen),this.fish.push(o)}for(let[t,n,r,i]of[[.86,.16,1.1,!0],[.95,.42,.85,!1],[.8,.8,1.2,!0],[.97,.97,1,!1],[.1,.92,.8,!0],[.58,.06,.65,!1],[.04,.12,.7,!1]])this.pads.push({nx:t,ny:n,size:r,rot:e()*Math.PI*2,spin:(e()-.5)*.02,age:e()*.8,seed:e(),flower:i?{white:e()>.5,seed:e()}:void 0});for(let t=0;t<16;t++)this.petals.push({x:e()*this.w,y:e()*this.h,vx:(e()-.3)*6,vy:(e()-.5)*4,rot:e()*6.28,spin:(e()-.5)*.3,size:.6+e()*.5});for(let[t,n,r]of[[-.02,.3,.15],[-.02,.62,-.1],[.35,1.02,-1.45],[.62,-.02,1.7]])this.plants.push({nx:t,ny:n,ang:r,blades:Array.from({length:6+Math.floor(e()*4)},()=>({da:(e()-.5)*1.1,len:.16+e()*.2,curl:(e()-.5)*.25,ph:e()*6.28,shade:e()}))})}splash(e,t,n,r=14){if(this.drops.push({x:e,y:t,r,s:n}),Math.abs(n)>.3)for(let n of this.fish)Math.hypot(n.head.x-e,n.head.y-t)<n.length*2&&n.startle(.8)}update(e){this.t+=e;let t={w:this.w,h:this.h,pointer:this.pointer,others:this.fish};for(let n of this.fish)n.update(e,t),n.depth<.25&&this.rand()<e*3&&this.drops.push({x:n.head.x,y:n.head.y,r:n.length*.08,s:.04});for(let t of this.petals)t.x+=(t.vx+Math.sin(this.t*.2+t.y*.01)*3)*e,t.y+=(t.vy+Math.cos(this.t*.17+t.x*.01)*3)*e,t.rot+=t.spin*e,t.x<-20?t.x+=this.w+40:t.x>this.w+20&&(t.x-=this.w+40),t.y<-20?t.y+=this.h+40:t.y>this.h+20&&(t.y-=this.h+40);for(let t of this.pads)t.rot+=t.spin*e}build(){let e=this.unit,t=this.t,n=this.under,r=this.surface;n.n=0,r.n=0;let i=e*.012;for(let t of this.pads)n.sprite(t.nx*this.w+i*2.5,t.ny*this.h+i*3,t.size*e*.1,0,[4,0,0,.35]);let a=[...this.fish].sort((e,t)=>t.depth-e.depth).map(e=>{let t=e.bodyPoints(),n=t.length,r=e.length*.13;return{f:e,pts:t,hw:t.map((e,t)=>r*c(t/(n-1))),maxHw:r}});for(let{f:e,pts:t,hw:r}of a){let a=i*(1.5+e.depth*3);n.ribbon(t.map(e=>({x:e.x+a,y:e.y+a*1.2})),r.map(e=>e*1.7),0,0,[3,0,0,.4*(1-e.depth*.5)])}for(let r of this.plants){let i=r.nx*this.w,a=r.ny*this.h;for(let o of r.blades){let s=o.len*e,c=[],l=[],u=i,d=a,f=r.ang+o.da;for(let n=0;n<8;n++)c.push({x:u,y:d}),l.push(Math.max(.6,e*.007*(1-n/8)**.7)),f+=o.curl+Math.sin(t*.6+o.ph+n*.4)*.04,u+=s/8*Math.cos(f),d+=s/8*Math.sin(f);n.ribbon(c,l,0,0,[5,o.shade,0,.35])}}for(let{f:e,pts:t,hw:r,maxHw:i}of a){let a=t.length,o=e.length,s=t=>[t,e.variety,e.p.seed%1e3/1e3,e.depth],c=e=>{let n=t[e],r=t[e+1],i=Math.hypot(r.x-n.x,r.y-n.y)||1;return{x:(r.x-n.x)/i,y:(r.y-n.y)/i}};for(let[i,a,l,u]of[[2,.2,.065,1],[6,.11,.04,.8]]){let d=c(i),f=-d.y,p=d.x;for(let c of[-1,1]){let m=u+.22*Math.sin(e.phase*.6+c),h={x:d.x*Math.cos(m)+f*c*Math.sin(m),y:d.y*Math.cos(m)+p*c*Math.sin(m)};n.fin({x:t[i].x+f*c*r[i]*.7,y:t[i].y+p*c*r[i]*.7},h,o*a,o*l,s(1))}}let l=c(a-2),u=.35*Math.sin(e.phase-a*.32),d=Math.cos(u),f=Math.sin(u);n.fin({x:t[a-1].x-l.x*o*.03,y:t[a-1].y-l.y*o*.03},{x:l.x*d-l.y*f,y:l.x*f+l.y*d},o*.32,o*.14,s(2)),n.ribbon(t,r,o,i,s(0))}for(let t of this.pads){let n=t.nx*this.w,i=t.ny*this.h,a=t.size*e*.1;r.sprite(n,i,a,t.rot,[6,t.seed,t.age,0])}for(let t of this.pads){if(!t.flower)continue;let n=t.size*e*.1,i=t.rot+2.4,a=t.nx*this.w+Math.cos(i)*n*.3,o=t.ny*this.h+Math.sin(i)*n*.3;r.sprite(a,o,n*.5,t.rot*.5,[7,t.flower.seed,+!!t.flower.white,0])}for(let t of this.petals)r.sprite(t.x,t.y,e*.014*t.size,t.rot,[8,0,0,0])}};function u(e,t,n){let r=(t,n)=>{let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)&&!e.isContextLost())throw Error(e.getShaderInfoLog(r)??`shader`);return r},i=e.createProgram();if(e.attachShader(i,r(e.VERTEX_SHADER,t)),e.attachShader(i,r(e.FRAGMENT_SHADER,n)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)&&!e.isContextLost())throw Error(e.getProgramInfoLog(i)??`link`);let a=new Map;return{p:i,u:t=>(a.has(t)||a.set(t,e.getUniformLocation(i,t)),a.get(t))}}function d(e,t,n,r){let i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,r?e.RGBA16F:e.RGBA8,t,n,0,e.RGBA,r?e.HALF_FLOAT:e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),{fb:a,tex:i,w:t,h:n}}function f(e,t){t&&(e.deleteFramebuffer(t.fb),e.deleteTexture(t.tex))}var p=`#version 300 es
precision highp float;
`,m=`
float hash12(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 hash22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`,h=`${p}
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,g=`${p}
in vec2 vUv; out vec4 o;
uniform sampler2D uState; uniform vec2 uTexel; uniform vec2 uSize; uniform float uDamp;
uniform vec4 uDrops[32]; uniform int uDropN;
void main(){
  vec2 s = texture(uState, vUv).rg;
  float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float d = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float u = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  float n = ((l + r + u + d) * 0.5 - s.g) * uDamp;
  vec2 cell = vUv * uSize;
  for (int i = 0; i < 32; i++){
    if (i >= uDropN) break;
    vec4 dr = uDrops[i];
    float dd = distance(cell, dr.xy);
    if (dd < dr.z) n += dr.w * (0.5 + 0.5 * cos(3.14159265 * dd / dr.z));
  }
  o = vec4(clamp(n, -4.0, 4.0), s.r, 0.0, 1.0);
}`,_=`${p}
in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uScale;
${m}
vec3 pebbles(vec2 p, out float gap){
  vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0; vec2 id = vec2(0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 g = vec2(x, y), c = g + 0.15 + 0.7 * hash22(i + g) - f; float d = dot(c, c);
    if (d < d1){ d2 = d1; d1 = d; id = i + g; } else if (d < d2) d2 = d;
  }
  gap = sqrt(d2) - sqrt(d1);
  float h = hash12(id);
  vec3 c = mix(vec3(0.2, 0.3, 0.26), vec3(0.36, 0.44, 0.36), h);
  c = mix(c, vec3(0.34, 0.33, 0.26), step(0.8, hash12(id + 3.7)));
  float dome = 1.0 - sqrt(d1) * 0.9;
  return c * (0.75 + 0.35 * dome);
}
void main(){
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 p = px / (24.0 * uScale);
  float gap; vec3 peb = pebbles(p, gap);
  peb = mix(peb * 0.6, peb, smoothstep(0.02, 0.2, gap));
  float big = fbm(px / (260.0 * uScale));
  float moss = fbm(px / (60.0 * uScale) + 9.0);
  vec3 silt = mix(vec3(0.12, 0.25, 0.21), vec3(0.22, 0.36, 0.26), moss);
  vec3 c = mix(silt, peb, smoothstep(0.5, 0.62, big) * 0.85);
  c *= 0.85 + 0.3 * fbm(px / (14.0 * uScale));
  // Deeper towards the middle: darker and bluer.
  vec2 q = abs(vUv - 0.5) * 2.0;
  float depth = 1.0 - smoothstep(0.55, 1.05, max(q.x, q.y));
  c = mix(c, vec3(0.05, 0.2, 0.2), depth * 0.45);
  c *= 1.0 - depth * 0.2;
  o = vec4(c, 1.0);
}`,v=`${p}
in vec2 vUv; out vec4 o;
uniform sampler2D uFloor; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform float uScale;
${m}
float cells(vec2 p, float t){
  vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 g = vec2(x, y), h = hash22(i + g);
    vec2 c = g + 0.5 + 0.42 * sin(t * (0.5 + 0.4 * h) + 6.2831 * h) - f; float d = dot(c, c);
    if (d < d1){ d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return pow(1.0 - smoothstep(0.0, 0.3, sqrt(d2) - sqrt(d1)), 3.0);
}
void main(){
  vec3 c = texture(uFloor, vUv).rgb;
  float h = texture(uRip, vUv).r;
  float lap = texture(uRip, vUv + vec2(uSimTexel.x, 0)).r + texture(uRip, vUv - vec2(uSimTexel.x, 0)).r
            + texture(uRip, vUv + vec2(0, uSimTexel.y)).r + texture(uRip, vUv - vec2(0, uSimTexel.y)).r - 4.0 * h;
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes / uScale;
  vec2 p = px / 95.0;
  p += 0.18 * sin(p.yx * 1.7 + uTime * 0.35);
  p += vec2(lap, -lap) * 3.0;
  float ca = cells(p, uTime) * 0.6 + cells(p * 1.63 + 4.1, uTime * 1.2) * 0.4;
  float focus = clamp(-lap * 6.0, -0.6, 1.6);
  float bands = 0.75 + 0.5 * fbm(px / 400.0 + vec2(uTime * 0.02, 0.0));
  c += vec3(0.55, 0.75, 0.55) * ca * (0.22 + 0.35 * focus) * bands;
  c += vec3(0.2, 0.3, 0.22) * focus * 0.15;
  o = vec4(c, 1.0);
}`,y=`${p}
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec2 aCenter;
layout(location = 3) in vec4 aK;
uniform vec2 uRes; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform float uSurface;
out vec2 vUv; out vec4 vK; out vec2 vC; out float vH;
void main(){
  vec2 pos = aPos; vH = 0.0;
  if (uSurface > 0.5){
    vec2 c = vec2(aCenter.x / uRes.x, 1.0 - aCenter.y / uRes.y);
    vec2 t = uSimTexel * 2.0;
    float h = texture(uRip, c).r;
    float gx = texture(uRip, c + vec2(t.x, 0)).r - texture(uRip, c - vec2(t.x, 0)).r;
    float gy = texture(uRip, c + vec2(0, t.y)).r - texture(uRip, c - vec2(0, t.y)).r;
    pos = aCenter + (pos - aCenter) * (1.0 + clamp(h, -1.0, 1.0) * 0.05);
    pos += clamp(vec2(-gx, gy) * 10.0, -8.0, 8.0);
    vH = h;
  }
  vUv = aUv; vK = aK; vC = aCenter;
  vec2 cl = pos / uRes * 2.0 - 1.0;
  gl_Position = vec4(cl.x, -cl.y, 0.0, 1.0);
}`,b=`${p}
in vec2 vUv; in vec4 vK; in vec2 vC; in float vH; out vec4 o;
uniform vec3 uWater; uniform float uTime;
${m}
const vec3 WHITE = vec3(0.96, 0.94, 0.9), RED = vec3(0.88, 0.2, 0.08), SUMI = vec3(0.06, 0.06, 0.07);

float scaleNet(vec2 q){
  q *= vec2(2.6, 3.2); q.x += 0.5 * mod(floor(q.y), 2.0);
  vec2 f = fract(q) - 0.5; return smoothstep(0.32, 0.5, length(f * vec2(1.0, 1.25)));
}
// Koi skin for 6 varieties: 0 kohaku, 1 asagi, 2 ogon, 3 showa, 4 shusui, 5 sanke.
vec3 skin(int kind, float u, float v, float seed, out float metal){
  vec2 q = vec2(u * 5.0, v * 0.55) + seed * 13.7;
  float n = fbm(q * 1.4), n2 = fbm(q * 2.2 + 31.0), net = scaleNet(vec2(u * 5.0, v * 0.55));
  float tail = smoothstep(0.9, 0.72, u);
  metal = 0.0;
  vec3 c = WHITE;
  if (kind == 0 || kind == 5){
    float red = smoothstep(0.47, 0.52, n + 0.06 * (1.0 - abs(v)) + (u < 0.17 ? 0.12 : 0.0)) * tail;
    c = mix(WHITE, RED, red);
    if (kind == 5){ float s = smoothstep(0.66, 0.7, n2) * smoothstep(0.95, 0.4, abs(v)) * step(0.15, u); c = mix(c, SUMI, s); }
    c *= 0.94 + 0.06 * net;
  } else if (kind == 1){
    c = mix(vec3(0.4, 0.52, 0.63), vec3(0.64, 0.75, 0.83), net);
    c = mix(c, vec3(0.88, 0.4, 0.16), smoothstep(0.62, 0.9, abs(v)) + smoothstep(0.12, 0.0, u) * 0.6);
    c = mix(c, vec3(0.86, 0.9, 0.9), smoothstep(0.14, 0.05, u) * 0.6);
  } else if (kind == 2){
    c = mix(vec3(1.0, 0.72, 0.22), vec3(1.0, 0.9, 0.55), net * 0.6 + 0.2 * n);
    metal = 1.0;
  } else if (kind == 3){
    float red = smoothstep(0.48, 0.53, n) * tail;
    float wht = smoothstep(0.55, 0.6, n2) * (1.0 - red);
    c = mix(SUMI, RED, red); c = mix(c, WHITE, wht);
    c *= 0.9 + 0.1 * net;
  } else {
    c = vec3(0.66, 0.76, 0.82);
    float row = smoothstep(0.24, 0.14, abs(v)) * (1.0 - scaleNet(vec2(u * 5.0, 0.0) + vec2(0.0, 0.25)));
    c = mix(c, vec3(0.16, 0.25, 0.42), row * step(0.14, u) * tail);
    c = mix(c, vec3(0.9, 0.36, 0.14), smoothstep(0.6, 0.92, abs(v)) + smoothstep(0.1, 0.0, u) * 0.4);
  }
  return c;
}
vec3 finColor(int kind, float x){
  if (kind == 2) return vec3(1.0, 0.78, 0.35);
  if (kind == 3) return mix(SUMI, WHITE, smoothstep(0.2, 0.7, x));
  if (kind == 1 || kind == 4) return mix(vec3(0.9, 0.42, 0.2), vec3(0.95, 0.85, 0.8), x);
  return WHITE;
}
vec4 underwater(vec3 c, float a, float depth){
  c = mix(c, uWater, depth * 0.55);
  return vec4(c * a, a);
}

void main(){
  int kind = int(vK.x + 0.5);
  vec2 uv = vUv;
  if (kind == 0){ // koi body: uv = (u head->tail, v across), vC = (length, half width)
    float u = uv.x, v = uv.y;
    float a = 1.0 - smoothstep(0.8, 1.0, abs(v));
    if (u < 0.08) a *= 1.0 - smoothstep(0.88, 1.0, length(vec2((0.08 - u) / 0.08, v)));
    float metal;
    vec3 c = skin(int(vK.y + 0.5), u, v, vK.z, metal);
    float round = sqrt(max(0.0, 1.0 - v * v));
    c *= 0.55 + 0.5 * round;
    c += (0.1 + 0.25 * metal) * exp(-v * v * 14.0) * (1.0 - u * 0.7);
    c += metal * 0.15 * sin(u * 30.0 + uTime * 0.7) * round;
    vec2 e = vec2((u - 0.075) * vC.x, (abs(v) - 0.58) * vC.y);
    c = mix(c, vec3(0.02), 1.0 - smoothstep(0.008, 0.016, length(e) / vC.x));
    o = underwater(c, a * smoothstep(1.0, 0.95, u), vK.w);
  } else if (kind == 1 || kind == 2){ // pectoral (1) or tail (2): uv.x root->tip, uv.y across
    float x = uv.x, y = uv.y, a;
    if (kind == 1){
      float w = pow(sin(3.14159 * min(x * 1.05, 1.0)), 0.6) * (0.35 + 0.65 * x);
      a = 1.0 - smoothstep(w - 0.15, w, abs(y));
    } else {
      float w = 0.22 + 0.78 * x;
      a = 1.0 - smoothstep(w - 0.15, w, abs(y));
      a *= smoothstep(0.0, 0.12, abs(y) - (x - 0.62) * 1.2);
      a *= 1.0 - smoothstep(0.88, 1.0, x);
    }
    int variety = int(vK.y + 0.5);
    vec3 c = finColor(variety, x);
    c *= 0.85 + 0.15 * sin(y * 22.0 + x * 4.0);
    o = underwater(c, a * (0.8 - 0.35 * x), vK.w);
  } else if (kind == 3){ // soft body shadow
    float a = (1.0 - smoothstep(0.1, 1.0, abs(uv.y))) * smoothstep(1.0, 0.7, uv.x) * smoothstep(0.0, 0.1, uv.x);
    o = vec4(vec3(0.0), a * vK.w);
  } else if (kind == 4){ // round soft shadow
    float a = 1.0 - smoothstep(0.55, 1.0, length(uv));
    o = vec4(vec3(0.0), a * vK.w);
  } else if (kind == 5){ // water plant blade
    float a = (1.0 - smoothstep(0.55, 1.0, abs(uv.y))) * (1.0 - smoothstep(0.92, 1.0, uv.x));
    vec3 c = mix(vec3(0.07, 0.24, 0.1), vec3(0.3, 0.55, 0.22), (1.0 - abs(uv.y)) * 0.7 + uv.x * 0.3 + vK.y * 0.2);
    c += 0.08 * smoothstep(0.15, 0.0, abs(uv.y));
    o = underwater(c, a, vK.w * (1.0 - uv.x * 0.6));
  } else if (kind == 6){ // lily pad, notch on +x
    float r = length(uv), ang = atan(uv.y, uv.x);
    float a = 1.0 - smoothstep(0.95, 1.0, r);
    a *= smoothstep(0.0, 0.03, (abs(ang) - 0.2) * r);
    float age = vK.z;
    vec3 c = mix(vec3(0.2, 0.38, 0.13), vec3(0.42, 0.4, 0.14), age);
    c *= 0.82 + 0.3 * fbm(uv * 4.0 + vK.y * 9.0);
    float vein = smoothstep(0.92, 1.0, abs(cos(ang * 9.0 + sin(r * 3.0) * 0.3)));
    c += vec3(0.08, 0.1, 0.03) * vein * smoothstep(0.1, 0.4, r);
    c = mix(c, c * 0.6 + vec3(0.08, 0.06, 0.0), smoothstep(0.82, 0.97, r));
    c *= 0.9 + 0.25 * dot(normalize(vec3(uv * 0.35, 1.0)), normalize(vec3(-0.4, -0.5, 0.75)));
    c *= 1.0 + clamp(vH, -1.0, 1.0) * 0.25;
    o = vec4(c * a, a);
  } else if (kind == 7){ // water lily flower
    float r = length(uv), ang = atan(uv.y, uv.x) + vK.y * 6.0;
    float r1 = 0.62 + 0.38 * pow(abs(cos(ang * 4.0)), 0.6);
    float r2 = 0.42 + 0.26 * pow(abs(cos(ang * 4.0 + 0.785)), 0.6);
    vec3 tint = vK.z > 0.5 ? vec3(1.0, 0.97, 0.95) : vec3(1.0, 0.7, 0.8);
    vec3 c = tint * (0.7 + 0.3 * pow(abs(cos(ang * 4.0)), 2.0)) * (0.75 + 0.25 * r / r1);
    float inner = 1.0 - smoothstep(r2 - 0.04, r2, r);
    c = mix(c, tint * (0.9 + 0.2 * pow(abs(cos(ang * 4.0 + 0.785)), 2.0)), inner);
    c = mix(c, vec3(1.0, 0.82, 0.25), 1.0 - smoothstep(0.14, 0.2, r));
    float a = 1.0 - smoothstep(r1 - 0.06, r1, r);
    o = vec4(c * a * 1.1, a);
  } else { // drifting petal, notch at +x
    vec2 p = uv * vec2(1.0, 1.7);
    float a = 1.0 - smoothstep(0.85, 1.0, length(p));
    a *= smoothstep(0.0, 0.08, abs(uv.y) - (uv.x - 0.7) * 0.9);
    vec3 c = mix(vec3(1.0, 0.92, 0.94), vec3(0.98, 0.66, 0.74), smoothstep(-1.0, 0.8, uv.x));
    c *= 1.0 + clamp(vH, -1.0, 1.0) * 0.2;
    o = vec4(c * a, a * 0.95);
  }
}`,x=`${p}
in vec2 vUv; out vec4 o;
uniform sampler2D uUnder; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform vec3 uWater; uniform float uScale;
${m}
float hgt(vec2 p){ return texture(uRip, p).r; }
void main(){
  vec2 t = uSimTexel;
  float hx = hgt(vUv + vec2(t.x, 0)) - hgt(vUv - vec2(t.x, 0));
  float hy = hgt(vUv + vec2(0, t.y)) - hgt(vUv - vec2(0, t.y));
  vec2 px = vUv * uRes / uScale;
  // Idle breeze so still water is never dead flat.
  vec2 breeze = vec2(fbm(px / 180.0 + vec2(uTime * 0.05, 0.0)), fbm(px / 180.0 + vec2(5.0, uTime * 0.04))) - 0.5;
  vec3 n = normalize(vec3(-hx * 5.0 + breeze.x * 0.06, -hy * 5.0 + breeze.y * 0.06, 1.0));
  vec2 ruv = vUv + n.xy * 22.0 * uScale / uRes;
  vec3 c = texture(uUnder, ruv).rgb;
  c = mix(c, uWater, 0.18);
  vec3 L = normalize(vec3(-0.45, 0.55, 0.7)), Hv = normalize(L + vec3(0, 0, 1));
  float sp = pow(max(dot(n, Hv), 0.0), 220.0);
  c += vec3(1.0, 0.97, 0.88) * sp * 1.6;
  float fres = pow(1.0 - n.z, 1.5);
  c += vec3(0.75, 0.9, 0.85) * (0.025 + fres * 0.9);
  o = vec4(c, 1.0);
}`,S=`${p}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc;
void main(){ vec3 c = texture(uSrc, vUv).rgb; o = vec4(max(c - 0.75, 0.0), 1.0); }`,C=`${p}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform vec2 uDir;
void main(){
  vec3 c = texture(uSrc, vUv).rgb * 0.227;
  c += (texture(uSrc, vUv + uDir * 1.38).rgb + texture(uSrc, vUv - uDir * 1.38).rgb) * 0.316;
  c += (texture(uSrc, vUv + uDir * 3.23).rgb + texture(uSrc, vUv - uDir * 3.23).rgb) * 0.07;
  o = vec4(c, 1.0);
}`,w=`${p}
in vec2 vUv; out vec4 o;
uniform sampler2D uScene; uniform sampler2D uBloom; uniform vec2 uPx; uniform float uTime;
float h(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main(){
  vec3 c = texture(uScene, vUv).rgb + texture(uBloom, vUv).rgb * 0.7;
  c = c / (1.0 + c * 0.12);
  vec2 q = (vUv - 0.5) * vec2(1.0, 0.9);
  c *= mix(1.0, 0.7, smoothstep(0.25, 0.75, length(q)));
  c = pow(c, vec3(0.95, 0.97, 1.0));
  c += (h(vUv * uPx + fract(uTime) * 91.0) - 0.5) * 0.04;
  o = vec4(c, 1.0);
}`,T=4,E=1/120,D=[.07,.25,.22],O=class{gl;dprCap;scale=1;float;P;vao;spriteVao;vbo;sim=[];floor;under;scene;bloomA;bloomB;cssW=0;cssH=0;acc=0;time=0;constructor(e,t){this.gl=e,this.dprCap=t,this.float=!!e.getExtension(`EXT_color_buffer_float`);let n=t=>u(e,h,t);this.P={sim:n(g),floor:n(_),under:n(v),water:n(x),bright:n(S),blur:n(C),final:n(w),sprite:u(e,y,b)},this.vao=e.createVertexArray(),this.spriteVao=e.createVertexArray(),this.vbo=e.createBuffer(),e.bindVertexArray(this.spriteVao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),[[0,2,0],[1,2,2],[2,2,4],[3,4,6]].forEach(([t,n,r])=>{e.enableVertexAttribArray(t),e.vertexAttribPointer(t,n,e.FLOAT,!1,40,r*4)}),e.bindVertexArray(null)}px(){let e=Math.min(window.devicePixelRatio||1,this.dprCap)*this.scale;return[Math.max(1,Math.round(this.cssW*e)),Math.max(1,Math.round(this.cssH*e))]}resize(e,t){let n=this.gl,r=e!==this.cssW||t!==this.cssH||!this.sim.length;this.cssW=e,this.cssH=t;let[i,a]=this.px();if(n.canvas.width=i,n.canvas.height=a,r){this.sim.forEach(e=>f(n,e));let r=Math.min(512,Math.ceil(e/T)),i=Math.min(512,Math.ceil(t/T));this.sim=[d(n,r,i,this.float),d(n,r,i,this.float)]}for(let e of[this.floor,this.under,this.scene,this.bloomA,this.bloomB])f(n,e);this.floor=d(n,i,a,!1),this.under=d(n,i,a,!1),this.scene=d(n,i,a,this.float);let o=Math.max(1,i>>2),s=Math.max(1,a>>2);this.bloomA=d(n,o,s,this.float),this.bloomB=d(n,o,s,this.float),this.pass(this.P.floor,this.floor,r=>{n.uniform2f(r.u(`uRes`),e,t),n.uniform1f(r.u(`uScale`),this.patternScale())})}patternScale(){return Math.min(1.4,Math.max(.6,Math.min(this.cssW,this.cssH)/700))}setScale(e){Math.abs(e-this.scale)<.01||(this.scale=e,this.resize(this.cssW,this.cssH))}bindTex(e,t,n,r){let i=this.gl;i.activeTexture(i.TEXTURE0+n),i.bindTexture(i.TEXTURE_2D,r),i.uniform1i(e.u(t),n)}pass(e,t,n){let r=this.gl;r.bindFramebuffer(r.FRAMEBUFFER,t?t.fb:null),r.viewport(0,0,t?t.w:r.canvas.width,t?t.h:r.canvas.height),r.useProgram(e.p),n(e),r.bindVertexArray(this.vao),r.drawArrays(r.TRIANGLES,0,3)}stepSim(e,t){let n=this.gl,[r]=this.sim,i=r.w,a=r.h,o=new Float32Array(128),s=e.drops.splice(0,32);e.drops.length=0,s.forEach((e,t)=>o.set([e.x/this.cssW*i,(1-e.y/this.cssH)*a,Math.max(1.5,e.r/T),e.s],t*4));for(let e=0;e<t;e++){let[t,r]=this.sim;this.pass(this.P.sim,r,r=>{this.bindTex(r,`uState`,0,t.tex),n.uniform2f(r.u(`uTexel`),1/i,1/a),n.uniform2f(r.u(`uSize`),i,a),n.uniform1f(r.u(`uDamp`),.986),n.uniform4fv(r.u(`uDrops`),o),n.uniform1i(r.u(`uDropN`),e===0?s.length:0)}),this.sim=[r,t]}}drawMesh(e,t){if(!e.n)return;let n=this.gl,r=this.P.sprite,i=this.sim[0];n.useProgram(r.p),n.uniform2f(r.u(`uRes`),this.cssW,this.cssH),n.uniform2f(r.u(`uSimTexel`),1/i.w,1/i.h),n.uniform1f(r.u(`uSurface`),+!!t),n.uniform3f(r.u(`uWater`),...D),n.uniform1f(r.u(`uTime`),this.time),this.bindTex(r,`uRip`,0,i.tex),n.bindVertexArray(this.spriteVao),n.bindBuffer(n.ARRAY_BUFFER,this.vbo),n.bufferData(n.ARRAY_BUFFER,e.data.subarray(0,e.n*10),n.DYNAMIC_DRAW),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.drawArrays(n.TRIANGLES,0,e.n),n.disable(n.BLEND)}frame(e,t){let n=this.gl;if(!this.under||!this.scene||!this.floor||!this.bloomA||!this.bloomB)return;this.time+=t,this.acc=Math.min(this.acc+t,E*4);let r=0;for(;this.acc>=E;)this.acc-=E,r++;this.float&&r?this.stepSim(e,r):this.float||(e.drops.length=0),e.build();let i=this.sim[0],a=this.cssW,o=this.cssH,s=this.patternScale(),c=e=>{n.uniform2f(e.u(`uSimTexel`),1/i.w,1/i.h),n.uniform2f(e.u(`uRes`),a,o),n.uniform1f(e.u(`uTime`),this.time),n.uniform1f(e.u(`uScale`),s)};this.pass(this.P.under,this.under,e=>{c(e),this.bindTex(e,`uFloor`,0,this.floor.tex),this.bindTex(e,`uRip`,1,i.tex)}),this.drawMesh(e.under,!1),this.pass(this.P.water,this.scene,e=>{c(e),n.uniform3f(e.u(`uWater`),...D),this.bindTex(e,`uUnder`,0,this.under.tex),this.bindTex(e,`uRip`,1,i.tex)}),this.drawMesh(e.surface,!0);let l=this.bloomA,u=this.bloomB;this.pass(this.P.bright,l,e=>this.bindTex(e,`uSrc`,0,this.scene.tex));for(let[e,t,r,i]of[[l,u,1,0],[u,l,0,1]])this.pass(this.P.blur,t,t=>{this.bindTex(t,`uSrc`,0,e.tex),n.uniform2f(t.u(`uDir`),r/l.w,i/l.h)});this.pass(this.P.final,null,e=>{this.bindTex(e,`uScene`,0,this.scene.tex),this.bindTex(e,`uBloom`,1,l.tex),n.uniform2f(e.u(`uPx`),n.canvas.width,n.canvas.height),n.uniform1f(e.u(`uTime`),this.time)})}},k=[523.25,587.33,659.25,783.99,880,1046.5],A=class{on=!1;ctx;out;last=0;init(){let e=this.ctx=new AudioContext,t=this.out=e.createGain();t.gain.value=0,t.connect(e.destination);let n=e.sampleRate*4,r=e.createBuffer(1,n,e.sampleRate),i=r.getChannelData(0),a=0;for(let e=0;e<n;e++)a=(a+(Math.random()*2-1)*.02)*.998,i[e]=a*3.5;let o=(n,i,a,o,s)=>{let c=e.createBufferSource();c.buffer=r,c.loop=!0,c.playbackRate.value=.9+Math.random()*.2;let l=e.createBiquadFilter();l.type=n,l.frequency.value=i,l.Q.value=.7;let u=e.createGain();u.gain.value=a;let d=e.createOscillator(),f=e.createGain();d.frequency.value=o,f.gain.value=s,d.connect(f).connect(u.gain),c.connect(l).connect(u).connect(t),c.start(),d.start()};o(`lowpass`,420,.5,.06,.15),o(`bandpass`,1400,.12,.23,.08)}async toggle(){this.ctx||this.init();let e=this.ctx,t=this.out.gain;return this.on=!this.on,this.on&&await e.resume(),t.cancelScheduledValues(e.currentTime),t.setTargetAtTime(this.on?.6:0,e.currentTime,.25),this.on}plink(e,t){if(!this.on||!this.ctx||!this.out)return;let n=this.ctx,r=n.currentTime;if(r-this.last<.12)return;this.last=r;let i=k[Math.floor(Math.random()*k.length)]*(Math.random()<.3?.5:1),a=n.createOscillator(),o=n.createGain(),s=n.createStereoPanner();a.type=`sine`,a.frequency.setValueAtTime(i,r),a.frequency.exponentialRampToValueAtTime(i*1.5,r+.09);let c=Math.min(.25,.08+e*.15);o.gain.setValueAtTime(1e-4,r),o.gain.exponentialRampToValueAtTime(c,r+.008),o.gain.exponentialRampToValueAtTime(1e-4,r+.45),s.pan.value=Math.max(-1,Math.min(1,t)),a.connect(o).connect(s).connect(this.out),a.start(r),a.stop(r+.5)}},j=document.documentElement.classList.contains(`embed`),M=matchMedia(`(prefers-reduced-motion: reduce)`).matches,N=document.querySelector(`#pond`),P=document.querySelector(`#fallback`),F=document.querySelector(`.creator`);F&&new IntersectionObserver(([e])=>F.classList.toggle(`is-live`,e.isIntersecting)).observe(F);var I=document.querySelector(`#theme`);I?.addEventListener(`click`,()=>{let e=document.documentElement.dataset.theme!==`light`;document.documentElement.dataset.theme=e?`light`:`dark`,I.setAttribute(`aria-pressed`,String(e));try{localStorage.setItem(`theme`,e?`light`:`dark`)}catch{}}),I?.setAttribute(`aria-pressed`,String(document.documentElement.dataset.theme===`light`));function L(){N.hidden=!0,P.hidden=!1}var R=N.getContext(`webgl2`,{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});R?z(R):L();function z(e){let t;try{t=new O(e,j?1.5:2)}catch(e){return console.error(e),L()}let n=new l(Math.random()*1e9|0,8),r=new A,i=!1,a=!0,o=0,s=0,c=0,u=0,d=1/60,f=()=>{for(let e=0;e<90;e++)n.update(1/60);n.drops.length=0,t.frame(n,1/60)},p=()=>{let e=N.getBoundingClientRect();e.width<2||e.height<2||(n.resize(e.width,e.height),t.resize(e.width,e.height),M&&f())};new ResizeObserver(p).observe(N);let m=e=>{s=requestAnimationFrame(m);let r=Math.min(.05,o?(e-o)/1e3:1/60);o=e,d+=(r-d)*.05,d>.024?(c++,u=0):d<.0175?(u++,c=0):c=u=0,c>45&&t.scale>.5&&(t.setScale(Math.max(.5,t.scale-.15)),c=0,d=1/60),u>240&&t.scale<1&&(t.setScale(Math.min(1,t.scale+.1)),u=0),n.update(r),t.frame(n,r)},h=()=>{let e=!M&&a&&!document.hidden;e&&!i?(i=!0,o=0,s=requestAnimationFrame(m)):!e&&i&&(i=!1,cancelAnimationFrame(s))};document.addEventListener(`visibilitychange`,h),new IntersectionObserver(([e])=>{a=e.isIntersecting,h()}).observe(N),N.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),i=!1,cancelAnimationFrame(s),L()});let g={x:-1e9,y:-1e9},_=0,v=e=>{let t=N.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}},y=(e,t,i)=>{n.pointer={x:e,y:t},clearTimeout(_),_=window.setTimeout(()=>{n.pointer=null},600),n.splash(e,t,i,Math.min(n.w,n.h)*.02),r.plink(Math.abs(i),e/n.w*2-1)};N.addEventListener(`pointerdown`,e=>{let t=v(e);N.setPointerCapture(e.pointerId),g=t,y(t.x,t.y,1.2)}),N.addEventListener(`pointermove`,e=>{let t=v(e),r=e.buttons!==0;if(!r&&e.pointerType!==`mouse`)return;let i=Math.min(n.w,n.h)*(r?.015:.03);Math.hypot(t.x-g.x,t.y-g.y)<i||(g=t,r?y(t.x,t.y,.45):(n.pointer=t,n.splash(t.x,t.y,.1,Math.min(n.w,n.h)*.012)))}),N.addEventListener(`pointerleave`,()=>{n.pointer=null});let b=document.querySelector(`#sound`);b?.addEventListener(`click`,async()=>{let e=await r.toggle();b.setAttribute(`aria-pressed`,String(e)),b.querySelector(`.label`).textContent=e?`Sound on`:`Sound off`}),p(),h()}