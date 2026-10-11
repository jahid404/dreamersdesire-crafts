import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-4 z-50 w-full px-4 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="flex h-14 items-center justify-between rounded-full border border-sky-200/60 bg-white/80 px-4 sm:px-6 shadow-sm shadow-sky-500/5 backdrop-blur-xl transition-all dark:border-sky-500/20 dark:bg-slate-900/80 dark:shadow-black/20">
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="group flex items-center transition-transform hover:scale-[1.02]"
                    >
                        <Image
                            src="/branding/dreamersdesire-crafts-main.png"
                            alt="DreamersDesire Crafts"
                            width={2172}
                            height={724}
                            className="h-7 sm:h-8 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Right Navigation & Status */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Live Indicator */}
                        <div className="hidden xs:flex sm:flex items-center gap-1.5 rounded-full border border-sky-300/40 bg-sky-50/70 px-2.5 py-1 text-[11px] font-medium text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-300">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                            </span>
                            <span>Playground Active</span>
                        </div>

                        {/* Quick Link */}
                        <a
                            href="#crafts-showcase"
                            className="rounded-full bg-slate-900/5 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-900/10 hover:text-slate-900 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            Explore Crafts ↓
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
