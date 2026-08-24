import { useEffect, useRef } from "react";
import { vertexShaderSource, fragmentShaderSource } from "../shaders/heroShader";

interface WebGLShaderOptions {
  reducedMotion: boolean;
}

export function useWebGLShader(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: WebGLShaderOptions
) {
  const animationFrameIdRef = useRef<number | null>(null);
  const isTabVisibleRef = useRef<boolean>(true);

  // Easing/Interpolation states for the mouse
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }

    // Helper to compile shader
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    // Compile vertex and fragment shaders
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    // Link shader program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup geometry (full-screen quad composed of two triangles)
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");

    // Track state variables
    let lastRenderTime = 0;
    let accumulatedTime = 0.0;

    // Handle mouse move to capture raw cursor targets
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      // Invert Y because WebGL coordinates start from bottom-left (0,0)
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      
      targetMouseRef.current = {
        x: Math.max(0.0, Math.min(1.0, x)),
        y: Math.max(0.0, Math.min(1.0, y)),
      };
    };

    // Smoothly ease mouse and render
    const update = (now: number) => {
      if (!isTabVisibleRef.current) {
        // If tab is hidden, yield next tick and do not update time
        animationFrameIdRef.current = requestAnimationFrame(update);
        return;
      }

      // Time tracking
      if (lastRenderTime === 0) {
        lastRenderTime = now;
      }
      const deltaTime = (now - lastRenderTime) / 1000.0;
      lastRenderTime = now;

      // Only increment time if reduced motion is disabled
      if (!options.reducedMotion) {
        accumulatedTime += deltaTime;
      } else {
        accumulatedTime = 0.0; // Static frame state
      }

      // Smooth mouse coordinate interpolation (lerp) for premium visual glide
      const lerpFactor = 0.08; // Control speed of interpolation (lower is smoother/slower)
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor;

      // Clear viewport and draw
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Pass uniforms
      gl.uniform1f(timeUniformLocation, accumulatedTime);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(mouseUniformLocation, mouseRef.current.x, mouseRef.current.y);

      // Draw triangles
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Loop if not reduced motion (or if we want interactive updates for static frame, we still loop but with static time)
      if (!options.reducedMotion) {
        animationFrameIdRef.current = requestAnimationFrame(update);
      } else {
        // If reduced motion is active, we can render once and stop the loop,
        // unless mouse is actively moving. For standard performance, let's stop the loop entirely.
        animationFrameIdRef.current = null;
      }
    };

    // Resize viewport handler
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // Cap devicePixelRatio to 2.0 to protect CPU/GPU from high-res screen overhead
      const dpr = Math.min(window.devicePixelRatio || 1.0, 2.0);
      const neededWidth = Math.floor(displayWidth * dpr);
      const neededHeight = Math.floor(displayHeight * dpr);

      if (canvas.width !== neededWidth || canvas.height !== neededHeight) {
        canvas.width = neededWidth;
        canvas.height = neededHeight;
      }

      // If in reduced motion, render a single frame immediately after resize
      if (options.reducedMotion) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(timeUniformLocation, 0.0);
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseUniformLocation, mouseRef.current.x, mouseRef.current.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    };

    // Visibility Listener to pause rendering loop when tab is hidden
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (isTabVisibleRef.current && !options.reducedMotion && !animationFrameIdRef.current) {
        lastRenderTime = performance.now();
        animationFrameIdRef.current = requestAnimationFrame(update);
      }
    };

    // Setup events
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial setup
    resizeCanvas();

    // Start render loop
    if (!options.reducedMotion) {
      lastRenderTime = performance.now();
      animationFrameIdRef.current = requestAnimationFrame(update);
    }

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      gl.deleteBuffer(positionBuffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, [options.reducedMotion, canvasRef]);
}
