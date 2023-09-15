import { fetcher } from "@/lib/utils";
import { useState } from "react";
import ManagerWrapper from "./wrapper";
import "@/styles/home.css";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export default function Manager() {
  return (
    <>
      <div className="grids-sm z-10 min-h-screen w-full pb-4 pt-16">
        {/* @ts-expect-error Server Component */}
        <Nav />
        <ManagerWrapper />
      </div>
      <Footer />
    </>
  );
}
