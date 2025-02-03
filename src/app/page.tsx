import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Technologies from "@/components/technologies";
import Features from "@/components/features";

export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center flex-col w-full h-full">
        <Navbar />
        <Hero />
        <Technologies />
        <Features />
      </div>
    </>
  );
}
