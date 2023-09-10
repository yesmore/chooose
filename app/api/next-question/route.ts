import { NextRequest, NextResponse } from "next/server";
import { getQuestion, getQuestionByExcludedIds } from "@/lib/db/question";

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { id, ids } = await req.json();
    const question = await getQuestion(id, ids);

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(error);
  }
}
