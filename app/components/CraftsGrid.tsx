"use client";

import { useState } from "react";
import { Category, CATEGORIES, Project } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function CraftsGrid({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="crafts-showcase" className="px-4 sm:px-6 scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        {/* Section Header & Category Filters */}
        <div className="mb-10 flex flex-col items-center justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
              <span>Curated Works</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore the Crafts
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-sky-200/60 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-sky-500/20 dark:bg-slate-900/60">
            {CATEGORIES.map((category) => {
              const count =
                category === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === category).length;

              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30 dark:bg-sky-500"
                      : "text-slate-600 hover:text-slate-900 hover:bg-sky-50/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Rounded Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="rounded-3xl border border-dashed border-sky-200 p-12 text-center dark:border-sky-800">
            <p className="text-sm text-slate-500">
              No crafts found in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
