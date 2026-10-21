// All GLSL for the pond. Written from scratch for this project.

const H = `#version 300 es
precision highp float;
`;

const NOISE = `
float hash12(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 hash22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`;

/** Fullscreen triangle, no buffers. vUv (0,0) = bottom-left. */
export const FS_VS = `${H}
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/** Ripple step: r = height now, g = height last step. Drops are (cellX, cellY, radiusCells, strength). */
export const SIM_FS = `${H}
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
}`;

/** Static pond floor (rendered once per resize): pebbles, silt, moss, depth tint. */
export const FLOOR_FS = `${H}
in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uScale;
${NOISE}
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
}`;

/** Per-frame floor: static floor + animated caustics, sharpened where ripples focus light. */
export const UNDER_FS = `${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uFloor; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform float uScale;
${NOISE}
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
}`;

/** Instanced-free sprite/ribbon geometry: fish, fins, shadows, plants, pads, flowers, petals. */
export const SPRITE_VS = `${H}
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
}`;

export const SPRITE_FS = `${H}
in vec2 vUv; in vec4 vK; in vec2 vC; in float vH; out vec4 o;
uniform vec3 uWater; uniform float uTime;
${NOISE}
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
}`;

/** Water surface: refract the underwater layer through the ripple normal, add sky and sun glints. */
export const WATER_FS = `${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uUnder; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform vec3 uWater; uniform float uScale;
${NOISE}
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
}`;

export const BRIGHT_FS = `${H}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc;
void main(){ vec3 c = texture(uSrc, vUv).rgb; o = vec4(max(c - 0.75, 0.0), 1.0); }`;

export const BLUR_FS = `${H}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform vec2 uDir;
void main(){
  vec3 c = texture(uSrc, vUv).rgb * 0.227;
  c += (texture(uSrc, vUv + uDir * 1.38).rgb + texture(uSrc, vUv - uDir * 1.38).rgb) * 0.316;
  c += (texture(uSrc, vUv + uDir * 3.23).rgb + texture(uSrc, vUv - uDir * 3.23).rgb) * 0.07;
  o = vec4(c, 1.0);
}`;

export const FINAL_FS = `${H}
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
}`;
