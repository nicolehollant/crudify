import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Avatar from "./avatar";
import ToggledMenu from "./toggled-menu";

const AuthStatus: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.user?.email) {
    return (
      <>
        <div className="flex items-center gap-2">
          <ToggledMenu
            trigger={
              <Avatar
                email={session.user.email}
                image={session.user?.image ?? undefined}
              ></Avatar>
            }
            align="RIGHT"
          >
            <button onClick={() => signOut()}>Sign out</button>
          </ToggledMenu>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex items-center justify-around transition duration-300 hover:text-fuchsia-300">
        <Link href="/api/auth/signin">Login</Link>
      </div>
    </>
  );
};

export default AuthStatus;
