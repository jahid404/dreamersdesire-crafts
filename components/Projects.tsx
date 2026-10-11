import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import littoralImage from "@/assets/project-littoral.jpg";

export interface ProjectItem {
  title: string;
  category: string;
  image: StaticImageData;
  description: string;
  detail: string;
  type: string;
  year: string;
  href: string;
}

export const projects: ProjectItem[] = [
  {
    title: "Littoral",
    category: "WebGL · Three.js · Generative Art",
    image: littoralImage,
    description: "Two screens, one sea. A living coastline where light, water, and sky follow the time of day.",
    detail:
      "A real-time WebGL craft capturing a shoreline that shifts dynamically with the hour of day, complete with procedural waves, dynamic sky, sun, moon phases, stars, and atmospheric lighting.",
    type: "Interactive Craft",
    year: "2026",
    href: "/crafts/littoral",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects site-width" aria-labelledby="projects-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">The collection</div>
          <h2 id="projects-title">
            Selected works<span className="text-primary">.</span>
          </h2>
        </div>
        <p>A few ideas brought to life, with intention.</p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-image-wrap">
              <Link href={project.href} className="block h-full w-full" tabIndex={-1} aria-hidden="true">
                <Image
                  className="project-image"
                  src={project.image}
                  alt={`${project.title} — Two screens, one sea`}
                  width={1024}
                  height={768}
                  priority
                />
              </Link>
            </div>
            <div className="project-info">
              <span className="project-category">{project.category}</span>
              <div className="project-title-row">
                <h3>
                  <Link href={project.href} className="hover:text-primary transition-colors">
                    {project.title}
                  </Link>
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  aria-label={`View ${project.title}`}
                  title={`View ${project.title}`}
                >
                  <Link href={project.href}>
                    <ArrowUpRight />
                  </Link>
                </Button>
              </div>
              <p>{project.description}</p>
              <div className="project-meta">
                <span>{project.type}</span>
                <span>{project.year}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
