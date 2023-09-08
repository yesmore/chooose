"use client";

import { Session } from "next-auth";
import { useAnswers } from "./request";

export function Wrapper({
  session,
  questionId,
}: {
  session: Session | null;
  questionId: string;
}) {
  const { answers } = useAnswers(questionId);

  return (
    <div>
      <div></div>
    </div>
  );
}
