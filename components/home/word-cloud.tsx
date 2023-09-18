"use client";

import { Question } from "@/lib/types/question";
import { fetcher } from "@/lib/utils";
import { QuestionResponse, useLimitQuestion } from "@/pages/p/request";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import WordCloud from "wordcloud";

export default function WordClouds() {
  const router = useRouter();
  const [words, setWords] = useState<Question[]>([]);
  const { data, isLoading } = useLimitQuestion("10");

  useEffect(() => {
    if (data) {
      setWords(data);
    }
  }, [data]);

  useEffect(() => {
    // 在组件挂载后初始化词云图
    const container = document.getElementById("word-cloud-container");
    if (container) {
      WordCloud(container, {
        list: words.map((word, index) => [word.title, Math.random() * 10 + 1]),
        gridSize: 14,
        shrinkToFit: true,
        fontWeight: 600,
        weightFactor: 5,
        click: (item, dimension, event) => {
          console.log(item);
          handleRequestQuestion(item[0]);
        },

        // hover: (item, dimension, event) => {
        //   // event.target.style.fontWeight = "bold";
        //   event.currentTarget;
        //   console.log(item, event.currentTarget);
        // },
      });
    }
  }, [words]);

  const handleRequestQuestion = async (title: string) => {
    const res = await fetcher<QuestionResponse>(`/api/question?title=${title}`);
    if (res && res.data) {
      router.push(`/p/${res.data.id}`);
    }
  };

  return (
    <div className="mx-auto h-64 w-full overflow-hidden rounded text-center md:h-80">
      <div id="word-cloud-container">
        {words.map((word, index) => (
          <span className=" cursor-pointer" key={index} data-word-id={index}>
            {word.title}
          </span>
        ))}
      </div>
    </div>
  );
}
