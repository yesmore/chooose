import { NextRequest, NextResponse } from "next/server";
import { createAnswers, createQuestion, getQuestion } from "@/lib/db/question";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const question = await getQuestion(id || undefined);

    return NextResponse.json(question);
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
