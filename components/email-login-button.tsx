"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { isEmail } from "@/lib/utils";
import { LoadingDots } from "./shared/icons";

export default function EmailButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const sign_req = await signIn("email", {
      email: email,
      image: "https://meetu.dev/_next/image?url=%2Flogo.png&w=32&q=75",
      callbackUrl: `/`,
      redirect: false,
    });
    setTimeout(() => {
      setLoading(false);
    }, 20000);
    if (sign_req?.ok) {
      toast("发送成功，请检查邮箱");
      setLoading(false);
    } else if (sign_req?.error) {
      toast("发送失败，请重试", {
        icon: "😅",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <button
        disabled={loading}
        onClick={handleSubmit}
        className={`${
          loading
            ? "border-gray-300 bg-gray-200"
            : "border-black bg-black hover:bg-gray-100"
        } h-10 w-56 rounded-md border px-2 py-1 text-sm text-white transition-all hover:text-black`}
      >
        {loading ? (
          <LoadingDots color="gray" />
        ) : (
          <div className="flex items-center justify-center">使用邮箱登录</div>
        )}
      </button>
    </>
  );
}
