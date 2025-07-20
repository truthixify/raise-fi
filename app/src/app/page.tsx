import Header from "@/components/Header";
import Hero1 from "@/components/Hero1";
import Hero2 from "@/components/Hero2";
import { CurveSvg } from "@/components/reusables";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col mx-auto w-fit">
        {/* <CurveSvg /> */}
        {/* This will be in a component of its own */}
        <Hero1 />

        <Hero2 />
      </main>
      <footer className="py-4 grid place-items-center font-semibold">
            <p className="">Built with Love by team</p>
      </footer>
    </div>
  );
}
