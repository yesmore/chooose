import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, getUsers } from "@/lib/db/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
// import { authOptions } from "../auth/[...nextauth]/route";
// import { getServerSession } from "next-auth/next";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string | string | undefined[]> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json("邮箱不能为空");

    const user = await getUserByEmail(email);

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export const dynamic = "force-dynamic";
