(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Math.PI*2,t=t=>t-e*Math.floor((t+Math.PI)/e);function n(e,n,r,i){let a=t(n-e),o=r*i;return t(e+Math.max(-o,Math.min(o,a)))}function r(e,n,r=.3){for(let i=1;i<e.length;i++){let a=e[i-1],o=e[i],s=Math.atan2(o.y-a.y,o.x-a.x);if(Math.hypot(o.x-a.x,o.y-a.y)<1e-6&&(s=Math.PI),i>1){let n=e[i-2],o=Math.atan2(a.y-n.y,a.x-n.x),c=t(s-o);s=o+Math.max(-r,Math.min(r,c))}o.x=a.x+Math.cos(s)*n,o.y=a.y+Math.sin(s)*n}}function i(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function a(e,t,n,r,i,a){let o=n-e,s=r-t,c=Math.hypot(o,s);if(c<.001)return a.x=a.y=0,a;let l=o/c,u=s/c,d=i*.6,f=Math.max(0,Math.min(1,(c-d)/(d*.5))),p=f+(1-f)*Math.max(-1,Math.min(1,(c-d)/d))*.5,m=(1-f)*.8;return a.x=l*p-u*m,a.y=u*p+l*m,a}var o={x:0,y:0},s=class{pts;heading;speed;segLen;phase=0;t=0;depth;depthTarget;rand;boost=0;feedT=0;feedAge=0;feedX=0;feedY=0;length;variety;p;constructor(e,t,n,r,a,o){this.length=r,this.variety=a,this.p=o,this.rand=i(o.seed),this.heading=n,this.speed=o.speed*r,this.segLen=r/11,this.pts=Array.from({length:12},(r,i)=>({x:e-Math.cos(n)*this.segLen*i,y:t-Math.sin(n)*this.segLen*i})),this.depth=this.depthTarget=this.rand()*.7}get head(){return this.pts[0]}startle(e){this.boost=Math.max(this.boost,e)}feed(e,t,n){this.feedX=e,this.feedY=t,this.feedT=n,this.feedAge=0}get feeding(){return this.feedT>0}update(e,i){let{p:s}=this,c=this.head;this.t+=e;let l=this.length,u=s.seed*.001,d=(Math.sin(this.t*.37*s.wander+u*7)+.6*Math.sin(this.t*.91*s.wander+u*13))*.9,f=Math.cos(this.heading+d*.6),p=Math.sin(this.heading+d*.6),m=Math.min(i.w,i.h)*.18+l*.5,h=e=>e<m?((m-Math.max(e,0))/m)**1.5*4:0,g=h(c.x)-h(i.w-c.x),_=h(c.y)-h(i.h-c.y);f+=g,p+=_;let v=Math.min(2,Math.hypot(g,_)),y=1;if(this.feedT>0){this.feedT-=e,this.feedAge+=e;let t=Math.min(1,this.feedAge/.8)*Math.min(1,this.feedT/.6+.3);a(c.x,c.y,this.feedX,this.feedY,l,o),f+=o.x*2.5*t,p+=o.y*2.5*t,Math.hypot(this.feedX-c.x,this.feedY-c.y)<l&&(y=.55)}let b=0;if(i.pointer&&this.feedT<=0){let e=c.x-i.pointer.x,t=c.y-i.pointer.y,n=Math.hypot(e,t),r=l*1.6;n<r&&n>.001&&(b=(r-n)/r*s.shy*(i.pointerShy??1),f+=e/n*b*3,p+=t/n*b*3)}for(let e of i.others){if(e===this)continue;let t=c.x-e.head.x,n=c.y-e.head.y,r=Math.hypot(t,n),i=(l+e.length)*.45;r<i&&r>.001&&(f+=t/r*((i-r)/i)*.8,p+=n/r*((i-r)/i)*.8)}let x=Math.atan2(p,f),S=this.heading,C=Math.min(3,this.speed/l/.4*s.turn)*(1+b+v);this.heading=n(this.heading,x,C,e);let w=Math.abs(t(this.heading-S))/Math.max(e,1e-4);this.boost=Math.max(0,this.boost-e*.8);let T=s.speed*l*(1+b*2.2+this.boost*2)*y;this.speed+=(T-this.speed)*Math.min(1,e*1.5),c.x+=Math.cos(this.heading)*this.speed*e,c.y+=Math.sin(this.heading)*this.speed*e,c.x=Math.min(i.w-2,Math.max(2,c.x)),c.y=Math.min(i.h-2,Math.max(2,c.y)),r(this.pts,this.segLen),this.phase+=e*(2.2+this.speed/l*6+w*.8),this.rand()<e*.08&&(this.depthTarget=this.rand()*.8),this.depth+=(this.depthTarget-this.depth)*e*.15}bodyPoints(){let e=this.pts.length,t=this.length*(.02+Math.min(.03,this.speed/this.length*.025));return this.pts.map((n,r)=>{let i=this.pts[Math.max(0,r-1)],a=this.pts[Math.min(e-1,r+1)],o=i.x-a.x,s=i.y-a.y,c=Math.hypot(o,s)||1,l=t*(r/(e-1))**1.6*Math.sin(this.phase-r*.32);return{x:n.x-s/c*l,y:n.y+o/c*l}})}},c=class{data=new Float32Array(81920);n=0;v(e,t,n,r,i,a,o){if((this.n+1)*10>this.data.length){let e=new Float32Array(this.data.length*2);e.set(this.data),this.data=e}let s=this.n++*10,c=this.data;c[s]=e,c[s+1]=t,c[s+2]=n,c[s+3]=r,c[s+4]=i,c[s+5]=a,c[s+6]=o[0],c[s+7]=o[1],c[s+8]=o[2],c[s+9]=o[3]}quad(e,t,n,r,i){for(let a of[0,1,2,0,2,3])this.v(e[a].x,e[a].y,t[a][0],t[a][1],n,r,i)}sprite(e,t,n,r,i){let a=Math.cos(r)*n,o=Math.sin(r)*n,s=[[-1,-1],[1,-1],[1,1],[-1,1]];this.quad(s.map(([n,r])=>({x:e+n*a-r*o,y:t+n*o+r*a})),s,e,t,i)}ribbon(e,t,n,r,i){let a=e.length,o=e.map((t,n)=>{let r=e[Math.max(0,n-1)],i=e[Math.min(a-1,n+1)],o=i.x-r.x,s=i.y-r.y,c=Math.hypot(o,s)||1;return{x:-s/c,y:o/c}});for(let s=0;s<a-1;s++){let c=(n,r)=>({x:e[n].x+o[n].x*t[n]*r,y:e[n].y+o[n].y*t[n]*r}),l=s/(a-1),u=(s+1)/(a-1);this.quad([c(s,-1),c(s+1,-1),c(s+1,1),c(s,1)],[[l,-1],[u,-1],[u,1],[l,1]],n,r,i)}}fin(e,t,n,r,i){let a=-t.y*r,o=t.x*r,s=e.x+t.x*n,c=e.y+t.y*n;this.quad([{x:e.x-a,y:e.y-o},{x:s-a,y:c-o},{x:s+a,y:c+o},{x:e.x+a,y:e.y+o}],[[0,-1],[1,-1],[1,1],[0,1]],0,0,i)}},l=2.5;function u(e,t,n,r,i,a){let o=Math.hypot(e,t),s=1-n/l;if(s<=0||o<.001)return a.x=a.y=0,a;let c=i*4,u=r*s*s*Math.exp(-((o/c)**2))/o;return a.x=e*u,a.y=t*u,a}var d={x:0,y:0},f=[0,1,2,3,4,5,0,2,5],p=e=>e<.28?.72+.28*Math.sin(e/.28*Math.PI*.5):1-.85*((e-.28)/.72)**1.3,m=class{w=0;h=0;t=0;fish=[];pads=[];petals=[];plants=[];under=new c;surface=new c;pointer=null;drops=[];pointerShy=1;dX=new Float32Array(16);dY=new Float32Array(16);dS=new Float32Array(16);dR=new Float32Array(16);dAge=new Float32Array(16).fill(l);dHead=0;lastFeed=-10;rand;fishCount;constructor(e,t=8){this.rand=i(e),this.fishCount=Math.max(6,Math.min(9,t))}get unit(){return Math.min(this.w,this.h)}resize(e,t){let n=this.w===0,i=n?1:e/this.w,a=n?1:t/this.h;if(this.w=e,this.h=t,n)return this.populate();for(let e of this.fish){for(let t of e.pts)t.x*=i,t.y*=a;e.length=this.unit*this.fishLen(e),e.segLen=e.length/(e.pts.length-1),r(e.pts,e.segLen)}for(let e of this.petals)e.x*=i,e.y*=a}fishLen(e){return .17+.07*(e.p.seed%97/97)}populate(){let e=this.rand;for(let t=0;t<this.fishCount;t++){let n=Math.floor(e()*1e6),i={speed:.28+e()*.22,turn:.8+e()*.4,wander:.6+e()*.8,shy:.7+e()*.6,seed:n},a=new s(this.w*(.2+e()*.6),this.h*(.2+e()*.6),e()*Math.PI*2,1,f[t],i);a.length=this.unit*this.fishLen(a),a.segLen=a.length/(a.pts.length-1),r(a.pts,a.segLen),this.fish.push(a)}for(let[t,n,r,i]of[[.86,.16,1.1,!0],[.95,.42,.85,!1],[.8,.8,1.2,!0],[.97,.97,1,!1],[.1,.92,.8,!0],[.58,.06,.65,!1],[.04,.12,.7,!1]])this.pads.push({ox:0,oy:0,vx:0,vy:0,kick:0,nx:t,ny:n,size:r,rot:e()*Math.PI*2,spin:(e()-.5)*.02,age:e()*.8,seed:e(),flower:i?{white:e()>.5,seed:e()}:void 0});for(let t=0;t<16;t++)this.petals.push({ex:0,ey:0,x:e()*this.w,y:e()*this.h,vx:(e()-.3)*6,vy:(e()-.5)*4,rot:e()*6.28,spin:(e()-.5)*.3,size:.6+e()*.5});for(let[t,n,r]of[[-.02,.3,.15],[-.02,.62,-.1],[.35,1.02,-1.45],[.62,-.02,1.7]])this.plants.push({nx:t,ny:n,ang:r,blades:Array.from({length:6+Math.floor(e()*4)},()=>({da:(e()-.5)*1.1,len:.16+e()*.2,curl:(e()-.5)*.25,ph:e()*6.28,shade:e()}))})}splash(e,t,n,r=14){if(this.drops.push({x:e,y:t,r,s:n}),this.disturb(e,t,n,r),Math.abs(n)>.3)for(let n of this.fish)Math.hypot(n.head.x-e,n.head.y-t)<n.length&&n.startle(.8)}disturb(e,t,n,r){let i=this.dHead;this.dHead=(i+1)%16,this.dX[i]=e,this.dY[i]=t,this.dS[i]=Math.min(1.5,Math.abs(n)),this.dR[i]=r,this.dAge[i]=0}tap(e,t){if(this.t-this.lastFeed<1.5)return;this.lastFeed=this.t;let n=1+Math.floor(this.rand()*3),r=this.fish.filter(e=>!e.feeding).sort((n,r)=>Math.hypot(n.head.x-e,n.head.y-t)-Math.hypot(r.head.x-e,r.head.y-t));for(let i of r.slice(0,n))i.feed(e,t,4+this.rand()*2.5)}update(e){this.t+=e;let t={w:this.w,h:this.h,pointer:this.pointer,others:this.fish,pointerShy:this.pointerShy};for(let n of this.fish)n.update(e,t),n.depth<.25&&this.rand()<e*3&&this.drops.push({x:n.head.x,y:n.head.y,r:n.length*.08,s:.04}),n.speed>.2*n.length&&this.disturb(n.head.x,n.head.y,.05,n.length*.1);for(let t=0;t<16;t++)this.dAge[t]+=e;let n=this.unit,r=Math.exp(-e*1.5),i=n*.012;for(let t of this.petals){let i=0,a=0;for(let e=0;e<16;e++)this.dAge[e]>=2.5||(u(t.x-this.dX[e],t.y-this.dY[e],this.dAge[e],this.dS[e],this.dR[e],d),i+=d.x,a+=d.y);t.ex=(t.ex+i*n*.08*e)*r,t.ey=(t.ey+a*n*.08*e)*r,t.x+=(t.vx+t.ex+Math.sin(this.t*.2+t.y*.01)*3)*e,t.y+=(t.vy+t.ey+Math.cos(this.t*.17+t.x*.01)*3)*e,t.rot+=t.spin*e,t.x<-20?t.x+=this.w+40:t.x>this.w+20&&(t.x-=this.w+40),t.y<-20?t.y+=this.h+40:t.y>this.h+20&&(t.y-=this.h+40)}let a=3.5;for(let t of this.pads){let r=0,o=0,s=0;for(let e=0;e<16;e++){if(this.dAge[e]>=2.5)continue;let n=t.nx*this.w+t.ox-this.dX[e],i=t.ny*this.h+t.oy-this.dY[e];u(n,i,this.dAge[e],this.dS[e],this.dR[e],d),r+=d.x,o+=d.y,s+=n*d.y-i*d.x}let c=n*.1;t.vx+=(r*c-6*t.ox-a*t.vx)*e,t.vy+=(o*c-6*t.oy-a*t.vy)*e,t.ox+=t.vx*e,t.oy+=t.vy*e;let l=Math.hypot(t.ox,t.oy);l>i&&(t.ox*=i/l,t.oy*=i/l),t.kick=(t.kick+Math.max(-1,Math.min(1,s/(n*.1+1)))*.05*e*60)*Math.exp(-e*2),t.rot+=(t.spin+t.kick)*e}}build(){let e=this.unit,t=this.t,n=this.under,r=this.surface;n.n=0,r.n=0;let i=e*.012;for(let t of this.pads)n.sprite(t.nx*this.w+t.ox+i*2.5,t.ny*this.h+t.oy+i*3,t.size*e*.1,0,[4,0,0,.35]);let a=[...this.fish].sort((e,t)=>t.depth-e.depth).map(e=>{let t=e.bodyPoints(),n=t.length,r=e.length*.13;return{f:e,pts:t,hw:t.map((e,t)=>r*p(t/(n-1))),maxHw:r}});for(let{f:e,pts:t,hw:r}of a){let a=i*(1.5+e.depth*3);n.ribbon(t.map(e=>({x:e.x+a,y:e.y+a*1.2})),r.map(e=>e*1.7),0,0,[3,0,0,.4*(1-e.depth*.5)])}for(let r of this.plants){let i=r.nx*this.w,a=r.ny*this.h;for(let o of r.blades){let s=o.len*e,c=[],l=[],u=i,d=a,f=r.ang+o.da;for(let n=0;n<8;n++)c.push({x:u,y:d}),l.push(Math.max(.6,e*.007*(1-n/8)**.7)),f+=o.curl+Math.sin(t*.6+o.ph+n*.4)*.04,u+=s/8*Math.cos(f),d+=s/8*Math.sin(f);n.ribbon(c,l,0,0,[5,o.shade,0,.35])}}for(let{f:e,pts:t,hw:r,maxHw:i}of a){let a=t.length,o=e.length,s=t=>[t,e.variety,e.p.seed%1e3/1e3,e.depth],c=e=>{let n=t[e],r=t[e+1],i=Math.hypot(r.x-n.x,r.y-n.y)||1;return{x:(r.x-n.x)/i,y:(r.y-n.y)/i}};for(let[i,a,l,u]of[[2,.2,.065,1],[6,.11,.04,.8]]){let d=c(i),f=-d.y,p=d.x;for(let c of[-1,1]){let m=u+.22*Math.sin(e.phase*.6+c),h={x:d.x*Math.cos(m)+f*c*Math.sin(m),y:d.y*Math.cos(m)+p*c*Math.sin(m)};n.fin({x:t[i].x+f*c*r[i]*.7,y:t[i].y+p*c*r[i]*.7},h,o*a,o*l,s(1))}}let l=c(a-2),u=.35*Math.sin(e.phase-a*.32),d=Math.cos(u),f=Math.sin(u);n.fin({x:t[a-1].x-l.x*o*.03,y:t[a-1].y-l.y*o*.03},{x:l.x*d-l.y*f,y:l.x*f+l.y*d},o*.32,o*.14,s(2)),n.ribbon(t,r,o,i,s(0))}for(let t of this.pads){let n=t.nx*this.w+t.ox,i=t.ny*this.h+t.oy,a=t.size*e*.1;r.sprite(n,i,a,t.rot,[6,t.seed,t.age,0])}for(let t of this.pads){if(!t.flower)continue;let n=t.size*e*.1,i=t.rot+2.4,a=t.nx*this.w+t.ox+Math.cos(i)*n*.3,o=t.ny*this.h+t.oy+Math.sin(i)*n*.3;r.sprite(a,o,n*.5,t.rot*.5,[7,t.flower.seed,+!!t.flower.white,0])}for(let t of this.petals)r.sprite(t.x,t.y,e*.014*t.size,t.rot,[8,0,0,0])}};function h(e,t,n){let r=(t,n)=>{let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)&&!e.isContextLost())throw Error(e.getShaderInfoLog(r)??`shader`);return r},i=e.createProgram();if(e.attachShader(i,r(e.VERTEX_SHADER,t)),e.attachShader(i,r(e.FRAGMENT_SHADER,n)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)&&!e.isContextLost())throw Error(e.getProgramInfoLog(i)??`link`);let a=new Map;return{p:i,u:t=>(a.has(t)||a.set(t,e.getUniformLocation(i,t)),a.get(t))}}function g(e){if(!e.getExtension(`EXT_color_buffer_float`)&&!e.getExtension(`EXT_color_buffer_half_float`))return!1;let t=_(e,4,4,!0),n=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE&&!e.getError();return v(e,t),n}function _(e,t,n,r,i=!1,a=[0,0,0,1]){let o=e.createTexture(),s=i?e.NEAREST:e.LINEAR;e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,r?e.RGBA16F:e.RGBA8,t,n,0,e.RGBA,r?e.HALF_FLOAT:e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let c=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,c),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0),e.clearColor(...a),e.clear(e.COLOR_BUFFER_BIT),{fb:c,tex:o,w:t,h:n}}function v(e,t){t&&(e.deleteFramebuffer(t.fb),e.deleteTexture(t.tex))}var y=`#version 300 es
precision highp float;
`,b=`
float hash12(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 hash22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`,x=`${y}
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,S=`
#ifdef PACKED
vec2 ripDec(vec4 t){ vec4 b = floor(t * 255.0 + 0.5); return (vec2(b.x, b.z) * 256.0 + vec2(b.y, b.w) - 32768.0) / 8192.0; }
vec4 ripEnc(vec2 v){
  vec2 u = clamp(floor(v * 8192.0 + 0.5) + 32768.0, 0.0, 65535.0), hi = floor(u / 256.0);
  return vec4(hi.x, u.x - hi.x * 256.0, hi.y, u.y - hi.y * 256.0) / 255.0;
}
float ripH(sampler2D s, vec2 uv){
  vec2 sz = vec2(textureSize(s, 0)), p = uv * sz - 0.5, f = fract(p), q = (floor(p) + 0.5) / sz, t = 1.0 / sz;
  return mix(mix(ripDec(texture(s, q)).x, ripDec(texture(s, q + vec2(t.x, 0))).x, f.x),
             mix(ripDec(texture(s, q + vec2(0, t.y))).x, ripDec(texture(s, q + t)).x, f.x), f.y);
}
#else
vec2 ripDec(vec4 t){ return t.rg; }
vec4 ripEnc(vec2 v){ return vec4(v, 0.0, 1.0); }
float ripH(sampler2D s, vec2 uv){ return texture(s, uv).r; }
#endif
`,C=e=>e.replace(`#version 300 es
`,`#version 300 es
#define PACKED
`),w=`${y}
in vec2 vUv; out vec4 o;
uniform sampler2D uState; uniform vec2 uTexel; uniform vec2 uSize; uniform float uDamp;
uniform vec4 uDrops[32]; uniform int uDropN;
${S}
void main(){
  vec2 s = ripDec(texture(uState, vUv));
  float l = ripDec(texture(uState, vUv - vec2(uTexel.x, 0.0))).x;
  float r = ripDec(texture(uState, vUv + vec2(uTexel.x, 0.0))).x;
  float d = ripDec(texture(uState, vUv - vec2(0.0, uTexel.y))).x;
  float u = ripDec(texture(uState, vUv + vec2(0.0, uTexel.y))).x;
  float n = ((l + r + u + d) * 0.5 - s.g) * uDamp;
  vec2 cell = vUv * uSize;
  for (int i = 0; i < 32; i++){
    if (i >= uDropN) break;
    vec4 dr = uDrops[i];
    float dd = distance(cell, dr.xy);
    if (dd < dr.z) n += dr.w * (0.5 + 0.5 * cos(3.14159265 * dd / dr.z));
  }
  o = ripEnc(vec2(clamp(n, -4.0, 3.99), s.x));
}`,T=`${y}
in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uScale;
${b}
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
}`,E=`${y}
in vec2 vUv; out vec4 o;
uniform sampler2D uFloor; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform float uScale;
${b}${S}
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
  float h = ripH(uRip, vUv);
  float lap = ripH(uRip, vUv + vec2(uSimTexel.x, 0)) + ripH(uRip, vUv - vec2(uSimTexel.x, 0))
            + ripH(uRip, vUv + vec2(0, uSimTexel.y)) + ripH(uRip, vUv - vec2(0, uSimTexel.y)) - 4.0 * h;
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
}`,D=`${y}
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec2 aCenter;
layout(location = 3) in vec4 aK;
uniform vec2 uRes; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform float uSurface;
out vec2 vUv; out vec4 vK; out vec2 vC; out float vH;
${S}
void main(){
  vec2 pos = aPos; vH = 0.0;
  if (uSurface > 0.5){
    vec2 c = vec2(aCenter.x / uRes.x, 1.0 - aCenter.y / uRes.y);
    vec2 t = uSimTexel * 2.0;
    float h = ripH(uRip, c);
    float gx = ripH(uRip, c + vec2(t.x, 0)) - ripH(uRip, c - vec2(t.x, 0));
    float gy = ripH(uRip, c + vec2(0, t.y)) - ripH(uRip, c - vec2(0, t.y));
    pos = aCenter + (pos - aCenter) * (1.0 + clamp(h, -1.0, 1.0) * 0.05);
    pos += clamp(vec2(-gx, gy) * 10.0, -8.0, 8.0);
    vH = h;
  }
  vUv = aUv; vK = aK; vC = aCenter;
  vec2 cl = pos / uRes * 2.0 - 1.0;
  gl_Position = vec4(cl.x, -cl.y, 0.0, 1.0);
}`,O=`${y}
in vec2 vUv; in vec4 vK; in vec2 vC; in float vH; out vec4 o;
uniform vec3 uWater; uniform float uTime;
${b}
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
}`,k=`${y}
in vec2 vUv; out vec4 o;
uniform sampler2D uUnder; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform vec3 uWater; uniform float uScale;
${b}${S}
float hgt(vec2 p){ return ripH(uRip, p); }
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
}`,A=`${y}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc;
void main(){ vec3 c = texture(uSrc, vUv).rgb; o = vec4(max(c - 0.75, 0.0), 1.0); }`,j=`${y}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform vec2 uDir;
void main(){
  vec3 c = texture(uSrc, vUv).rgb * 0.227;
  c += (texture(uSrc, vUv + uDir * 1.38).rgb + texture(uSrc, vUv - uDir * 1.38).rgb) * 0.316;
  c += (texture(uSrc, vUv + uDir * 3.23).rgb + texture(uSrc, vUv - uDir * 3.23).rgb) * 0.07;
  o = vec4(c, 1.0);
}`,M=`${y}
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
}`,N=4,P=1/120,F=32,I=[.07,.25,.22],L=class{gl;dprCap;scale=1;half;get ripplePath(){return this.packed?`packed`:`half`}packed;drops=new Float32Array(128);P;vao;spriteVao;vbo;sim=[];floor;under;scene;bloomA;bloomB;cssW=0;cssH=0;acc=0;time=0;constructor(e,t,n={}){this.gl=e,this.dprCap=t,this.half=!n.forceNoFloat&&g(e),this.packed=!this.half;let r=e=>this.packed?C(e):e,i=t=>h(e,x,r(t));this.P={sim:i(w),floor:h(e,x,T),under:i(E),water:i(k),bright:h(e,x,A),blur:h(e,x,j),final:h(e,x,M),sprite:h(e,r(D),O)},this.vao=e.createVertexArray(),this.spriteVao=e.createVertexArray(),this.vbo=e.createBuffer(),e.bindVertexArray(this.spriteVao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),[[0,2,0],[1,2,2],[2,2,4],[3,4,6]].forEach(([t,n,r])=>{e.enableVertexAttribArray(t),e.vertexAttribPointer(t,n,e.FLOAT,!1,40,r*4)}),e.bindVertexArray(null)}px(){let e=Math.min(window.devicePixelRatio||1,this.dprCap)*this.scale;return[Math.max(1,Math.round(this.cssW*e)),Math.max(1,Math.round(this.cssH*e))]}resize(e,t){let n=this.gl,r=e!==this.cssW||t!==this.cssH||!this.sim.length;this.cssW=e,this.cssH=t;let[i,a]=this.px();if(n.canvas.width=i,n.canvas.height=a,r){this.sim.forEach(e=>v(n,e));let r=Math.min(512,Math.ceil(e/N)),i=Math.min(512,Math.ceil(t/N)),a=()=>this.packed?_(n,r,i,!1,!0,[128/255,0,128/255,0]):_(n,r,i,!0);this.sim=[a(),a()]}for(let e of[this.floor,this.under,this.scene,this.bloomA,this.bloomB])v(n,e);this.floor=_(n,i,a,!1),this.under=_(n,i,a,!1),this.scene=_(n,i,a,this.half);let o=Math.max(1,i>>2),s=Math.max(1,a>>2);this.bloomA=_(n,o,s,this.half),this.bloomB=_(n,o,s,this.half),this.pass(this.P.floor,this.floor,r=>{n.uniform2f(r.u(`uRes`),e,t),n.uniform1f(r.u(`uScale`),this.patternScale())})}patternScale(){return Math.min(1.4,Math.max(.6,Math.min(this.cssW,this.cssH)/700))}setScale(e){Math.abs(e-this.scale)<.01||(this.scale=e,this.resize(this.cssW,this.cssH))}bindTex(e,t,n,r){let i=this.gl;i.activeTexture(i.TEXTURE0+n),i.bindTexture(i.TEXTURE_2D,r),i.uniform1i(e.u(t),n)}pass(e,t,n){let r=this.gl;r.bindFramebuffer(r.FRAMEBUFFER,t?t.fb:null),r.viewport(0,0,t?t.w:r.canvas.width,t?t.h:r.canvas.height),r.useProgram(e.p),n(e),r.bindVertexArray(this.vao),r.drawArrays(r.TRIANGLES,0,3)}stepSim(e,t){let n=this.gl,r=this.sim[0].w,i=this.sim[0].h,a=this.P.sim,o=this.drops,s=Math.min(e.drops.length,F);for(let t=0;t<s;t++){let n=e.drops[t],a=t*4;o[a]=n.x/this.cssW*r,o[a+1]=(1-n.y/this.cssH)*i,o[a+2]=Math.max(1.5,n.r/N),o[a+3]=n.s}e.drops.length=0,n.useProgram(a.p),n.bindVertexArray(this.vao),n.viewport(0,0,r,i),n.uniform2f(a.u(`uTexel`),1/r,1/i),n.uniform2f(a.u(`uSize`),r,i),n.uniform1f(a.u(`uDamp`),.986),n.uniform4fv(a.u(`uDrops`),o);for(let e=0;e<t;e++){let[t,r]=this.sim;n.bindFramebuffer(n.FRAMEBUFFER,r.fb),this.bindTex(a,`uState`,0,t.tex),n.uniform1i(a.u(`uDropN`),e===0?s:0),n.drawArrays(n.TRIANGLES,0,3),this.sim[0]=r,this.sim[1]=t}}drawMesh(e,t){if(!e.n)return;let n=this.gl,r=this.P.sprite,i=this.sim[0];n.useProgram(r.p),n.uniform2f(r.u(`uRes`),this.cssW,this.cssH),n.uniform2f(r.u(`uSimTexel`),1/i.w,1/i.h),n.uniform1f(r.u(`uSurface`),+!!t),n.uniform3f(r.u(`uWater`),...I),n.uniform1f(r.u(`uTime`),this.time),this.bindTex(r,`uRip`,0,i.tex),n.bindVertexArray(this.spriteVao),n.bindBuffer(n.ARRAY_BUFFER,this.vbo),n.bufferData(n.ARRAY_BUFFER,e.data.subarray(0,e.n*10),n.DYNAMIC_DRAW),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.drawArrays(n.TRIANGLES,0,e.n),n.disable(n.BLEND)}frame(e,t){let n=this.gl;if(!this.under||!this.scene||!this.floor||!this.bloomA||!this.bloomB)return;this.time+=t,this.acc=Math.min(this.acc+t,P*4);let r=0;for(;this.acc>=P;)this.acc-=P,r++;r&&this.stepSim(e,r),e.build();let i=this.sim[0],a=this.cssW,o=this.cssH,s=this.patternScale(),c=e=>{n.uniform2f(e.u(`uSimTexel`),1/i.w,1/i.h),n.uniform2f(e.u(`uRes`),a,o),n.uniform1f(e.u(`uTime`),this.time),n.uniform1f(e.u(`uScale`),s)};this.pass(this.P.under,this.under,e=>{c(e),this.bindTex(e,`uFloor`,0,this.floor.tex),this.bindTex(e,`uRip`,1,i.tex)}),this.drawMesh(e.under,!1),this.pass(this.P.water,this.scene,e=>{c(e),n.uniform3f(e.u(`uWater`),...I),this.bindTex(e,`uUnder`,0,this.under.tex),this.bindTex(e,`uRip`,1,i.tex)}),this.drawMesh(e.surface,!0);let l=this.bloomA,u=this.bloomB;this.pass(this.P.bright,l,e=>this.bindTex(e,`uSrc`,0,this.scene.tex));for(let[e,t,r,i]of[[l,u,1,0],[u,l,0,1]])this.pass(this.P.blur,t,t=>{this.bindTex(t,`uSrc`,0,e.tex),n.uniform2f(t.u(`uDir`),r/l.w,i/l.h)});this.pass(this.P.final,null,e=>{this.bindTex(e,`uScene`,0,this.scene.tex),this.bindTex(e,`uBloom`,1,l.tex),n.uniform2f(e.u(`uPx`),n.canvas.width,n.canvas.height),n.uniform1f(e.u(`uTime`),this.time)})}},R=[523.25,587.33,659.25,783.99,880,1046.5],z=class{on=!1;ctx;out;last=0;init(){let e=this.ctx=new AudioContext,t=this.out=e.createGain();t.gain.value=0,t.connect(e.destination);let n=e.sampleRate*4,r=e.createBuffer(1,n,e.sampleRate),i=r.getChannelData(0),a=0;for(let e=0;e<n;e++)a=(a+(Math.random()*2-1)*.02)*.998,i[e]=a*3.5;let o=(n,i,a,o,s)=>{let c=e.createBufferSource();c.buffer=r,c.loop=!0,c.playbackRate.value=.9+Math.random()*.2;let l=e.createBiquadFilter();l.type=n,l.frequency.value=i,l.Q.value=.7;let u=e.createGain();u.gain.value=a;let d=e.createOscillator(),f=e.createGain();d.frequency.value=o,f.gain.value=s,d.connect(f).connect(u.gain),c.connect(l).connect(u).connect(t),c.start(),d.start()};o(`lowpass`,420,.5,.06,.15),o(`bandpass`,1400,.12,.23,.08)}async toggle(){this.ctx||this.init();let e=this.ctx,t=this.out.gain;return this.on=!this.on,this.on&&await e.resume(),t.cancelScheduledValues(e.currentTime),t.setTargetAtTime(this.on?.6:0,e.currentTime,.25),this.on}plink(e,t){if(!this.on||!this.ctx||!this.out)return;let n=this.ctx,r=n.currentTime;if(r-this.last<.12)return;this.last=r;let i=R[Math.floor(Math.random()*R.length)]*(Math.random()<.3?.5:1),a=n.createOscillator(),o=n.createGain(),s=n.createStereoPanner();a.type=`sine`,a.frequency.setValueAtTime(i,r),a.frequency.exponentialRampToValueAtTime(i*1.5,r+.09);let c=Math.min(.25,.08+e*.15);o.gain.setValueAtTime(1e-4,r),o.gain.exponentialRampToValueAtTime(c,r+.008),o.gain.exponentialRampToValueAtTime(1e-4,r+.45),s.pan.value=Math.max(-1,Math.min(1,t)),a.connect(o).connect(s).connect(this.out),a.start(r),a.stop(r+.5)}},B=document.documentElement.classList.contains(`embed`),V=matchMedia(`(prefers-reduced-motion: reduce)`).matches,H=document.querySelector(`#pond`),U=document.querySelector(`#fallback`),W=document.querySelector(`.creator`);W&&new IntersectionObserver(([e])=>W.classList.toggle(`is-live`,e.isIntersecting)).observe(W);var G=document.querySelector(`#theme`);G?.addEventListener(`click`,()=>{let e=document.documentElement.dataset.theme!==`light`;document.documentElement.dataset.theme=e?`light`:`dark`,G.setAttribute(`aria-pressed`,String(e));try{localStorage.setItem(`theme`,e?`light`:`dark`)}catch{}}),G?.setAttribute(`aria-pressed`,String(document.documentElement.dataset.theme===`light`));function K(){H.hidden=!0,U.hidden=!1}var q=H.getContext(`webgl2`,{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});q?J(q):K();function J(e){let t;try{t=new L(e,B?1.5:2)}catch(e){return console.error(e),K()}H.dataset.ripples=t.ripplePath;let n=new m(Math.random()*1e9|0,8),r=new z,i=!1,a=!1,o=!0,s=0,c=0,l=0,u=0,d=1/60,f=()=>{for(let e=0;e<90;e++)n.update(1/60);n.drops.length=0,t.frame(n,1/60)},p=()=>{let e=H.getBoundingClientRect();e.width<2||e.height<2||(n.resize(e.width,e.height),t.resize(e.width,e.height),V&&f())};new ResizeObserver(p).observe(H);let h=e=>{c=requestAnimationFrame(h);let r=Math.min(.05,s?(e-s)/1e3:1/60);s=e,d+=(r-d)*.05,d>.024?(l++,u=0):d<.0175?(u++,l=0):l=u=0,l>45&&t.scale>.5&&(t.setScale(Math.max(.5,t.scale-.15)),l=0,d=1/60),u>240&&t.scale<1&&(t.setScale(Math.min(1,t.scale+.1)),u=0),n.update(r),t.frame(n,r)},g=()=>{let e=!i&&!V&&o&&!document.hidden;e&&!a?(a=!0,s=0,c=requestAnimationFrame(h)):!e&&a&&(a=!1,cancelAnimationFrame(c))};document.addEventListener(`visibilitychange`,g),new IntersectionObserver(([e])=>{o=e.isIntersecting,g()}).observe(H),H.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),i=!0,a=!1,cancelAnimationFrame(c)}),H.addEventListener(`webglcontextrestored`,()=>{try{t=new L(e,B?1.5:2)}catch(e){return console.error(e),K()}H.dataset.ripples=t.ripplePath,i=!1,p(),g()});let _={x:-1e9,y:-1e9},v=0,y=e=>{let t=H.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}},b=(e,t,i)=>{n.pointer={x:e,y:t},clearTimeout(v),v=window.setTimeout(()=>{n.pointer=null},600),n.splash(e,t,i,Math.min(n.w,n.h)*.02),r.plink(Math.abs(i),e/n.w*2-1)};V||H.addEventListener(`pointerdown`,e=>{let t=y(e);H.setPointerCapture(e.pointerId),_=t,n.pointerShy=1,b(t.x,t.y,1.2),n.tap(t.x,t.y)}),H.addEventListener(`pointercancel`,()=>{clearTimeout(v),n.pointer=null}),V||H.addEventListener(`pointermove`,e=>{let t=y(e),r=e.buttons!==0;if(!r&&e.pointerType!==`mouse`)return;let i=Math.min(n.w,n.h)*(r?.015:.03);Math.hypot(t.x-_.x,t.y-_.y)<i||(_=t,r?(n.pointerShy=1,b(t.x,t.y,.45)):(n.pointerShy=.5,n.pointer=t,n.splash(t.x,t.y,.1,Math.min(n.w,n.h)*.012)))}),H.addEventListener(`pointerleave`,()=>{n.pointer=null});let x=document.querySelector(`#sound`);x?.addEventListener(`click`,async()=>{let e=await r.toggle();x.setAttribute(`aria-pressed`,String(e))}),p(),g()}