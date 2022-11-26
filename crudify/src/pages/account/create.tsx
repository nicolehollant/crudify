import { type NextPage } from "next";
import Head from "next/head";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useRouter } from "next/router";
import { useFetch } from "@hooks/useFetch";
import AppHeader from "@components/app-header";
import UserEntities from "@components/user-entities";
import Avatar from "@components/avatar";
import IconPlus from "~icons/mdi/plus.jsx";
import { useEffect, useState } from "react";
import TextInput from "@components/text-input";
import SchemaTreeEditor from "@components/schema-tree-editor";
import { JsonValidator } from "@server/utils";
import { get, set, ensureExists } from "object-path";
import slugify from "slugify";

const CreateAccount: NextPage = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => useFetch().get("/api/user"),
  });
  useEffect(() => {
    if (currentUser.isSuccess && !currentUser?.data?.error) {
      router.push("/dashboard");
    }
  }, [currentUser]);
  const createAccount = useMutation({
    mutationFn: (val: any) => {
      return useFetch().post(`/api/user`, val);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });
  if (
    status === "unauthenticated" ||
    (status === "authenticated" && !session?.user?.email)
  ) {
    router.push("/");
  }
  if (status === "loading") {
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
        <title>Create Account</title>
        <meta name="description" content="Create your crudify account" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto grid max-w-4xl gap-6 px-8 py-12">
          <div className="grid gap-1">
            <h2 className="text-2xl">Create your account</h2>
          </div>
          <hr className="border-t-2 border-fuchsia-900/30" />
          <section className="grid gap-4">
            <TextInput
              label="Name"
              name="name"
              onInput={(v) => setName(v)}
              value={name}
            ></TextInput>
            <TextInput
              label="Slug"
              name="slug"
              readOnly={true}
              onInput={() => {}}
              value={slugify(name.trim().toLowerCase())}
            ></TextInput>
            <button
              onClick={() =>
                createAccount
                  .mutateAsync({
                    name: name.trim(),
                    email: session?.user?.email,
                    slug: slugify(name.trim().toLowerCase()),
                  })
                  .then((v) => {
                    if (v?.insertedId) {
                      router.push("/dashboard");
                    }
                  })
              }
              className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-blue-400 bg-transparent px-6 py-2 text-xl text-blue-400 transition duration-300 hover:bg-blue-900/30 hover:text-blue-300"
            >
              <p>Create Account</p>
              <IconPlus className="animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
            </button>
            {createAccount.data?.error && (
              <p className="w-max animate-wiggle-sm text-rose-400">
                {createAccount.data.error + ""}
              </p>
            )}
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default CreateAccount;
