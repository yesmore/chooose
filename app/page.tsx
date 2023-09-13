import { DEPLOY_URL } from "@/lib/constants";
import WebVitals from "@/components/home/web-vitals";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import "@/styles/home.css";
import "@/styles/globals.css";
import "@/styles/home.css";
import "@/styles/input.css";
import "@/styles/button.css";
import { ReactNode } from "react";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import WordClouds from "@/components/home/word-cloud";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="z-10 w-full bg-gradient-to-br from-cyan-50 via-yellow-50 to-yellow-100 pt-32">
        {/* @ts-expect-error Server Component */}
        <Nav />
        <div className="mb-8">
          <div
            className="mx-auto w-full max-w-[80%] text-center md:max-w-[70%]"
            style={{
              animationDelay: "0.15s",
              animationFillMode: "forwards",
            }}
          >
            <p className="title-font animate-fade-up text-center font-display text-3xl font-bold tracking-[-0.02em] text-slate-700 drop-shadow-sm md:text-5xl">
              选择困难症
              <span className="items-end justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ">
                治疗
              </span>
              中心
              <span className=" rounded border border-slate-400 px-1 align-top text-xs text-slate-500">
                ICU
              </span>
            </p>

            <p className="mt-6 mb-10 animate-fade-up text-slate-500 ">
              这里收录了一些奇奇怪怪的“选择题”，你可以随意选择
            </p>

            <Link
              href="/p"
              className=" rounded-md bg-blue-400 px-12 py-3 text-white shadow transition-all hover:opacity-70 hover:shadow-inner"
            >
              开始治疗
            </Link>
          </div>
          <About />
        </div>
        <Footer />
      </div>
    </>
  );
}

function About() {
  return (
    <div className="grids mx-auto my-12 max-w-[90%] text-center md:max-w-[80%]">
      <div className=" relative py-4 px-5 text-center text-sm text-slate-500 md:text-lg">
        <WordClouds />
        <div
          className="absolute top-20 left-[50%] z-10 flex w-full items-center justify-center gap-8 py-8 md:gap-12"
          style={{ transform: "translate(-50%, 0)" }}
        >
          <CardItem
            bgColor="bg-cyan-400"
            rotate="rotate-12 origin-top-left"
            icon={"A"}
          />
          <CardItem bgColor="bg-orange-400" rotate="rotate-45" icon="B" />
          <CardItem rotate="rotate-12 origin-top-left" icon={"C"} />
          <CardItem bgColor="bg-pink-400" rotate="-rotate-12" icon="D" />
        </div>
      </div>
    </div>
  );
}

function CardItem({
  bgColor = "bg-yellow-400",
  rotate = "rotate-12",
  icon,
}: {
  bgColor?: string;
  rotate?: string;
  icon: ReactNode;
}) {
  return (
    <>
      <div
        className={
          `${bgColor} ${rotate}` +
          " flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl text-xl shadow-lg transition-all hover:rotate-0 md:h-20 md:w-20"
        }
      >
        <span className="font-bold text-slate-100 md:scale-150">{icon}</span>
      </div>
    </>
  );
}
