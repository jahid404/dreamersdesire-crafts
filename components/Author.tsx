import Image from "next/image";
import { Globe } from "lucide-react";

export default function Author() {
    return (
        <section id="about" className="author" aria-labelledby="about-title">
            <div className="site-width author-inner">
                <div className="author-main">
                    <div className="eyebrow">Behind the crafts</div>
                    <h2 id="about-title">
                        A dreamer at heart.
                        <br />A creator by choice.
                    </h2>
                    <p>
                        I’m Jahid — the creative mind behind DreamersDesire
                        Crafts. I find inspiration in simple things and believe
                        the most meaningful work comes from curiosity, care, and
                        a little imagination.
                    </p>
                    <div id="author" className="author-signature">
                        <div className="author-avatar overflow-hidden">
                            <Image
                                src="/branding/author.jpg"
                                alt="Jahidul Islam Jahid"
                                width={88}
                                height={88}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <strong>Jahidul Islam Jahid</strong>
                            <span>Designer & creative explorer</span>
                        </div>
                    </div>
                </div>
                <div className="author-side">
                    <Image
                        src="/branding/dreamersdesire-crafts-pocket.png"
                        alt="DreamersDesire Crafts"
                        width={1374}
                        height={1145}
                        className="ml-auto mb-2.5 h-18 w-auto object-contain opacity-85"
                    />
                    <p className="text-xs text-muted-foreground m-0">
                        Small details.
                        <br />
                        Endless possibilities.
                    </p>

                    <div className="social-buttons mt-5 flex flex-wrap items-center justify-end gap-2.5">
                        <a
                            href="https://dreamersdesire.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Website"
                            title="Website"
                            className="group flex size-10 items-center justify-center rounded-2xl border border-sky-200/70 bg-sky-100/50 text-sky-700 shadow-xs shadow-sky-500/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 hover:shadow-md hover:shadow-sky-500/10 dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:border-sky-400/40 dark:hover:bg-sky-900/50 dark:hover:text-sky-100"
                        >
                            <Globe className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
                        </a>

                        <a
                            href="https://github.com/jahid404"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            title="GitHub"
                            className="group flex size-10 items-center justify-center rounded-2xl border border-sky-200/70 bg-sky-100/50 text-sky-700 shadow-xs shadow-sky-500/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 hover:shadow-md hover:shadow-sky-500/10 dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:border-sky-400/40 dark:hover:bg-sky-900/50 dark:hover:text-sky-100"
                        >
                            <svg
                                className="size-4.5 fill-current transition-transform duration-200 group-hover:scale-110"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                />
                            </svg>
                        </a>

                        <a
                            href="https://linkedin.com/in/jahid400"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            title="LinkedIn"
                            className="group flex size-10 items-center justify-center rounded-2xl border border-sky-200/70 bg-sky-100/50 text-sky-700 shadow-xs shadow-sky-500/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 hover:shadow-md hover:shadow-sky-500/10 dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:border-sky-400/40 dark:hover:bg-sky-900/50 dark:hover:text-sky-100"
                        >
                            <svg
                                className="size-4.5 fill-current transition-transform duration-200 group-hover:scale-110"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
