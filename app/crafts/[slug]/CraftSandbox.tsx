"use client";

import { useState, useEffect, useRef } from "react";
import { Project } from "../../data/projects";

export default function CraftSandbox({ project }: { project: Project }) {
  switch (project.slug) {
    case "mesh-gradient-studio":
      return <MeshGradientSandbox />;
    case "type-scale-visualizer":
      return <TypeScaleSandbox />;
    case "particle-wave":
      return <ParticleWaveSandbox />;
    case "ambient-lofi-beats":
      return <AmbientAudioSandbox />;
    case "glass-credit-card":
      return <GlassCardSandbox />;
    case "svg-blob-generator":
      return <SvgBlobSandbox />;
    default:
      return <DefaultCraftSandbox project={project} />;
  }
}

// 1. Mesh Gradient Studio Interactive Craft
function MeshGradientSandbox() {
  const [color1, setColor1] = useState("#38bdf8");
  const [color2, setColor2] = useState("#6366f1");
  const [color3, setColor3] = useState("#2563eb");
  const [blurAmount, setBlurAmount] = useState(60);
  const [copied, setCopied] = useState(false);

  const cssCode = `background: radial-gradient(at 20% 20%, ${color1} 0px, transparent 50%),
  radial-gradient(at 80% 30%, ${color2} 0px, transparent 50%),
  radial-gradient(at 50% 80%, ${color3} 0px, transparent 50%);
filter: blur(${blurAmount}px);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Canvas Area */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl border border-sky-200/60 bg-slate-950 p-6 shadow-inner dark:border-sky-500/20">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            backgroundImage: `radial-gradient(at 25% 25%, ${color1} 0px, transparent 55%), radial-gradient(at 75% 35%, ${color2} 0px, transparent 55%), radial-gradient(at 50% 75%, ${color3} 0px, transparent 55%)`,
            filter: `blur(${blurAmount}px)`,
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <div className="rounded-xl bg-black/40 p-4 backdrop-blur-md">
            <p className="text-xs font-mono text-sky-200">
              Interactive Mesh Preview • Adjust the palette nodes below
            </p>
          </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 rounded-2xl border border-sky-100 bg-white/70 p-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Node A (Sky)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5"
            />
            <span className="font-mono text-xs">{color1}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Node B (Indigo)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5"
            />
            <span className="font-mono text-xs">{color2}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Node C (Azure)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color3}
              onChange={(e) => setColor3(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5"
            />
            <span className="font-mono text-xs">{color3}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Blur Spread</span>
            <span>{blurAmount}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="mt-3 w-full accent-sky-500"
          />
        </div>
      </div>

      {/* Copy Code Snippet */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-slate-900 p-4 text-white dark:border-sky-500/20">
        <code className="text-xs font-mono text-sky-300 truncate max-w-full sm:max-w-lg">
          background: radial-gradient(...)
        </code>
        <button
          onClick={copyToClipboard}
          className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sky-400"
        >
          {copied ? "✓ Copied to Clipboard!" : "Copy CSS Code"}
        </button>
      </div>
    </div>
  );
}

// 2. TypeScale Visualizer Interactive Craft
function TypeScaleSandbox() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25); // Major Third
  const [sampleText, setSampleText] = useState("Dreamers create what code envisions.");

  const scales = [
    { label: "Minor Second (1.067)", value: 1.067 },
    { label: "Major Second (1.125)", value: 1.125 },
    { label: "Major Third (1.250)", value: 1.25 },
    { label: "Perfect Fourth (1.333)", value: 1.333 },
    { label: "Golden Ratio (1.618)", value: 1.618 },
  ];

  const steps = [
    { name: "h1 (3 steps)", size: Math.round(baseSize * Math.pow(ratio, 3)) },
    { name: "h2 (2 steps)", size: Math.round(baseSize * Math.pow(ratio, 2)) },
    { name: "h3 (1 step)", size: Math.round(baseSize * Math.pow(ratio, 1)) },
    { name: "body (base)", size: baseSize },
    { name: "caption (-1 step)", size: Math.max(10, Math.round(baseSize / ratio)) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-sky-100 bg-white/70 p-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Scale Ratio
          </label>
          <select
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
          >
            {scales.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Base Size ({baseSize}px)
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={baseSize}
            onChange={(e) => setBaseSize(Number(e.target.value))}
            className="mt-3 w-full accent-sky-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Preview Text
          </label>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Typography Preview Stack */}
      <div className="space-y-4 rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-8 backdrop-blur-xl dark:border-sky-500/15 dark:bg-slate-900/70">
        {steps.map((step) => (
          <div
            key={step.name}
            className="border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800"
          >
            <div className="flex items-center justify-between text-xs font-mono text-sky-600 dark:text-sky-400">
              <span>{step.name}</span>
              <span>{step.size}px</span>
            </div>
            <p
              style={{ fontSize: `${step.size}px`, lineHeight: 1.25 }}
              className="mt-1 font-bold tracking-tight text-slate-900 truncate dark:text-white"
            >
              {sampleText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Particle Wave Interactive Craft
function ParticleWaveSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 360);
    let step = 0;

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 360;
      }
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      step += 0.03;
      ctx.fillStyle = "rgba(11, 17, 32, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const count = 40;
      const spacing = width / count;

      for (let i = 0; i < count; i++) {
        const x = i * spacing;
        const wave1 = Math.sin(step + i * 0.15) * 45;
        const wave2 = Math.cos(step * 0.7 + i * 0.2) * 25;
        const y = height / 2 + wave1 + wave2;

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${190 + i * 2}, 90%, 65%)`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `hsla(${190 + i * 2}, 90%, 50%, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/60 bg-slate-950 p-2 shadow-2xl dark:border-sky-500/20">
        <canvas ref={canvasRef} className="block w-full h-90 rounded-2xl" />
        <div className="absolute bottom-4 left-6 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono text-sky-300 backdrop-blur-md">
          HTML5 Canvas 60FPS • Sinusoidal Waves
        </div>
      </div>
    </div>
  );
}

// 4. Ambient Audio Synthesizer Craft
function AmbientAudioSandbox() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleSound = () => {
    if (isPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Create white noise buffer for soft rain/breeze
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Lowpass filter for soothing rain sound
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.value = rainVolume * 0.2;
      gainNodeRef.current = gain;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      setIsPlaying(true);
    }
  };

  const updateVolume = (val: number) => {
    setRainVolume(val);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = val * 0.2;
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-10 text-center backdrop-blur-xl dark:border-sky-500/15 dark:bg-slate-900/70">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 text-3xl text-white shadow-lg shadow-sky-500/20">
        {isPlaying ? "🎵" : "🎧"}
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
        {isPlaying ? "Ambient Sound Playing" : "Procedural Soundboard"}
      </h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Synthesized in real-time via Web Audio API. Zero external audio downloads.
      </p>

      <div className="mt-6 flex justify-center">
        <button
          onClick={toggleSound}
          className={`rounded-full px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all ${
            isPlaying
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-sky-600 text-white hover:bg-sky-500 shadow-sky-500/25"
          }`}
        >
          {isPlaying ? "Stop Audio Stream" : "▶ Start Procedural Rain Ambience"}
        </button>
      </div>

      {isPlaying && (
        <div className="mx-auto mt-6 max-w-xs">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Ambience Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={rainVolume}
            onChange={(e) => updateVolume(Number(e.target.value))}
            className="mt-2 w-full accent-sky-500"
          />
        </div>
      )}
    </div>
  );
}

// 5. Glassmorphism Card Tilt
function GlassCardSandbox() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(((y - centerY) / centerY) * -15);
    setRotateY(((x - centerX) / centerX) * 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="flex min-h-95 items-center justify-center rounded-3xl border border-sky-100 bg-linear-to-br from-slate-900 via-sky-950 to-slate-900 p-8 perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative h-56 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-100 ease-out flex flex-col justify-between"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: "0 25px 50px -12px rgba(14, 165, 233, 0.25)",
        }}
      >
        <div className="flex justify-between items-center text-white">
          <span className="font-mono text-sm tracking-widest uppercase">
            Craft Access
          </span>
          <span className="text-lg">✨</span>
        </div>

        <div className="text-white">
          <p className="font-mono text-sm tracking-wider">
            •••• •••• •••• 2026
          </p>
          <p className="text-xs font-semibold mt-2 opacity-80">
            Jahidul Islam Jahid
          </p>
        </div>
      </div>
    </div>
  );
}

// 6. Svg Blob Generator
function SvgBlobSandbox() {
  const [seed, setSeed] = useState(1);

  const generatePath = () => {
    const s = seed * 15;
    return `M 200,50 Q ${260 + (s % 30)},${90 + (s % 40)} ${280 + (s % 20)},160 Q ${290 - (s % 35)},${240 + (s % 20)} 200,280 Q ${120 + (s % 25)},${290 - (s % 20)} 80,210 Q ${60 + (s % 30)},${120 - (s % 20)} 200,50 Z`;
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center p-8 rounded-3xl border border-sky-100 bg-white/80 dark:border-sky-500/15 dark:bg-slate-900/70">
        <svg width="280" height="280" viewBox="0 0 360 360">
          <defs>
            <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path
            d={generatePath()}
            fill="url(#blobGrad)"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
      </div>

      <button
        onClick={() => setSeed((prev) => prev + 1)}
        className="rounded-full bg-sky-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-sky-500"
      >
        🎲 Morph Shape (Seed #{seed})
      </button>
    </div>
  );
}

// Default Fallback Sandbox
function DefaultCraftSandbox({ project }: { project: Project }) {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 text-center backdrop-blur-xl dark:border-sky-500/15 dark:bg-slate-900/70">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {project.description}
      </p>
    </div>
  );
}
