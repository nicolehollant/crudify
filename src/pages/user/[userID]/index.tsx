import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useRouter } from "next/router";
import { httpRequest } from "@hooks/httpRequest";
import AppHeader from "@components/app-header";
import UserEntities from "@components/user-entities";
import Avatar from "@components/avatar";
import IconPlus from "~icons/mdi/plus.jsx";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const user = useQuery({
    queryKey: [`getUserAccount-${router.query.userID}`],
    queryFn: () => httpRequest().get(`/api/user/${router.query.userID}`),
  });
  if (user.isLoading) {
    return (
      <MainLayout>
        <div className="m-auto grid max-w-4xl gap-6 px-8 py-12">
          <p className="animate-pulse text-slate-500">loading...</p>
        </div>
      </MainLayout>
    );
  }
  return (
    <>
      <Head>
        <title>Crudify User</title>
        <meta name="description" content="Crudify user page" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto max-w-7xl px-8 py-12">
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <section className="flex shrink-0 items-center gap-8">
                <Avatar
                  email={user.data?.email ?? ""}
                  image={user.data?.image ?? ""}
                  size="xl"
                ></Avatar>
                <div>
                  <p className="break-all text-2xl capitalize tracking-wide">
                    {user.data?.name}
                  </p>
                  <p className="break-all text-xl tracking-wide text-slate-400">
                    {user.data?.slug}
                  </p>
                </div>
              </section>
            </div>
            <hr className="border-t-2 border-fuchsia-900/30" />
            <section className="flex flex-1 flex-col gap-4">
              <h3 className="text-xl text-fuchsia-300/80">
                <span className="capitalize">{user.data?.name}&apos;s</span>{" "}
                Entities
              </h3>
              {user.data?.userID && (
                <>
                  <UserEntities userID={user.data.userID}></UserEntities>
                </>
              )}
            </section>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default UserProfile;
