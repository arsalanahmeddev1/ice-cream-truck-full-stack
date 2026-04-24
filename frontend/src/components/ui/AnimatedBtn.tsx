"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import FragmentCanvas from "fragment-canvas";

const fragmentShader = `
    precision mediump float;

    uniform vec2 iResolution;
    uniform float iTime;

    float random(vec2 pos) {
        return fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 pos) {
        vec2 i = floor(pos);
        vec2 f = fract(pos);
        float a = random(i + vec2(0.0, 0.0));
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 pos) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(20.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 8; i++) {
            v += a * noise(pos);
            pos = rot * pos * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main(void) {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        uv *= 0.5;

        vec2 q = vec2(
            fbm(uv + 0.20 * iTime),
            fbm(uv + vec2(5.0, 1.0))
        );
        vec2 r = vec2(
            fbm(uv + 3.0 * q + vec2(1.2, 3.2) + 0.2 * iTime),
            fbm(uv + 3.0 * q + vec2(8.8, 2.8) + 0.2 * iTime)
        );
        
        float f = fbm(uv + r);

        // Two colors only
        vec3 magenta = vec3(193.0 / 255.0, 49.0 / 255.0, 149.0 / 255.0); // #C13195 (Magenta)
        vec3 blue = vec3(34.0 / 255.0, 148.0 / 255.0, 242.0 / 255.0); // #2294F2 (Blue)

        // Adjusted color mixing
        vec3 color = mix(
            magenta,
            blue,
            clamp((f * f) * 6.0, 0.0, 5.0) // Controls color strength
        );

        gl_FragColor = vec4(color, 1.0);
    }
`;

export type AnimatedBtnProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function AnimatedBtn({
  children,
  className = "",
  ...rest
}: AnimatedBtnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const fcRef = useRef<InstanceType<typeof FragmentCanvas> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;

    let disposed = false;
    let fc: InstanceType<typeof FragmentCanvas> | null = null;

    const resizeCanvas = () => {
      const w = layer.clientWidth;
      const h = layer.clientHeight;
      if (w < 1 || h < 1) return false;
      const dpr = Math.max(1, window.devicePixelRatio);
      const cw = Math.max(1, Math.floor(w * dpr));
      const ch = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== ch) canvas.height = ch;
      return true;
    };

    const startRaf = () => {
      if (disposed || !fc) return;
      const tick = (time: number) => {
        if (disposed || !fc) return;
        fc.render(time);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const tryInit = () => {
      if (disposed || fc) return;
      if (!resizeCanvas()) return;
      fc = new FragmentCanvas(canvas, {
        fragmentShader,
        autoRender: false,
        uniforms: {
          offset: (gl, location, time) =>
            gl.uniform1f(location, Math.cos(time / 1000) * 1.0),
        },
      });
      fcRef.current = fc;
      startRaf();
    };

    const onWindowResize = () => {
      if (fc) {
        resizeCanvas();
      } else {
        tryInit();
      }
    };
    window.addEventListener("resize", onWindowResize);

    const ro = new ResizeObserver(() => {
      if (fc) {
        resizeCanvas();
      } else {
        tryInit();
      }
    });
    ro.observe(layer);

    requestAnimationFrame(() => {
      requestAnimationFrame(tryInit);
    });

    return () => {
      disposed = true;
      ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      fcRef.current = null;
    };
  }, []);

  return (
    <button
      className={`animated-btn group relative isolate z-0 inline-flex cursor-pointer overflow-hidden rounded-[14px] border-0 bg-transparent  text-base font-medium shadow-none outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${className}`.trim()}
      {...rest}
    >
      <div ref={layerRef} className="absolute -inset-4 z-0" aria-hidden>
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0 h-full w-full group-hover:scale-[1.2] group-hover:rotate-[10deg] transition-all duration-300"
        />
      </div>
      <div className="relative z-10 m-[2px] rounded-[12px] bg-black/50 px-6 py-2.5 py-[22px] px-[43px] transition-bg duration-300 group-hover:bg-black/25">
        <div className="text-white/80 group-hover:text-white group-hover:scale-[1.05] transition-all duration-300">
          {children}
        </div>
      </div>
    </button>
  );
}
