import * as THREE from "three";

export interface LittoralSceneCallbacks {
  onTimeChange?: (minutes: number, formattedTime: string, formattedDate: string) => void;
  onInteraction?: () => void;
  onError?: (error: unknown) => void;
}

export interface LittoralSceneController {
  setHour: (minutes: number) => void;
  setLive: (live: boolean) => void;
  setPlaying: (playing: boolean) => void;
  getTrackGradient: () => string;
  destroy: () => void;
}

/* ================= Math & Utility Helpers ================= */
function createColor(hex: string | number) {
  return new THREE.Color(hex);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function rng(a: number) {
  let seed = a;
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(dx: number, dy: number, dz: number, s: number) {
  return Math.exp(-(dx * dx + dy * dy + dz * dz) / (2 * s * s));
}

function sandBase(z: number) {
  if (z >= 0) return -0.52 + 0.16 * Math.min(z, 3) + 0.06 * Math.max(0, Math.min(z - 3, 12)) + 0.008 * Math.max(z - 15, 0);
  return -0.52 + 0.1 * Math.max(z, -14);
}

function sandH(x: number, z: number) {
  let h = sandBase(z);
  const u = smoothstep(1.5, 8, z);
  const dn = smoothstep(22, 80, z);
  h += u * (0.03 * Math.sin(x * 0.35 + z * 0.21) + 0.02 * Math.sin(x * 0.9 - z * 0.4));
  h += dn * (1.4 + 0.9 * Math.sin(x * 0.021 + 1.0) + 0.7 * Math.sin(x * 0.049 + z * 0.031 + 2.0) + 0.4 * Math.sin(z * 0.07 + x * 0.013));
  return h;
}

/* ================= 24-hour keyframes ================= */
function K(
  h: number,
  top: string,
  mid: string,
  hor: string,
  sun: string,
  glow: string,
  anti: string,
  sh: string,
  dp: string,
  cs: string,
  cm: string,
  cl: string,
  foam: string,
  hs: string,
  hg: string,
  ga: number,
  hi: number,
  si: number,
  st: number
) {
  return {
    h,
    top: createColor(top),
    mid: createColor(mid),
    hor: createColor(hor),
    sun: createColor(sun),
    glow: createColor(glow),
    anti: createColor(anti),
    sh: createColor(sh),
    dp: createColor(dp),
    cs: createColor(cs),
    cm: createColor(cm),
    cl: createColor(cl),
    foam: createColor(foam),
    hs: createColor(hs),
    hg: createColor(hg),
    ga,
    hi,
    si,
    st,
  };
}

const NIGHT = [
  "#01030a",
  "#040a1a",
  "#0a1630",
  "#000000",
  "#1a2a55",
  "#101a3a",
  "#0a2a3a",
  "#030a1a",
  "#05080f",
  "#101828",
  "#26324f",
  "#6f86a8",
  "#2c4272",
  "#050c1c",
];

const keys = [
  K(0, NIGHT[0], NIGHT[1], NIGHT[2], NIGHT[3], NIGHT[4], NIGHT[5], NIGHT[6], NIGHT[7], NIGHT[8], NIGHT[9], NIGHT[10], NIGHT[11], NIGHT[12], NIGHT[13], 0, 0.55, 0, 1),
  K(4.7, "#02061a", "#081230", "#142444", "#000000", "#2a3a6a", "#18284a", "#0c3040", "#041428", "#080e1c", "#141e34", "#303c5c", "#7890b0", "#324b80", "#08102a", 0.05, 0.58, 0, 0.95),
  K(5.2, "#0c1a46", "#243b78", "#7a6a9a", "#ffb080", "#d48a9a", "#4a4a8a", "#16405a", "#0a2050", "#2a3560", "#5a5a90", "#a08aa8", "#b8b8d8", "#5a70b0", "#1a2a50", 0.55, 0.7, 0, 0.45),
  K(5.6, "#1d3f84", "#5a7cb4", "#f4a98a", "#ffc090", "#ff9a70", "#7a6aa8", "#2c6e86", "#16356e", "#506498", "#e0a8a0", "#ffd0b0", "#ffe0d0", "#9ab0d8", "#3a4a78", 1, 0.85, 0.2, 0.1),
  K(5.95, "#2a5ca8", "#6f9fd2", "#ffc896", "#ffd8a8", "#ffa868", "#a08ab8", "#4a9aa6", "#1c4486", "#6a80b8", "#ffd0a8", "#fff0d8", "#fff0e0", "#bcd0ea", "#4a6aa0", 1, 1.0, 0.75, 0),
  K(6.8, "#2468c4", "#58a6e8", "#f0e4d4", "#fff0d0", "#ffd8a8", "#a0b8e0", "#58c8d8", "#0f50a8", "#84a8da", "#f2e4d4", "#fffaf0", "#fffaf0", "#c8dcf4", "#4a78b8", 0.35, 1.05, 1.0, 0),
  K(8.5, "#1c68cf", "#44a0ea", "#c8e8f6", "#fff6e0", "#ffe8c8", "#b0c8e8", "#62d4e2", "#0e56b2", "#86acde", "#e6eff9", "#ffffff", "#ffffff", "#cfe4ff", "#3b73b8", 0.1, 1.05, 1.05, 0),
  K(12, "#1862cc", "#3a9ae8", "#bfe6f6", "#fff8ea", "#fff0d8", "#b0c8e8", "#5cd6e6", "#0c52b0", "#8cb2e2", "#e8f2fc", "#ffffff", "#ffffff", "#cfe4ff", "#3b73b8", 0, 1.1, 1.15, 0),
  K(15.5, "#1d65c4", "#4aa2e6", "#cfe6f2", "#fff2d8", "#ffe0b0", "#b0c8e8", "#63d6e4", "#0f58b5", "#86adde", "#e4eef9", "#ffffff", "#ffffff", "#cfe4ff", "#3b73b8", 0.1, 1.05, 1.05, 0),
  K(17, "#2559b0", "#5aa4e0", "#ffe2bc", "#ffe0b0", "#ffc890", "#a8b8e0", "#78dcd6", "#1648a0", "#7c98d0", "#ffe2c4", "#fff4dc", "#fff4e4", "#d8e0f0", "#4a70b0", 0.45, 1.0, 0.95, 0),
  K(17.75, "#2a509a", "#6a90d0", "#ffc88a", "#ffc890", "#ffa860", "#a090c0", "#84dcd0", "#173f98", "#7488cc", "#ffd0a0", "#ffecd0", "#fff0dc", "#e0d8e8", "#4a64a8", 0.85, 0.9, 0.8, 0),
  K(18.1, "#2a3a82", "#8878b8", "#ff9a68", "#ff9c60", "#ff7a48", "#8a6aa8", "#6a9eb0", "#1c3a88", "#5a62a0", "#f0a090", "#ffd0a0", "#ffe0c8", "#c8b0c8", "#3a4a88", 1, 0.75, 0.35, 0),
  K(18.4, "#1a2a68", "#4a4a90", "#d0687a", "#ff7048", "#e0607a", "#5a4a98", "#2e5a78", "#142e6a", "#3a4478", "#9a6a92", "#e0907a", "#d0b0c0", "#7a80b8", "#2a3a70", 0.85, 0.7, 0, 0.15),
  K(18.8, "#0a1450", "#202e6a", "#4a4a86", "#000000", "#6a5a9a", "#3a3a7a", "#17405c", "#0a2050", "#222c58", "#3a4272", "#6a6a98", "#9aa8c8", "#4a5c98", "#1a2a58", 0.35, 0.6, 0, 0.65),
  K(19.3, "#030820", "#07122e", "#0e1c3a", "#000000", "#1a2a55", "#101a3a", "#0b2f42", "#041024", "#06101e", "#121c34", "#2c3a5c", "#7a90b0", "#2e4678", "#06102a", 0.05, 0.55, 0, 1),
  K(24, NIGHT[0], NIGHT[1], NIGHT[2], NIGHT[3], NIGHT[4], NIGHT[5], NIGHT[6], NIGHT[7], NIGHT[8], NIGHT[9], NIGHT[10], NIGHT[11], NIGHT[12], NIGHT[13], 0, 0.55, 0, 1),
];

const colorNames = ["top", "mid", "hor", "sun", "glow", "anti", "sh", "dp", "cs", "cm", "cl", "foam", "hs", "hg"] as const;
type ColorKey = (typeof colorNames)[number];

const S: Record<ColorKey, THREE.Color> = {} as Record<ColorKey, THREE.Color>;
colorNames.forEach((n) => {
  S[n] = new THREE.Color();
});

const N = { ga: 0, hi: 1, si: 1, st: 0 };

function sample(h: number) {
  let i = 0;
  while (i < keys.length - 2 && h >= keys[i + 1].h) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = Math.max(0, Math.min(1, (h - a.h) / (b.h - a.h)));
  colorNames.forEach((n) => {
    S[n].copy(a[n]).lerp(b[n], t);
  });
  N.ga = lerp(a.ga, b.ga, t);
  N.hi = lerp(a.hi, b.hi, t);
  N.si = lerp(a.si, b.si, t);
  N.st = lerp(a.st, b.st, t);
}

/* ================= Shared Shaders ================= */
const COMMON = `
uniform vec3 uTop, uMid, uHor, uGlow, uAnti, uSunCol, uSun, uMoon, uMoonCol;
uniform float uTime, uStars, uGlowAmt;
vec3 skyBase(vec3 d){
  float h = clamp(d.y, 0.0, 1.0);
  float t = pow(h, 0.5);
  vec3 c = mix(uHor, uMid, smoothstep(0.0, 0.5, t));
  c = mix(c, uTop, smoothstep(0.35, 1.0, t));
  vec2 hd = normalize(d.xz + vec2(0.00001));
  vec2 sd = normalize(uSun.xz + vec2(0.00001));
  float az = dot(hd, sd) * 0.5 + 0.5;
  float low = 1.0 - smoothstep(0.0, 0.55, h);
  c = mix(c, uGlow, clamp(uGlowAmt * pow(az, 2.5) * low, 0.0, 1.0));
  c = mix(c, uAnti, clamp(uGlowAmt * 0.35 * pow(1.0 - az, 2.0) * (1.0 - smoothstep(0.0, 0.35, h)), 0.0, 1.0));
  float s = max(dot(d, normalize(uSun)), 0.0);
  float sv = smoothstep(-0.12, 0.05, uSun.y);
  c += uSunCol * (pow(s, 6.0) * 0.14 + pow(s, 40.0) * 0.3) * sv;
  c += uMoonCol * pow(max(dot(d, normalize(uMoon)), 0.0), 12.0) * 0.07;
  return c;
}
`;

const NOISE2 = `
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm2(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vn(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
`;

const NOISE3 = `
float hash31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash31(i), hash31(i + vec3(1.0, 0.0, 0.0)), f.x), mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x), mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }
float fbm3(vec3 p){ return vn3(p) * 0.55 + vn3(p * 2.1) * 0.3 + vn3(p * 4.3) * 0.15; }
`;

/* ================= Littoral Scene Initializer ================= */
export function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl2") ||
          testCanvas.getContext("webgl") ||
          testCanvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function initLittoralScene(
  canvas: HTMLCanvasElement,
  callbacks?: LittoralSceneCallbacks
): LittoralSceneController | null {
  if (!isWebGLSupported()) {
    callbacks?.onError?.(new Error("WebGL is not supported in this browser"));
    return null;
  }

  const gl =
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");

  if (!gl) {
    callbacks?.onError?.(new Error("Failed to get WebGL rendering context"));
    return null;
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl as WebGLRenderingContext,
      antialias: true,
    });
  } catch (err) {
    callbacks?.onError?.(err);
    return null;
  }

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(PR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1600);

  const U = {
    uTop: { value: new THREE.Color() },
    uMid: { value: new THREE.Color() },
    uHor: { value: new THREE.Color() },
    uGlow: { value: new THREE.Color() },
    uAnti: { value: new THREE.Color() },
    uSunCol: { value: new THREE.Color() },
    uSun: { value: new THREE.Vector3(0, 1, 0) },
    uMoon: { value: new THREE.Vector3(0, 1, 0) },
    uMoonCol: { value: new THREE.Color() },
    uTime: { value: 0 },
    uStars: { value: 0 },
    uGlowAmt: { value: 0 },
    uCl: { value: new THREE.Color() },
  };

  function uni(extra?: Record<string, { value: unknown }>) {
    return Object.assign({}, U, extra || {});
  }

  /* Sky Dome */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: uni(),
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      ${COMMON}
      ${NOISE2}
      varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        vec3 c = skyBase(d);
        float s = dot(d, normalize(uSun));
        float sv = smoothstep(-0.02, 0.04, uSun.y) * step(0.0, d.y);
        c = mix(c, uSunCol * 1.3 + vec3(0.12), smoothstep(0.99955, 0.99975, s) * sv);
        if (d.y > 0.0) {
          vec2 q = d.xz / (d.y + 0.14); q *= vec2(0.8, 2.2); q.x += uTime * 0.012;
          float f = fbm2(q * 1.4 + vec2(3.0, 1.0));
          float cov = smoothstep(0.5, 0.85, f) * smoothstep(0.04, 0.3, d.y) * 0.5 * (1.0 - uStars * 0.85);
          c = mix(c, uCl * 1.05, cov);
        }
        gl_FragColor = vec4(c, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 20), skyMat);
  sky.renderOrder = -10;
  scene.add(sky);

  /* Stars */
  const starGroup = new THREE.Group();
  scene.add(starGroup);
  (function buildStars() {
    const N1 = 1500;
    const N2 = 5200;
    const NT = N1 + N2;
    const pos = new Float32Array(NT * 3);
    const size = new Float32Array(NT);
    const mag = new Float32Array(NT);
    const tint = new Float32Array(NT * 3);
    const rndArr = new Float32Array(NT * 2);
    const r = rng(2026);
    const tints = [
      [0.75, 0.85, 1.0],
      [1, 1, 1],
      [1, 0.92, 0.8],
      [1, 0.82, 0.7],
    ];
    let i = 0;
    for (i = 0; i < N1; i++) {
      const z = r() * 2 - 1;
      const a = r() * Math.PI * 2;
      const s = Math.sqrt(1 - z * z);
      const m = Math.pow(r(), 5);
      pos[i * 3] = s * Math.cos(a) * 850;
      pos[i * 3 + 1] = z * 850;
      pos[i * 3 + 2] = s * Math.sin(a) * 850;
      mag[i] = 0.35 + 0.65 * m;
      size[i] = 1.2 + 2.4 * m;
      const tc = tints[Math.floor(r() * 4)];
      tint[i * 3] = tc[0];
      tint[i * 3 + 1] = tc[1];
      tint[i * 3 + 2] = tc[2];
    }
    const nM = new THREE.Vector3(0.35, 0.8, 0.5).normalize();
    const e1 = new THREE.Vector3(1, 0, 0).cross(nM).normalize();
    const e2 = nM.clone().cross(e1);
    const v = new THREE.Vector3();
    for (; i < NT; i++) {
      const th = r() * Math.PI * 2;
      const g = (r() + r() + r() - 1.5) * 0.35;
      v.copy(e1).multiplyScalar(Math.cos(th)).addScaledVector(e2, Math.sin(th)).addScaledVector(nM, g).normalize();
      pos[i * 3] = v.x * 850;
      pos[i * 3 + 1] = v.y * 850;
      pos[i * 3 + 2] = v.z * 850;
      mag[i] = 0.12 + 0.2 * r();
      size[i] = 1.0 + 0.7 * r();
      tint[i * 3] = 0.8 + 0.2 * r();
      tint[i * 3 + 1] = 0.85 + 0.1 * r();
      tint[i * 3 + 2] = 1.0;
    }
    for (i = 0; i < NT; i++) {
      rndArr[i * 2] = r();
      rndArr[i * 2 + 1] = r();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aMag", new THREE.BufferAttribute(mag, 1));
    geo.setAttribute("aTint", new THREE.BufferAttribute(tint, 3));
    geo.setAttribute("aRnd", new THREE.BufferAttribute(rndArr, 2));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: U.uTime, uStars: U.uStars, uPx: { value: PR } },
      vertexShader: `
        attribute float aSize; attribute float aMag; attribute vec3 aTint; attribute vec2 aRnd;
        uniform float uTime, uPx, uStars; varying vec3 vCol; varying float vY;
        void main(){
          vec4 w = modelMatrix * vec4(position, 1.0);
          vY = w.y / length(w.xyz);
          float tw = 0.8 + 0.2 * sin(uTime * (1.0 + aRnd.x * 2.0) + aRnd.y * 6.28);
          vCol = aTint * aMag * tw * uStars;
          gl_PointSize = aSize * uPx;
          gl_Position = projectionMatrix * viewMatrix * w;
        }
      `,
      fragmentShader: `
        varying vec3 vCol; varying float vY;
        void main(){
          if (vY < 0.0) discard;
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.05, d) * smoothstep(0.0, 0.1, vY);
          gl_FragColor = vec4(vCol * a, 1.0);
        }
      `,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    pts.renderOrder = -8;
    starGroup.add(pts);
  })();

  /* Moon */
  const moonU = { uCol: { value: new THREE.Color(0.78, 0.86, 1.0) }, uAmt: { value: 0 }, uPhase: { value: 0.95 } };
  const moon = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: moonU,
      vertexShader: `varying vec2 vUv; varying float vWy; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vWy = w.y; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `
        ${NOISE2}
        uniform vec3 uCol; uniform float uAmt, uPhase; varying vec2 vUv; varying float vWy;
        void main(){
          if (vWy < 0.0) discard;
          vec2 p = (vUv - 0.5) * 2.0; float r = length(p);
          vec2 q = p / 0.22; float rq = dot(q, q);
          float disc = 1.0 - smoothstep(0.97, 1.0, sqrt(rq));
          float z = sqrt(max(1.0 - rq, 0.0));
          vec3 n = vec3(q, z);
          vec3 L = normalize(vec3(sin(uPhase), 0.18, cos(uPhase)));
          float lit = smoothstep(-0.04, 0.08, dot(n, L));
          float m = vn(q * 2.6) * 0.5 + vn(q * 6.0) * 0.3 + vn(q * 14.0) * 0.2;
          vec3 surf = mix(vec3(0.55, 0.58, 0.66), vec3(0.96, 0.94, 0.88), smoothstep(0.38, 0.62, m));
          surf *= 0.75 + 0.25 * z;
          vec3 body = surf * lit + vec3(0.035, 0.05, 0.09) * (1.0 - lit);
          float glow = exp(-r * r * 14.0) * 0.5 + exp(-r * r * 3.0) * 0.08;
          vec3 col = body * disc * 1.1 + uCol * glow;
          gl_FragColor = vec4(col * uAmt, 1.0);
        }
      `,
    })
  );
  moon.renderOrder = -7;
  scene.add(moon);

  /* Far Lights */
  const dotTex = (function () {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const x = c.getContext("2d");
    if (x) {
      const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(c);
  })();

  const farLights = (function () {
    const r = rng(77);
    const n = 26;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const x = (r() - 0.5) * 520;
      p[i * 3] = x;
      p[i * 3 + 1] = 0.35 + r() * 0.7;
      p[i * 3 + 2] = -(300 + r() * 20) + Math.abs(x) * 0.02;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const m = new THREE.PointsMaterial({
      size: 4,
      sizeAttenuation: false,
      map: dotTex,
      color: 0xffd7a0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    pts.renderOrder = -6;
    scene.add(pts);
    return pts;
  })();

  /* Ocean */
  const oceanMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: uni({
      uShallow: { value: new THREE.Color() },
      uDeep: { value: new THREE.Color() },
      uFoam: { value: new THREE.Color() },
    }),
    vertexShader: `
      uniform float uTime; varying vec3 vWorld; varying float vH;
      float waveH(vec2 p, float t){ return sin(p.x*0.22+t*0.5)*0.10 + sin(p.y*0.31-t*0.9)*0.14 + sin((p.x*0.6+p.y*0.8)*0.4-t*1.2)*0.07; }
      void main(){
        vec3 p = position; float h = waveH(p.xz, uTime); p.y += h; vH = h;
        vec4 w = modelMatrix * vec4(p, 1.0); vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      ${COMMON}
      ${NOISE2}
      uniform vec3 uShallow, uDeep, uFoam; varying vec3 vWorld; varying float vH;
      float sandBase(float z){ return z >= 0.0 ? -0.52 + 0.16*min(z,3.0) + 0.06*clamp(z-3.0,0.0,12.0) + 0.008*max(z-15.0,0.0) : -0.52 + 0.10*max(z,-14.0); }
      float hf(vec2 p){ float t = uTime;
        return sin(p.x*0.22+t*0.5)*0.10 + sin(p.y*0.31-t*0.9)*0.14 + sin((p.x*0.6+p.y*0.8)*0.4-t*1.2)*0.07
             + sin(p.x*1.7+p.y*1.1+t*1.3)*0.030 + sin(p.x*2.3-p.y*2.9-t*1.7)*0.020 + sin(p.y*4.1-t*2.3+p.x*0.7)*0.012; }
      void main(){
        vec2 p = vWorld.xz; float e = 0.06;
        float h0 = hf(p), hx = hf(p + vec2(e, 0.0)), hz = hf(p + vec2(0.0, e));
        vec3 toCam = cameraPosition - vWorld; float camD = length(toCam); vec3 v = toCam / camD;
        float soft = mix(1.6, 0.3, smoothstep(40.0, 220.0, camD));
        vec3 n = normalize(vec3((h0 - hx) / e * soft, 1.0, (h0 - hz) / e * soft));
        float ndv = max(dot(n, v), 0.0);
        float F = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
        float d = length(p);
        float depth = vWorld.y - sandBase(p.y);
        if (depth <= 0.0) discard;
        vec3 water = mix(uShallow, uDeep, smoothstep(1.5, 45.0, d));
        float crest = smoothstep(0.05, 0.32, vH);
        float sunLum = dot(uSunCol, vec3(0.333));
        water += uShallow * crest * 0.45 * sunLum;
        vec3 r = reflect(-v, n); r.y = abs(r.y);
        vec3 refl = skyBase(normalize(r));
        vec3 col = mix(water, refl, F);
        float sv = smoothstep(-0.02, 0.06, uSun.y);
        float s = max(dot(r, normalize(uSun)), 0.0);
        col += uSunCol * (pow(s, 1500.0) * 6.0 + pow(s, 150.0) * 0.7 + pow(s, 18.0) * 0.12) * sv;
        float sm = max(dot(r, normalize(uMoon)), 0.0);
        col += uMoonCol * (pow(sm, 1200.0) * 6.0 + pow(sm, 120.0) * 0.8 + pow(sm, 14.0) * 0.15);
        float g = sin(vWorld.x*3.7+uTime*1.3) * sin(vWorld.z*4.9-uTime*1.9) * sin((vWorld.x-vWorld.z)*6.1+uTime*2.3);
        col += vec3(0.5, 0.62, 1.0) * uStars * smoothstep(0.7, 0.9, g) * 0.22 * F;

        /* foam */
        float nf = vn(p * 2.2 + uTime * 0.15) * 0.6 + vn(p * 5.1 - uTime * 0.2) * 0.4;
        float wv = sin(p.y*0.31 - uTime*0.9 + sin(p.x*0.2)*0.8);
        float broken = sin(p.x*0.9+uTime*0.2)*sin(p.y*0.7) + 0.5*sin(p.x*2.3-p.y*1.7);
        float foamA = smoothstep(0.9, 0.95, wv) * smoothstep(-0.25, 0.2, broken) * smoothstep(0.3, 0.6, nf);
        float wv2 = sin((p.x*0.6+p.y*0.8)*0.4 - uTime*1.2);
        float foamB = smoothstep(0.92, 0.96, wv2) * smoothstep(0.0, 0.5, sin(p.x*1.9+p.y*1.3)) * smoothstep(0.3, 0.6, nf);
        float foam = max(foamA, foamB * 0.8);
        float rr = length(p);
        float x = fract(rr * 0.9 - uTime * 0.25);
        float ring = (1.0 - smoothstep(0.0, 0.06, abs(x - 0.5))) * (1.0 - smoothstep(0.5, 4.5, rr)) * smoothstep(0.35, 0.6, rr);
        float collar = (1.0 - smoothstep(0.26, 0.42, rr)) * (0.65 + 0.35 * sin(atan(p.y, p.x) * 7.0 + uTime * 1.5));
        foam = max(foam, max(ring * 0.85, collar));
        float edge = 1.0 - smoothstep(0.0, 0.17, depth);
        float lace = edge * (0.45 + 0.55 * vn(p * 7.0 + vec2(uTime * 0.35, 0.0)));
        foam = max(foam, lace);
        col = mix(col, uFoam, clamp(foam, 0.0, 1.0) * 0.9);
        vec3 fogCol = skyBase(normalize(vec3(-v.x, 0.0, -v.z) + vec3(0.0001, 0.0, 0.0)));
        col = mix(col, fogCol, smoothstep(150.0, 390.0, camD));
        float alpha = max(smoothstep(0.0, 0.22, depth), edge * 0.75 * smoothstep(0.0, 0.02, depth));
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
  const oceanGeo = new THREE.PlaneGeometry(800, 800, 400, 400);
  oceanGeo.rotateX(-Math.PI / 2);
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.frustumCulled = false;
  ocean.position.y = -0.49;
  ocean.renderOrder = -9;
  scene.add(ocean);

  /* Sand Beach */
  const sandMat = new THREE.ShaderMaterial({
    uniforms: uni({
      uHs: { value: new THREE.Color() },
      uHg: { value: new THREE.Color() },
      uSunL: { value: new THREE.Color() },
      uMoonL: { value: new THREE.Color(0x9db6e8) },
      uHi: { value: 1 },
      uSunI: { value: 1 },
      uMoonI: { value: 0 },
    }),
    vertexShader: `varying vec3 vWorld, vN; void main(){ vWorld = position; vN = normal; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      ${COMMON}
      ${NOISE2}
      uniform vec3 uHs, uHg, uSunL, uMoonL; uniform float uHi, uSunI, uMoonI; varying vec3 vWorld, vN;
      const float WL = -0.49;
      float wvH(vec2 p, float t){ return sin(p.x*0.22+t*0.5)*0.10 + sin(p.y*0.31-t*0.9)*0.14 + sin((p.x*0.6+p.y*0.8)*0.4-t*1.2)*0.07; }
      float segDist(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0); return length(pa - ba * h); }
      void main(){
        vec2 p = vWorld.xz;
        vec3 toCam = cameraPosition - vWorld; float camD = length(toCam); vec3 v = toCam / camD;
        float near = 1.0 - smoothstep(8.0, 55.0, camD);
        float gA = vn(p * 24.0), gB = vn(p * 24.0 + 31.7);
        float rip = sin(p.y * 6.0 + sin(p.x * 0.8) * 1.4 + vn(p * 1.6) * 5.0);
        vec3 n = normalize(vN + near * vec3((gA - 0.5) * 0.55, 0.0, (gB - 0.5) * 0.55 + rip * 0.05));
        float grain = vn(p * 70.0) * 0.6 + vn(p * 190.0) * 0.4;
        float broad = fbm2(p * 0.12);
        vec3 dry = mix(vec3(0.88, 0.76, 0.56), vec3(0.80, 0.66, 0.46), broad);
        dry *= 0.93 + 0.14 * mix(0.5, grain, near);
        float swash = WL + wvH(p, uTime) - vWorld.y;
        float wetBand = 1.0 - smoothstep(0.08, 0.40, vWorld.y - WL);
        float wet = clamp(max(wetBand * 0.9, smoothstep(-0.25, 0.02, swash)), 0.0, 1.0);
        vec3 alb = mix(dry, dry * vec3(0.50, 0.46, 0.43), wet);
        vec3 sd = normalize(uSun);
        vec2 tip = -sd.xz / max(sd.y, 0.08) * 1.55; tip *= min(1.0, 12.0 / max(length(tip), 0.001));
        float sh = 1.0 - smoothstep(0.10, 0.30, segDist(p, vec2(0.0), tip));
        float sunUp = smoothstep(-0.02, 0.08, sd.y);
        vec3 hemiC = mix(uHg, uHs, n.y * 0.5 + 0.5) * uHi;
        vec3 md = normalize(uMoon);
        vec3 light = hemiC + uSunL * uSunI * max(dot(n, sd), 0.0) * (1.0 - 0.8 * sh) + uMoonL * uMoonI * max(dot(n, md), 0.0);
        vec3 col = alb * light;
        vec3 r = reflect(-v, n); r.y = abs(r.y);
        vec3 refl = skyBase(normalize(r));
        float F = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
        col = mix(col, refl, F * wet * 0.85);
        col += uSunCol * pow(max(dot(r, sd), 0.0), 80.0) * sunUp * wet * 0.5;
        vec3 fogCol = skyBase(normalize(vec3(-v.x, 0.0, -v.z) + vec3(0.0001, 0.0, 0.0)));
        col = mix(col, fogCol, smoothstep(150.0, 390.0, camD));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  (function buildBeach() {
    function span(arr: number[], a: number, b: number, step: number) {
      const n = Math.round((b - a) / step);
      for (let k = 0; k <= n; k++) arr.push(a + ((b - a) * k) / n);
    }
    function uniq(arr: number[]) {
      arr.sort((a, b) => a - b);
      return arr.filter((q, i) => i === 0 || q - arr[i - 1] > 1e-6);
    }
    let zs: number[] = [];
    let xs: number[] = [];
    span(zs, -14, -1, 0.25);
    span(zs, -1, 4, 0.04);
    span(zs, 4, 15, 0.25);
    span(zs, 15, 60, 1.5);
    span(zs, 60, 400, 8.5);
    span(xs, -400, -60, 20);
    span(xs, -60, -12, 3);
    span(xs, -12, 12, 0.4);
    span(xs, 12, 60, 3);
    span(xs, 60, 400, 20);
    zs = uniq(zs);
    xs = uniq(xs);
    const nx = xs.length;
    const nz = zs.length;
    const pos = new Float32Array(nx * nz * 3);
    const idx: number[] = [];
    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        const o = (j * nx + i) * 3;
        pos[o] = xs[i];
        pos[o + 1] = sandH(xs[i], zs[j]);
        pos[o + 2] = zs[j];
      }
    }
    for (let j = 0; j < nz - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const a = j * nx + i;
        const b = a + 1;
        const c = a + nx;
        const e = c + 1;
        idx.push(a, c, b, b, c, e);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const beach = new THREE.Mesh(g, sandMat);
    beach.frustumCulled = false;
    scene.add(beach);
  })();

  /* Clouds */
  const cloudMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uL: { value: new THREE.Vector3(0, 1, 0) },
      uSunV: { value: new THREE.Vector3(0, 0, -1) },
      uSunVis: { value: 1 },
      uShadow: { value: new THREE.Color() },
      uMid: { value: new THREE.Color() },
      uLit: { value: new THREE.Color() },
      uHor: U.uHor,
      uSunCol: U.uSunCol,
    },
    vertexShader: `
      attribute vec3 aSeed; varying vec3 vN, vP; varying float vDepth;
      void main(){ vN = normalize(normalMatrix * normal); vP = position + aSeed; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDepth = -mv.z; gl_Position = projectionMatrix * mv; }
    `,
    fragmentShader: `
      ${NOISE3}
      uniform vec3 uL, uSunV, uShadow, uMid, uLit, uHor, uSunCol; uniform float uSunVis; varying vec3 vN, vP; varying float vDepth;
      void main(){
        vec3 n = normalize(vN);
        float nz = clamp(n.z, 0.0, 1.0);
        float f = fbm3(vP * 1.7);
        float l = dot(n, normalize(uL)) * 0.5 + 0.5 + (f - 0.5) * 0.4;
        vec3 c = mix(uShadow, uMid, smoothstep(0.18, 0.55, l));
        c = mix(c, uLit, smoothstep(0.5, 0.95, l));
        float back = clamp(-uSunV.z, 0.0, 1.0);
        c += uSunCol * pow(1.0 - nz, 2.2) * back * 0.9 * uSunVis;
        c = mix(c, uHor, smoothstep(220.0, 520.0, vDepth) * 0.55);
        float edge = nz + (f - 0.5) * 0.6;
        float a = smoothstep(0.0, 0.45, edge) * 0.95;
        gl_FragColor = vec4(c, a);
      }
    `,
  });

  const sphereGeo = new THREE.SphereGeometry(1, 20, 14);
  function puffGeo(r: () => number) {
    const g = sphereGeo.clone();
    const n = g.attributes.position.count;
    const a = new Float32Array(n * 3);
    const sx = r() * 20;
    const sy = r() * 20;
    const sz = r() * 20;
    for (let i = 0; i < n; i++) {
      a[i * 3] = sx;
      a[i * 3 + 1] = sy;
      a[i * 3 + 2] = sz;
    }
    g.setAttribute("aSeed", new THREE.BufferAttribute(a, 3));
    return g;
  }

  function makeCloud(w: number, h: number, seed: number) {
    const r = rng(seed);
    const g = new THREE.Group();
    const n = Math.round(10 + w / 14);
    for (let i = 0; i < n; i++) {
      const u = (r() - 0.5) * 2;
      const x = u * w * 0.5;
      const prof = Math.pow(1 - Math.abs(u), 0.7);
      const y = r() * h * prof * 0.9;
      const rad = h * (0.22 + 0.3 * r()) * (0.5 + 0.7 * prof);
      const m = new THREE.Mesh(puffGeo(r), cloudMat);
      m.scale.set(rad * 1.15, rad * 0.8, rad);
      m.position.set(x, y + rad * 0.3, (r() - 0.5) * w * 0.18);
      g.add(m);
    }
    for (let i = 0; i < Math.round(w / 18); i++) {
      const m = new THREE.Mesh(puffGeo(r), cloudMat);
      m.scale.set(h * 0.5, h * 0.17, h * 0.42);
      m.position.set((r() - 0.5) * w * 0.9, h * 0.1, (r() - 0.5) * w * 0.12);
      g.add(m);
    }
    return g;
  }

  const clouds: THREE.Group[] = [];
  [
    [95, 18, -270, 170, 62, 11, 0.7],
    [-135, 8, -285, 130, 34, 23, 0.5],
    [-20, 4, -330, 260, 16, 37, 0.35],
    [-70, 62, -150, 100, 26, 41, 0.9],
    [150, 55, -90, 90, 22, 59, 0.8],
    [10, 120, -40, 110, 24, 73, 0.6],
  ].forEach((c) => {
    const g = makeCloud(c[3], c[4], c[5]);
    g.position.set(c[0], c[1], c[2]);
    g.userData.speed = c[6];
    scene.add(g);
    clouds.push(g);
  });

  /* The Character */
  const UP = 0.85;
  const boy = new THREE.Group();
  scene.add(boy);
  const upper = new THREE.Group();
  upper.position.set(0, UP, 0);
  boy.add(upper);

  function windify(mat: THREE.MeshStandardMaterial, amp: number) {
    mat.onBeforeCompile = function (sh) {
      sh.uniforms.uTime = U.uTime;
      sh.uniforms.uAmp = { value: amp };
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aFlex; uniform float uTime; uniform float uAmp;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
float wv = sin(uTime*1.7 + position.y*5.0 + position.x*7.0)*0.5 + sin(uTime*2.9 + position.y*9.0)*0.25 + 0.7;
transformed.z += wv * aFlex * uAmp;
transformed.x += sin(uTime*1.3 + position.y*4.0) * aFlex * uAmp * 0.4;
transformed.y -= wv * aFlex * uAmp * 0.15;`
        );
    };
    mat.customProgramCacheKey = function () {
      return "wind";
    };
  }

  interface RingTubeCtrl {
    p: [number, number, number];
    rx: number;
    rz: number;
  }

  interface RingTubeOptions {
    radial?: number;
    rows?: number;
    ref?: THREE.Vector3;
    capStart?: boolean;
    capEnd?: boolean;
    deform?: (v: THREE.Vector3, t: number, a: number, ca: number, sa: number, P: THREE.Vector3) => void;
    flex?: (v: THREE.Vector3, t: number) => number;
    color?: (v: THREE.Vector3, t: number) => THREE.Color;
  }

  function ringTube(ctrl: RingTubeCtrl[], o?: RingTubeOptions) {
    const opt = o || {};
    const radial = opt.radial || 24;
    const rows = opt.rows || 28;
    const refVec = opt.ref || new THREE.Vector3(0, 0, 1);
    const spine = new THREE.CatmullRomCurve3(
      ctrl.map((c) => new THREE.Vector3(c.p[0], c.p[1], c.p[2])),
      false,
      "catmullrom",
      0.5
    );
    const rad = new THREE.CatmullRomCurve3(
      ctrl.map((c) => new THREE.Vector3(c.rx, c.rz, 0)),
      false,
      "catmullrom",
      0.5
    );
    const pos: number[] = [];
    const col: number[] = [];
    const flex: number[] = [];
    const idx: number[] = [];

    for (let i = 0; i <= rows; i++) {
      const t = i / rows;
      const P = spine.getPoint(t);
      const R = rad.getPoint(t);
      const T = spine.getTangent(t);
      const Svec = new THREE.Vector3().crossVectors(T, refVec).normalize();
      const Bvec = new THREE.Vector3().crossVectors(Svec, T).normalize();
      for (let j = 0; j < radial; j++) {
        const a = (j / radial) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const v = P.clone().addScaledVector(Svec, R.x * ca).addScaledVector(Bvec, R.y * sa);
        if (opt.deform) opt.deform(v, t, a, ca, sa, P);
        pos.push(v.x, v.y, v.z);
        flex.push(opt.flex ? opt.flex(v, t) : 0);
        if (opt.color) {
          const c = opt.color(v, t);
          col.push(c.r, c.g, c.b);
        }
      }
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < radial; j++) {
        const a0 = i * radial + j;
        const b0 = i * radial + ((j + 1) % radial);
        const c0 = (i + 1) * radial + j;
        const d0 = (i + 1) * radial + ((j + 1) % radial);
        idx.push(a0, c0, b0, b0, c0, d0);
      }
    }

    if (opt.capStart || opt.capEnd) {
      ([
        [0, opt.capStart],
        [rows, opt.capEnd],
      ] as [number, boolean | undefined][]).forEach((e) => {
        if (!e[1]) return;
        let cx = 0;
        let cy = 0;
        let cz = 0;
        const base = e[0] * radial;
        for (let j = 0; j < radial; j++) {
          cx += pos[(base + j) * 3];
          cy += pos[(base + j) * 3 + 1];
          cz += pos[(base + j) * 3 + 2];
        }
        const ci = pos.length / 3;
        pos.push(cx / radial, cy / radial, cz / radial);
        flex.push(0);
        if (opt.color) col.push(col[base * 3], col[base * 3 + 1], col[base * 3 + 2]);
        for (let j = 0; j < radial; j++) idx.push(ci, base + j, base + ((j + 1) % radial));
      });
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aFlex", new THREE.Float32BufferAttribute(flex, 1));
    if (opt.color) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  function put(parent: THREE.Group, geo: THREE.BufferGeometry, mat: THREE.Material) {
    if (parent === upper) geo.translate(0, -UP, 0);
    const m = new THREE.Mesh(geo, mat);
    parent.add(m);
    return m;
  }

  const mSkin = new THREE.MeshStandardMaterial({ color: "#cf9a74", roughness: 0.6, metalness: 0 });
  const mJeans = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
  const mCuff = new THREE.MeshStandardMaterial({ color: "#4c668f", roughness: 0.9 });
  const mShirt = new THREE.MeshStandardMaterial({ color: "#eceff2", roughness: 0.93, metalness: 0, side: THREE.DoubleSide });
  const mCollar = new THREE.MeshStandardMaterial({ color: "#dfe3e8", roughness: 0.95 });
  const mHairShell = new THREE.MeshStandardMaterial({ color: "#17110e", roughness: 0.55 });
  const mHairStrand = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, side: THREE.DoubleSide });
  const mEye = new THREE.MeshStandardMaterial({ color: "#e8e3da", roughness: 0.25 });
  const mIris = new THREE.MeshStandardMaterial({ color: "#2a1a12", roughness: 0.2 });
  const mBrow = new THREE.MeshStandardMaterial({ color: "#150f0c", roughness: 0.7 });
  const mLip = new THREE.MeshStandardMaterial({ color: "#b7766a", roughness: 0.5 });
  windify(mShirt, 0.012);
  windify(mHairStrand, 0.006);

  const jc = new THREE.Color();
  function jeansColor(v: THREE.Vector3) {
    const wet = smoothstep(0.34, 0.2, v.y);
    const k = 1 - 0.42 * wet + 0.03 * Math.sin(v.y * 90 + v.x * 30) + 0.02 * Math.sin(v.x * 140);
    return jc.setRGB(0.2 * k, 0.29 * k, 0.43 * k);
  }

  function legDeform(v: THREE.Vector3, t: number, a: number, ca: number, sa: number, P: THREE.Vector3) {
    const dx = v.x - P.x;
    const dz = v.z - P.z;
    const l = Math.hypot(dx, dz) || 1;
    const amt =
      0.003 * Math.sin(v.y * 95) * Math.exp(-Math.pow((v.y - 0.52) / 0.07, 2)) +
      0.003 * Math.sin(v.y * 130 + a * 2) * Math.exp(-Math.pow((v.y - 0.27) / 0.09, 2)) +
      0.0025 * Math.sin(a * 3 + v.y * 14);
    v.x += (dx / l) * amt;
    v.z += (dz / l) * amt;
  }

  function buildLeg(s: number, bend: number) {
    put(
      boy,
      ringTube(
        [
          { p: [s * 0.095, 0.9, 0], rx: 0.1, rz: 0.108 },
          { p: [s * 0.1, 0.7, -0.004 - bend * 0.3], rx: 0.093, rz: 0.097 },
          { p: [s * 0.105, 0.5, -0.012 - bend], rx: 0.07, rz: 0.072 },
          { p: [s * 0.103, 0.34, 0.006 - bend * 0.4], rx: 0.066, rz: 0.068 },
          { p: [s * 0.1, 0.2, 0], rx: 0.062, rz: 0.062 },
        ],
        { rows: 34, radial: 22, deform: legDeform, color: jeansColor }
      ),
      mJeans
    );
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(1, 0.16, 10, 28), mCuff);
    cuff.position.set(s * 0.1, 0.215, 0);
    cuff.rotation.x = Math.PI / 2;
    cuff.scale.set(0.064, 0.064, 0.075);
    boy.add(cuff);
    put(
      boy,
      ringTube(
        [
          { p: [s * 0.1, 0.26, 0], rx: 0.052, rz: 0.054 },
          { p: [s * 0.1, 0.1, 0.008], rx: 0.049, rz: 0.052 },
          { p: [s * 0.1, -0.12, 0], rx: 0.038, rz: 0.04 },
          { p: [s * 0.1, -0.44, -0.012], rx: 0.038, rz: 0.04 },
        ],
        { rows: 18, radial: 16 }
      ),
      mSkin
    );
    const foot = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mSkin);
    foot.position.set(s * 0.1, -0.5, -0.05);
    foot.scale.set(0.044, 0.034, 0.12);
    boy.add(foot);
  }
  buildLeg(1, 0);
  buildLeg(-1, 0.025);

  put(
    boy,
    ringTube(
      [
        { p: [0, 0.68, 0], rx: 0.19, rz: 0.125 },
        { p: [0, 0.82, 0], rx: 0.2, rz: 0.13 },
        { p: [0, 0.97, 0], rx: 0.19, rz: 0.125 },
      ],
      { rows: 12, radial: 28, color: jeansColor }
    ),
    mJeans
  );

  function shirtDeform(v: THREE.Vector3, t: number, a: number, ca: number, sa: number, P: THREE.Vector3) {
    const fl = smoothstep(1.28, 0.8, v.y);
    const dx = v.x - P.x;
    const dz = v.z - P.z;
    const l = Math.hypot(dx, dz) || 1;
    const amt = fl * 0.014 * (Math.sin(a * 7 + t * 5) * 0.6 + Math.sin(a * 13 - t * 8 + 1.3) * 0.4);
    v.x += (dx / l) * amt;
    v.z += (dz / l) * amt;
    v.y -= fl * (0.02 * Math.max(sa, 0) + 0.008 * Math.sin(a * 5));
  }
  put(
    upper,
    ringTube(
      [
        { p: [0, 0.78, 0.005], rx: 0.238, rz: 0.168 },
        { p: [0, 0.86, 0.003], rx: 0.228, rz: 0.158 },
        { p: [0, 1.0, 0], rx: 0.218, rz: 0.148 },
        { p: [0, 1.14, -0.002], rx: 0.216, rz: 0.142 },
        { p: [0, 1.27, -0.006], rx: 0.222, rz: 0.138 },
        { p: [0, 1.35, -0.01], rx: 0.205, rz: 0.122 },
        { p: [0, 1.4, -0.014], rx: 0.15, rz: 0.098 },
        { p: [0, 1.43, -0.016], rx: 0.098, rz: 0.078 },
        { p: [0, 1.452, -0.016], rx: 0.066, rz: 0.062 },
      ],
      { rows: 52, radial: 44, deform: shirtDeform, flex: (v) => smoothstep(1.32, 0.78, v.y) }
    ),
    mShirt
  );

  const collar = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 10, 32), mCollar);
  collar.position.set(0, 1.452 - UP, -0.016);
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(0.066, 0.062, 0.08);
  upper.add(collar);

  put(
    upper,
    ringTube(
      [
        { p: [0, 1.4, 0.0], rx: 0.056, rz: 0.054 },
        { p: [0, 1.47, -0.006], rx: 0.052, rz: 0.05 },
        { p: [0, 1.545, -0.014], rx: 0.05, rz: 0.05 },
      ],
      { rows: 10, radial: 18 }
    ),
    mSkin
  );

  function sleeveDeform(v: THREE.Vector3, t: number, a: number, ca: number, sa: number, P: THREE.Vector3) {
    const dx = v.x - P.x;
    const dz = v.z - P.z;
    const l = Math.hypot(dx, dz) || 1;
    const amt = 0.004 * t * Math.sin(a * 5 + t * 6);
    v.x += (dx / l) * amt;
    v.z += (dz / l) * amt;
  }
  [-1, 1].forEach((s) => {
    put(
      upper,
      ringTube(
        [
          { p: [s * 0.2, 1.36, 0.0], rx: 0.05, rz: 0.05 },
          { p: [s * 0.245, 1.23, 0.03], rx: 0.047, rz: 0.05 },
          { p: [s * 0.29, 1.075, 0.065], rx: 0.04, rz: 0.042 },
          { p: [s * 0.245, 0.92, 0.0], rx: 0.043, rz: 0.042 },
          { p: [s * 0.19, 0.78, -0.05], rx: 0.031, rz: 0.029 },
          { p: [s * 0.15, 0.72, -0.07], rx: 0.03, rz: 0.028 },
        ],
        { rows: 30, radial: 16 }
      ),
      mSkin
    );
    put(
      upper,
      ringTube(
        [
          { p: [s * 0.2, 1.385, 0.0], rx: 0.078, rz: 0.082 },
          { p: [s * 0.238, 1.28, 0.02], rx: 0.088, rz: 0.092 },
          { p: [s * 0.268, 1.17, 0.05], rx: 0.098, rz: 0.098 },
        ],
        { rows: 16, radial: 24, capStart: true, deform: sleeveDeform, flex: (v, t) => 0.3 * t }
      ),
      mShirt
    );
  });

  const HX = 0.078;
  const HY = 0.115;
  const HZ = 0.1;
  function shapeHead(x: number, y: number, z: number, out: THREE.Vector3) {
    const jaw = smoothstep(0.0, -0.9, y);
    let px = x * (1 - 0.32 * jaw);
    const py = y;
    let pz = z * (1 - (z > 0 ? 0.1 : 0.04) * jaw);
    if (z > 0 && y > -0.4) pz *= 1.05;
    pz -= 0.09 * gauss(x, y + 0.9, z + 0.55, 0.35);
    pz -= 0.28 * gauss(x, y + 0.35, z + 0.97, 0.17);
    pz -= 0.08 * gauss(x, y, z + 0.97, 0.12);
    pz -= 0.06 * gauss(x * 0.6, y - 0.14, z + 0.95, 0.3);
    pz += 0.05 * gauss(x, y + 0.64, z + 0.88, 0.2);
    pz -= 0.04 * gauss(x, y + 0.58, z + 0.9, 0.1);
    for (let s = -1; s <= 1; s += 2) {
      pz += 0.07 * gauss(x - s * 0.36, y - 0.02, z + 0.9, 0.17);
      px += s * 0.05 * gauss(x - s * 0.62, y + 0.25, z + 0.65, 0.25);
    }
    return out.set(px * HX, py * HY, pz * HZ);
  }

  const headGeo = (function () {
    const g = new THREE.SphereGeometry(1, 64, 48);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    const unit = new Float32Array(p.array);
    for (let i = 0; i < p.count; i++) {
      shapeHead(unit[i * 3], unit[i * 3 + 1], unit[i * 3 + 2], v);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    g.userData.unit = unit;
    return g;
  })();

  function surf(ux: number, uy: number) {
    return shapeHead(ux, uy, -Math.sqrt(Math.max(0, 1 - ux * ux - uy * uy)), new THREE.Vector3());
  }

  const head = new THREE.Group();
  head.position.set(0, 1.628 - UP, -0.016);
  upper.add(head);
  head.add(new THREE.Mesh(headGeo, mSkin));

  [-1, 1].forEach((s) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 12), mSkin);
    ear.position.set(s * 0.077, -0.004, 0.004);
    ear.scale.set(0.009, 0.027, 0.02);
    ear.rotation.y = s * 0.35;
    head.add(ear);

    const e = surf(s * 0.36, 0.02);
    e.z += 0.0045;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mEye);
    eye.position.copy(e);
    eye.scale.setScalar(0.0105);
    head.add(eye);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), mIris);
    iris.position.set(e.x, e.y, e.z - 0.0068);
    iris.scale.setScalar(0.0066);
    head.add(iris);

    const bp: THREE.Vector3[] = [];
    for (let k = 0; k <= 5; k++) {
      const f = k / 5;
      const q = surf(s * (0.16 + 0.44 * f), 0.26 + 0.05 * Math.sin(f * 2.4));
      q.z -= 0.0015;
      q.y += 0.001;
      bp.push(q);
    }
    head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bp), 14, 0.0024, 6, false), mBrow));
  });

  const lipP = surf(0, -0.6);
  const lip = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mLip);
  lip.position.set(lipP.x, lipP.y, lipP.z + 0.002);
  lip.scale.set(0.017, 0.0045, 0.006);
  head.add(lip);

  function hairMask(x: number, y: number, z: number) {
    if (Math.abs(x) > 0.88 && y < 0.25 && z < 0.35) return false;
    if (z < -0.15) return y > 0.5 - 0.22 * Math.abs(x);
    return y > -0.12 - 0.5 * Math.max(z, 0);
  }

  const shell = (function () {
    const g = headGeo.clone();
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const u = headGeo.userData.unit;
    const ix = g.index ? g.index.array : [];
    const keep: number[] = [];
    for (let i = 0; i < ix.length; i += 3) {
      const a = ix[i];
      const b = ix[i + 1];
      const c = ix[i + 2];
      const cx = (u[a * 3] + u[b * 3] + u[c * 3]) / 3;
      const cy = (u[a * 3 + 1] + u[b * 3 + 1] + u[c * 3 + 1]) / 3;
      const cz = (u[a * 3 + 2] + u[b * 3 + 2] + u[c * 3 + 2]) / 3;
      const l = Math.hypot(cx, cy, cz) || 1;
      if (hairMask(cx / l, cy / l, cz / l)) keep.push(a, b, c);
    }
    for (let i = 0; i < p.count; i++) {
      p.setXYZ(i, p.getX(i) + n.getX(i) * 0.0045, p.getY(i) + n.getY(i) * 0.0045, p.getZ(i) + n.getZ(i) * 0.0045);
    }
    g.setIndex(keep);
    return g;
  })();
  head.add(new THREE.Mesh(shell, mHairShell));

  (function strands() {
    const r = rng(404);
    const pos: number[] = [];
    const nor: number[] = [];
    const col: number[] = [];
    const fx: number[] = [];
    const idx: number[] = [];
    let vc = 0;
    const SEG = 6;
    let count = 0;
    let tries = 0;
    const crown = new THREE.Vector3(0, 1, 0.3).normalize();
    const d0 = new THREE.Vector3();
    const t = new THREE.Vector3();
    const d = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const cr = new THREE.Vector3();
    const N1 = new THREE.Vector3();
    const N2 = new THREE.Vector3();
    const T = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    while (count < 1100 && tries < 40000) {
      tries++;
      const yy = r() * 2 - 1;
      const an = r() * Math.PI * 2;
      const rr = Math.sqrt(1 - yy * yy);
      d0.set(rr * Math.cos(an), yy, rr * Math.sin(an));
      if (!hairMask(d0.x, d0.y, d0.z)) continue;
      t.copy(d0).addScaledVector(crown, -d0.dot(crown));
      if (t.lengthSq() < 1e-4) t.set(1, 0, 0);
      t.normalize();
      const phi = r() - 0.5;
      cr.crossVectors(d0, t);
      t.multiplyScalar(Math.cos(phi)).addScaledVector(cr, Math.sin(phi));
      t.x += 0.25;
      t.addScaledVector(d0, -t.dot(d0)).normalize();
      const len = (d0.y > 0.6 ? 0.05 : d0.z > 0.2 ? 0.034 : 0.024) * (0.8 + 0.5 * r());
      const angTot = len / 0.1;
      const r0 = 0.0028 * (0.8 + 0.5 * r());
      const shade = 0.65 + 0.7 * r();
      const warm = r() < 0.15 ? 1.4 : 1.0;
      const pts: THREE.Vector3[] = [];

      for (let k = 0; k <= SEG; k++) {
        const sk = k / SEG;
        d.copy(d0).addScaledVector(t, sk * angTot);
        d.y -= 0.35 * sk * sk * angTot;
        d.normalize();
        shapeHead(d.x, d.y, d.z, tmp);
        tmp.multiplyScalar(k === 0 ? 0.985 : 1.0 + 0.05 * Math.sin(Math.PI * sk) + 0.012 * sk);
        pts.push(tmp.clone());
      }
      const base = vc;
      for (let k = 0; k <= SEG; k++) {
        T.copy(pts[Math.min(k + 1, SEG)]).sub(pts[Math.max(k - 1, 0)]).normalize();
        N1.crossVectors(T, up);
        if (N1.lengthSq() < 1e-4) N1.set(1, 0, 0);
        N1.normalize();
        N2.crossVectors(T, N1);
        const rad = r0 * (1 - (0.88 * k) / SEG);
        for (let j = 0; j < 3; j++) {
          const aa = j * 2.0944;
          const dx = N1.x * Math.cos(aa) + N2.x * Math.sin(aa);
          const dy = N1.y * Math.cos(aa) + N2.y * Math.sin(aa);
          const dz = N1.z * Math.cos(aa) + N2.z * Math.sin(aa);
          pos.push(pts[k].x + dx * rad, pts[k].y + dy * rad, pts[k].z + dz * rad);
          nor.push(dx, dy, dz);
          col.push(0.09 * shade * warm, 0.067 * shade, 0.055 * shade);
          fx.push(k / SEG);
          vc++;
        }
      }
      for (let k = 0; k < SEG; k++) {
        for (let j = 0; j < 3; j++) {
          const a1 = base + k * 3 + j;
          const b1 = base + k * 3 + ((j + 1) % 3);
          const c1 = base + (k + 1) * 3 + j;
          const e1 = base + (k + 1) * 3 + ((j + 1) % 3);
          idx.push(a1, c1, b1, b1, c1, e1);
        }
      }
      count++;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute("aFlex", new THREE.Float32BufferAttribute(fx, 1));
    g.setIndex(idx);
    head.add(new THREE.Mesh(g, mHairStrand));
  })();

  /* Lights */
  const hemi = new THREE.HemisphereLight(0xcfe4ff, 0x3b73b8, 1.05);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
  const moonLight = new THREE.DirectionalLight(0x9db6e8, 0);
  const fill = new THREE.DirectionalLight(0xdfeaff, 0.55);
  fill.position.set(0.4, 0.7, 1);
  scene.add(hemi, sunLight, moonLight, fill);

  /* Time of Day Logic */
  const sunDir = new THREE.Vector3();
  const moonDir = new THREE.Vector3();
  const cloudL = new THREE.Vector3();

  function bodyDir(h: number, amp: number, out: THREE.Vector3) {
    const hw = ((h % 24) + 24) % 24;
    const el = (Math.sin(((hw - 6) / 24) * Math.PI * 2) * amp * Math.PI) / 180;
    const phi = ((hw - 12) / 6) * 0.5;
    out.set(Math.sin(phi) * Math.cos(el), Math.sin(el), -Math.cos(phi) * Math.cos(el));
  }

  const poleAxis = new THREE.Vector3(0, Math.sin((23.8 * Math.PI) / 180), Math.cos((23.8 * Math.PI) / 180));
  let curMin = 971;
  let isPlaying = false;
  let isLive = true;
  let lastLabel = "";

  function setHour(m: number) {
    curMin = m;
    const h = m / 60;
    sample(h);
    bodyDir(h, 66, sunDir);
    bodyDir(h + 12, 50, moonDir);
    const sunVis = smoothstep(-0.08, 0.05, sunDir.y);
    const moonVis = smoothstep(-0.02, 0.1, moonDir.y);

    U.uTop.value.copy(S.top);
    U.uMid.value.copy(S.mid);
    U.uHor.value.copy(S.hor);
    U.uGlow.value.copy(S.glow);
    U.uAnti.value.copy(S.anti);
    U.uSunCol.value.copy(S.sun);
    U.uSun.value.copy(sunDir);
    U.uMoon.value.copy(moonDir);
    U.uMoonCol.value.set(0.78, 0.86, 1.0).multiplyScalar(N.st * moonVis);
    U.uGlowAmt.value = N.ga;
    U.uStars.value = N.st;
    U.uCl.value.copy(S.cl);

    const ou = oceanMat.uniforms;
    ou.uShallow.value.copy(S.sh);
    ou.uDeep.value.copy(S.dp);
    ou.uFoam.value.copy(S.foam);

    const cu = cloudMat.uniforms;
    cu.uShadow.value.copy(S.cs);
    cu.uMid.value.copy(S.cm);
    cu.uLit.value.copy(S.cl);
    cu.uSunVis.value = sunVis;
    cloudL.copy(sunDir).multiplyScalar(0.5).add(new THREE.Vector3(0.4, 0.9, 0.4)).normalize();

    sunLight.position.copy(sunDir).multiplyScalar(30);
    sunLight.color.copy(S.sun).lerp(new THREE.Color(1, 1, 1), 0.35);
    sunLight.intensity = N.si * sunVis;
    moonLight.position.copy(moonDir).multiplyScalar(30);
    moonLight.intensity = 0.55 * N.st * moonVis;
    hemi.color.copy(S.hs);
    hemi.groundColor.copy(S.hg);
    hemi.intensity = N.hi;
    fill.intensity = 0.15 + 0.4 * (1 - N.st);

    const su = sandMat.uniforms;
    su.uHs.value.copy(S.hs);
    su.uHg.value.copy(S.hg);
    su.uHi.value = N.hi;
    su.uSunL.value.copy(sunLight.color);
    su.uSunI.value = sunLight.intensity;
    su.uMoonI.value = moonLight.intensity;

    starGroup.quaternion.setFromAxisAngle(poleAxis, -(h / 24) * Math.PI * 2 * 1.0027 + 1.3);
    moon.position.copy(moonDir).multiplyScalar(700);
    moon.lookAt(0, 0, 0);
    moon.visible = moonDir.y > -0.12;
    moonU.uAmt.value = N.st * moonVis;
    farLights.material.opacity = smoothstep(0.3, 0.9, N.st) * 0.9;

    const total = Math.floor(m);
    const h24 = Math.floor(total / 60) % 24;
    const mm = total % 60;
    const label = `${(h24 % 12) || 12}:${mm < 10 ? "0" : ""}${mm}${h24 >= 12 ? " P.M." : " A.M."}`;

    if (label !== lastLabel) {
      lastLabel = label;
      const dateLabel = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      callbacks?.onTimeChange?.(total, label, dateLabel);
    }
  }

  function localMinutes() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
  }

  /* Camera */
  const cam = reduce
    ? { az: 0, pitch: 0.1, r: 5.6, taz: 0, tp: 0.1, tr: 5.6 }
    : { az: 0.65, pitch: 0.4, r: 11, taz: 0, tp: 0.1, tr: 5.6 };

  let lastInput = -10;
  let now = 0;

  function touched() {
    lastInput = now;
    callbacks?.onInteraction?.();
  }

  function clampCam() {
    const TWO_PI = Math.PI * 2;
    while (cam.taz > TWO_PI) {
      cam.taz -= TWO_PI;
      cam.az -= TWO_PI;
    }
    while (cam.taz < -TWO_PI) {
      cam.taz += TWO_PI;
      cam.az += TWO_PI;
    }
    cam.tp = Math.max(-0.2, Math.min(1.2, cam.tp));
    cam.tr = Math.max(2.2, Math.min(16, cam.tr));
  }

  const ptrs = new Map<number, { x: number; y: number }>();
  let pinch0 = 0;
  function pinchDist() {
    const p = Array.from(ptrs.values());
    return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
  }

  const onPointerDown = (e: PointerEvent) => {
    canvas.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) pinch0 = pinchDist();
    touched();
  };

  const onPointerMove = (e: PointerEvent) => {
    const prev = ptrs.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    prev.x = e.clientX;
    prev.y = e.clientY;
    if (ptrs.size === 1) {
      cam.taz -= dx * 0.005;
      cam.tp += dy * 0.004;
    } else if (ptrs.size === 2) {
      const d = pinchDist();
      cam.tr *= pinch0 / d;
      pinch0 = d;
    }
    clampCam();
    touched();
  };

  const onPointerUp = (e: PointerEvent) => {
    ptrs.delete(e.pointerId);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    cam.tr *= Math.exp(e.deltaY * 0.001);
    clampCam();
    touched();
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  function updateCamera(dt: number, time: number) {
    const k = 1 - Math.exp(-dt * (reduce ? 10 : 2.2));
    cam.az += (cam.taz - cam.az) * k;
    cam.pitch += (cam.tp - cam.pitch) * k;
    cam.r += (cam.tr - cam.r) * k;
    const idle = reduce ? 0 : Math.max(0, Math.min(1, (time - lastInput - 3) / 3));
    const az = cam.az + Math.sin(time * 0.17) * 0.06 * idle;
    const pitch = cam.pitch + Math.sin(time * 0.23) * 0.012 * idle;
    camera.position.set(Math.sin(az) * cam.r, 1.4 + (cam.r - 5.6) * 0.06, Math.cos(az) * cam.r);
    camera.lookAt(0, 1.2, 0);
    camera.rotateX(pitch);
  }

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 50 + (1 - w / h) * 26 : 50;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", onResize);
  onResize();

  /* Animation Loop */
  let animId: number;
  let last = performance.now();
  let liveTick = 0;

  function frame(nowMs: number) {
    const dt = Math.min(0.05, (nowMs - last) / 1000);
    last = nowMs;
    now += dt;
    const wt = now * (reduce ? 0.3 : 1);
    U.uTime.value = wt;

    if (isPlaying) {
      curMin = (curMin + dt * 12) % 1440;
      setHour(curMin);
    } else if (isLive) {
      liveTick += dt;
      if (liveTick > 1) {
        liveTick = 0;
        setHour(localMinutes());
      }
    }

    boy.position.y = 0;
    upper.rotation.z = 0.02 + Math.sin(wt * 0.9) * 0.006;
    upper.rotation.x = Math.sin(wt * 1.1) * 0.004;
    head.rotation.y = Math.sin(wt * 0.3) * 0.1;
    head.rotation.x = 0.07 + Math.sin(wt * 0.21) * 0.03;

    if (!reduce) {
      clouds.forEach((g) => {
        g.position.x += g.userData.speed * dt;
        if (g.position.x > 340) g.position.x = -340;
      });
    }

    updateCamera(dt, now);
    camera.updateMatrixWorld();
    cloudMat.uniforms.uL.value.copy(cloudL).transformDirection(camera.matrixWorldInverse);
    cloudMat.uniforms.uSunV.value.copy(sunDir).transformDirection(camera.matrixWorldInverse);

    renderer.render(scene, camera);
    animId = requestAnimationFrame(frame);
  }

  setHour(localMinutes());
  animId = requestAnimationFrame(frame);

  return {
    setHour: (minutes: number) => {
      setHour(minutes);
    },
    setLive: (live: boolean) => {
      isLive = live;
      if (live) {
        isPlaying = false;
        setHour(localMinutes());
      }
    },
    setPlaying: (playing: boolean) => {
      isPlaying = playing;
      if (playing) {
        isLive = false;
      }
    },
    getTrackGradient: () => {
      const stops: string[] = [];
      for (let hh = 0; hh <= 24; hh++) {
        sample(hh);
        stops.push("#" + S.hor.clone().lerp(S.mid, 0.4).getHexString() + " " + ((hh / 24) * 100).toFixed(2) + "%");
      }
      return `linear-gradient(to right, ${stops.join(",")})`;
    },
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      dotTex.dispose();
      renderer.dispose();
    },
  };
}
