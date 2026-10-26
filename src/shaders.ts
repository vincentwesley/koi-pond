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

/** Ripple state codec + height sampler. Float path: RG16F (cur, prev). PACKED path: RGBA8 holding two 16-bit fixed-point
 * values (cur in RG, prev in BA), NEAREST sampled, so ripH does the bilinear filtering by hand. Needs "#define PACKED" first. */
const RIP = `
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
`;

/** Switch a shader to the packed RGBA8 ripple state. */
export const packed = (src: string): string => src.replace("#version 300 es\n", "#version 300 es\n#define PACKED\n");

/** Ripple step: cur = height now, prev = height last step. Drops are (cellX, cellY, radiusCells, strength). */
export const SIM_FS = `${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uState; uniform vec2 uTexel; uniform vec2 uSize; uniform float uDamp;
uniform vec4 uDrops[32]; uniform int uDropN;
${RIP}
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
}`;

/** Shared pond shape: depth 0 at the shore, 1 in the middle; ice grows inward from the shore with uIce. Needs NOISE. */
const POND = `
float pondDepth(vec2 uv){
  vec2 q = (uv - 0.5) * 2.0;
  float e = pow(pow(abs(q.x), 3.0) + pow(abs(q.y), 3.0), 1.0 / 3.0) + 0.16 * (fbm(uv * vec2(5.0, 3.5) + 4.0) - 0.5);
  return 1.0 - smoothstep(0.25, 1.12, e);
}
`;

/** Static pond floor (rendered once per resize): neutral sand albedo, ripples, river stones, silt. Mood tint is applied per frame. */
export const FLOOR_FS = `${H}
in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uScale;
${NOISE}
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
}`;

/** Per-frame floor: static floor + animated caustics, sharpened where ripples focus light. */
export const UNDER_FS = `${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uFloor; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform float uScale;
uniform vec3 uLight; uniform vec3 uTint; uniform vec4 uK; // uK = ambient, caustics, moon, ice
${NOISE}${RIP}${POND}
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
}`;

/** Instanced-free sprite/ribbon geometry: fish, fins, shadows, plants, pads, flowers, petals. */
export const SPRITE_VS = `${H}
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec2 aCenter;
layout(location = 3) in vec4 aK;
uniform vec2 uRes; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform float uSurface;
out vec2 vUv; out vec4 vK; out vec2 vC; out float vH;
${RIP}
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
}`;

export const SPRITE_FS = `${H}
in vec2 vUv; in vec4 vK; in vec2 vC; in float vH; out vec4 o;
uniform vec3 uWater; uniform float uTime; uniform vec3 uLight; uniform vec4 uK; // uK.x = ambient
${NOISE}
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
  float w = 0.22 + 0.78 * x;
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
}`;

/** Water surface: refract the underwater layer through the ripple normal, add sky and sun glints. */
export const WATER_FS = `${H}
in vec2 vUv; out vec4 o;
uniform sampler2D uUnder; uniform sampler2D uRip; uniform vec2 uSimTexel; uniform vec2 uRes; uniform float uTime; uniform vec3 uWater; uniform float uScale;
uniform vec3 uLight; uniform vec3 uSky; uniform vec4 uK; // uK = ambient, caustics (sun), moon, ice
${NOISE}${RIP}${POND}
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
}`;

export const BRIGHT_FS = `${H}
in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform float uThr;
void main(){ vec3 c = texture(uSrc, vUv).rgb; o = vec4(max(c - uThr, 0.0), 1.0); }`;

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
uniform sampler2D uScene; uniform sampler2D uBloom; uniform vec2 uPx; uniform float uTime; uniform float uBloomG; uniform vec3 uLight;
${NOISE}
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
}`;
