"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";
import { Suspense } from "react";
import { useEditNicknameModal } from "./edit-nickname-modal";

export default function NavBar({ session }: { session: Session | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { EditModal, setShowEditModal } = useEditNicknameModal(session);
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
      <EditModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center font-display">
              {/* <Pill className="h-5 w-5" /> */}
              <p className="via-dark-500 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text font-bold text-transparent">
                Ch
                <span className="items-end justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ">
                  ooo
                </span>
                se.icu
              </p>
            </Link>
            {/* <Link
              href="/stories"
              className="mx-4 flex items-center font-display text-slate-600 hover:text-slate-500"
            >
              榜单
            </Link> */}
            {/* <Link
              href="/about"
              className="flex items-center font-display hover:text-slate-500"
            >
              about
            </Link> */}
          </div>

          <Suspense fallback="...">
            <div>
              {session ? (
                <UserDropdown
                  session={session}
                  setShowEditModal={setShowEditModal}
                />
              ) : (
                <button
                  className="nice-border rounded-full border border-gray-100 text-sm hover:border-gray-800"
                  onClick={() => setShowSignInModal(true)}
                >
                  注册/登录
                </button>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}
