import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Answer, Comment, Question, User } from "@/lib/types/question";

export interface QuestionResponse {
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

export function useLimitQuestion(limit: string) {
  const { data, error, isLoading } = useSWR<Question[]>(
    `/api/question?limit=${limit}`,
    () =>
      fetcher(`/api/question?limit=${limit}`, {
        method: "GET",
      }),
  );

  return {
    data: data,
    isLoading,
    isError: error,
  };
}

export function useComments(questionId: string, length: number) {
  let api = `/api/comments?id=${questionId}&content=${length}`;
  const { data, error, isLoading } = useSWR<Comment[]>(api, () =>
    fetcher(api, {
      method: "GET",
    }),
  );

  return {
    comments: data,
    isLoading,
    isError: error,
  };
}

export function useUserInfoByEmail(email: string) {
  let api = `/api/users?email=${email}`;
  const { data, error, isLoading } = useSWR<User>(api, () =>
    fetcher(api, {
      method: "GET",
    }),
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
