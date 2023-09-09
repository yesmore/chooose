"use client";

import { Session } from "next-auth";
import { useAnswers } from "./request";

export function AnswerWrapper({
  session,
  questionId,
}: {
  session: Session | null;
  questionId: string;
}) {
  const { answers } = useAnswers(questionId);

  return (
    <div>
      <div>答案:{answers?.length}</div>
    </div>
  );
}
