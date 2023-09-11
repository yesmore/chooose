import { NextRequest, NextResponse } from "next/server";
import {
  createAnswers,
  createQuestion,
  getQuestionById,
  getQuestionByIndex,
  updateQuestionDislikes,
  updateQuestionLikes,
} from "@/lib/db/question";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const index = searchParams.get("i");
    const id = searchParams.get("id");
    if (!index) return NextResponse.json("empty index");

    if (!id) {
      const data = await getQuestionByIndex(Number(index));
      return NextResponse.json(data);
    } else {
      const data = await getQuestionById(id);
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { title, content, answers } = await req.json();

    createQuestion(title, content).then(async (question) => {
      const createdAnswers = await createAnswers(question.id, answers);
      console.log("创建的答案记录:", createdAnswers);
    });
    return NextResponse.json("success");
  } catch {
    return NextResponse.json("error");
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
