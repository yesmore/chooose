import { NextRequest, NextResponse } from "next/server";
import {
  createAnswers,
  createQuestion,
  getQuestionById,
  getQuestionByIndex,
  getQuestionByTitle,
  getQuestions,
  updateQuestionDislikes,
  updateQuestionLikes,
} from "@/lib/db/question";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserByEmail } from "@/lib/db/user";
import { generateName } from "@/lib/utils";

// export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const index = searchParams.get("i");
    const id = searchParams.get("id");
    const title = searchParams.get("title");
    const limit = searchParams.get("limit");

    // if (!index) return NextResponse.json("empty index");
    if (limit) {
      const data = await getQuestions(Number(limit));
      return NextResponse.json(data);
    }

    if (index && !id && !title) {
      const data = await getQuestionByIndex(Number(index));
      return NextResponse.json(data);
    }
    if (id && index && !title) {
      if (id.length < 12) {
        return NextResponse.json("invalid id");
      }
      const data = await getQuestionById(id);
      return NextResponse.json(data);
    }
    if (title && !index && !id) {
      const data = await getQuestionByTitle(title);
      return NextResponse.json(data);
    }

    return NextResponse.json("empty param");
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({
        data: null,
        code: 401,
        msg: "未登录",
      });
    }
    const emails = process.env.WHITE_EMAIL || "";
    const white_emails = emails.split(",");

    if (
      session &&
      session.user &&
      !white_emails.includes(session.user.email || "")
    ) {
      return NextResponse.json({
        data: null,
        code: 401,
        msg: "未授权",
      });
    }
    const user = await getUserByEmail(session?.user.email || "");

    if (!user)
      return NextResponse.json({
        data: null,
        code: 402,
        msg: "找不到用户",
      });

    const { title, content, answers } = await req.json();
    if (!title || !answers) {
      return NextResponse.json({
        data: null,
        code: 403,
        msg: "empty `title` or `answers`",
      });
    }

    const res = await createQuestion(
      title,
      content,
      user.id,
      user.name || generateName(user.id),
    );
    if (res) {
      const createdAnswers = await createAnswers(res.id, answers);
      if (createdAnswers)
        return NextResponse.json({
          data: res.id,
          code: 200,
          msg: "success",
        });
    } else {
      return NextResponse.json({
        data: null,
        code: 402,
        msg: "something wrong",
      });
    }
  } catch {
    return NextResponse.json({
      data: null,
      code: 500,
      msg: "error",
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { questionId, key, type } = await req.json();

    if (key === "likes") {
      const res = await updateQuestionLikes(questionId, type);
      return NextResponse.json(res);
    } else if (key === "dislikes") {
      const res = await updateQuestionDislikes(questionId, type);
      return NextResponse.json(res);
    }
  } catch {
    return NextResponse.json("error");
  }
}
