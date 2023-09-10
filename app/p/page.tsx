import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QuestionWrapper } from "./question";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export default async function Questions() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="z-10 min-h-screen w-full bg-gradient-to-br from-cyan-50 via-yellow-50 to-yellow-100 pt-20">
        {/* @ts-expect-error Server Component */}
        <Nav />
        <QuestionWrapper session={session} />
      </div>
      <Footer />
    </>
  );
}
