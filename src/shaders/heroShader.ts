// WebGL Vertex Shader: A simple pass-through shader for a screen-filling quad.
export const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 v_uv;
  void main() {
    v_uv = position * 0.5 + 0.5; // Transform position from [-1, 1] to [0, 1]
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// WebGL Fragment Shader: Premium interactive neural-plasma shader with custom cosine palette,
// cursor-induced coordinate warping, and a grain overlay.
export const fragmentShaderSource = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  
  varying vec2 v_uv;

  // Simple 2D hash function for random noise generation
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // 2D Bilinear Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Quintic Hermite curve for smooth interpolation (smoother than smoothstep)
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Fractional Brownian Motion (fBm) - 4 octaves of noise combined for rich details
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency);
      p += vec2(0.12, 0.23); // Shift coordinates slightly to break patterns
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }

  // Generate color palette using cosine gradients
  // Formula: a + b * cos(2 * PI * (c * t + d))
  vec3 getPaletteColor(float t) {
    vec3 a = vec3(0.08, 0.05, 0.14); // Very dark purple/black baseline for high contrast
    vec3 b = vec3(0.35, 0.28, 0.52); // Soft neon pastel gradient bounds
    vec3 c = vec3(0.9, 0.8, 1.1);    // Frequency adjustments per channel
    vec3 d = vec3(0.1, 0.42, 0.72);  // Phase offset (Cyan/Teal to Magenta transitions)
    
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    // Normalize coordinates, adjusting for aspect ratio
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = (uv - 0.5) * vec2(aspect, 1.0);
    
    // --- Mouse Interaction Twist/Warp ---
    // u_mouse is normalized [0, 1]. Map to aspect-corrected local coordinates.
    vec2 mouse_st = (u_mouse - 0.5) * vec2(aspect, 1.0);
    
    // Vector pointing from pixel to mouse
    vec2 toMouse = st - mouse_st;
    float distToMouse = length(toMouse);
    
    // Gravitational warping field: strong near cursor, decays exponentially
    float influence = exp(-distToMouse * 3.5);
    
    // Rotational/swirling coordinate warp based on cursor distance
    float swirlAngle = influence * 1.5;
    float c_val = cos(swirlAngle);
    float s_val = sin(swirlAngle);
    mat2 swirlMatrix = mat2(c_val, -s_val, s_val, c_val);
    
    // Apply the swirl distortion around the mouse
    st = mouse_st + swirlMatrix * toMouse;
    
    // Add additional repulsion/attraction influence
    st += normalize(toMouse) * influence * -0.05;

    // --- Domain Warping (fbm fluid simulation) ---
    // Warped octave layer 1
    vec2 q = vec2(
      fbm(st + vec2(0.0, 0.0) + u_time * 0.05),
      fbm(st + vec2(5.2, 1.3) + u_time * 0.08)
    );
    
    // Warped octave layer 2 (feedback warp)
    vec2 r = vec2(
      fbm(st + 4.0 * q + vec2(1.7, 9.2) + u_time * 0.04),
      fbm(st + 4.0 * q + vec2(8.3, 2.8) + u_time * 0.06)
    );
    
    // Final noise field computation
    float f = fbm(st + 4.0 * r);
    
    // Generate base color from the noise intensity
    vec3 color = getPaletteColor(f + length(q) * 0.4);
    
    // Add glowing high-frequency highlights near cursor
    color += vec3(0.04, 0.08, 0.12) * influence;
    
    // Add subtle ambient brightness scaling over time (breathing effect)
    color *= 0.9 + 0.1 * sin(u_time * 0.4);
    
    // --- Film Grain Overlay ---
    // Adds tactile texture to the gradient, minimizing WebGL banding
    float grainNoise = hash(v_uv + u_time * 0.01) - 0.5;
    color += grainNoise * 0.032;
    
    // Clamp output colors safely
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
