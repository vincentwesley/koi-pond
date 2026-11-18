(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={short:540,middle:734,long:1491.4},t=`logo-form`,n=document.documentElement,r=matchMedia(`(max-width: 29.99rem)`),i=document.querySelector(`[data-logo-link]`),a=i?.querySelector(`.brand-logo`),o=document.querySelectorAll(`[data-logo-form]`);function s(e){n.dataset.logo=e,o.forEach(t=>t.checked=t.value===e);try{localStorage.setItem(t,e)}catch{}}o.forEach(e=>e.addEventListener(`change`,()=>e.checked&&s(e.value)));var c=n.dataset.logo;if(o.forEach(t=>t.checked=t.value===(c&&c in e?c:`middle`)),i&&a){try{let e=+(localStorage.getItem(`logo-hint`)??0);e<3&&!localStorage.getItem(t)&&(localStorage.setItem(`logo-hint`,String(e+1)),a.setAttribute(`data-hint`,``))}catch{}let n=[0,12,26,66,106],o=[e.short,e.short,e.middle,e.middle,e.long],c=e=>{let t=1;for(;t<4&&e>n[t];)t++;return o[t-1]+(o[t]-o[t-1])*(e-n[t-1])/(n[t]-n[t-1])},l=-1,u=0,d=0,f=0,p=!1,m=!1,h=()=>r.matches?e.middle:e.long;i.addEventListener(`pointerdown`,e=>{e.isPrimary&&!e.button&&(l=e.pointerId,u=e.clientX,f=parseFloat(getComputedStyle(a).getPropertyValue(`--logo-x`)),d=f<637?6:f<1112?46:106,p=!1)}),i.addEventListener(`pointermove`,e=>{if(e.pointerId!==l)return;let t=e.clientX-u;if(!p){if(Math.abs(t)<=6)return;p=!0,i.setPointerCapture(l),a.setAttribute(`data-drag`,``)}f=Math.min(h(),c(Math.min(106,Math.max(0,d+t)))),a.style.setProperty(`--logo-x`,String(f))});let g=()=>{l<0||(l=-1,p&&(p=!1,m=!0,setTimeout(()=>m=!1,100),a.removeAttribute(`data-drag`),a.style.removeProperty(`--logo-x`),s(Object.keys(e).filter(t=>e[t]<=h()).reduce((t,n)=>Math.abs(e[n]-f)<Math.abs(e[t]-f)?n:t))))};i.addEventListener(`pointerup`,g),i.addEventListener(`pointercancel`,g),i.addEventListener(`click`,e=>{m&&=(e.preventDefault(),!1)},!0)}var l=Math.PI*2,u=e=>e-l*Math.floor((e+Math.PI)/l);function d(e,t,n,r){let i=u(t-e),a=n*r;return u(e+Math.max(-a,Math.min(a,i)))}function f(e,t,n=.3){for(let r=1;r<e.length;r++){let i=e[r-1],a=e[r],o=Math.atan2(a.y-i.y,a.x-i.x);if(Math.hypot(a.x-i.x,a.y-i.y)<1e-6&&(o=Math.PI),r>1){let t=e[r-2],a=Math.atan2(i.y-t.y,i.x-t.x),s=u(o-a);o=a+Math.max(-n,Math.min(n,s))}a.x=i.x+Math.cos(o)*t,a.y=i.y+Math.sin(o)*t}}function p(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function m(e,t,n,r,i,a){let o=Math.max(1,Math.ceil(i/.008)),s=Math.min(i,.1)/o;for(let i=0;i<o;i++)e.v+=(n*(t-e.x)-r*e.v)*s,e.x+=e.v*s,e.x>a?(e.x=a,e.v>0&&(e.v=0)):e.x<-a&&(e.x=-a,e.v<0&&(e.v=0))}function h(e,t,n,r,i,a,o,s){let c=Math.cos(i),l=Math.sin(i),u=n-c*a*1.1-l*o*a*.4,d=r-l*a*1.1+c*o*a*.4,f=u-e,p=d-t,m=Math.hypot(f,p);if(m<.001)return s.x=s.y=0,s;let h=Math.min(1,m/(a*2.5));return s.x=f/m*h,s.y=p/m*h,s}function g(e,t,n,r,i,a){let o=n-e,s=r-t,c=Math.hypot(o,s);if(c<.001)return a.x=a.y=0,a;let l=o/c,u=s/c,d=i*.6,f=Math.max(0,Math.min(1,(c-d)/(d*.5))),p=f+(1-f)*Math.max(-1,Math.min(1,(c-d)/d))*.5,m=(1-f)*.8;return a.x=l*p-u*m,a.y=u*p+l*m,a}var _={x:0,y:0},v={x:0,y:0},y=class{pts;heading;speed;segLen;phase=0;t=0;depth;depthTarget;rand;boost=0;feedT=0;feedAge=0;feedX=0;feedY=0;tail=Array.from({length:5},()=>({x:0,v:0}));pec=[{x:0,v:0},{x:0,v:0}];leader=null;buddyT=0;side=1;length;variety;p;constructor(e,t,n,r,i,a){this.length=r,this.variety=i,this.p=a,this.rand=p(a.seed),this.heading=n,this.speed=a.speed*r,this.segLen=r/11,this.pts=Array.from({length:12},(r,i)=>({x:e-Math.cos(n)*this.segLen*i,y:t-Math.sin(n)*this.segLen*i})),this.depth=this.depthTarget=this.rand()*.7}get head(){return this.pts[0]}startle(e){this.boost=Math.max(this.boost,e)}feed(e,t,n){this.feedX=e,this.feedY=t,this.feedT=n,this.feedAge=0}follow(e,t){this.leader=e,this.buddyT=t,this.side=this.rand()<.5?-1:1}get feeding(){return this.feedT>0}update(e,t){let{p:n}=this,r=this.head;this.t+=e;let i=this.length,a=n.seed*.001,o=(Math.sin(this.t*.37*n.wander+a*7)+.6*Math.sin(this.t*.91*n.wander+a*13))*.9,s=Math.cos(this.heading+o*.6),c=Math.sin(this.heading+o*.6),l=Math.min(t.w,t.h)*.18+i*.5,p=e=>e<l?((l-Math.max(e,0))/l)**1.5*4:0,y=p(r.x)-p(t.w-r.x),b=p(r.y)-p(t.h-r.y);s+=y,c+=b;let x=Math.min(2,Math.hypot(y,b)),S=1;if(this.feedT>0){this.feedT-=e,this.feedAge+=e;let t=Math.min(1,this.feedAge/.8)*Math.min(1,this.feedT/.6+.3);g(r.x,r.y,this.feedX,this.feedY,i,_),s+=_.x*2.5*t,c+=_.y*2.5*t,Math.hypot(this.feedX-r.x,this.feedY-r.y)<i&&(S=.55)}if(this.leader&&this.buddyT>0&&this.feedT<=0){this.buddyT-=e;let t=this.leader;h(r.x,r.y,t.head.x,t.head.y,t.heading,i,this.side,v),s+=v.x*1.6,c+=v.y*1.6,Math.hypot(t.head.x-r.x,t.head.y-r.y)<i*2&&(S=Math.min(S,.85))}else this.leader=null;let C=0;if(t.pointer&&this.feedT<=0){let e=r.x-t.pointer.x,a=r.y-t.pointer.y,o=Math.hypot(e,a),l=i*1.6;o<l&&o>.001&&(C=(l-o)/l*n.shy*(t.pointerShy??1),s+=e/o*C*3,c+=a/o*C*3)}for(let e of t.others){if(e===this)continue;let t=r.x-e.head.x,n=r.y-e.head.y,a=Math.hypot(t,n),o=(i+e.length)*.45;a<o&&a>.001&&(s+=t/a*((o-a)/o)*.8,c+=n/a*((o-a)/o)*.8)}let w=Math.atan2(c,s),T=this.heading,ee=Math.min(3,this.speed/i/.4*n.turn)*(1+C+x);this.heading=d(this.heading,w,ee,e);let E=u(this.heading-T)/Math.max(e,1e-4),te=Math.abs(E);this.boost=Math.max(0,this.boost-e*.8);let D=n.speed*i*(1+C*2.2+this.boost*2)*S;this.speed+=(D-this.speed)*Math.min(1,e*1.5),r.x+=Math.cos(this.heading)*this.speed*e,r.y+=Math.sin(this.heading)*this.speed*e,r.x=Math.min(t.w-2,Math.max(2,r.x)),r.y=Math.min(t.h-2,Math.max(2,r.y)),f(this.pts,this.segLen),this.phase+=e*(2.2+this.speed/i*6+te*.8);let O=Math.min(1,this.speed/i/.5);m(this.tail[0],.32*Math.sin(this.phase-3.84)-Math.max(-.4,Math.min(.4,E*.12)),60,9,e,.5);for(let t=1;t<5;t++)m(this.tail[t],this.tail[t-1].x*(.9+.1*O),38-t*4,5,e,.5);m(this.pec[0],.22*Math.sin(this.phase*.6)+Math.max(-.3,Math.min(.3,E*.06)),22,4,e,.6),m(this.pec[1],this.pec[0].x,14,3,e,.7),this.rand()<e*.08&&(this.depthTarget=this.rand()<.3?this.rand()*.12:this.rand()*.8),this.depth+=(this.depthTarget-this.depth)*e*.15}bodyPoints(){let e=this.pts.length,t=this.length*(.02+Math.min(.03,this.speed/this.length*.025));return this.pts.map((n,r)=>{let i=this.pts[Math.max(0,r-1)],a=this.pts[Math.min(e-1,r+1)],o=i.x-a.x,s=i.y-a.y,c=Math.hypot(o,s)||1,l=t*(r/(e-1))**1.6*Math.sin(this.phase-r*.32);return{x:n.x-s/c*l,y:n.y+o/c*l}})}},b=[`dawn`,`day`,`golden`,`dusk`,`night`],x=[`spring`,`summer`,`autumn`,`winter`],S={dawn:{light:[1,.86,.84],ambient:.88,waterTint:[.2,.52,.46],skyGlow:[1,.78,.84],caustics:.5,moon:.05,fireflies:.15,bloomGain:.8,bloomThr:.7},day:{light:[1,.98,.92],ambient:1.05,waterTint:[.1,.44,.5],skyGlow:[.62,.82,.98],caustics:1,moon:0,fireflies:0,bloomGain:.6,bloomThr:.78},golden:{light:[1,.8,.55],ambient:1,waterTint:[.68,.45,.26],skyGlow:[1,.72,.48],caustics:.85,moon:0,fireflies:.1,bloomGain:1,bloomThr:.65},dusk:{light:[.78,.68,1],ambient:.72,waterTint:[.3,.24,.56],skyGlow:[.6,.5,.9],caustics:.3,moon:.1,fireflies:.85,bloomGain:1,bloomThr:.62},night:{light:[.45,.58,1],ambient:.62,waterTint:[.04,.09,.22],skyGlow:[.08,.12,.28],caustics:0,moon:1,fireflies:1,bloomGain:.9,bloomThr:.6}},C=[[0,`night`],[5.5,`night`],[6.8,`dawn`],[9,`day`],[16,`day`],[17.6,`golden`],[19,`dusk`],[20.6,`night`],[24,`night`]],w=[`ambient`,`caustics`,`moon`,`fireflies`,`bloomGain`,`bloomThr`],T=[`light`,`waterTint`,`skyGlow`];function ee(e){let t=e.getMonth(),n=Math.floor((t+1)%12/3),r=[`winter`,`spring`,`summer`,`autumn`],i=(t+1)%3+(e.getDate()-1)/31;return{season:r[n],seasonT:Math.min(1,i/3)}}function E(e=new Date,t={}){let n={dawn:0,day:0,golden:0,dusk:0,night:0};if(t.time)n[t.time]=1;else{let t=e.getHours()+e.getMinutes()/60+e.getSeconds()/3600,r=0;for(;r<C.length-2&&t>=C[r+1][0];)r++;let[i,a]=C[r],[o,s]=C[r+1],c=Math.min(1,Math.max(0,(t-i)/(o-i))),l=c*c*(3-2*c);n[a]+=1-l,n[s]+=l}let r={weights:n},i=r;for(let e of w)i[e]=0;for(let e of T)i[e]=[0,0,0];let a=`night`;for(let e of b)n[e]>n[a]&&(a=e);for(let e of b){if(!n[e])continue;let t=S[e];for(let r of w)i[r]+=t[r]*n[e];for(let r of T)for(let a=0;a<3;a++)i[r][a]+=t[r][a]*n[e]}r.phase=a;let o=ee(e);return r.season=t.season??o.season,r.seasonT=t.season?.5:o.seasonT,r}function te(e){let t=new URLSearchParams(e),n={},r=t.get(`time`),i=t.get(`season`);return r&&b.includes(r)&&(n.time=r),i&&x.includes(i)&&(n.season=i),n}var D=1.4,O=9,k=e=>Math.max(0,Math.min(1,e)),ne=e=>Math.round(k(e)*24);function re(e,t,n){let r=x.indexOf(e),i=.12;for(let e of x)n[e]=0;let a=t<i?.5*(1-t/i):t>.88?.5*(1-(1-t)/i):0;return a>0&&(n[x[(r+(t<i?3:1))%4]]=a),n[e]=1-a,n}var A=(e,t)=>k((e-t*.6)/.4),ie=class{data=new Float32Array(81920);n=0;v(e,t,n,r,i,a,o){if((this.n+1)*10>this.data.length){let e=new Float32Array(this.data.length*2);e.set(this.data),this.data=e}let s=this.n++*10,c=this.data;c[s]=e,c[s+1]=t,c[s+2]=n,c[s+3]=r,c[s+4]=i,c[s+5]=a,c[s+6]=o[0],c[s+7]=o[1],c[s+8]=o[2],c[s+9]=o[3]}quad(e,t,n,r,i){for(let a of[0,1,2,0,2,3])this.v(e[a].x,e[a].y,t[a][0],t[a][1],n,r,i)}sprite(e,t,n,r,i){let a=Math.cos(r)*n,o=Math.sin(r)*n,s=[[-1,-1],[1,-1],[1,1],[-1,1]];this.quad(s.map(([n,r])=>({x:e+n*a-r*o,y:t+n*o+r*a})),s,e,t,i)}ribbon(e,t,n,r,i){let a=e.length,o=e.map((t,n)=>{let r=e[Math.max(0,n-1)],i=e[Math.min(a-1,n+1)],o=i.x-r.x,s=i.y-r.y,c=Math.hypot(o,s)||1;return{x:-s/c,y:o/c}});for(let s=0;s<a-1;s++){let c=(n,r)=>({x:e[n].x+o[n].x*t[n]*r,y:e[n].y+o[n].y*t[n]*r}),l=s/(a-1),u=(s+1)/(a-1);this.quad([c(s,-1),c(s+1,-1),c(s+1,1),c(s,1)],[[l,-1],[u,-1],[u,1],[l,1]],n,r,i)}}fin(e,t,n,r,i){let a=-t.y*r,o=t.x*r,s=e.x+t.x*n,c=e.y+t.y*n;this.quad([{x:e.x-a,y:e.y-o},{x:s-a,y:c-o},{x:s+a,y:c+o},{x:e.x+a,y:e.y+o}],[[0,-1],[1,-1],[1,1],[0,1]],0,0,i)}},ae=[0,2,2,3],oe=[16,8,5,18],se=[[.25,.3],[.7,.65],[.45,.85]],ce=[.55,1,.6,.3],le=[.85,1.15,.95,.8],j=[0,0,0,0],M=(e,t,n,r)=>(j[0]=e,j[1]=t,j[2]=n,j[3]=r,j),ue=2.5;function N(e,t,n,r,i,a){let o=Math.hypot(e,t),s=1-n/ue;if(s<=0||o<.001)return a.x=a.y=0,a;let c=i*4,l=r*s*s*Math.exp(-((o/c)**2))/o;return a.x=e*l,a.y=t*l,a}var P={x:0,y:0},de=[0,6,3,1,8,2,9,7,4],F=Array.from({length:6},()=>({x:0,y:0})),I=[,,,,,,].fill(0),L=[{x:0,y:0},{x:0,y:0},{x:0,y:0}],R=[0,0,0],fe=e=>e<.28?.72+.28*Math.sin(e/.28*Math.PI*.5):1-.85*((e-.28)/.72)**1.3,pe=class{w=0;h=0;t=0;fish=[];pads=[];petals=[];plants=[];pellets=Array.from({length:12},()=>({x:0,y:0,ex:0,ey:0,age:0,alive:!1}));dragonflies=[];fireflies=[];sw={spring:0,summer:1,autumn:0,winter:0};swT={spring:0,summer:1,autumn:0,winter:0};ffLevel=0;ffT=0;moodSet=!1;claim=new Int8Array(9).fill(-1);eatCd=new Float32Array(9);fx=new Float32Array(9);fy=new Float32Array(9);baseSpeed=[];_a={x:0,y:0};onEat;under=new ie;surface=new ie;pointer=null;drops=[];pointerShy=1;dX=new Float32Array(16);dY=new Float32Array(16);dS=new Float32Array(16);dR=new Float32Array(16);dAge=new Float32Array(16).fill(ue);dHead=0;lastFeed=-10;pairT=6;rand;fishCount;constructor(e,t=8){this.rand=p(e),this.fishCount=Math.max(6,Math.min(9,t))}get unit(){return Math.min(this.w,this.h)}setMood(e){if(re(e.season,e.seasonT,this.swT),this.ffT=ne(e.fireflies),!this.moodSet){this.moodSet=!0;for(let e of x)this.sw[e]=this.swT[e];this.ffLevel=this.ffT}}resize(e,t){let n=this.w===0,r=n?1:e/this.w,i=n?1:t/this.h;if(this.w=e,this.h=t,n)return this.populate();for(let e of this.fish){for(let t of e.pts)t.x*=r,t.y*=i;e.length=this.unit*this.fishLen(e),e.segLen=e.length/(e.pts.length-1),f(e.pts,e.segLen)}for(let e of this.petals)e.x*=r,e.y*=i;for(let e of this.pellets)e.x*=r,e.y*=i;for(let e of this.dragonflies)e.x*=r,e.y*=i,e.tx*=r,e.ty*=i}fishLen(e){return .17+.07*(e.p.seed%97/97)}populate(){let e=this.rand;for(let t=0;t<this.fishCount;t++){let n=Math.floor(e()*1e6),r={speed:.28+e()*.22,turn:.8+e()*.4,wander:.6+e()*.8,shy:.7+e()*.6,seed:n},i=new y(this.w*(.2+e()*.6),this.h*(.2+e()*.6),e()*Math.PI*2,1,de[t],r);i.length=this.unit*this.fishLen(i),i.segLen=i.length/(i.pts.length-1),f(i.pts,i.segLen),this.fish.push(i),this.baseSpeed.push(r.speed)}for(let[t,n,r,i]of[[.86,.16,1.35,1],[.8,.8,1.5,1],[.95,.42,.95,2],[.1,.92,1,1],[.58,.06,.7,0],[.97,.97,1.1,0],[.04,.12,.8,2],[.5,.95,.55,0],[.3,.08,.5,0]])this.pads.push({ox:0,oy:0,vx:0,vy:0,kick:0,nx:t,ny:n,size:r,rot:e()*Math.PI*2,spin:(e()-.5)*.02,age:e()*.5,seed:e(),flower:i?{white:e()>.6,seed:e(),bud:i===2}:void 0});oe.forEach((t,n)=>{for(let r=0;r<t;r++){let i=n===1||n===2,a=n===0&&r<9?se[r%3]:null;this.petals.push({ex:0,ey:0,x:a?(a[0]+(e()-.5)*.12)*this.w:e()*this.w,y:a?(a[1]+(e()-.5)*.12)*this.h:e()*this.h,vx:(e()-.3)*(i?8:6),vy:(e()-.5)*4,rot:e()*6.28,spin:(e()-.5)*(i?1.6:n===3?.2:.3),size:.6+e()*.5,kind:n,q:(r+e())/t,age:e()*O,landed:!1})}});for(let t=0;t<2;t++)this.dragonflies.push({x:e()*this.w,y:e()*this.h,ang:e()*6.28,tx:e()*this.w,ty:e()*this.h,z:1,hue:t});for(let t=0;t<24;t++)this.fireflies.push({hx:.08+e()*.84,hy:.08+e()*.84,fx:.15+e()*.3,fy:.12+e()*.3,ph:e()*6.28,ox:0,oy:0});for(let[t,n,r]of[[-.02,.3,.15],[-.02,.62,-.1],[.35,1.02,-1.45],[.62,-.02,1.7]])this.plants.push({nx:t,ny:n,ang:r,blades:Array.from({length:6+Math.floor(e()*4)},()=>({da:(e()-.5)*1.1,len:.16+e()*.2,curl:(e()-.5)*.25,ph:e()*6.28,shade:e()}))})}splash(e,t,n,r=14){if(this.drops.push({x:e,y:t,r,s:n}),this.disturb(e,t,n,r),Math.abs(n)>.3)for(let n of this.fish)Math.hypot(n.head.x-e,n.head.y-t)<n.length&&n.startle(.8)}disturb(e,t,n,r){let i=this.dHead;this.dHead=(i+1)%16,this.dX[i]=e,this.dY[i]=t,this.dS[i]=Math.min(1.5,Math.abs(n)),this.dR[i]=r,this.dAge[i]=0}tap(e,t){if(this.t-this.lastFeed<1.5)return;this.lastFeed=this.t,this.dropFood(e,t);let n=1+Math.floor(this.rand()*3),r=this.fish.filter(e=>!e.feeding).sort((n,r)=>Math.hypot(n.head.x-e,n.head.y-t)-Math.hypot(r.head.x-e,r.head.y-t));for(let i of r.slice(0,n))i.feed(e,t,4+this.rand()*2.5)}dropFood(e,t){let n=3+Math.floor(this.rand()*3),r=this.unit*.05,i=0;for(let a of this.pellets){if(i===n)break;a.alive||(a.x=e+(this.rand()-.5)*r*2,a.y=t+(this.rand()-.5)*r*2,a.ex=(this.rand()-.5)*r,a.ey=(this.rand()-.5)*r,a.age=0,a.alive=!0,i++)}return i}push(e,t){let n=0,r=0;for(let i=0;i<16;i++)this.dAge[i]>=2.5||(N(e-this.dX[i],t-this.dY[i],this.dAge[i],this.dS[i],this.dR[i],P),n+=P.x,r+=P.y);return this._a.x=n,this._a.y=r,this._a}updateFood(e){let t=this.unit,n=Math.exp(-e*1.5),r=this.pellets;for(let i of r){if(!i.alive)continue;if(i.age+=e,i.age>20){i.alive=!1;continue}let r=this.push(i.x,i.y);i.ex=(i.ex+r.x*t*.08*e)*n,i.ey=(i.ey+r.y*t*.08*e)*n,i.x+=(i.ex+Math.sin(this.t*.3+i.y*.02)*1.2)*e,i.y+=(i.ey+Math.cos(this.t*.27+i.x*.02)*1.2)*e}for(let n=0;n<this.fish.length&&n<this.claim.length;n++){let i=this.fish[n];this.eatCd[n]-=e;let a=this.claim[n];if(a>=0&&!r[a].alive&&(a=-1),a<0&&i.feeding){let e=0xde0b6b3a7640000;for(let t=0;t<r.length;t++){if(!r[t].alive||this.claim.includes(t))continue;let n=Math.hypot(r[t].x-i.head.x,r[t].y-i.head.y);n<e&&(e=n,a=t)}}if(this.claim[n]=a,a<0)continue;let o=r[a],s=Math.hypot(o.x-i.head.x,o.y-i.head.y);this.eatCd[n]<=0&&s<i.length*.35?(o.alive=!1,this.claim[n]=-1,this.eatCd[n]=.7,this.splash(o.x,o.y,.14,t*.006),this.onEat?.(o.x,o.y)):(!i.feeding||Math.hypot(o.x-this.fx[n],o.y-this.fy[n])>i.length*.2)&&(i.feed(o.x,o.y,3),this.fx[n]=o.x,this.fy[n]=o.y)}}updateDragonflies(e){if(this.sw.summer<.02)return;let t=this.unit,n=this.rand;for(let r of this.dragonflies){let i=Math.hypot(r.tx-r.x,r.ty-r.y);r.z=k((i-t*.04)/(t*.14));let a=Math.atan2(r.ty-r.y,r.tx-r.x),o=e*5;r.ang+=Math.max(-o,Math.min(o,u(a-r.ang)));let s=t*.3*(.5+.5*r.z);if(r.x+=Math.cos(r.ang)*s*e,r.y+=Math.sin(r.ang)*s*e,i<t*.04){this.sw.summer>.3&&this.splash(r.x,r.y,.22,t*.008);let e=n()*6.283,i=t*(.3+n()*.3);r.tx=Math.max(this.w*.08,Math.min(this.w*.92,r.x+Math.cos(e)*i)),r.ty=Math.max(this.h*.08,Math.min(this.h*.92,r.y+Math.sin(e)*i))}}}updateFireflies(e){if(this.ffLevel<.01)return;let t=this.unit,n=this.pointer,r=Math.exp(-e*.6);for(let i of this.fireflies){let a=i.ox,o=i.oy;if(n){let r=i.hx*this.w+Math.sin(this.t*i.fx+i.ph)*t*.1+a,s=i.hy*this.h+Math.cos(this.t*i.fy+i.ph*1.7)*t*.08+o,c=r-n.x,l=s-n.y,u=Math.hypot(c,l)||1;if(u<t*.28){let n=(1-u/(t*.28))*t*.6*e;a+=c/u*n,o+=l/u*n}}let s=t*.35,c=Math.hypot(a,o);c>s&&(a*=s/c,o*=s/c),i.ox=a*r,i.oy=o*r}}update(e){if(this.t+=e,this.pairT-=e,this.pairT<=0){this.pairT=12+this.rand()*18;let e=this.fish.filter(e=>!e.leader&&!e.feeding);if(e.length>=2&&this.rand()<.7){let t=e[Math.floor(this.rand()*e.length)],n=e.filter(e=>e!==t)[Math.floor(this.rand()*(e.length-1))];this.fish.some(e=>e.leader===t)||n.follow(t,14+this.rand()*14)}}let t={w:this.w,h:this.h,pointer:this.pointer,others:this.fish,pointerShy:this.pointerShy};for(let n of this.fish)n.update(e,t),n.depth<.25&&this.rand()<e*3&&this.drops.push({x:n.head.x,y:n.head.y,r:n.length*.08,s:.04}),n.speed>.2*n.length&&this.disturb(n.head.x,n.head.y,.05,n.length*.1);for(let t=0;t<16;t++)this.dAge[t]+=e;let n=this.unit,r=Math.exp(-e*1.5),i=n*.012,a=Math.min(1,e*.7);for(let e of x)this.sw[e]+=(this.swT[e]-this.sw[e])*a;this.ffLevel+=(this.ffT-this.ffLevel)*Math.min(1,e*.8),this.fish.forEach((e,t)=>{e.p.speed=this.baseSpeed[t]*(1-.4*this.sw.winter)}),this.updateFood(e),this.updateDragonflies(e),this.updateFireflies(e);for(let t of this.petals){let i=this.sw[x[ae[t.kind]]];if(i<.01)continue;t.kind===3&&(t.age+=e,t.age>=O?(t.age=0,t.landed=!1,t.x=this.rand()*this.w,t.y=this.rand()*this.h):!t.landed&&t.age>=D&&(t.landed=!0,i>.3&&this.splash(t.x,t.y,.1,n*.005)));let a=this.push(t.x,t.y),o=a.x,s=a.y;t.ex=(t.ex+o*n*.08*e)*r,t.ey=(t.ey+s*n*.08*e)*r,t.x+=(t.vx+t.ex+Math.sin(this.t*.2+t.y*.01)*3)*e,t.y+=(t.vy+t.ey+Math.cos(this.t*.17+t.x*.01)*3)*e,t.rot+=t.spin*e,t.x<-20?t.x+=this.w+40:t.x>this.w+20&&(t.x-=this.w+40),t.y<-20?t.y+=this.h+40:t.y>this.h+20&&(t.y-=this.h+40)}let o=3.5;for(let t of this.pads){let r=0,a=0,s=0;for(let e=0;e<16;e++){if(this.dAge[e]>=2.5)continue;let n=t.nx*this.w+t.ox-this.dX[e],i=t.ny*this.h+t.oy-this.dY[e];N(n,i,this.dAge[e],this.dS[e],this.dR[e],P),r+=P.x,a+=P.y,s+=n*P.y-i*P.x}let c=n*.1;t.vx+=(r*c-6*t.ox-o*t.vx)*e,t.vy+=(a*c-6*t.oy-o*t.vy)*e,t.ox+=t.vx*e,t.oy+=t.vy*e;let l=Math.hypot(t.ox,t.oy);l>i&&(t.ox*=i/l,t.oy*=i/l),t.kick=(t.kick+Math.max(-1,Math.min(1,s/(n*.1+1)))*.05*e*60)*Math.exp(-e*2),t.rot+=(t.spin+t.kick)*e}}build(){let e=this.unit,t=this.t,n=this.under,r=this.surface;n.n=0,r.n=0;let i=e*.012,a=0,o=0;x.forEach((e,t)=>{a+=this.sw[e]*ce[t],o+=this.sw[e]*le[t]});let s=this.pads.length,c=e=>k(a*s-e+.5);this.pads.forEach((t,r)=>{let a=c(r);a>.01&&n.sprite(t.nx*this.w+t.ox+i*2.5,t.ny*this.h+t.oy+i*3,t.size*o*e*.1*(.7+.3*a),0,M(4,0,0,.35*a))}),this.fireflyPos((t,r,i,a,o)=>n.sprite(r,i+e*.014,e*.05,0,M(9,1,o,a*.5)));let l=this.sw.summer,u=Math.min(1,this.sw.summer+this.sw.spring*.6);if(this.pads.forEach((t,r)=>{if(!t.flower)return;let a=c(r)*(t.flower.bud?A(u,t.flower.seed):A(l,t.flower.seed));if(a<.01)return;let s=t.size*o*e*.1,d=t.rot+2.4;n.sprite(t.nx*this.w+t.ox+Math.cos(d)*s*.3+i*3,t.ny*this.h+t.oy+Math.sin(d)*s*.3+i*4.5,s*(t.flower.bud?.22:.45),0,M(4,0,0,.3*a))}),this.sw.summer>.02)for(let t of this.dragonflies)n.sprite(t.x+i*(1+t.z*6),t.y+i*(1.5+t.z*9),e*.03,t.ang,M(4,0,0,.22*this.sw.summer*(1-.5*t.z)));for(let t of this.pellets)t.alive&&n.sprite(t.x+i*.5,t.y+i*.8,e*.007,0,M(4,0,0,.3));let d=[...this.fish].sort((e,t)=>t.depth-e.depth).map(e=>{let t=e.bodyPoints(),n=t.length,r=e.length*.13;return{f:e,pts:t,hw:t.map((e,t)=>r*fe(t/(n-1))),maxHw:r}});for(let{f:e,pts:t,hw:r}of d){let a=i*(1.5+e.depth*3);n.ribbon(t.map(e=>({x:e.x+a,y:e.y+a*1.2})),r.map(e=>e*1.7),0,0,[3,0,0,.4*(1-e.depth*.5)])}for(let r of this.plants){let i=r.nx*this.w,a=r.ny*this.h;for(let o of r.blades){let s=o.len*e,c=[],l=[],u=i,d=a,f=r.ang+o.da;for(let n=0;n<8;n++)c.push({x:u,y:d}),l.push(Math.max(.6,e*.007*(1-n/8)**.7)),f+=o.curl+Math.sin(t*.6+o.ph+n*.4)*.04,u+=s/8*Math.cos(f),d+=s/8*Math.sin(f);n.ribbon(c,l,0,0,[5,o.shade,0,.35])}}for(let{f:e,pts:t,hw:r,maxHw:i}of d){let a=t.length,o=e.length,s=t=>[t,e.variety,e.p.seed%1e3/1e3,e.depth],c=e=>{let n=t[e],r=t[e+1],i=Math.hypot(r.x-n.x,r.y-n.y)||1;return{x:(r.x-n.x)/i,y:(r.y-n.y)/i}};for(let[i,a,l,u]of[[2,.2,.065,1],[6,.11,.04,.8]]){let d=c(i),f=-d.y,p=d.x;for(let c of[-1,1]){let m=u+c*e.pec[0].x,h=u*.55+c*e.pec[1].x,g=o*a*.5*(i===2?1.3:1);L[0].x=t[i].x+f*c*r[i]*.7,L[0].y=t[i].y+p*c*r[i]*.7;for(let e=1;e<3;e++){let t=e===1?m:h;L[e].x=L[e-1].x+d.x*Math.cos(t)*g+f*c*Math.sin(t)*g,L[e].y=L[e-1].y+d.y*Math.cos(t)*g+p*c*Math.sin(t)*g}R[0]=R[1]=R[2]=o*l*1.15,n.ribbon(L,R,0,0,s(1))}}let l=c(a-2),u=Math.atan2(l.y,l.x);F[0].x=t[a-1].x-l.x*o*.1,F[0].y=t[a-1].y-l.y*o*.1,I[0]=o*.07;for(let t=1;t<=5;t++)u+=e.tail[t-1].x,F[t].x=F[t-1].x+Math.cos(u)*o*.09,F[t].y=F[t-1].y+Math.sin(u)*o*.09,I[t]=o*(.07+.13*Math.sin(Math.min(1,t/3.2)*Math.PI*.5));n.ribbon(F,I,0,0,s(2)),n.ribbon(t,r,o,i,s(0))}let f=this.sw.autumn*.5+this.sw.winter*.3;this.pads.forEach((t,n)=>{let i=c(n);i>.01&&r.sprite(t.nx*this.w+t.ox,t.ny*this.h+t.oy,t.size*o*e*.1*(.7+.3*i),t.rot,M(6,t.seed,Math.min(1,t.age*.5+f),i))}),this.pads.forEach((t,n)=>{if(!t.flower)return;let i=t.flower.bud,a=c(n)*A(i?u:l,t.flower.seed);if(a<.01)return;let s=t.size*o*e*.1,d=t.rot+2.4,f=t.nx*this.w+t.ox+Math.cos(d)*s*.3,p=t.ny*this.h+t.oy+Math.sin(d)*s*.3;i?r.sprite(f,p,s*.22,t.rot+.8,M(12,0,0,a)):r.sprite(f,p,s*.5*(.6+.4*a),t.rot*.5,M(7,t.flower.seed,+!!t.flower.white,a))});for(let t of this.petals){let n=this.sw[x[ae[t.kind]]],i=A(n,t.q),a=e*t.size*(t.kind===0?.027:t.kind===1?.034:t.kind===2?.028:.019);if(!(i<.01)){if(t.kind===3){let e=t.landed?0:1-t.age/D;a*=1+e*.8,i*=(1-.6*e)*k((O-t.age)/1.5)}r.sprite(t.x,t.y,a,t.rot,M(8,t.kind,t.q,i))}}for(let t of this.pellets)t.alive&&r.sprite(t.x,t.y,e*.0075,t.age*.3,M(11,0,0,k(t.age/.3)*k((20-t.age)/2)));if(this.sw.summer>.02)for(let t of this.dragonflies)r.sprite(t.x,t.y,e*.026*(1+t.z*.5),t.ang,M(10,0,t.hue,this.sw.summer));this.fireflyPos((t,n,i,a,o)=>r.sprite(n,i,e*.038,0,M(9,0,o,a)))}fireflyPos(e){let t=Math.ceil(this.ffLevel),n=this.unit;for(let r=0;r<t&&r<this.fireflies.length;r++){let t=this.fireflies[r],i=k(this.ffLevel-r);e(r,t.hx*this.w+Math.sin(this.t*t.fx+t.ph)*n*.1+t.ox,t.hy*this.h+Math.cos(this.t*t.fy+t.ph*1.7)*n*.08+t.oy,i,t.ph/6.28)}}};function z(e,t,n){let r=(t,n)=>{let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)&&!e.isContextLost())throw Error(e.getShaderInfoLog(r)??`shader`);return r},i=e.createProgram();if(e.attachShader(i,r(e.VERTEX_SHADER,t)),e.attachShader(i,r(e.FRAGMENT_SHADER,n)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)&&!e.isContextLost())throw Error(e.getProgramInfoLog(i)??`link`);let a=new Map;return{p:i,u:t=>(a.has(t)||a.set(t,e.getUniformLocation(i,t)),a.get(t))}}function me(e){if(!e.getExtension(`EXT_color_buffer_float`)&&!e.getExtension(`EXT_color_buffer_half_float`))return!1;let t=B(e,4,4,!0),n=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE&&!e.getError();return V(e,t),n}function B(e,t,n,r,i=!1,a=[0,0,0,1]){let o=e.createTexture(),s=i?e.NEAREST:e.LINEAR;e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,r?e.RGBA16F:e.RGBA8,t,n,0,e.RGBA,r?e.HALF_FLOAT:e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let c=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,c),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0),e.clearColor(...a),e.clear(e.COLOR_BUFFER_BIT),{fb:c,tex:o,w:t,h:n}}function V(e,t){t&&(e.deleteFramebuffer(t.fb),e.deleteTexture(t.tex))}var H=`#version 300 es
precision highp float;
`,U=`
float hash12(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 hash22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`,W=`${H}
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,G=`
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
`,he=e=>e.replace(`#version 300 es
`,`#version 300 es
#define PACKED
`),ge=`${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uState; uniform vec2 uTexel; uniform vec2 uSize; uniform float uDamp;
uniform vec4 uDrops[32]; uniform int uDropN;
${G}
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
}`,_e=`
float pondDepth(vec2 uv){
  vec2 q = (uv - 0.5) * 2.0;
  float e = pow(pow(abs(q.x), 3.0) + pow(abs(q.y), 3.0), 1.0 / 3.0) + 0.16 * (fbm(uv * vec2(5.0, 3.5) + 4.0) - 0.5);
  return 1.0 - smoothstep(0.25, 1.12, e);
}
`,ve=`${H}
in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uScale;
${U}
void main(){
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes / uScale;
  // Sand: long wind-ripples warped by noise, plus fine grain.
  float w = fbm(px / 170.0) * 15.0;
  float rip = sin((px.x * 0.8 + px.y * 0.38) / 11.0 + w) * 0.5 + 0.5;
  float rip2 = sin((px.x * 0.3 - px.y * 0.9) / 5.5 + w * 1.7) * 0.5 + 0.5;
  vec3 c = vec3(0.64, 0.57, 0.45) * (0.86 + 0.1 * rip + 0.05 * rip2);
  c *= 0.93 + 0.14 * vnoise(px / 2.2);
  c = mix(c, vec3(0.5, 0.46, 0.4), smoothstep(0.55, 0.78, fbm(px / 330.0 + 3.0)) * 0.5);
  // Dark silt patches.
  float silt = smoothstep(0.56, 0.74, fbm(px / 240.0 + 11.0));
  c = mix(c, vec3(0.2, 0.19, 0.17) * (0.8 + 0.4 * vnoise(px / 5.0)), silt * 0.8);
  // A few big smooth stones on a loose grid.
  const float CELL = 230.0;
  vec2 gi = floor(px / CELL), gf = fract(px / CELL);
  float best = 0.0, shadow = 0.0; vec3 sc = vec3(0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 g = vec2(x, y), id = gi + g;
    if (hash12(id) < 0.62) continue;
    vec2 ctr = (g + 0.25 + 0.5 * hash22(id + 1.7)) * CELL, d = gf * CELL - ctr;
    float a = hash12(id + 5.3) * 3.14159, ca = cos(a), sa = sin(a);
    d = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
    float rad = 34.0 + 34.0 * hash12(id + 2.9), asp = 0.65 + 0.3 * hash12(id + 8.1);
    float r = length(d / vec2(rad, rad * asp));
    shadow = max(shadow, (1.0 - smoothstep(1.0, 1.55, length((d - vec2(6.0, 8.0)) / vec2(rad, rad * asp)))) * 0.45);
    float dome = sqrt(max(0.0, 1.0 - r * r));
    if (dome > best){
      best = dome;
      vec3 base = mix(vec3(0.46, 0.5, 0.52), vec3(0.62, 0.54, 0.48), hash12(id + 9.9));
      sc = base * (0.62 + 0.55 * dome - 0.18 * (d.x + d.y) / (rad * 2.0)) * (0.94 + 0.12 * vnoise(d / 6.0));
    }
  }
  c *= 1.0 - shadow * (1.0 - smoothstep(0.0, 0.2, best));
  c = mix(c, sc, smoothstep(0.0, 0.12, best));
  o = vec4(c, 1.0);
}`,ye=`${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uFloor; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform float uScale;
uniform vec3 uLight; uniform vec3 uTint; uniform vec4 uK; // uK = ambient, caustics, moon, ice
${U}${G}${_e}
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
  float d = pondDepth(vUv);
  // Sunlit sand, then water absorbs: deeper = more of the mood tint, less floor.
  c *= uLight * uK.x;
  c += uLight * ca * uK.y * (0.2 + 0.35 * focus) * bands * (1.0 - 0.5 * d);
  c += uLight * focus * 0.05 * uK.y;
  c = mix(c, uTint * (0.35 + 0.5 * uK.x), 0.22 + 0.55 * d);
  o = vec4(c, 1.0);
}`,be=`${H}
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec2 aCenter;
layout(location = 3) in vec4 aK;
uniform vec2 uRes; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform float uSurface;
out vec2 vUv; out vec4 vK; out vec2 vC; out float vH;
${G}
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
}`,xe=`${H}
in vec2 vUv; in vec4 vK; in vec2 vC; in float vH; out vec4 o;
uniform vec3 uWater; uniform float uTime; uniform vec3 uLight; uniform vec4 uK; // uK.x = ambient
${U}
const vec3 WHITE = vec3(0.96, 0.94, 0.9), RED = vec3(0.88, 0.2, 0.08), SUMI = vec3(0.06, 0.06, 0.07);

float scaleNet(vec2 q){
  q *= vec2(2.6, 3.2); q.x += 0.5 * mod(floor(q.y), 2.0);
  vec2 f = fract(q) - 0.5; return smoothstep(0.32, 0.5, length(f * vec2(1.0, 1.25)));
}
// Koi skin: 0 kohaku, 1 asagi, 2 ogon, 3 showa, 4 shusui, 5 sanke, 6 tancho, 7 chagoi, 8 kumonryu, 9 doitsu.
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
  } else if (kind == 4){
    c = vec3(0.66, 0.76, 0.82);
    float row = smoothstep(0.24, 0.14, abs(v)) * (1.0 - scaleNet(vec2(u * 5.0, 0.0) + vec2(0.0, 0.25)));
    c = mix(c, vec3(0.16, 0.25, 0.42), row * step(0.14, u) * tail);
    c = mix(c, vec3(0.9, 0.36, 0.14), smoothstep(0.6, 0.92, abs(v)) + smoothstep(0.1, 0.0, u) * 0.4);
  } else if (kind == 6){ // tancho: white, one round red crown on the head
    c = mix(WHITE, vec3(0.9, 0.9, 0.88), net * 0.4);
    c = mix(c, RED, 1.0 - smoothstep(0.046, 0.056, length(vec2(u - 0.13, v * 0.13))));
  } else if (kind == 7){ // chagoi: plain bronze, paler belly
    c = mix(vec3(0.5, 0.34, 0.17), vec3(0.78, 0.6, 0.34), 0.25 + 0.35 * n + 0.3 * abs(v) + net * 0.12);
  } else if (kind == 8){ // kumonryu: warped black swirl on white
    vec2 w = q * 1.3 + 3.0 * vec2(fbm(q * 1.1 + 5.0), fbm(q * 1.1 + 9.0));
    float blk = smoothstep(0.5, 0.58, fbm(w)) * step(0.05, u);
    c = mix(vec3(0.92, 0.93, 0.92), vec3(0.1, 0.11, 0.15), blk);
    c = mix(c, vec3(0.5, 0.52, 0.56), smoothstep(0.62, 0.7, fbm(w + 7.0)) * (1.0 - blk) * 0.5);
  } else { // doitsu (9): scaleless, golden-orange patches, a dorsal row of big dark-edged scales
    c = mix(vec3(0.96, 0.9, 0.78), vec3(0.95, 0.5, 0.18), smoothstep(0.45, 0.55, n) * tail);
    vec2 g = vec2(u * 8.0, v * 2.0 + 0.5); g.x += 0.5 * mod(floor(g.y), 2.0);
    float d = length((fract(g) - 0.5) * vec2(1.0, 1.1));
    float sc = smoothstep(0.34, 0.46, d) * smoothstep(0.62, 0.45, d) * smoothstep(0.62, 0.38, abs(v)) * step(0.15, u) * tail;
    c = mix(c, vec3(0.2, 0.2, 0.3), sc * 0.8);
    c += 0.06 * (1.0 - smoothstep(0.0, 0.4, d)) * smoothstep(0.62, 0.38, abs(v));
  }
  return c;
}
vec3 finColor(int kind, float x){
  if (kind == 7) return vec3(0.84, 0.66, 0.4);
  if (kind == 8) return mix(vec3(0.3, 0.32, 0.38), vec3(0.95, 0.95, 0.95), smoothstep(0.1, 0.8, x));
  if (kind == 9) return mix(vec3(0.95, 0.62, 0.3), WHITE, x);
  if (kind == 2) return vec3(1.0, 0.78, 0.35);
  if (kind == 3) return mix(SUMI, WHITE, smoothstep(0.2, 0.7, x));
  if (kind == 1 || kind == 4) return mix(vec3(0.9, 0.42, 0.2), vec3(0.95, 0.85, 0.8), x);
  return WHITE;
}
const vec3 INK = vec3(0.03, 0.035, 0.06);
// Fin silhouette coverage; s insets the outline so (a - inset) leaves a brush-like rim.
float finShape(int kind, float x, float y, float s){
  float ay = abs(y) + s;
  if (kind == 1){
    float w = pow(sin(3.14159 * min((x + s * 0.6) * 1.05, 1.0)), 0.6) * (0.35 + 0.65 * x);
    return 1.0 - smoothstep(w - 0.05, w, ay);
  }
  float w = 0.4 + 0.6 * x;
  float a = 1.0 - smoothstep(w - 0.05, w, ay);
  a *= smoothstep(0.0, 0.12, abs(y) - (x - 0.62) * 1.2 - s);
  return a * (1.0 - smoothstep(0.88, 1.0, x + s));
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
    float a = 1.0 - smoothstep(0.9, 1.0, abs(v));
    if (u < 0.08) a *= 1.0 - smoothstep(0.88, 1.0, length(vec2((0.08 - u) / 0.08, v)));
    float metal;
    vec3 c = skin(int(vK.y + 0.5), u, v, vK.z, metal);
    float round = sqrt(max(0.0, 1.0 - v * v));
    c *= 0.55 + 0.5 * round;
    c *= mix(vec3(1.0), uLight * uK.x, 0.5); // koi sit under water: only half the mood light, ink stays ink
    c += (0.1 + 0.25 * metal) * exp(-v * v * 14.0) * (1.0 - u * 0.7);
    c += metal * 0.15 * sin(u * 30.0 + uTime * 0.7) * round;
    // Ink outline with a wobbling brush width (thicker at the nose and tail).
    float ow = 0.78 + 0.08 * vnoise(vec2(u * 18.0, vK.z * 50.0 + sign(v) * 7.0));
    float rim = length(vec2(max(0.08 - u, 0.0) / 0.08, v));
    float ink = max(smoothstep(ow, ow + 0.07, abs(v)), max(smoothstep(0.93, 0.97, u), u < 0.08 ? smoothstep(0.8, 0.92, rim) : 0.0));
    c = mix(c, INK, ink * 0.85);
    vec2 e = vec2((u - 0.075) * vC.x, (abs(v) - 0.58) * vC.y);
    c = mix(c, vec3(0.02), 1.0 - smoothstep(0.008, 0.016, length(e) / vC.x));
    o = underwater(c, a * smoothstep(1.0, 0.95, u), vK.w);
  } else if (kind == 1 || kind == 2){ // pectoral (1) or tail (2): uv.x root->tip, uv.y across
    float x = uv.x, y = uv.y;
    // Brush-like rim: inset width wobbles along the fin, so the line is thick and thin like ink.
    float inset = 0.07 + 0.07 * vnoise(vec2(x * 8.0 + y * 2.0, vK.z * 40.0));
    float a = finShape(kind, x, y, 0.0), edge = a * (1.0 - finShape(kind, x, y, inset));
    int variety = int(vK.y + 0.5);
    vec3 c = finColor(variety, x);
    float ray = sin(y * 22.0 + x * 4.0);
    c *= 0.85 + 0.15 * ray;
    c = mix(c, INK, smoothstep(0.8, 1.0, ray) * 0.22 * x);
    c *= mix(vec3(1.0), uLight * uK.x, 0.5);
    c = mix(c * 1.18, INK, edge * 0.65);
    o = underwater(c, max(a * (0.84 - 0.32 * x), edge * 0.7), vK.w * 0.7);
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
    c *= mix(vec3(1.0), uLight * uK.x, 0.7);
    o = underwater(c, a, vK.w * (1.0 - uv.x * 0.6));
  } else if (kind == 6){ // round lotus leaf: raised rim, radial veins, pale hub. k3 = alpha
    float r = length(uv), ang = atan(uv.y, uv.x), sd = vK.y * 20.0, age = vK.z;
    float edge = 0.965 + 0.025 * sin(ang * 5.0 + sd) + 0.01 * sin(ang * 13.0 + sd * 0.7);
    float a = 1.0 - smoothstep(edge - 0.015, edge, r);
    vec3 c = mix(vec3(0.15, 0.4, 0.2), vec3(0.4, 0.42, 0.14), clamp(age * 1.6, 0.0, 1.0));
    c = mix(c, vec3(0.55, 0.36, 0.12), clamp(age * 1.4 - 0.7, 0.0, 1.0));
    c *= 0.85 + 0.28 * fbm(uv * 3.0 + sd);
    float vein = pow(abs(cos(ang * 11.0 + sin(r * 2.5 + sd) * 0.25)), 40.0);
    c += vec3(0.07, 0.1, 0.04) * vein * smoothstep(0.06, 0.3, r) * (1.0 - 0.6 * smoothstep(0.7, 0.95, r));
    c *= 0.9 + 0.12 * smoothstep(0.0, 0.7, r);
    c = mix(c, c * vec3(1.2, 1.25, 0.95) + 0.03, 1.0 - smoothstep(0.0, 0.08, r));
    float rim = smoothstep(edge - 0.13, edge - 0.07, r) * (1.0 - smoothstep(edge - 0.035, edge, r));
    float lip = smoothstep(edge - 0.22, edge - 0.14, r) * (1.0 - smoothstep(edge - 0.14, edge - 0.09, r));
    c *= 1.0 - 0.2 * lip;
    c = mix(c, c * 1.3 + 0.03, rim * 0.8);
    c *= 1.0 + rim * 0.3 * dot(uv / (r + 1e-3), vec2(-0.6, -0.8));
    c *= 1.0 + clamp(vH, -1.0, 1.0) * 0.25;
    c *= uLight * uK.x;
    o = vec4(c * a, a) * vK.w;
  } else if (kind == 7){ // lotus bloom, pointed layered petals. k1 seed, k2 white
    float r = length(uv), ang = atan(uv.y, uv.x) + vK.y * 6.0;
    float l1 = abs(cos(ang * 4.0)), l2 = abs(cos(ang * 4.0 + 0.785));
    float r1 = 0.5 + 0.5 * pow(l1, 1.6), r2 = 0.34 + 0.34 * pow(l2, 1.6);
    vec3 tint = vK.z > 0.5 ? vec3(1.0, 0.97, 0.95) : vec3(1.0, 0.68, 0.8);
    vec3 tip = vK.z > 0.5 ? vec3(1.0, 0.86, 0.9) : vec3(0.96, 0.4, 0.62);
    vec3 c = mix(tint, tip, smoothstep(0.35, 1.0, r / r1) * pow(l1, 1.2)) * (0.72 + 0.28 * pow(l1, 2.0));
    float inner = 1.0 - smoothstep(r2 - 0.03, r2, r);
    c = mix(c, mix(tint, tip, 0.45 * smoothstep(0.1, r2, r)) * (0.88 + 0.2 * pow(l2, 2.0)), inner);
    c = mix(c, vec3(1.0, 0.82, 0.25), 1.0 - smoothstep(0.13, 0.19, r));
    c *= uLight * uK.x;
    float a = 1.0 - smoothstep(r1 - 0.05, r1, r);
    o = vec4(c * a, a) * vK.w;
  } else if (kind == 8){ // floating things. k1 type 0 sakura, 1 maple, 2 ginkgo, 3 snow; k2 variation
    float t = floor(vK.y + 0.5), r = length(uv), ang = atan(uv.y, uv.x), vr = vK.z;
    vec3 c; float a;
    if (t < 0.5){ // sakura petal, notch at +x
      float tm = 0.45 + 0.55 * abs(cos(uTime * 0.7 + vr * 25.0)); // slow tumble
      vec2 p = uv * vec2(1.0, 1.5 / tm);
      a = (1.0 - smoothstep(0.55, 1.0, length(p))) * smoothstep(0.0, 0.2, abs(uv.y) - (uv.x - 0.75) * 0.7);
      c = mix(vec3(1.0, 0.98, 0.98), vec3(0.98, 0.8, 0.87), smoothstep(-1.0, 0.9, uv.x));
    } else if (t < 1.5){ // maple: five pointed lobes, stem at -x
      float c5 = cos(5.0 * ang);
      float e = 0.55 + 0.45 * pow(0.5 + 0.5 * c5, 0.9) + 0.04 * cos(ang * 25.0);
      a = 1.0 - smoothstep(e - 0.04, e, r);
      a = max(a, (1.0 - smoothstep(0.03, 0.06, abs(uv.y))) * step(uv.x, -0.2) * step(-1.0, uv.x));
      c = mix(vec3(0.72, 0.1, 0.07), vec3(0.96, 0.5, 0.1), vr);
      c += 0.2 * smoothstep(0.95, 1.0, c5) * (1.0 - r);
      c *= 0.88 + 0.16 * fbm(uv * 4.0 + vr * 9.0);
    } else if (t < 2.5){ // ginkgo fan, stem at -x
      vec2 p = uv - vec2(-0.75, 0.0);
      float fr = length(p) / 1.75, fa = atan(p.y, p.x);
      a = (1.0 - smoothstep(0.93, 1.0, fr + 0.03 * sin(fa * 18.0))) * (1.0 - smoothstep(1.0, 1.1, abs(fa)));
      a *= 1.0 - 0.8 * (1.0 - smoothstep(0.0, 0.1, abs(fa))) * smoothstep(0.5, 0.75, fr);
      c = mix(vec3(0.95, 0.74, 0.14), vec3(0.98, 0.88, 0.3), vr) * (0.9 + 0.1 * sin(fa * 16.0));
    } else { // snowflake: six soft arms
      float arm = 0.1 + 0.9 * pow(abs(cos(3.0 * ang)), 7.0);
      a = (1.0 - smoothstep(arm * 0.9, arm, r)) * 0.9 + (1.0 - smoothstep(0.0, 0.4, r)) * 0.4;
      c = vec3(0.92, 0.96, 1.0);
    }
    c *= 1.0 + clamp(vH, -1.0, 1.0) * 0.2;
    c *= t > 2.5 ? mix(vec3(1.0), uLight * uK.x, 0.6) : uLight * uK.x;
    o = vec4(c * a, a * 0.95) * vK.w;
  } else if (kind == 9){ // firefly glow (k1 0) or its water reflection (k1 1); additive. k2 flicker phase, k3 level
    float r = length(uv);
    float fl = 0.75 + 0.25 * sin(uTime * 2.3 + vK.z * 40.0) * sin(uTime * 0.9 + vK.z * 17.0);
    vec3 c = vec3(0.31, 0.88, 0.63);
    float g = exp(-r * r * 7.0) * 0.55 + exp(-r * r * 90.0) * 1.1;
    if (vK.y > 0.5){ g = exp(-r * r * 5.0) * 0.3; }
    o = vec4(mix(c, vec3(0.85, 1.0, 0.9), exp(-r * r * 120.0)) * g * fl * vK.w, 0.0);
  } else if (kind == 10){ // dragonfly seen from above, heading +x. k2 hue, k3 alpha
    float x = uv.x, y = uv.y, ay = abs(y);
    float bw = 0.05 - 0.02 * smoothstep(-0.2, -0.95, x);
    float seg = 0.8 + 0.2 * sin(x * 55.0);
    float abd = (1.0 - smoothstep(bw - 0.015, bw, ay)) * step(-0.95, x) * step(x, 0.12) * seg;
    float thx = 1.0 - smoothstep(0.85, 1.0, length(vec2((x - 0.28) / 0.17, y / 0.1)));
    float head = 1.0 - smoothstep(0.8, 1.0, length(vec2(x - 0.6, y)) / 0.085);
    float body = max(max(abd, thx), head);
    float wing = 0.0, vein = 0.0;
    for (int i = 0; i < 2; i++){
      float cx = 0.32 - 0.2 * float(i), hl = 0.27 + 0.03 * float(i);
      float u = (x - cx + (ay - 0.5) * 0.3) / hl, v = (ay - 0.55) / 0.42;
      float w = 1.0 - smoothstep(0.8, 1.0, length(vec2(u, v)));
      wing = max(wing, w);
      vein = max(vein, w * (1.0 - smoothstep(0.0, 0.07, abs(u))));
    }
    wing *= smoothstep(0.08, 0.16, ay);
    float fl = 0.85 + 0.15 * sin(uTime * 40.0 + vK.z * 9.0);
    vec3 bc = mix(vec3(0.12, 0.5, 0.78), vec3(0.78, 0.2, 0.18), step(0.5, vK.z)) * (0.8 + 0.4 * smoothstep(0.0, 0.5, x));
    vec3 wc = vec3(0.82, 0.93, 1.0) * (0.9 + 0.5 * vein);
    float wa = wing * (0.2 + 0.22 * vein) * fl;
    float a = max(body, wa);
    vec3 c = (body > wa ? bc : wc) * uLight * uK.x;
    o = vec4(c * a, a) * vK.w;
  } else if (kind == 11){ // koi food pellet. k3 alpha
    float r = length(uv);
    float a = 1.0 - smoothstep(0.8, 1.0, r);
    vec3 c = mix(vec3(0.7, 0.48, 0.2), vec3(0.95, 0.78, 0.45), smoothstep(0.7, -0.2, r - 0.35 * uv.x - 0.35 * uv.y));
    c *= uLight * uK.x * (1.0 + clamp(vH, -1.0, 1.0) * 0.3);
    o = vec4(c * a, a) * vK.w;
  } else { // 12: lotus bud, tip at +x. k3 alpha
    float x = uv.x;
    float w = 0.62 * sqrt(max(0.0, (1.0 + x) * 0.5)) * (1.0 - x) * 1.1;
    float a = (1.0 - smoothstep(w - 0.06, w, abs(uv.y))) * step(-1.0, x) * step(x, 1.0);
    vec3 c = mix(vec3(0.3, 0.52, 0.28), vec3(1.0, 0.62, 0.76), smoothstep(-0.25, 0.45, x));
    c *= 0.82 + 0.3 * smoothstep(0.5, 0.0, abs(uv.y));
    c *= uLight * uK.x;
    o = vec4(c * a, a) * vK.w;
  }
}`,Se=`${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uUnder; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform vec3 uWater; uniform float uScale;
uniform vec3 uLight; uniform vec3 uSky; uniform vec4 uK; // uK = ambient, caustics (sun), moon, ice
${U}${G}${_e}
float hgt(vec2 p){ return ripH(uRip, p); }
void main(){
  vec2 t = uSimTexel;
  float hx = hgt(vUv + vec2(t.x, 0)) - hgt(vUv - vec2(t.x, 0));
  float hy = hgt(vUv + vec2(0, t.y)) - hgt(vUv - vec2(0, t.y));
  vec2 px = vUv * uRes / uScale;
  // Idle breeze so still water is never dead flat.
  vec2 breeze = vec2(fbm(px / 180.0 + vec2(uTime * 0.05, 0.0)), fbm(px / 180.0 + vec2(5.0, uTime * 0.04))) - 0.5;
  vec3 n = normalize(vec3(-hx * 5.0 + breeze.x * 0.06, -hy * 5.0 + breeze.y * 0.06, 1.0));
  float dep = pondDepth(vUv);
  vec2 ruv = vUv + n.xy * 22.0 * uScale / uRes;
  vec3 c = texture(uUnder, ruv).rgb;
  c = mix(c, uWater, 0.12 + 0.12 * dep);
  // Soft sky gradient mirrored on the surface, stronger at grazing angles and in the deep middle.
  vec3 sky = uSky * mix(0.55, 1.15, vUv.y + n.y * 0.5) * (0.5 + 0.5 * uK.x);
  float fres = pow(1.0 - n.z, 1.5);
  c = mix(c, sky, clamp(0.07 + 0.06 * dep + fres * 0.9, 0.0, 0.85));
  // Sun glint by day, moon streak by night: stretched down the water and broken by ripples.
  vec3 L = normalize(vec3(-0.45, 0.55, 0.7)), Hv = normalize(L + vec3(0, 0, 1));
  float sp = pow(max(dot(n, Hv), 0.0), 220.0);
  c += uLight * sp * 1.6 * uK.y;
  vec2 m = vec2(vUv.x - 0.72 + n.x * 0.7 + breeze.x * 0.05, vUv.y - 0.55 + n.y * 0.3);
  // A smooth column that widens toward the viewer, swayed by the ripples and softly broken into long glints.
  float dy = 0.55 - vUv.y, wid = 0.014 + 0.05 * clamp(dy, 0.0, 1.0);
  float sx = vUv.x - 0.72 + n.x * 0.35 + breeze.x * 0.06 + 0.012 * sin(dy * 14.0 + uTime * 0.6);
  float streak = exp(-sx * sx / (wid * wid)) * smoothstep(-0.04, 0.12, dy) * (1.0 - smoothstep(0.3, 0.95, dy));
  float broken = 0.4 + 0.6 * smoothstep(0.2, 0.8, fbm(vec2(px.x / 90.0 + hx * 14.0, px.y / 14.0 + hy * 14.0 + uTime * 0.35)));
  c += vec3(0.78, 0.86, 1.0) * streak * broken * uK.z * 0.42;
  c += vec3(0.85, 0.92, 1.0) * exp(-dot(m, m) * 9000.0) * uK.z * 0.5;
  // Winter: a thin frosted crust at the shore, with hairline cracks.
  float ice = smoothstep(0.0, 0.05, uK.w) * (1.0 - smoothstep(0.02 + 0.14 * uK.w, 0.06 + 0.2 * uK.w, dep + 0.08 * (fbm(px / 40.0) - 0.5)));
  float crack = 1.0 - smoothstep(0.0, 0.025, abs(fbm(px / 70.0 + 7.0) - 0.5));
  vec3 iceC = mix(vec3(0.72, 0.84, 0.92), vec3(0.95, 0.98, 1.0), fbm(px / 30.0)) * (0.45 + 0.55 * uK.x) * (uLight * 0.4 + 0.6);
  iceC += crack * 0.07;
  c = mix(c, iceC, ice * 0.88);
  o = vec4(c, 1.0);
}`,Ce=`${H}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform float uThr;
void main(){ vec3 c = texture(uSrc, vUv).rgb; o = vec4(max(c - uThr, 0.0), 1.0); }`,we=`${H}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform vec2 uDir;
void main(){
  vec3 c = texture(uSrc, vUv).rgb * 0.227;
  c += (texture(uSrc, vUv + uDir * 1.38).rgb + texture(uSrc, vUv - uDir * 1.38).rgb) * 0.316;
  c += (texture(uSrc, vUv + uDir * 3.23).rgb + texture(uSrc, vUv - uDir * 3.23).rgb) * 0.07;
  o = vec4(c, 1.0);
}`,Te=`${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uScene; uniform sampler2D uBloom; uniform vec2 uPx; uniform float uTime; uniform float uBloomG; uniform vec3 uLight;
${U}
void main(){
  vec3 c = texture(uScene, vUv).rgb + texture(uBloom, vUv).rgb * uBloomG;
  c = c / (1.0 + c * 0.12);
  vec2 q = (vUv - 0.5) * vec2(1.0, 0.9);
  c *= mix(1.0, 0.68, smoothstep(0.25, 0.75, length(q)));
  c = pow(c, vec3(0.95, 0.97, 1.0));
  // Paper and ink: static fibre + wash blotches, multiplicative so darks stay clean; tiny animated dither against banding.
  vec2 px = vUv * uPx;
  float fibre = vnoise(px / 1.7) * 0.6 + vnoise(px / 5.0 + 3.0) * 0.4;
  float wash = fbm(px / 90.0);
  c *= 1.0 + (fibre - 0.5) * 0.07 + (wash - 0.5) * 0.06;
  c += (hash12(px + fract(uTime) * 91.0) - 0.5) * 0.012;
  o = vec4(c, 1.0);
}`,K=4,q=1/120,Ee=32,J=15,De=class{gl;dprCap;scale=1;half;get ripplePath(){return this.packed?`packed`:`half`}packed;drops=new Float32Array(128);P;vao;spriteVao;vbo;sim=[];floor;under;scene;bloomA;bloomB;cssW=0;cssH=0;acc=0;time=0;cur=new Float32Array(J);tgt=new Float32Array(J);moodSet=!1;water=new Float32Array(3);setMood(e){let t=this.tgt;t.set(e.light,0),t.set(e.waterTint,3),t.set(e.skyGlow,6),t[9]=e.ambient,t[10]=e.caustics,t[11]=e.moon,t[12]=e.season===`winter`?.25+.75*Math.sin(Math.PI*e.seasonT):0,t[13]=e.bloomGain,t[14]=e.bloomThr,this.moodSet||=(this.cur.set(t),!0)}easeMood(e){let t=Math.min(1,e*1.5),n=this.cur,r=this.tgt;for(let e=0;e<J;e++)n[e]+=(r[e]-n[e])*t;let i=.35+.5*n[9];this.water[0]=n[3]*i,this.water[1]=n[4]*i,this.water[2]=n[5]*i}moodUniforms(e){let t=this.gl,n=this.cur;t.uniform3f(e.u(`uLight`),n[0],n[1],n[2]),t.uniform3f(e.u(`uTint`),n[3],n[4],n[5]),t.uniform3f(e.u(`uSky`),n[6],n[7],n[8]),t.uniform4f(e.u(`uK`),n[9],n[10],n[11],n[12]),t.uniform3f(e.u(`uWater`),this.water[0],this.water[1],this.water[2])}constructor(e,t,n={}){this.gl=e,this.dprCap=t,this.half=!n.forceNoFloat&&me(e),this.packed=!this.half;let r=e=>this.packed?he(e):e,i=t=>z(e,W,r(t));this.P={sim:i(ge),floor:z(e,W,ve),under:i(ye),water:i(Se),bright:z(e,W,Ce),blur:z(e,W,we),final:z(e,W,Te),sprite:z(e,r(be),xe)},this.vao=e.createVertexArray(),this.spriteVao=e.createVertexArray(),this.vbo=e.createBuffer(),e.bindVertexArray(this.spriteVao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),[[0,2,0],[1,2,2],[2,2,4],[3,4,6]].forEach(([t,n,r])=>{e.enableVertexAttribArray(t),e.vertexAttribPointer(t,n,e.FLOAT,!1,40,r*4)}),e.bindVertexArray(null)}px(){let e=Math.min(window.devicePixelRatio||1,this.dprCap)*this.scale;return[Math.max(1,Math.round(this.cssW*e)),Math.max(1,Math.round(this.cssH*e))]}resize(e,t){let n=this.gl,r=e!==this.cssW||t!==this.cssH||!this.sim.length;this.cssW=e,this.cssH=t;let[i,a]=this.px();if(n.canvas.width=i,n.canvas.height=a,r){this.sim.forEach(e=>V(n,e));let r=Math.min(512,Math.ceil(e/K)),i=Math.min(512,Math.ceil(t/K)),a=()=>this.packed?B(n,r,i,!1,!0,[128/255,0,128/255,0]):B(n,r,i,!0);this.sim=[a(),a()]}for(let e of[this.floor,this.under,this.scene,this.bloomA,this.bloomB])V(n,e);this.floor=B(n,i,a,!1),this.under=B(n,i,a,!1),this.scene=B(n,i,a,this.half);let o=Math.max(1,i>>2),s=Math.max(1,a>>2);this.bloomA=B(n,o,s,this.half),this.bloomB=B(n,o,s,this.half),this.pass(this.P.floor,this.floor,r=>{n.uniform2f(r.u(`uRes`),e,t),n.uniform1f(r.u(`uScale`),this.patternScale())})}patternScale(){return Math.min(1.4,Math.max(.6,Math.min(this.cssW,this.cssH)/700))}setScale(e){Math.abs(e-this.scale)<.01||(this.scale=e,this.resize(this.cssW,this.cssH))}bindTex(e,t,n,r){let i=this.gl;i.activeTexture(i.TEXTURE0+n),i.bindTexture(i.TEXTURE_2D,r),i.uniform1i(e.u(t),n)}pass(e,t,n){let r=this.gl;r.bindFramebuffer(r.FRAMEBUFFER,t?t.fb:null),r.viewport(0,0,t?t.w:r.canvas.width,t?t.h:r.canvas.height),r.useProgram(e.p),n(e),r.bindVertexArray(this.vao),r.drawArrays(r.TRIANGLES,0,3)}stepSim(e,t){let n=this.gl,r=this.sim[0].w,i=this.sim[0].h,a=this.P.sim,o=this.drops,s=Math.min(e.drops.length,Ee);for(let t=0;t<s;t++){let n=e.drops[t],a=t*4;o[a]=n.x/this.cssW*r,o[a+1]=(1-n.y/this.cssH)*i,o[a+2]=Math.max(1.5,n.r/K),o[a+3]=n.s}e.drops.length=0,n.useProgram(a.p),n.bindVertexArray(this.vao),n.viewport(0,0,r,i),n.uniform2f(a.u(`uTexel`),1/r,1/i),n.uniform2f(a.u(`uSize`),r,i),n.uniform1f(a.u(`uDamp`),.986),n.uniform4fv(a.u(`uDrops`),o);for(let e=0;e<t;e++){let[t,r]=this.sim;n.bindFramebuffer(n.FRAMEBUFFER,r.fb),this.bindTex(a,`uState`,0,t.tex),n.uniform1i(a.u(`uDropN`),e===0?s:0),n.drawArrays(n.TRIANGLES,0,3),this.sim[0]=r,this.sim[1]=t}}drawMesh(e,t){if(!e.n)return;let n=this.gl,r=this.P.sprite,i=this.sim[0];n.useProgram(r.p),n.uniform2f(r.u(`uRes`),this.cssW,this.cssH),n.uniform2f(r.u(`uSimTexel`),1/i.w,1/i.h),n.uniform1f(r.u(`uSurface`),+!!t),this.moodUniforms(r),n.uniform1f(r.u(`uTime`),this.time),this.bindTex(r,`uRip`,0,i.tex),n.bindVertexArray(this.spriteVao),n.bindBuffer(n.ARRAY_BUFFER,this.vbo),n.bufferData(n.ARRAY_BUFFER,e.data.subarray(0,e.n*10),n.DYNAMIC_DRAW),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.drawArrays(n.TRIANGLES,0,e.n),n.disable(n.BLEND)}frame(e,t){let n=this.gl;if(!this.under||!this.scene||!this.floor||!this.bloomA||!this.bloomB)return;this.time+=t,this.easeMood(t),this.acc=Math.min(this.acc+t,q*4);let r=0;for(;this.acc>=q;)this.acc-=q,r++;r&&this.stepSim(e,r),e.build();let i=this.sim[0],a=this.cssW,o=this.cssH,s=this.patternScale(),c=e=>{n.uniform2f(e.u(`uSimTexel`),1/i.w,1/i.h),n.uniform2f(e.u(`uRes`),a,o),n.uniform1f(e.u(`uTime`),this.time),n.uniform1f(e.u(`uScale`),s),this.moodUniforms(e)};this.pass(this.P.under,this.under,e=>{c(e),this.bindTex(e,`uFloor`,0,this.floor.tex),this.bindTex(e,`uRip`,1,i.tex)}),this.drawMesh(e.under,!1),this.pass(this.P.water,this.scene,e=>{c(e),this.bindTex(e,`uUnder`,0,this.under.tex),this.bindTex(e,`uRip`,1,i.tex)}),this.drawMesh(e.surface,!0);let l=this.bloomA,u=this.bloomB;this.pass(this.P.bright,l,e=>{this.bindTex(e,`uSrc`,0,this.scene.tex),n.uniform1f(e.u(`uThr`),this.cur[14])});for(let[e,t,r,i]of[[l,u,1,0],[u,l,0,1]])this.pass(this.P.blur,t,t=>{this.bindTex(t,`uSrc`,0,e.tex),n.uniform2f(t.u(`uDir`),r/l.w,i/l.h)});this.pass(this.P.final,null,e=>{this.bindTex(e,`uScene`,0,this.scene.tex),this.bindTex(e,`uBloom`,1,l.tex),n.uniform2f(e.u(`uPx`),n.canvas.width,n.canvas.height),n.uniform1f(e.u(`uTime`),this.time),n.uniform1f(e.u(`uBloomG`),this.cur[13])})}},Oe=e=>Math.min(1,Math.max(0,e));function ke(e){let t=e.weights,n=e.season===`winter`,r=Oe(t.dusk*.8+t.night),i=n?.55:1;return{water:(.5+.1*(t.day+t.golden))*i,wind:(.1+.1*(t.dawn+t.day+t.golden))*i,crickets:r*(n?.1:e.season===`autumn`?.6:1)}}var Ae=[523.25,587.33,659.25,783.99,880,1046.5],je=class{on=!1;ctx;out;last=0;hooked=!1;lay;target={water:.5,wind:.1,crickets:0};setMood(e){this.target=ke(e),this.apply()}apply(){if(!this.ctx||!this.lay)return;let e=this.ctx.currentTime;for(let t of[`water`,`wind`,`crickets`])this.lay[t].gain.setTargetAtTime(this.target[t],e,2)}init(){let e=this.ctx=new AudioContext,t=this.out=e.createGain();t.gain.value=0,t.connect(e.destination);let n=e.sampleRate*4,r=e.createBuffer(1,n,e.sampleRate),i=r.getChannelData(0),a=0;for(let e=0;e<n;e++)a=(a+(Math.random()*2-1)*.02)*.998,i[e]=a*3.5;let o=(t,n,i,a,o,s)=>{let c=e.createBufferSource();c.buffer=r,c.loop=!0,c.playbackRate.value=.9+Math.random()*.2;let l=e.createBiquadFilter();l.type=t,l.frequency.value=n,l.Q.value=.7;let u=e.createGain();u.gain.value=i;let d=e.createOscillator(),f=e.createGain();d.frequency.value=a,f.gain.value=o,d.connect(f).connect(u.gain),c.connect(l).connect(u).connect(s),c.start(),d.start()},s=()=>{let n=e.createGain();return n.gain.value=0,n.connect(t),n},c=s(),l=s(),u=s();o(`lowpass`,420,1,.06,.3,c),o(`bandpass`,1400,.24,.23,.16,c),o(`bandpass`,600,1,.05,.4,l);for(let[t,n,r]of[[4300,7,.13],[3700,5.5,.09]]){let i=e.createOscillator(),a=e.createGain(),o=e.createOscillator(),s=e.createGain(),c=e.createOscillator(),l=e.createGain(),d=e.createGain();i.frequency.value=t,a.gain.value=.015,o.frequency.value=n,s.gain.value=.015,o.connect(s).connect(a.gain),c.frequency.value=r,l.gain.value=.5,d.gain.value=.5,c.connect(l).connect(d.gain),i.connect(a).connect(d).connect(u),i.start(),o.start(),c.start()}this.lay={water:c,wind:l,crickets:u},this.apply()}async toggle(){this.ctx||this.init();let e=this.ctx,t=this.out.gain;return this.hooked||(this.hooked=!0,document.addEventListener(`visibilitychange`,()=>{this.on&&(document.hidden?e.suspend():e.resume())})),this.on=!this.on,this.on&&await e.resume(),t.cancelScheduledValues(e.currentTime),t.setTargetAtTime(this.on?.6:0,e.currentTime,.25),this.on}plink(e,t){if(!this.on||!this.ctx||!this.out)return;let n=this.ctx,r=n.currentTime;if(r-this.last<.12)return;this.last=r;let i=Ae[Math.floor(Math.random()*Ae.length)]*(Math.random()<.3?.5:1),a=n.createOscillator(),o=n.createGain(),s=n.createStereoPanner();a.type=`sine`,a.frequency.setValueAtTime(i,r),a.frequency.exponentialRampToValueAtTime(i*1.5,r+.09);let c=Math.min(.25,.08+e*.15);o.gain.setValueAtTime(1e-4,r),o.gain.exponentialRampToValueAtTime(c,r+.008),o.gain.exponentialRampToValueAtTime(1e-4,r+.45),s.pan.value=Math.max(-1,Math.min(1,t)),a.connect(o).connect(s).connect(this.out),a.start(r),a.stop(r+.5)}},Me=document.documentElement.classList.contains(`embed`),Y=matchMedia(`(prefers-reduced-motion: reduce)`).matches,X=document.querySelector(`#pond`),Ne=document.querySelector(`#fallback`),Z=document.querySelector(`.creator`);Z&&new IntersectionObserver(([e])=>Z.classList.toggle(`is-live`,e.isIntersecting)).observe(Z);var Q=document.querySelector(`#theme`);Q?.addEventListener(`click`,()=>{let e=document.documentElement.dataset.theme!==`light`;document.documentElement.dataset.theme=e?`light`:`dark`,Q.setAttribute(`aria-pressed`,String(e));try{localStorage.setItem(`theme`,e?`light`:`dark`)}catch{}}),Q?.setAttribute(`aria-pressed`,String(document.documentElement.dataset.theme===`light`));function $(){X.hidden=!0,Ne.hidden=!1}var Pe=X.getContext(`webgl2`,{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});Pe?Fe(Pe):$();function Fe(e){let t;try{t=new De(e,Me?1.5:2)}catch(e){return console.error(e),$()}X.dataset.ripples=t.ripplePath;let n=te(location.search),r=new pe(Math.random()*1e9|0,8),i=new je;r.onEat=e=>i.plink(.25,e/r.w*2-1);let a=()=>{let e=E(new Date,n);t.setMood(e),r.setMood(e),i.setMood(e)};a(),setInterval(a,1e3);let o=!1,s=!1,c=!0,l=0,u=0,d=0,f=0,p=1/60,m=()=>{for(let e=0;e<90;e++)r.update(1/60);r.drops.length=0,t.frame(r,1/60)},h=()=>{let e=X.getBoundingClientRect();e.width<2||e.height<2||(r.resize(e.width,e.height),t.resize(e.width,e.height),Y&&m())};new ResizeObserver(h).observe(X);let g=e=>{u=requestAnimationFrame(g);let n=Math.min(.05,l?(e-l)/1e3:1/60);l=e,p+=(n-p)*.05,p>.024?(d++,f=0):p<.0175?(f++,d=0):d=f=0,d>45&&t.scale>.5&&(t.setScale(Math.max(.5,t.scale-.15)),d=0,p=1/60),f>240&&t.scale<1&&(t.setScale(Math.min(1,t.scale+.1)),f=0),r.update(n),t.frame(r,n)},_=()=>{let e=!o&&!Y&&c&&!document.hidden;e&&!s?(s=!0,l=0,u=requestAnimationFrame(g)):!e&&s&&(s=!1,cancelAnimationFrame(u))};document.addEventListener(`visibilitychange`,_),new IntersectionObserver(([e])=>{c=e.isIntersecting,_()}).observe(X),X.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),o=!0,s=!1,cancelAnimationFrame(u)}),X.addEventListener(`webglcontextrestored`,()=>{try{t=new De(e,Me?1.5:2)}catch(e){return console.error(e),$()}X.dataset.ripples=t.ripplePath,a(),o=!1,h(),_()});let v={x:-1e9,y:-1e9},y=0,b=e=>{let t=X.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}},x=(e,t,n)=>{r.pointer={x:e,y:t},clearTimeout(y),y=window.setTimeout(()=>{r.pointer=null},600),r.splash(e,t,n,Math.min(r.w,r.h)*.02),i.plink(Math.abs(n),e/r.w*2-1)};Y||X.addEventListener(`pointerdown`,e=>{let t=b(e);X.setPointerCapture(e.pointerId),v=t,r.pointerShy=1,x(t.x,t.y,1.2),r.tap(t.x,t.y)}),X.addEventListener(`pointercancel`,()=>{clearTimeout(y),r.pointer=null}),Y||X.addEventListener(`pointermove`,e=>{let t=b(e),n=e.buttons!==0;if(!n&&e.pointerType!==`mouse`)return;let i=Math.min(r.w,r.h)*(n?.015:.03);Math.hypot(t.x-v.x,t.y-v.y)<i||(v=t,n?(r.pointerShy=1,x(t.x,t.y,.45)):(r.pointerShy=.5,r.pointer=t,r.splash(t.x,t.y,.1,Math.min(r.w,r.h)*.012)))}),X.addEventListener(`pointerleave`,()=>{r.pointer=null});let S=document.querySelector(`#sound`);S?.addEventListener(`click`,async()=>{let e=await i.toggle();S.setAttribute(`aria-pressed`,String(e))}),h(),_()}