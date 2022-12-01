import { type NextPage } from "next";
import Head from "next/head";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useRouter } from "next/router";
import { httpRequest } from "@hooks/httpRequest";
import AppHeader from "@components/app-header";
import UserEntities from "@components/user-entities";
import Avatar from "@components/avatar";
import IconPlus from "~icons/mdi/plus.jsx";
import { useState } from "react";
import TextInput from "@components/text-input";
import SchemaTreeEditor from "@components/schema-tree-editor";
import type { JsonValidator } from "@server/utils";
import { get, set, ensureExists } from "object-path";
import YamlEditor from "@components/editor/yaml-editor";

const CreateUserPool: NextPage = () => {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => httpRequest().get("/api/user"),
  });
  const createUserPool = useMutation({
    mutationFn: (val: any) => {
      return httpRequest().post(
        `/api/user/${currentUser.data?.userID}/userPool`,
        val
      );
    },
  });
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
        <title>Create Entity</title>
        <meta name="description" content="Create a user pool" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto grid max-w-4xl gap-6 px-8 py-12">
          <div className="grid gap-1">
            <h2 className="text-2xl">Create a new user pool</h2>
            <p className="text-slate-400">
              A user pool is a group of email-based accounts that you can use
              with your application.
            </p>
          </div>
          <hr className="border-t-2 border-fuchsia-900/30" />
          <section className="grid gap-4">
            <TextInput
              label="Pool Name"
              name="name"
              onInput={(v) => setName(v)}
              value={name}
              placeholder="My App"
            ></TextInput>
            <TextInput
              label="Sender Name"
              name="email"
              onInput={(v) => setFromEmail(v)}
              value={fromEmail}
              placeholder="My App Auth"
            ></TextInput>
            <TextInput
              label="Redirect Url"
              name="redirect"
              onInput={(v) => setRedirectUrl(v)}
              value={redirectUrl}
              placeholder="https://example.com/auth/token"
            ></TextInput>
            <button
              onClick={() =>
                createUserPool
                  .mutateAsync({
                    name: name.trim(),
                    fromEmail: fromEmail.trim().replace("@", ""),
                    redirectUrl: redirectUrl.trim(),
                  })
                  .then((v) => {
                    if (v.modifiedCount) {
                      router.push(
                        `/user/${currentUser.data?.userID}/pool/${name.trim()}`
                      );
                    }
                  })
              }
              className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-blue-400 bg-transparent px-6 py-2 text-xl text-blue-400 transition duration-300 hover:bg-blue-900/30 hover:text-blue-300"
            >
              <p>Create User Pool</p>
              <IconPlus className="animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
            </button>
            {createUserPool.data?.error && (
              <p className="w-max animate-wiggle-sm text-rose-400">
                {createUserPool.data.error + ""}
              </p>
            )}
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default CreateUserPool;
