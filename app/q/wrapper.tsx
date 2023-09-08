"use client";

import { Session } from "next-auth";
import { useRandomQuestion } from "./request";
import { fetcher } from "@/lib/utils";

export function Wrapper({ session }: { session: Session | null }) {
  const { question, isLoading, isError } = useRandomQuestion();

  const handleCreate = () => {
    fetcher("/api/question", {
      method: "POST",
      body: JSON.stringify({
        title: "标题1",
        content: "内容尼尔内容内容",
        answers: ["answers1", "answers2", "answers3", "answers4"],
      }),
    });
  };

  return (
    <div>
      <div>
        {isLoading ? "加载中" : question?.title}
        <button onClick={() => handleCreate()}>创建</button>
      </div>
    </div>
  );
}
