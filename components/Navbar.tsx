"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            id="top"
            className={`site-header site-width${scrolled ? " is-scrolled" : ""}`}
        >
            <a
                className="brand"
                href="#top"
                aria-label="DreamersDesire Crafts home"
            >
                <Image
                    src="/branding/dreamersdesire-crafts-main.png"
                    alt="DreamersDesire Crafts"
                    width={2172}
                    height={724}
                    className={`w-auto object-contain transition-all duration-300 ${
                        scrolled ? "h-11 sm:h-14" : "h-12 sm:h-16"
                    }`}
                    priority
                />
            </a>
            <nav className="nav-links" aria-label="Main navigation">
                <a href="#projects">Work</a>
                <a href="#about">About</a>
                <a
                    href="https://dreamersdesire.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-contact"
                >
                    The creator <ArrowUpRight className="inline size-3" />
                </a>
            </nav>
        </header>
    );
}
