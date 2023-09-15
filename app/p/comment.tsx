"use client";

import { Session } from "next-auth";
import { useComments, useUserInfoByEmail } from "./request";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  fetcher,
  formatDate,
  generateName,
  getAvatarById,
  nFormatter,
} from "@/lib/utils";
import { Answer, Comment, User } from "@/lib/types/question";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { LoadingDots } from "@/components/shared/icons";
import { Answer_Letters } from "@/lib/constants";

export default function CommentWrapper({
  session,
  questionId,
  currentAnswers,
  user,
}: {
  session: Session | null;
  questionId: string;
  currentAnswers?: Answer[];
  user?: User;
}) {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [inputComment, setInputComment] = useState("");
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useComments(questionId, currentPage, pageSize);

  useEffect(() => {
    if (data && data.comments) {
      setCommentList(data.comments);
    }
  }, [data, currentPage, questionId]);

  useEffect(() => {
    setCurrentPage(0);
  }, [questionId]);

  const handleCreateComment = async () => {
    if (!session?.user || !user) {
      toast("登录后评论");
      return;
    }
    if (inputComment.length === 0) {
      return;
    }

    setIsCreatingComment(true);
    const name = user.name || generateName(user.id || "");
    const res = await fetcher(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        userName: name,
        questionId,
        content: inputComment,
      }),
    });
    if (res) {
      setIsCreatingComment(false);
      setCommentList([
        ...commentList,
        {
          content: inputComment,
          questionId: questionId,
          userId: user.id || "",
          userName: name,
          likes: 0,
          dislikes: 0,
        },
      ]);
      setInputComment("");
    } else {
      setIsCreatingComment(false);
      toast(res);
    }
  };
  const handleDeleteComment = async (id: string, email: string) => {
    const res = await fetcher(`/api/comments?id=${id}&email=${email}`, {
      method: "DELETE",
    });
    if (res && res.id) {
      toast("已删除");
      setCommentList(commentList.filter((item) => item.id !== res.id));
    } else {
      toast(res);
    }
  };
  const handleKeydown = (key: string) => {
    if (key === "Enter") {
      // handleCreateComment();
    }
  };
  const handlePrevComment = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextComment = () => {
    if (data && pageSize * (currentPage + 1) < data.total) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="mt-6 w-full">
        <p className="mb-2 text-sm font-semibold text-slate-500">
          病友评论吧{data && data?.total > 0 && `(${nFormatter(data.total)})`}
        </p>

        <div className="relative">
          <textarea
            className="shadow-blue-gray-200 w-full rounded-md border border-slate-200 bg-[#f8f8f8a1] text-sm placeholder-gray-400 shadow-inner"
            placeholder={`${
              Answer_Letters[currentAnswers?.length || 0]
            }: 你的答案 (支持Markdown语法)`}
            value={inputComment}
            rows={4}
            maxLength={300}
            onChange={(e) => setInputComment(e.target.value)}
            onKeyDown={(e) => handleKeydown(e.key)}
          />
          <button
            disabled={isCreatingComment || inputComment.length === 0}
            className={
              "absolute right-2 bottom-4 w-16 cursor-pointer rounded border px-3 py-1 text-sm text-slate-500 transition-all " +
              `${
                inputComment.length > 0
                  ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  : "bg-slate-400 text-slate-100"
              }`
            }
            onClick={handleCreateComment}
          >
            {isCreatingComment ? <LoadingDots color="#fff" /> : "提交"}
          </button>
        </div>

        {commentList &&
          commentList.map((item, index) => (
            <div
              id={`comment-${item.id}`}
              key={item.id}
              className="border-b border-slate-200 py-2 px-2"
            >
              <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="rounded border border-slate-200">
                    <Image
                      alt={"avatar"}
                      src={getAvatarById(item.userId)}
                      width={25}
                      height={25}
                    />
                  </div>

                  <span>{item.userName}</span>
                  <span className="text-xs text-slate-400">
                    {formatDate(item.createdAt ?? "")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">#{index + 1}</span>
                  {item.userId === user?.id && (
                    <Trash2
                      className=" h-4 w-4 cursor-pointer text-slate-400"
                      onClick={() =>
                        handleDeleteComment(item.id || "", user.email)
                      }
                    />
                  )}
                </div>
              </div>

              <div className="my-1 pl-9 text-sm">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </div>
          ))}

        <div className="flex items-center justify-between">
          <span
            className="cursor-pointer text-sm text-slate-500"
            onClick={() => window.scrollTo(0, 0)}
          >
            回到顶部
          </span>
          <div className="flex items-center justify-end gap-2 pt-4 text-sm">
            <span className=" text-slate-500">
              共 {data?.total} 条, 第 {currentPage + 1} 页
            </span>
            <button
              className="rounded-lg border px-1 shadow transition-all hover:bg-slate-500 hover:text-white"
              onClick={handlePrevComment}
            >
              <ChevronLeft className="w-4" />
            </button>
            <button
              className="rounded-lg border px-1 shadow transition-all hover:bg-slate-500 hover:text-white"
              onClick={handleNextComment}
            >
              <ChevronRight className="w-4" />
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
