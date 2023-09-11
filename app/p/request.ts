import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Answer, Question } from "@/lib/types/question";

interface QuestionResponse {
  data: Question;
  count: number;
}

export function useQuestion(index: number, id?: string) {
  const { data, error, isLoading } = useSWR<QuestionResponse>(
    `/api/question?i=${index}`,
    () =>
      fetcher(`/api/question?i=${index}${id ? `&id=${id}` : ""}`, {
        method: "GET",
      }),
  );

  return {
    data: data,
    isLoading,
    isError: error,
  };
}

export function useAnswers(questionId: string) {
  let api = `/api/answers?id=${questionId}`;
  const { data, error, isLoading } = useSWR<[Answer]>(api, () =>
    fetcher(api, {
      method: "GET",
    }),
  );

  return {
    answers: data,
    isLoading,
    isError: error,
  };
}
