import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Technologies from "@/components/technologies";
import Features from "@/components/features";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center flex-col w-full h-full">
        <Navbar />
        <Hero />
        <Technologies />
        <Features />
        <Contact />
      </div>
    </>
  );
}
