"use client";

import { KeyboardEventHandler, useState } from "react";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { isEmail } from "@/lib/utils";
import { LoadingDots } from "./shared/icons";

export default function EmailButton() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSendSuccess, setIsSendSuccess] = useState(false);

  const handleSubmit = async () => {
    if (email === "") {
      toast("邮箱不能为空", {
        icon: "😅",
      });
      return;
    }
    if (!isEmail(email)) {
      toast("邮箱格式错误", {
        icon: "😅",
      });
      return;
    }

    setIsSendSuccess(false);
    setLoading(true);

    const sign_req = await signIn("email", {
      email: email,
      image: "https://chooose.icu/_next/image?url=%2Flogo.png&w=32&q=75",
      callbackUrl: `/`,
      redirect: false,
    });
    setTimeout(() => {
      setLoading(false);
    }, 20000);
    if (sign_req?.ok) {
      setLoading(false);
      setIsSendSuccess(true);
    } else if (sign_req?.error) {
      toast("发送失败，请重试", {
        icon: "😅",
      });
      setLoading(false);
      setIsSendSuccess(false);
    }
  };
  const handleKeydown = (key: string) => {
    console.log(key);

    if (key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <Toaster />
      <input
        className="mb-2  rounded-md"
        type="text"
        placeholder="请输入邮箱"
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => handleKeydown(e.key)}
      />
      <button
        disabled={loading}
        onClick={handleSubmit}
        className={`
        ${
          loading
            ? "border-gray-300 bg-gray-200"
            : `${
                isSendSuccess
                  ? " border-blue-500 bg-blue-500 hover:text-blue-500"
                  : "border-black bg-black hover:text-black"
              } hover:bg-gray-100`
        } 
        h-10 w-full rounded-md border px-2 py-1 text-sm text-white transition-all `}
      >
        {loading ? (
          <LoadingDots color="gray" />
        ) : (
          <div className="flex items-center justify-center">
            {isSendSuccess && !loading
              ? "发送成功，请检查邮箱"
              : "使用邮箱注册/登录"}
          </div>
        )}
      </button>
    </>
  );
}
