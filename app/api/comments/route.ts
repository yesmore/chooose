import { NextRequest, NextResponse } from "next/server";
import { createAnswers, createQuestion } from "@/lib/db/question";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  // const question = await getRandomQuestion();

  return NextResponse.json(1);
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
