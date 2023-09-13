"use client";

import { Session } from "next-auth";
import { useComments, useUserInfoByEmail } from "./request";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetcher, formatDate, getAvatarById } from "@/lib/utils";
import { Comment } from "@/lib/types/question";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export default function CommentWrapper({
  session,
  questionId,
}: {
  session: Session | null;
  questionId: string;
}) {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const { user } = useUserInfoByEmail(session?.user?.email || "");
  const [inputComment, setInputComment] = useState("");
  const [isCreatingComment, setIsCreatingComment] = useState(false);

  const { comments, isLoading } = useComments(questionId, commentList.length);

  useEffect(() => {
    if (comments) {
      setCommentList(comments);
    }
  }, [comments]);

  const handleCreateComment = async () => {
    if (!session?.user || !user) {
      toast("登录后评论");
      return;
    }
    if (inputComment.length === 0) {
      return;
    }

    setIsCreatingComment(true);
    const res = await fetcher(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        userName: user.name || `匿名用户${user.id?.slice(-6)}`,
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
          userName: user.name || "",
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

  return (
    <>
      <div className="mt-6 w-full">
        <p className="mb-2 text-sm font-semibold text-slate-500">评论</p>
        <div className="relative ">
          <textarea
            className="shadow-blue-gray-200 w-full rounded-md border border-slate-200 bg-gray-100 text-sm placeholder-gray-400 shadow-inner"
            placeholder="支持Markdown语法"
            value={inputComment}
            rows={4}
            maxLength={300}
            onChange={(e) => setInputComment(e.target.value)}
            onKeyDown={(e) => handleKeydown(e.key)}
          />
          <button
            disabled={isCreatingComment || inputComment.length === 0}
            className={
              "absolute right-2 bottom-4 cursor-pointer rounded border px-3 py-1 text-sm text-slate-500 transition-all " +
              `${
                inputComment.length > 0
                  ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  : "bg-slate-400 text-slate-100"
              }`
            }
            onClick={handleCreateComment}
          >
            {isCreatingComment ? "提交中" : "提交"}
          </button>
        </div>

        <div className="py-4 ">
          {commentList &&
            commentList.map((item, index) => (
              <div
                key={item.id}
                className="border-b border-slate-100 py-2 px-2"
              >
                <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Image
                      alt={"avatar"}
                      src={getAvatarById(item.userId)}
                      width={25}
                      height={25}
                      className=" border border-slate-600"
                    />
                    <span> {item.userName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">#{index + 1}</span>
                    <span className="text-xs text-slate-400">
                      {formatDate(item.createdAt ?? "")}
                    </span>
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
        </div>
      </div>
      <Toaster />
    </>
  );
}
