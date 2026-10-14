// page.js is your home page. It just stacks the sections in order, like frames in Figma.
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Beyond from "@/components/Beyond";
import Connect from "@/components/Connect";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Work />
      <Process />
      <Beyond />
      <Connect />
    </>
  );
}
