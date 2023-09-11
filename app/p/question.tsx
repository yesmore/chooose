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
import useLocalStorage from "@/lib/hooks/use-local-storage";
import toast, { Toaster } from "react-hot-toast";

export function QuestionWrapper({
  session,
  questionId,
}: {
  session: Session | null;
  questionId?: string;
}) {
  const [cacheQuestionIndex, setCacheQuestionIndex] = useLocalStorage<number>(
    "question-index",
    0,
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const { data, isLoading, isError } = useQuestion(
    cacheQuestionIndex,
    questionId,
  );
  const [canUpdateQuestion, setCanUpdateQuestion] = useState(true);

  useEffect(() => {
    // 第一次请求或点击上/下一题时可赋值
    if (canUpdateQuestion || (!currentQuestion?.id && data)) {
      setCurrentQuestion(data?.data);
      setCanUpdateQuestion(false);
    }
  }, [data]);

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

  const handleNextQuestion = () => {
    setCanUpdateQuestion(true);
    const count = data?.count ?? 0;
    if (cacheQuestionIndex >= count - 1) {
      setCacheQuestionIndex(count - 1);
    } else {
      setCacheQuestionIndex(cacheQuestionIndex + 1);
    }
  };
  const handlePrevQuestion = () => {
    if (cacheQuestionIndex <= 0) {
      toast("没有更多了");
      return;
    }
    setCanUpdateQuestion(true);
    setCacheQuestionIndex(cacheQuestionIndex - 1);
  };
  const handleCleat = () => {
    setCanUpdateQuestion(true);
    setCacheQuestionIndex(0);
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
          <div className=" mt-4 grid grid-cols-1 gap-4 text-center md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                className=""
                style={{ width: "100%" }}
                height={48}
              />
            ))}
          </div>
        </div>
      )}
      {!isLoading && !data && <NotFound />}
      {data && !isLoading && (
        <div className="mt-4 animate-fade-in ">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="">{currentQuestion?.title}</h3>
            {!questionId && (
              <Link
                href={`/p/${data.data.id}`}
                target="_blank"
                className="nice-border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-sm text-transparent after:content-['↗'] "
              >
                分享
              </Link>
            )}
          </div>
          <p className="mb-6">{currentQuestion?.content}</p>

          {currentQuestion?.id && (
            <AnswerWrapper
              questionId={currentQuestion.id}
              questionTitle={currentQuestion.title}
              session={session}
            />
          )}
        </div>
      )}

      {!questionId && (
        <div className="actions mt-6">
          {/* <button onClick={() => handleCreate()}>创建</button> */}
          <p>
            共{data?.count}题，当前第{cacheQuestionIndex + 1}题
          </p>
          <button className="nice-border" onClick={handlePrevQuestion}>
            上一题
          </button>
          <button className="nice-border" onClick={handleNextQuestion}>
            下一题
          </button>
          <button className="nice-border" onClick={handleCleat}>
            清空缓存
          </button>
        </div>
      )}
      {questionId && (
        <div className="mt-6">
          <Link href="/p" className="">
            更多选择题
          </Link>
        </div>
      )}

      <CommentWrapper />
      <Toaster />
    </div>
  );
}
