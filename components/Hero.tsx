import Image from "next/image";
import { ArrowDown, ArrowUpRight, DraftingCompass } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/craft-hero.jpg";

export default function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <Image
                src={heroImage}
                alt="Sculptural blue paper ribbon beside delicate porcelain and frosted glass"
                width={1536}
                height={1024}
                className="hero-image"
                priority
            />
            <div className="site-width hero-content">
                <div className="eyebrow">
                    A little imagination. A lot of intention.
                </div>
                <h1 id="hero-title">
                    DreamersDesire
                    <br />
                    <span>Crafts.</span>
                </h1>
                <p className="hero-description">
                    Turning small sparks of inspiration into thoughtful design.
                    Crafted with care, curiosity, and a love for the details.
                </p>
                <div className="hero-actions">
                    <Button asChild className="craft-button">
                        <a href="#projects">
                            Explore my work <ArrowDown />
                        </a>
                    </Button>
                    <Button asChild variant="ghost" className="craft-button">
                        <a
                            href="https://dreamersdesire.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            A little about me <ArrowUpRight />
                        </a>
                    </Button>
                </div>
                <div className="hero-note">
                    <DraftingCompass /> Thoughtfully crafted. Quietly different.
                </div>
            </div>
        </section>
    );
}
