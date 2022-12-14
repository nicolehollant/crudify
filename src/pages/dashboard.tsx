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
import { useEffect, useState } from "react";
import Tab from "@components/tab-selector";
import UserPools from "@components/user-pools";

const Dashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"Entities" | "User Pools">(
    "Entities"
  );
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => httpRequest().get("/api/user"),
  });
  useEffect(() => {
    if (
      !currentUser.isLoading &&
      currentUser?.data?.error === "User does not have account"
    ) {
      router.push("/account/create");
    }
  }, [currentUser]);
  if (
    status === "unauthenticated" ||
    (status === "authenticated" && !session?.user?.email)
  ) {
    router.push("/");
  }
  if (status === "loading" || currentUser.isLoading) {
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
        <title>Dashboard</title>
        <meta
          name="description"
          content="View your Crudify entities and create new ones"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto max-w-7xl px-8 py-12">
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <section className="flex shrink-0 items-center gap-8">
                <Avatar
                  email={session?.user?.email ?? ""}
                  image={session?.user?.image ?? ""}
                  size="xl"
                ></Avatar>
                <div>
                  <p className="break-all text-2xl capitalize tracking-wide">
                    {currentUser.data?.name}
                  </p>
                  <p className="break-all text-xl tracking-wide text-slate-400">
                    {currentUser.data?.slug}
                  </p>
                  <p className="break-all text-lg">{session?.user?.email}</p>
                </div>
              </section>
              {activeTab === "Entities" ? (
                <Link
                  href="/entity/create"
                  className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-blue-400 bg-transparent px-6 py-2 text-xl text-blue-400 transition duration-300 hover:bg-blue-900/30 hover:text-blue-300"
                >
                  <p>Create Entity</p>
                  <IconPlus className=" animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
                </Link>
              ) : (
                <Link
                  href="/userPool/create"
                  className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-green-400 bg-transparent px-6 py-2 text-xl text-green-400 transition duration-300 hover:bg-green-900/30 hover:text-green-300"
                >
                  <p>Create User Pool</p>
                  <IconPlus className=" animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
                </Link>
              )}
            </div>
            <hr className="border-t-2 border-fuchsia-900/30" />
            <Tab.Row className="text-xl">
              <Tab.Button
                value="Entities"
                className="py-1 !font-medium"
                onClick={setActiveTab as any}
                isActive={activeTab === "Entities"}
              ></Tab.Button>
              <Tab.Button
                value="User Pools"
                className="py-1 !font-medium"
                onClick={setActiveTab as any}
                isActive={activeTab === "User Pools"}
              ></Tab.Button>
            </Tab.Row>
            {activeTab === "Entities" ? (
              <section className="flex flex-1 flex-col gap-4">
                {currentUser.data?.userID && (
                  <>
                    <UserEntities
                      userID={currentUser.data.userID}
                    ></UserEntities>
                  </>
                )}
              </section>
            ) : (
              <section className="flex flex-1 flex-col gap-4">
                {currentUser.data?.userID && (
                  <>
                    <UserPools userID={currentUser.data.userID}></UserPools>
                  </>
                )}
              </section>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
