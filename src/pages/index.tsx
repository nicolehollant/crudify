import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import IconArrowRight from "~icons/mdi/arrow-right.jsx";
import IconShimmer from "~icons/mdi/shimmer.jsx";

const CrudOps = () => {
  const operations = [
    <span
      key={0}
      className="animate-slide-down block font-bold tracking-wider text-orange-500"
    >
      CREATE
    </span>,
    <span
      key={1}
      className="animate-slide-down block font-bold tracking-wider text-green-500"
    >
      READ
    </span>,
    <span
      key={2}
      className="animate-slide-down block font-bold tracking-wider text-blue-500"
    >
      UPDATE
    </span>,
    <span
      key={3}
      className="animate-slide-down block font-bold tracking-wider text-red-500"
    >
      DELETE
    </span>,
  ];
  const [operationIndex, setOperationIndex] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOperationIndex((v) => (v + 1) % 4);
    }, 2400);
    return () => clearTimeout(timer);
  }, [operationIndex]);
  return operations[operationIndex] ?? null;
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "authenticated" && session?.user?.email) {
    router.push("/dashboard");
    return null;
  }
  return (
    <>
      <Head>
        <title>Crudify</title>
        <meta
          name="description"
          content="Crudify allows you to rapidly create CRUD APIs"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout withAuthStatus={false}>
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-start justify-center gap-12 px-6 py-4">
          <div className="grid gap-4">
            <h1 className=" text-2xl font-medium tracking-wide text-transparent sm:text-3xl md:text-4xl">
              <span className="bg-gradient-to-tr from-orange-400 via-rose-400  to-pink-500 bg-clip-text">
                🚀
              </span>
              <span className="ml-4 bg-gradient-to-tr from-slate-500 via-[rgb(151,109,194)] to-fuchsia-400 bg-clip-text">
                CRUDIFY
              </span>
            </h1>
            <h2 className="flex flex-col gap-4 text-4xl font-medium transition-all duration-200 sm:text-5xl md:flex-row lg:text-6xl">
              <span>Rapidly</span>
              <span className="w-[8ch] md:text-center">
                <CrudOps></CrudOps>
              </span>
              <span>your data</span>
            </h2>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Link href="/auth/signin">
              <div className="xs:w-40 xs:justify-around group flex w-full items-center justify-between gap-2 rounded-lg border border-slate-400 px-4 py-2 text-xl text-slate-400 transition duration-300 hover:border-fuchsia-300 hover:text-fuchsia-300">
                <p>Sign In</p>
                <IconArrowRight className="delay-500 duration-300 group-hover:translate-x-2" />
              </div>
            </Link>
            <Link href="/explore">
              <div className="xs:w-40 xs:justify-around group flex w-full items-center justify-between gap-2 px-4 py-2 text-xl text-slate-400 transition duration-300 hover:text-fuchsia-300">
                <p>Explore</p>
                <IconShimmer className=" animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
              </div>
            </Link>
          </div>
          <div className="fixed top-4 left-0 w-full">
            <div className="mx-auto flex w-full max-w-6xl px-6">
              <Link
                href="/api/auth/signin"
                className="ml-auto text-right font-medium tracking-wide text-slate-400 transition duration-300 hover:text-fuchsia-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Home;
