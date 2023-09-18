"use client";

import Link from "next/link";
import Image from "next/image";
import Pill from "../shared/icons/pill";

export default function UserFooter() {
  return (
    <>
      <div
        className="absolute bottom-10 left-[50%]"
        style={{ transform: "translate(-50%, 0)" }}
      >
        <Link
          href="/"
          className="flex flex-col items-center justify-center font-display"
        >
          <Pill className="h-5 w-5" />
          {/* <p>Meet U</p> */}
          <p className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent">
            Chooose.icu
          </p>
        </Link>
      </div>
    </>
  );
}
