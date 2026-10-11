import Image from "next/image";

export default function Hero({ craftCount }: { craftCount: number }) {
  return (
    <section className="relative px-4 pt-8 pb-16 sm:px-6 sm:pt-14 sm:pb-20 text-center">
      {/* Decorative ambient backdrop flare */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center overflow-hidden">
        <div className="h-72 w-full max-w-3xl rounded-full bg-linear-to-b from-sky-300/30 via-blue-400/15 to-transparent blur-3xl dark:from-sky-600/20 dark:via-blue-800/10"></div>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Branding Emblem */}
        <div className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl border border-sky-200/80 bg-white/80 p-3.5 shadow-lg shadow-sky-500/10 backdrop-blur-xl transition-transform hover:scale-105 dark:border-sky-500/20 dark:bg-slate-900/80">
          <Image
            src="/branding/dreamersdesire-crafts-pocket.png"
            alt="DreamersDesire Crafts Emblem"
            width={1374}
            height={1145}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        {/* Kicker Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/50 bg-sky-100/60 px-3.5 py-1 text-xs font-medium text-sky-800 shadow-sm shadow-sky-500/10 backdrop-blur-md transition-transform hover:scale-[1.02] dark:border-sky-500/30 dark:bg-sky-950/60 dark:text-sky-300">
          <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></span>
          <span>Personal Atelier & Hobby Laboratory</span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
          Where spontaneous ideas <br />
          <span className="bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-cyan-300">
            become interactive crafts.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
          A cozy, curated digital playground of creative UI concepts, tactile micro-tools, and visual code experiments. Built for the pure joy of exploring the modern web without boundaries.
        </p>

        {/* Key Attributes Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/70 px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-sky-500 font-bold">✓</span> {craftCount} Interactive Crafts
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/70 px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-blue-500 font-bold">⚡</span> Next.js 16 & React 19
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/70 px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-cyan-500 font-bold">✦</span> Pure In-App Experiences
          </span>
        </div>
      </div>
    </section>
  );
}
