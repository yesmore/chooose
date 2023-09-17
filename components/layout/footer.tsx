"use client";

import Link from "next/link";
import Image from "next/image";
import { Github } from "../shared/icons";

export default function Footer() {
  return (
    <div className=" h-32 w-full border-t border-gray-200 bg-white py-5 text-center ">
      <Link
        href="/"
        className="flex flex-col items-center justify-center font-display text-xl"
      >
        🤡
      </Link>
      <div className="mt-2 flex items-center justify-center text-sm">
        <Link href="/manager">我要投稿</Link>
        <span className="mx-2">‣</span>
        <Link href="/privacy">隐私政策</Link>
        <span className="mx-2">‣</span>
        <Link href="mailto:3224266014@qq.com">联系我们</Link>
        <span className="mx-2">‣</span>
        <Link
          className="items-end justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-purple-500 bg-clip-text font-semibold text-transparent "
          href="https://discord.gg/utuNdj35vr"
          target="_blank"
        >
          Discord
        </Link>
      </div>
      <div className="mt-2 flex items-center justify-center text-sm">
        <span>Copyright © 2023 </span>
        <Link
          className="ml-1 font-medium text-gray-800 transition-colors"
          href="https://chooose.icu"
          target="_blank"
          rel="noopener noreferrer"
        >
          chooose.icu
        </Link>
      </div>
    </div>
  );
}
