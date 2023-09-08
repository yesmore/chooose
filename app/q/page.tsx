import { getServerSession } from "next-auth/next";

import UserFooter from "@/components/layout/user-footer";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Wrapper } from "./wrapper";

export default async function UserHome({
  params,
}: {
  params: { nickname: string };
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="relative z-10 w-full overflow-x-hidden">
        <Wrapper session={session} />
      </div>
    </>
  );
}
