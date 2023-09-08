import { NextRequest, NextResponse } from "next/server";
import { getAnswers } from "@/lib/db/question";

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json("empty id");
    const question = await getAnswers(id);

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json("error");
  }
}
