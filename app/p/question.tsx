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
import { ArrowRight, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { nFormatter } from "../../lib/utils";

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
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentDislikes, setCurrentDislikes] = useState(0);
  const { data, isLoading, isError } = useQuestion(
    cacheQuestionIndex,
    questionId,
  );
  const [canUpdateQuestion, setCanUpdateQuestion] = useState(true);
  const [isLike, setIslike] = useState(false);
  const [isDislike, setIsDislike] = useState(false);

  useEffect(() => {
    // 第一次请求或点击上/下一题时可赋值
    if (canUpdateQuestion || (!currentQuestion?.id && data)) {
      setCurrentQuestion(data?.data);
      setCanUpdateQuestion(false);
    }
  }, [data]);

  useEffect(() => {
    setIslike(false);
    setIsDislike(false);
  }, [cacheQuestionIndex]);

  useEffect(() => {
    if (currentQuestion) {
      setCurrentLikes(currentQuestion.likes);
      setCurrentDislikes(currentQuestion.dislikes);
    }
  }, [currentQuestion]);

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

  const handleUpdateLikes = async (key: "likes" | "dislikes") => {
    if (!session?.user) {
      toast("请先登陆");
      return;
    }

    if (key === "likes") {
      if (isLike) {
        handleRequestUpdateLikes("likes", "sub");
      } else {
        handleRequestUpdateLikes("likes", "add");
      }
      setIslike(!isLike);
    } else {
      if (isDislike) {
        handleRequestUpdateLikes("dislikes", "sub");
      } else {
        handleRequestUpdateLikes("dislikes", "add");
      }
      setIsDislike(!isDislike);
    }
  };

  const handleRequestUpdateLikes = async (
    key: "likes" | "dislikes",
    type: "add" | "sub",
  ) => {
    const res = await fetcher(`/api/question`, {
      method: "PUT",
      body: JSON.stringify({
        questionId: currentQuestion?.id,
        key,
        type,
      }),
    });

    if (res) {
      if (key === "likes") {
        setCurrentLikes(res);
      } else {
        setCurrentDislikes(res);
      }
    }
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
                className="rounded border border-slate-100 p-1 text-xs text-slate-500 transition-all after:content-['↗'] hover:border-slate-200 hover:shadow"
                href={`/p/${data.data.id}`}
                target="_blank"
              >
                <span>题链</span>
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
        <div className="actions mt-10 w-full">
          {/* <button onClick={() => handleCreate()}>创建</button> */}
          {/* <p>
            共{data?.count}题，当前第{cacheQuestionIndex + 1}题
          </p> */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <button
                className={
                  "flex items-center gap-1 rounded-lg text-slate-500 transition-all hover:text-slate-600 " +
                  `${isLike ? "text-blue-600" : ""}`
                }
                onClick={() => handleUpdateLikes("likes")}
              >
                <ThumbsUp className="w-4" />
                <span className="text-xs">{nFormatter(currentLikes)}</span>
              </button>
              <button
                className={
                  "flex items-center gap-1 rounded-lg text-slate-400 transition-all hover:text-slate-600 " +
                  `${isDislike ? "text-blue-600" : ""}`
                }
                onClick={() => handleUpdateLikes("dislikes")}
              >
                <ThumbsDown className="w-4" />
                <span className="text-xs">{nFormatter(currentDislikes)}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border px-4 py-1 shadow transition-all hover:bg-slate-500 hover:text-white md:px-6 "
                onClick={handlePrevQuestion}
              >
                <ArrowLeft className="w-5" />
              </button>
              <button
                className="rounded-lg border px-4 py-1 shadow transition-all hover:bg-slate-500 hover:text-white md:px-6 "
                onClick={handleNextQuestion}
              >
                <ArrowRight className="w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {questionId && (
        <div className="mt-6">
          <Link href="/p" className="">
            查看更多
          </Link>
        </div>
      )}

      <CommentWrapper />
      <Toaster />
    </div>
  );
}
