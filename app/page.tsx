import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Author from "@/components/Author";
import Copyright from "@/components/Copyright";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Author />
      </main>
      <Copyright />
    </>
  );
}
