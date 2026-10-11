"use client";

import { ArrowUp } from "lucide-react";

export default function Copyright() {
  function scrollToTop(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer className="footer site-width">
      <span>© 2026 DreamersDesire Crafts. Made with intention.</span>
      <a
        href="#top"
        onClick={scrollToTop}
        className="cursor-pointer transition-colors hover:text-foreground"
        aria-label="Scroll back to top"
      >
        Back to the top <ArrowUp className="size-3" />
      </a>
    </footer>
  );
}
