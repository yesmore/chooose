"use client";

import { Session } from "next-auth";
import { useQuestion } from "./request";
import { fetcher } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Question } from "@/lib/types/question";
import { AnswerWrapper } from "./answers";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import NotFound from "@/components/layout/not-found";
import CommentWrapper from "./comment";

export function QuestionWrapper({
  session,
  questionId,
}: {
  session: Session | null;
  questionId?: string;
}) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const { question, isLoading, isError } = useQuestion([], questionId);

  useEffect(() => {
    if (!currentQuestion?.id && question) {
      setCurrentQuestion(question);
    }
  }, [question]);

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
    <div
      className="z-10 mx-auto max-w-[80%] md:max-w-[70%]"
      style={{
        animationDelay: "0.15s",
        animationFillMode: "forwards",
      }}
    >
      {isLoading && (
        <div className="">
          <Skeleton className="mb-3" width={200} height={30} />
          <Skeleton style={{ width: "100%" }} count={3} />
          <div className=" mt-4 grid grid-cols-1 gap-4 text-center md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="" style={{ width: "100%" }} height={48} />
            <Skeleton className="" style={{ width: "100%" }} height={48} />
            <Skeleton className="" style={{ width: "100%" }} height={48} />
            <Skeleton className="" style={{ width: "100%" }} height={48} />
          </div>
        </div>
      )}
      {!isLoading && !question && <NotFound />}
      {question && !isLoading && (
        <div className="mt-4 animate-fade-in ">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="">{currentQuestion?.title}</h3>
            <Link
              href={`/p/${question.id}`}
              target="_blank"
              className="nice-border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-sm text-transparent after:content-['↗'] "
            >
              分享
            </Link>
          </div>
          <p className="mb-6">{currentQuestion?.content}</p>

          {/* <button onClick={() => handleCreate()}>创建</button> */}
          {currentQuestion?.id && (
            <AnswerWrapper
              questionId={currentQuestion.id}
              session={session}
              setCurrentQuestion={setCurrentQuestion}
            />
          )}
        </div>
      )}

      <CommentWrapper />
    </div>
  );
}
