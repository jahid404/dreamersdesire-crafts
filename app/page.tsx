import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CraftsGrid from "./components/CraftsGrid";
import Footer from "./components/Footer";
import { PROJECTS } from "./data/projects";

export default function Home() {
    return (
        <div className="relative min-h-screen flex flex-col soft-blue-gradient-bg text-slate-900 selection:bg-sky-500 selection:text-white dark:text-slate-100">
            {/* Ambient background blur circles */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-125 w-125 rounded-full bg-sky-200/20 blur-[120px] dark:bg-sky-900/15"></div>
                <div className="absolute top-3/4 left-1/4 h-100 w-100 rounded-full bg-blue-200/15 blur-[100px] dark:bg-blue-950/20"></div>
            </div>

            {/* Floating Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1">
                {/* Hero Section */}
                <Hero craftCount={PROJECTS.length} />

                {/* Crafts Showcase with Large Rounded Cards */}
                <CraftsGrid projects={PROJECTS} />
            </main>

            {/* Author and Copyright Footer */}
            <Footer />
        </div>
    );
}
