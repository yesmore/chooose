import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QuestionWrapper } from "./question";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import "@/styles/home.css";

export default async function Questions() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="grids-sm z-10 min-h-screen w-full pb-4 pt-16">
        {/* @ts-expect-error Server Component */}
        <Nav />
        <QuestionWrapper session={session} />
      </div>
      <Footer />
    </>
  );
}
