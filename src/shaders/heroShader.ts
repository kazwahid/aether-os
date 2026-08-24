// Minimal pass-through vertex shader for a full-screen quad
export const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 v_uv;
  void main() {
    v_uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Fragment Shader — black/ember/orange palette
// Sections:
//  1. hash()      — 2D pseudo-random hash
//  2. noise()     — bilinear value noise with quintic smoothing
//  3. fbm()       — 4-octave fractional brownian motion
//  4. palette()   — cosine gradient producing black → deep orange → ember white
//  5. main()      — aspect-corrected UVs, mouse-driven swirl warp, nested domain warp, grain overlay
export const fragmentShaderSource = `
  precision mediump float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_mouse;

  varying vec2 v_uv;

  // 1. Hash — scatter input coords into pseudorandom scalar
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // 2. Value noise — interpolate hash at grid corners with quintic curve
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // 3. fBm — 4 octaves accumulate amplitude-halved noise at doubling frequency
  float fbm(vec2 p) {
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v   += amp * noise(p);
      p   += vec2(0.37, 0.19);  // breaks grid symmetry each octave
      p   *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  // 4. Cosine palette — maps scalar t to black → charcoal → deep orange → ember
  vec3 palette(float t) {
    // a=base, b=amplitude, c=frequency, d=phase shift per channel
    vec3 a = vec3(0.02, 0.01, 0.005);
    vec3 b = vec3(0.45, 0.18, 0.06);
    vec3 c = vec3(0.80, 0.70, 0.60);
    vec3 d = vec3(0.00, 0.15, 0.30);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    // --- 5a. Normalize UVs with aspect correction
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = (v_uv - 0.5) * vec2(aspect, 1.0);

    // --- 5b. Mouse swirl warp
    //  u_mouse is in [0,1]; map to same aspect-corrected space
    vec2 m  = (u_mouse - 0.5) * vec2(aspect, 1.0);
    vec2 dm = st - m;
    float dist = length(dm);

    // Exponential decay: strongest influence near cursor, zero at distance
    float influence = exp(-dist * 4.0);

    // Rotation matrix: angle proportional to cursor pull strength
    float ang = influence * 1.8;
    float ca = cos(ang), sa = sin(ang);
    st = m + mat2(ca, -sa, sa, ca) * dm;

    // Subtle radial repulsion toward cursor
    st -= normalize(dm + 0.001) * influence * 0.04;

    // --- 5c. Nested domain warp (two-layer fBm feedback)
    float speed = u_time * 0.05;
    vec2 q = vec2(
      fbm(st + vec2(0.0,  0.0)  + speed),
      fbm(st + vec2(5.2,  1.3)  + speed * 1.4)
    );
    vec2 r = vec2(
      fbm(st + 4.0 * q + vec2(1.7, 9.2) + speed * 0.8),
      fbm(st + 4.0 * q + vec2(8.3, 2.8) + speed * 1.2)
    );

    float f = fbm(st + 4.0 * r);

    // --- 5d. Color — palette driven by field value + vector length for depth
    vec3 col = palette(f * 1.2 + length(q) * 0.35);

    // Subtle ember bloom at cursor — warm, not neon
    col += vec3(0.12, 0.04, 0.005) * influence;

    // Breathing pulse — gentle brightness oscillation over time
    col *= 0.88 + 0.12 * sin(u_time * 0.3);

    // --- 5e. Film grain — high-freq hash adds micro-texture, kills banding
    float grain = (hash(v_uv + fract(u_time * 0.01)) - 0.5) * 0.028;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;
