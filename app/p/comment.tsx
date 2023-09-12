"use client";

import { Session } from "next-auth";
import { useComments, useUserInfoByEmail } from "./request";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetcher, getAvatarByEmail } from "@/lib/utils";
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
  const { comments, isLoading } = useComments(questionId, commentList.length);
  const { user } = useUserInfoByEmail(session?.user?.email || "");
  const [inputComment, setInputComment] = useState("");
  const [isCreatingComment, setIsCreatingComment] = useState(false);

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
    if (!inputComment) {
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
    console.log(res);
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

  return (
    <>
      <div className="mt-8 w-full">
        <div>
          <textarea
            className="w-full rounded-md border"
            placeholder="评论内容，支持Markdown语法"
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
          />
          <button
            disabled={isCreatingComment || inputComment.length === 0}
            className="nice-border"
            onClick={handleCreateComment}
          >
            {isCreatingComment ? "提交中" : "提交"}
          </button>
        </div>

        <div className="pb-4 ">
          {commentList &&
            commentList.map((item, index) => (
              <div className="border-b border-slate-100 py-2 px-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Image
                      alt={"avatar"}
                      src={user?.image || getAvatarByEmail(user?.email || "")}
                      width={30}
                      height={30}
                    />
                    <span> {item.userName}</span>
                  </div>

                  {item.userId === user?.id && (
                    <div>
                      <Trash2
                        className=" float-right h-4 w-4 cursor-pointer text-slate-400"
                        onClick={() =>
                          handleDeleteComment(item.id || "", user.email)
                        }
                      />
                    </div>
                  )}
                </div>
                <ReactMarkdown className="my-1 text-sm">
                  {item.content}
                </ReactMarkdown>
              </div>
            ))}
        </div>
      </div>
      <Toaster />
    </>
  );
}
