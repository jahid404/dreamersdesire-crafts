import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-sky-100/80 bg-white/50 py-12 px-4 sm:px-6 backdrop-blur-md dark:border-sky-500/15 dark:bg-slate-950/50">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand & Personal Statement */}
          <div className="max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <Image
                src="/branding/dreamersdesire-crafts-main.png"
                alt="DreamersDesire Crafts"
                width={2172}
                height={724}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A private digital sandbox where creative concepts, visual mathematics, and micro-utilities come to life. Constantly evolving with new interactive crafts.
            </p>
          </div>

          {/* Author Card */}
          <div className="flex flex-col items-center rounded-2xl border border-sky-200/60 bg-sky-50/50 p-4 sm:p-5 text-center shadow-sm backdrop-blur-sm md:items-start md:text-left dark:border-sky-500/20 dark:bg-slate-900/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Craftsman & Developer
            </span>
            <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              Jahidul Islam Jahid
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              Creator of DreamersDesire
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs font-medium">
              <a
                href="https://dreamersdesire.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
              >
                <span>Website</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href="https://github.com/jahid404"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
              >
                <span>GitHub</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Back to Top ↑
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright & Colophon */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-800/80 dark:text-slate-500">
          <p>© 2026 DreamersDesire Crafts. Built with care and curiosity.</p>
          <p className="flex items-center gap-1 font-mono text-[11px]">
            <span>Next.js 16</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind CSS v4</span>
            <span>•</span>
            <span>Bun</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
