"use client";

import { Session } from "next-auth";
import { useRandomQuestion } from "./request";
import { fetcher } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Question } from "@/lib/types/question";
import { AnswerWrapper } from "./answers";

export function Wrapper({ session }: { session: Session | null }) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const { question, isLoading, isError } = useRandomQuestion();

  useEffect(() => {
    if (!currentQuestion?.id && question) {
      setCurrentQuestion(question);
    }
  }, [question, isLoading]);

  const handleCreate = () => {
    fetcher("/api/question", {
      method: "POST",
      body: JSON.stringify({
        title: "标题3",
        content: "内容尼尔内容内容",
        answers: ["answers1", "answers2", "answers3", "answers4"],
      }),
    });
  };

  return (
    <div>
      <div>
        {isLoading ? "加载中" : currentQuestion?.title}
        {/* <button onClick={() => handleCreate()}>创建</button> */}
        {currentQuestion?.id && (
          <AnswerWrapper questionId={currentQuestion.id} session={session} />
        )}
      </div>
    </div>
  );
}
