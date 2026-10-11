import Link from "next/link";
import { Project } from "../data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] sm:rounded-4xl border border-sky-100/80 bg-white/80 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/60 hover:shadow-xl hover:shadow-sky-500/10 backdrop-blur-xl dark:border-sky-500/15 dark:bg-slate-900/60 dark:hover:border-sky-400/40 dark:hover:shadow-sky-500/5">
      {/* Top Banner & Visual Artwork Container */}
      <div>
        <div
          className={`relative mb-6 h-36 sm:h-44 w-full overflow-hidden rounded-2xl bg-linear-to-br ${project.gradient.from} ${project.gradient.via || ""} ${project.gradient.to} p-4 shadow-inner`}
        >
          {/* Subtle noise/mesh overlay */}
          <div className="absolute inset-0 bg-white/10 opacity-30 backdrop-blur-[2px]"></div>
          
          {/* Decorative geometric elements inside the banner */}
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-black/10 blur-lg"></div>

          {/* Banner floating badge */}
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                {project.status}
              </span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                {project.category}
              </span>
            </div>

            {/* Micro visual representation */}
            <div className="flex items-center justify-between text-white/90">
              <span className="text-xs font-mono tracking-wider opacity-80">
                /crafts/{project.slug}
              </span>
              <span className="text-xl font-bold opacity-75 group-hover:scale-110 transition-transform duration-300">
                ↗
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors dark:text-white dark:group-hover:text-sky-400">
            {project.title}
          </h2>

          <p className="text-sm font-medium text-sky-700 dark:text-sky-300">
            {project.tagline}
          </p>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {project.description}
          </p>

          {/* Features bullet list */}
          <ul className="mt-4 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {project.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
              >
                <span className="text-sky-500 font-bold">✦</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Footer Section with Tech Tags & In-App Link */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-[11px] font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Dedicated In-App Link Button */}
        <Link
          href={`/crafts/${project.slug}`}
          className="flex h-11 w-full items-center justify-between rounded-xl bg-slate-900 px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-sky-600 dark:bg-slate-800 dark:hover:bg-sky-500"
        >
          <span>Open Craft</span>
          <span className="flex items-center gap-1 font-mono text-xs opacity-90 transition-transform group-hover:translate-x-1">
            Launch In-App →
          </span>
        </Link>
      </div>
    </article>
  );
}
