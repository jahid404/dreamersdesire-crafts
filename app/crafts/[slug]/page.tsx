import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "../../data/projects";
import CraftSandbox from "./CraftSandbox";
import Footer from "../../components/Footer";

export function generateStaticParams() {
    return PROJECTS.map((project) => ({
        slug: project.slug,
    }));
}

export default async function CraftPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = PROJECTS.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="relative min-h-screen flex flex-col soft-blue-gradient-bg text-slate-900 dark:text-slate-100">
            {/* Ambient background blur */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 h-112.5 w-112.5 rounded-full bg-sky-300/15 blur-[120px] dark:bg-sky-900/15"></div>
            </div>

            {/* Top Header / Return Navigation */}
            <header className="sticky top-4 z-40 w-full px-4 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="flex h-14 items-center justify-between rounded-full border border-sky-200/60 bg-white/80 px-4 sm:px-6 shadow-sm shadow-sky-500/5 backdrop-blur-xl dark:border-sky-500/20 dark:bg-slate-900/80">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                        >
                            <Image
                                src="/branding/dreamersdesire-crafts-pocket.png"
                                alt="DreamersDesire Crafts"
                                width={1374}
                                height={1145}
                                className="h-6 w-auto object-contain"
                            />
                            <span>← Back to Crafts Hub</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                {project.category}
                            </span>
                            <span className="hidden sm:inline rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {project.status}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Craft Sandbox Content */}
            <main className="flex-1 px-4 sm:px-6 pt-8 pb-16">
                <div className="mx-auto max-w-4xl">
                    {/* Craft Title & Details */}
                    <div className="mb-8 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2 font-mono text-xs text-sky-600 dark:text-sky-400">
                            <span>Craft #{project.id}</span>
                            <span>•</span>
                            <span>In-App Interactive Demo</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {project.title}
                        </h1>
                        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                            {project.tagline}
                        </p>

                        {/* Tag Badges */}
                        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-lg border border-sky-200/60 bg-white/60 px-2.5 py-1 text-xs font-mono text-slate-600 shadow-2xl backdrop-blur-sm dark:border-sky-500/20 dark:bg-slate-900/60 dark:text-slate-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Component Sandbox */}
                    <CraftSandbox project={project} />
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
