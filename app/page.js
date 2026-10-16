// page.js is your home page. It just stacks the sections in order, like frames in Figma.
// Intro, Desk and SkillMap are kept in /components for later (the 3D desk opening).
import Nav from "@/components/Nav";
import PhotoHero from "@/components/PhotoHero";
import About from "@/components/About";
import WorkCards from "@/components/WorkCards";
import Experience from "@/components/Experience";
import ProcessFlip from "@/components/ProcessFlip";
import Testimonials from "@/components/Testimonials";
import Toolbox from "@/components/Toolbox";
import Beyond from "@/components/Beyond";
import Connect from "@/components/Connect";

export default function Home() {
  return (
    <>
      <Nav />
      <PhotoHero />
      <About />
      <WorkCards />
      <Experience />
      <ProcessFlip />
      <Testimonials />
      <Toolbox />
      <Beyond />
      <Connect />
    </>
  );
}
