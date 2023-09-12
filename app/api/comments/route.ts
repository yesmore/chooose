import { NextRequest, NextResponse } from "next/server";
import { createComment, deleteComment, getComments } from "@/lib/db/comment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json("empty id");

  const comments = await getComments(id);

  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { userId, userName, questionId, content } = await req.json();
    if (!userId || !userName || !questionId || !content) {
      return NextResponse.json("empty content");
    }

    const res = await createComment(userId, userName, questionId, content);
    if (res) {
      return NextResponse.json("success");
    }

    return NextResponse.json("something wrong");
  } catch {
    return NextResponse.json("error");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json("请登录");
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id) return NextResponse.json("id不能为空");

    if (email !== session.user.email) return NextResponse.json("未授权");

    const res = await deleteComment(id);
    return NextResponse.json(res);
  } catch (error) {
    console.log("[出错了]", error);

    return NextResponse.json(error);
  }
}
