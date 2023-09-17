"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, UserCog, History, SmilePlus } from "lucide-react";
import Popover from "@/components/shared/popover";
import Image from "next/image";
import { Session } from "next-auth";
import Link from "next/link";
import { useUserInfoByEmail } from "@/pages/p/request";
import { generateName, getAvatarById } from "@/lib/utils";
import { useEditNicknameModal } from "./edit-nickname-modal";

export default function UserDropdown({
  session,
  setShowEditModal,
}: {
  session: Session;
  setShowEditModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { email, image } = session?.user || {};
  const { user } = useUserInfoByEmail(session?.user?.email || "");
  const [openPopover, setOpenPopover] = useState(false);

  if (!email) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            {user && (
              <button className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100">
                <p className="truncate font-semibold text-slate-700">
                  {user?.name || `${generateName(user.id || "")}`}
                </p>
              </button>
            )}
            <button className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100">
              <p className="truncate text-sm">{email}</p>
            </button>

            <hr className="my-2" />

            <button className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100">
              <SmilePlus className="h-4 w-4" />
              <Link href="/manager" className="text-sm">
                我有一个问题
              </Link>
            </button>

            <hr className="my-2" />

            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => {
                setShowEditModal(true);
                setOpenPopover(false);
              }}
            >
              <UserCog className="h-4 w-4" />
              <p className="text-sm">修改昵称</p>
            </button>

            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">退出登录</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt={email}
            src={getAvatarById(user?.id || "chooose")}
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </div>
  );
}
