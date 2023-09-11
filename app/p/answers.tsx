"use client";

import { Session } from "next-auth";
import { useAnswers } from "./request";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetcher, nFormatter } from "@/lib/utils";
import { Answer, Question } from "@/lib/types/question";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface UserSelectedQuestion {
  question_id: string;
  question_title: string;
  answer_id: string;
  answer_index: number;
}

export function AnswerWrapper({
  session,
  questionId,
  questionTitle,
}: {
  session: Session | null;
  questionId: string;
  questionTitle: string;
}) {
  const { answers, isLoading } = useAnswers(questionId);
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>();
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [totalClick, setTotalClick] = useState<number>(0);
  const [isUpdatingClick, setIsUpdatingClick] = useState(false);
  const [userSelectedQuestions, setUserSelectedQuestions] = useLocalStorage<
    UserSelectedQuestion[]
  >("user-selected-questions", []);
  const [existingQuestionIndex, setExistingQuestionIndex] =
    useState<number>(-1);

  // useEffect(() => {
  //   setSelectIndex(-1);
  // setExistingQuestionIndex(-1);
  // }, [questionId]);

  useEffect(() => {
    if (answers) {
      setCurrentAnswers(answers);
      setTotalClick(answers.reduce((acc, answer) => acc + answer.click, 0));
    }
  }, [answers]);

  useEffect(() => {
    if (userSelectedQuestions) {
      // 初始化选项
      setExistingQuestionIndex(
        userSelectedQuestions.findIndex(
          (item) => item.question_id === questionId,
        ),
      );
      if (existingQuestionIndex !== -1) {
        setSelectIndex(
          userSelectedQuestions[existingQuestionIndex].answer_index,
        );
      } else {
        setSelectIndex(-1);
      }
    }
  }, [userSelectedQuestions, existingQuestionIndex, questionId]);

  const onCaclePercent = (itemClick: number) =>
    `${((itemClick / totalClick) * 100).toFixed(2)}%`;

  const generateItemClasses = (index: number) => `
    relative cursor-pointer rounded-lg py-3 shadow transition-all hover:bg-slate-400 hover:text-white
     ${selectIndex === index ? "bg-slate-300" : "bg-gray-50"}
     ${isUpdatingClick && selectIndex === index ? "animate-pulse" : ""}
  `;

  const handleClickAnswerItem = async (index: number) => {
    if (
      userSelectedQuestions &&
      existingQuestionIndex !== -1 &&
      userSelectedQuestions[existingQuestionIndex].answer_index === index
    )
      return;

    if (currentAnswers && !isUpdatingClick) {
      setIsUpdatingClick(true);

      setSelectIndex(index);

      const id = currentAnswers[index].id as string;

      if (
        existingQuestionIndex !== -1 &&
        userSelectedQuestions[existingQuestionIndex].answer_index !== index
      ) {
        // 已经选过且再次新选的index不等于已选的index，则已选的 answer - 1， 新选的 + 1
        const res = await fetcher("/api/answers", {
          method: "POST",
          body: JSON.stringify({
            id: userSelectedQuestions[existingQuestionIndex].answer_id,
            type: "sub",
          }),
        });
        if (res) {
          const updatedAnswers = currentAnswers.map((answer) => {
            if (
              answer.id ===
              userSelectedQuestions[existingQuestionIndex].answer_id
            ) {
              return res;
            }
            return answer;
          });
          setCurrentAnswers(updatedAnswers);
        }
      }

      const res = await fetcher("/api/answers", {
        method: "POST",
        body: JSON.stringify({
          id: id,
          type: "add",
        }),
      });
      if (res) {
        const updatedAnswers = currentAnswers.map((answer) => {
          if (answer.id === id) {
            return res;
          }
          return answer;
        });
        setCurrentAnswers(updatedAnswers);
        // setExistingQuestionIndex(index);
        setIsUpdatingClick(false);
        handleSaveSelectedAnswerToLocal(id, index);
      }
    }
  };

  const handleSaveSelectedAnswerToLocal = (id: string, index: number) => {
    if (existingQuestionIndex !== -1) {
      userSelectedQuestions[existingQuestionIndex].answer_index = index;
      userSelectedQuestions[existingQuestionIndex].answer_id = id;
      setUserSelectedQuestions(userSelectedQuestions);
    } else {
      setUserSelectedQuestions([
        ...userSelectedQuestions,
        {
          question_id: questionId,
          question_title: questionTitle,
          answer_id: id,
          answer_index: index,
        },
      ]);
    }
  };

  return (
    <div className="">
      {isLoading && (
        <div className=" mt-4 grid grid-cols-1 gap-4 text-center md:grid-cols-2 ">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className=""
              style={{ width: "100%" }}
              height={48}
            />
          ))}
        </div>
      )}
      {!isLoading && currentAnswers && (
        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2 ">
          {currentAnswers.map((item, index) => (
            <div
              className={generateItemClasses(index)}
              key={item.id}
              onClick={() => handleClickAnswerItem(index)}
            >
              <div
                className="absolute top-0 left-0 h-full rounded-lg bg-gradient-to-br from-pink-400 via-yellow-400 to-blue-400 opacity-25 transition-all duration-1000"
                style={{ width: `${onCaclePercent(item.click)}` }}
              />
              <div className="">{item.value}</div>
              <div className="absolute left-1 bottom-1 rounded-lg text-xs text-slate-500 transition-all duration-1000">
                {isUpdatingClick ? "" : onCaclePercent(item.click)}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="float-right mt-3 text-sm">
        {existingQuestionIndex !== -1 ? "已回答" : "未回答"} / 已选择
        {nFormatter(totalClick)}次
      </div>
    </div>
  );
}
