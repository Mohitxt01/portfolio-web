/* =========================================================
   GLSL — the atmosphere layer.

   Design intent: obsidian void, violet nebula plumes, and thin
   acid-lime "voltage" filaments riding the noise ridges. Accents
   are punctuation — the field stays ~90% near-black so type on
   top of it never loses contrast.
   ========================================================= */

/* A single fullscreen triangle beats a quad: 3 verts, no index buffer,
   and the rasteriser covers the clip-space square exactly. */
export const VERT = /* glsl */ `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // vertexID 0,1,2 -> p = (0,0), (2,0), (0,2)
  // which maps to clip (-1,-1), (3,-1), (-1,3): a triangle whose
  // interior covers the whole clip square, with uv 0..1 across it.
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uRes;        // drawing-buffer size in px
uniform float uTime;       // seconds
uniform vec2  uMouse;      // smoothed pointer, 0..1
uniform float uVel;        // scroll velocity, roughly -1..1
uniform float uIntensity;  // master fade 0..1 (preloader handoff)

/* ---------- gradient noise ---------- */
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = ROT * p * 2.02;
    a *= 0.5;
  }
  return v;
}

/* Ridged variant — folds the noise so the zero-crossings become
   sharp crests. Those crests are what the lime filaments ride. */
float ridged(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(noise(p)) * 2.0;
    v += a * n * n;
    p = ROT * p * 2.07;
    a *= 0.5;
  }
  return v;
}

/* ---------- compact ordered dither (no arrays, no texture) ---------- */
float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
#define bayer4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
#define bayer8(a) (bayer4(0.5 * (a)) * 0.25 + bayer2(a))

void main() {
  vec2 res = uRes;
  vec2 frag = vUv * res;

  // Aspect-corrected, centre-origin coords.
  vec2 uv = (vUv - 0.5) * vec2(res.x / max(res.y, 1.0), 1.0);

  float t = uTime * 0.045;
  float vel = clamp(uVel, -1.5, 1.5);

  // Pointer as a soft lens: warps the field toward the cursor
  // and lifts local intensity, so the background feels touched.
  vec2 m = (uMouse - 0.5) * vec2(res.x / max(res.y, 1.0), 1.0);
  float mDist = length(uv - m);
  float lens = exp(-mDist * 2.1);

  // ---------- domain warp: fbm of fbm, the plume generator ----------
  vec2 q = vec2(
    fbm(uv * 1.15 + vec2(0.0, t)),
    fbm(uv * 1.15 + vec2(5.2, 1.3 - t))
  );

  // Scroll velocity feeds turbulence and a vertical shear, so fast
  // scrolling visibly stirs the field instead of just sliding it.
  float turb = 0.55 + abs(vel) * 0.40;
  vec2 r = vec2(
    fbm(uv * 1.9 + q * (1.7 * turb) + vec2(1.7, 9.2) + t * 1.4),
    fbm(uv * 1.9 + q * (1.7 * turb) + vec2(8.3, 2.8) - t * 1.1 + vel * 0.25)
  );

  float plume = fbm(uv * 1.35 + r * 1.25 + lens * 0.45);
  plume = plume * 0.5 + 0.5;

  // ---------- voltage filaments ----------
  float fil = ridged(uv * 2.3 + r * 0.9 + vec2(t * 2.0, -t * 1.3));
  fil = pow(clamp(fil, 0.0, 1.0), 7.0);          // thin them out hard
  fil *= 0.45 + lens * 0.9;                       // brighter near cursor
  fil *= smoothstep(0.18, 0.62, plume);           // only inside plumes

  // ---------- palette ----------
  const vec3 VOID   = vec3(0.024, 0.024, 0.031);
  const vec3 VIOLET = vec3(0.431, 0.337, 0.973);
  const vec3 LIME   = vec3(0.784, 1.000, 0.000);
  const vec3 CYAN   = vec3(0.310, 0.847, 0.910);

  vec3 col = VOID;

  // Violet nebula — the broad, slow body of the field.
  float nebula = smoothstep(0.34, 0.92, plume);
  col = mix(col, VIOLET * 0.50, nebula * 0.42);

  // A cyan undertone in the troughs keeps the darks from going muddy.
  float trough = smoothstep(0.46, 0.02, plume);
  col = mix(col, CYAN * 0.22, trough * 0.14);

  // Lime filaments — the punctuation. Additive, deliberately scarce.
  col += LIME * fil * 0.30;

  // Pointer bloom, violet-leaning so it never fights lime type.
  col += VIOLET * lens * 0.055;

  // ---------- finishing ----------
  // Vignette focuses the centre and protects edge-anchored UI.
  float vig = 1.0 - smoothstep(0.52, 1.28, length((vUv - 0.5) * 2.0));
  col *= 0.30 + vig * 0.70;

  // Subtle scanline-free film grain, animated per frame.
  float grain = fract(sin(dot(frag + uTime * 60.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.016;

  col *= uIntensity;

  // Ordered dither before quantising to 8-bit kills the banding that
  // gradients this dark would otherwise show on wide-gamut displays.
  col += (bayer8(frag) - 0.5) / 255.0;

  fragColor = vec4(max(col, 0.0), 1.0);
}`;
