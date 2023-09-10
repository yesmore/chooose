import { NextRequest, NextResponse } from "next/server";
import { getAnswers, updateAnswer } from "@/lib/db/question";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json("empty id");

    const question = await getAnswers(id);
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json("error");
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { id, type } = await req.json();

    if (!id) return NextResponse.json("empty id");

    const question = await updateAnswer(id, type);
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json("error");
  }
}
