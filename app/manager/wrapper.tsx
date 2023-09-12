"use client";

import { fetcher } from "@/lib/utils";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { QuestionResponse } from "../p/request";
import Link from "next/link";

export default function ManagerWrapper() {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [newId, setNewId] = useState("");

  const handleCreate = async () => {
    if (!isCreating && title && answer) {
      const res_find = await fetcher<QuestionResponse>(
        `/api/question?title=${title}`,
      );
      if (res_find && res_find.data) {
        toast("标题已存在");
        return;
      }

      setIsCreating(true);
      console.log(title, content, answer.split("="));
      const res = await fetcher("/api/question", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          answers: answer.split("="),
        }),
      });
      if (res && res.data) {
        toast("创建成功");
        setNewId(res.data);
        // setTitle("")
        // setContent("")
        // setAnswer("")
        setIsCreating(false);
      } else {
        toast(res.msg);
        setIsCreating(false);
      }
    }
  };
  return (
    <>
      <div className="mx-auto mt-6 max-w-[85%] md:max-w-[70%]">
        <div className="flex flex-col justify-center gap-3">
          <input
            className="rounded-md border"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="标题"
          />
          <textarea
            className="rounded-md border"
            placeholder="内容"
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            className="rounded-md border"
            type="text"
            placeholder="选项（使用=间隔）"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            disabled={isCreating}
            onClick={handleCreate}
            className="nice-border mt-4"
          >
            {isCreating ? "提交中" : "提交"}
          </button>
          <p>
            新问题：
            <Link href={`/p/${newId}`} target="_blank">
              {newId}
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </>
  );
}
