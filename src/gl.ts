// Minimal WebGL2 helpers: programs with cached uniforms, render targets.

export interface Prog {
  p: WebGLProgram;
  u: (name: string) => WebGLUniformLocation | null;
}

export function program(gl: WebGL2RenderingContext, vs: string, fs: string): Prog {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  const cache = new Map<string, WebGLUniformLocation | null>();
  return {
    p,
    u: (n) => {
      if (!cache.has(n)) cache.set(n, gl.getUniformLocation(p, n));
      return cache.get(n)!;
    },
  };
}

export interface Target { fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number }

/** True if RGBA16F is really renderable (checked by framebuffer completeness, not extension presence). */
export function halfFloatTargets(gl: WebGL2RenderingContext): boolean {
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return false;
  const t = target(gl, 4, 4, true);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE && !gl.getError();
  freeTarget(gl, t);
  return ok;
}

/** `nearest` for the packed ripple state; `clear` is the initial RGBA fill. */
export function target(gl: WebGL2RenderingContext, w: number, h: number, float: boolean, nearest = false, clear: [number, number, number, number] = [0, 0, 0, 1]): Target {
  const tex = gl.createTexture()!;
  const filter = nearest ? gl.NEAREST : gl.LINEAR;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, float ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.clearColor(...clear);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { fb, tex, w, h };
}

export function freeTarget(gl: WebGL2RenderingContext, t: Target | undefined): void {
  if (!t) return;
  gl.deleteFramebuffer(t.fb);
  gl.deleteTexture(t.tex);
}
