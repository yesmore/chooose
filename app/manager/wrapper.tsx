"use client";

import { fetcher } from "@/lib/utils";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { QuestionResponse } from "../p/request";
import Link from "next/link";
import { LoadingDots } from "@/components/shared/icons";

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

  const handleClear = () => {
    setTitle("");
    setContent("");
    setAnswer("");
    setNewId("");
  };

  const handleAnswer = () => {
    setAnswer("不知道答案，病友来帮忙");
  };

  return (
    <>
      <div className="mx-auto mt-6 max-w-[85%] md:max-w-[70%]">
        <div className="flex flex-col justify-center gap-3">
          <h2 className="text-3xl">投稿中心</h2>
          <p className="text-blue-500">
            你可以将你的问题/选择题投稿至本站，投稿格式按下方输入区域排版即可。{" "}
          </p>
          <input
            className="rounded-md border"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            value={title}
            placeholder="标题 (必填)"
          />
          <textarea
            className="rounded-md border"
            placeholder="内容描述, 支持Markdown语法 (可不填)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <textarea
            className="rounded-md border"
            placeholder="选项, 仅支持文本（每个选项使用=间隔, 必填）"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            disabled={isCreating || !(title.length > 0 && answer.length > 0)}
            onClick={handleCreate}
            className={
              "nice-border mt-4" +
              `
                ${
                  title.length > 0 && answer.length > 0
                    ? " bg-blue-500 text-white"
                    : " bg-slate-500"
                }
              `
            }
          >
            {isCreating ? <LoadingDots /> : "提交"}
          </button>

          <button className="nice-border mt-2" onClick={handleAnswer}>
            不知道答案，病友来帮忙
          </button>

          <button className="nice-border mt-2" onClick={handleClear}>
            清空
          </button>

          {newId && (
            <p className="mt-3">
              题链🔗：
              <Link href={`/p/${newId}`} target="_blank">
                {newId}
              </Link>
            </p>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
