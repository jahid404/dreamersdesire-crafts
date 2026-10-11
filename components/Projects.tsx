import Image, { StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import verdeImage from "@/assets/project-verde.jpg";
import formImage from "@/assets/project-form.jpg";
import lumaImage from "@/assets/project-luma.jpg";

export interface ProjectItem {
  title: string;
  category: string;
  image: StaticImageData;
  description: string;
  detail: string;
  type: string;
  year: string;
}

export const projects: ProjectItem[] = [
  {
    title: "Verde Botanicals",
    category: "Brand identity · Packaging",
    image: verdeImage,
    description: "A fresh perspective on nature, distilled into a quiet, considered identity.",
    detail:
      "A concept identity for botanical skincare. Earthy greens, tactile materials and restrained typography bring a sense of care to everyday rituals. The exploration includes visual identity, packaging and art direction.",
    type: "Identity design",
    year: "2026",
  },
  {
    title: "Form & Field",
    category: "Editorial · Art direction",
    image: formImage,
    description: "An independent journal celebrating the beauty of the everyday.",
    detail:
      "An editorial concept exploring the meeting of art, architecture and landscape. Generous space, expressive typography and an intentional visual rhythm let every story breathe. The exploration includes publication design and print art direction.",
    type: "Editorial design",
    year: "2026",
  },
  {
    title: "Luma Objects",
    category: "Objects · Creative exploration",
    image: lumaImage,
    description: "Sculptural simplicity. Everyday objects with a little more soul.",
    detail:
      "A lighting concept built around a single, continuous curve. A warm terracotta finish and a playful silhouette transform an everyday desk lamp into a thoughtful object. The exploration considers shape, material and atmosphere.",
    type: "Product concept",
    year: "2026",
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
              <Image
                className="project-image"
                src={project.image}
                alt={`${project.title} design concept`}
                width={1024}
                height={768}
              />
            </div>
            <div className="project-info">
              <span className="project-category">{project.category}</span>
              <div className="project-title-row">
                <h3>{project.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${project.title}`}
                  title={`View ${project.title}`}
                >
                  <ArrowUpRight />
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
