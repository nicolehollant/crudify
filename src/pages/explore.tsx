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
import { useEffect } from "react";

const ExploreUser: React.FC<{
  name: string;
  userID: string;
  slug: string;
  entities: { name: string }[];
}> = (props) => {
  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border border-slate-700/20 bg-slate-900/60 p-4">
        <Link href={`/user/${props.userID}`} className="group">
          <p className="text-xl group-hover:underline">{props.name}</p>
          <p className="text-slate-400">{props.slug}</p>
        </Link>
        <hr className="border-fuchsia-800/40" />
        {props.entities.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-3">
              {props.entities.map((entity, i) => (
                <>
                  <Link
                    href={`/user/${props.userID}/entity/${entity.name}`}
                    key={entity.name}
                  >
                    <div className=" rounded-lg bg-black/20 p-3 transition-all duration-500 hover:bg-gradient-to-br hover:from-slate-900 hover:to-fuchsia-900/50">
                      <p>{entity.name}</p>
                    </div>
                  </Link>
                </>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">No entities yet...</p>
        )}
      </div>
    </>
  );
};

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const explore = useQuery({
    queryKey: ["getExplore"],
    queryFn: () => httpRequest().get("/api/user/explore"),
  });

  if (status === "loading" || explore.isLoading) {
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
        <title>Explore</title>
        <meta
          name="description"
          content="View existing Crudify entities and create new ones"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto max-w-7xl px-8 py-12">
          <div className="flex flex-col gap-8 md:gap-12">
            <h1 className="text-4xl">Explore</h1>
            <hr className="border-t-2 border-fuchsia-900/30" />
            <section className="flex flex-1 flex-col gap-4">
              {explore?.data?.map((user: any) => (
                <>
                  <ExploreUser {...user}></ExploreUser>
                </>
              ))}
            </section>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
