import { type NextPage } from "next";
import Head from "next/head";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useRouter } from "next/router";
import { httpRequest } from "@hooks/httpRequest";
import AppHeader from "@components/app-header";
import Avatar from "@components/avatar";
import IconPlus from "~icons/mdi/plus.jsx";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import React, { useEffect, useState } from "react";
import IconArrowRight from "~icons/mdi/arrow-right.jsx";
import RenderJson from "@components/render-json";
import AppModal from "@components/app-modal";
import TextInput from "@components/text-input";

const Endpoint: React.FC<{
  title: string;
  description: string;
  path: string;
  headers?: React.ReactNode;
  requestBody?: React.ReactNode;
  responseBody?: React.ReactNode;
  method: "GET" | "POST" | "PUT" | "DELETE";
}> = (props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <section title={props.title} className="grid gap-4">
      <p>
        <span
          className={
            "font-bold tracking-wider " +
            {
              GET: "text-green-500",
              POST: "text-orange-500",
              PUT: "text-blue-500",
              DELETE: "text-red-500",
            }[props.method]
          }
        >
          {props.method}
        </span>{" "}
        <span className="ml-2 break-all text-fuchsia-300">
          {`${window.origin}/api${props.path}`}
        </span>
      </p>
      <p className="text-slate-400">- {props.description}</p>
      <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12 md:gap-y-6">
        {props.headers && (
          <pre className="rounded-lg border-2 border-fuchsia-600/10 !py-3 !text-sm shadow-lg shadow-fuchsia-700/10 md:col-span-2">
            <p className="pb-2">Headers</p>
            <code className="language-json !text-sm">{props.headers}</code>
          </pre>
        )}
        <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
          <p className="pb-2">Request Body</p>
          <code className="language-json">{props.requestBody}</code>
        </pre>
        <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
          <p className="pb-2">Response Body</p>
          <code className="language-typescript">{props.responseBody}</code>
        </pre>
      </div>
    </section>
  );
};

const UpdatePoolInfo: React.FC<{
  name: string;
  redirectUrl: string;
  fromEmail: string;
  userID: string;
  userPoolName: string;
}> = (props) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(props.name);
  const [fromEmail, setFromEmail] = useState(props.fromEmail);
  const [redirectUrl, setRedirectUrl] = useState(props.redirectUrl);
  const updateUserPool = useMutation({
    mutationFn: (val: any) => {
      return httpRequest().put(
        `/api/user/${props.userID}/userPool/${props.userPoolName}`,
        val
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`getUserPool-${props.userPoolName}`],
      });
    },
  });
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-blue-400 bg-transparent px-6 py-2 text-xl text-blue-400 transition duration-300 hover:bg-blue-900/30 hover:text-blue-300"
      >
        <p>Update User Pool</p>
        <IconPlus className=" animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
      </button>
      <AppModal
        setOpen={setOpen}
        open={open}
        className="flex !h-auto flex-col gap-8"
      >
        <h3 className="text-2xl">Update User Pool Info</h3>
        <section className="grid gap-4">
          <TextInput
            label="Pool Name"
            name="name"
            onInput={(v: string) => setName(v)}
            value={name}
            placeholder="My App"
          ></TextInput>
          <TextInput
            label="Sender Name"
            name="email"
            onInput={(v: string) => setFromEmail(v)}
            value={fromEmail}
            placeholder="My App Auth"
          ></TextInput>
          <TextInput
            label="Redirect Url"
            name="redirect"
            onInput={(v: string) => setRedirectUrl(v)}
            value={redirectUrl}
            placeholder="https://example.com/auth/token"
          ></TextInput>
          <button
            onClick={() =>
              updateUserPool
                .mutateAsync({
                  name: name.trim(),
                  fromEmail: fromEmail.trim().replace("@", ""),
                  redirectUrl: redirectUrl.trim(),
                })
                .then((v) => {
                  if (v?.message === "Success") {
                    setOpen(false);
                  }
                })
            }
            className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-blue-400 bg-transparent px-6 py-2 text-xl text-blue-400 transition duration-300 hover:bg-blue-900/30 hover:text-blue-300"
          >
            <p>Submit</p>
            <IconArrowRight className="animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
          </button>
          {updateUserPool.data?.error && (
            <p className="w-max animate-wiggle-sm text-rose-400">
              {updateUserPool.data.error + ""}
            </p>
          )}
        </section>
      </AppModal>
    </>
  );
};

const UserPoolPage: React.FC<{
  userID: string;
  userPoolName: string;
}> = (props) => {
  const router = useRouter();
  const userPool = useQuery({
    queryKey: [`getUserPool-${props.userPoolName}`],
    queryFn: () =>
      httpRequest().get(
        `/api/user/${props.userID}/userPool/${props.userPoolName}`
      ),
  });
  useEffect(() => {
    if (!userPool.isLoading) {
      Prism.highlightAll();
    }
  }, [userPool.isLoading]);
  if (userPool.isLoading) {
    return <p className="animate-pulse text-slate-500">loading...</p>;
  }
  if (userPool.data?.error?.length > 0) {
    router.push("/");
    return null;
  }
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="grid gap-4 md:flex md:items-center md:justify-between">
        <div className="grid gap-2">
          <p className="text-2xl capitalize tracking-wide">
            {userPool.data?.name}
          </p>
          <p className="break-all text-xl tracking-wide text-slate-400">
            <span className="text-sm">Email from:</span>{" "}
            {userPool.data?.fromEmail}
          </p>
          <p className="break-all text-xl tracking-wide text-slate-400">
            <span className="text-sm">Redirect URL:</span>{" "}
            {userPool.data?.redirectUrl}
          </p>
        </div>
        <UpdatePoolInfo
          userID={props.userID}
          userPoolName={props.userPoolName}
          redirectUrl={userPool.data?.redirectUrl}
          fromEmail={userPool.data?.fromEmail}
          name={userPool.data?.name}
        ></UpdatePoolInfo>
      </div>
      <hr className="border-t-2 border-fuchsia-900/30" />
      <h3 className="text-2xl">API Documentation</h3>
      <section className="flex flex-1 flex-col gap-16">
        <Endpoint
          title="Log In"
          description="Request a magic link sent to the passed email address"
          path={`/user/${props.userID}/userPool/${props.userPoolName}/login`}
          method="POST"
          requestBody={JSON.stringify(
            {
              email: "string",
            },
            null,
            2
          )}
          responseBody={JSON.stringify(
            { message: "Successfully sent email" },
            null,
            2
          )}
        ></Endpoint>
        <Endpoint
          title="Refresh"
          description="Refresh your auth token"
          path={`/user/${props.userID}/userPool/${props.userPoolName}/refresh`}
          method="POST"
          headers={JSON.stringify(
            {
              Authorization: "Bearer $TOKEN",
            },
            null,
            2
          )}
          requestBody={JSON.stringify(
            {
              refreshToken: "string",
            },
            null,
            2
          )}
          responseBody={JSON.stringify(
            {
              accessToken: "string",
              refreshToken: "string",
            },
            null,
            2
          )}
        ></Endpoint>
        <Endpoint
          title="Get Account"
          description="Get your account details"
          path={`/user/${props.userID}/userPool/${props.userPoolName}/account`}
          method="GET"
          headers={JSON.stringify(
            {
              Authorization: "Bearer $TOKEN",
            },
            null,
            2
          )}
          requestBody="null"
          responseBody={JSON.stringify(
            {
              message: "Success",
              checks: {
                isAuthorized: true,
                isNewAccount: "boolean",
              },
              id: "string",
              avatar: "string",
              email: "string",
              data: {},
            },
            null,
            2
          )}
        ></Endpoint>
        <Endpoint
          title="Update Account"
          description="Update your account details"
          path={`/user/${props.userID}/userPool/${props.userPoolName}/account`}
          method="PUT"
          headers={JSON.stringify(
            {
              Authorization: "Bearer $TOKEN",
            },
            null,
            2
          )}
          requestBody={JSON.stringify(
            {
              avatar: "string",
              data: {},
            },
            null,
            2
          )}
          responseBody={JSON.stringify(
            {
              message: "Success",
            },
            null,
            2
          )}
        ></Endpoint>
      </section>
      <hr className="border-t-2 border-fuchsia-900/30" />
      <section className="flex flex-col gap-8">
        <h3 className="text-2xl">Users</h3>
        <div className="flex flex-wrap gap-8 pb-[70vh] md:flex-row md:gap-12 ">
          {userPool?.data?.users?.map?.((user: any) => (
            <div
              key={user.id}
              className="rounded-lg border border-fuchsia-600/20  bg-gradient-to-br from-slate-800 to-slate-800 p-4 text-lg text-fuchsia-100 shadow-md transition duration-200"
            >
              <p>{user.email}</p>
              <p className="py-1 text-sm text-slate-400">{user.id}</p>
              <RenderJson
                className="!max-w-xs !bg-transparent !p-0"
                value={{ ...user.data, avatar: user.avatar }}
              ></RenderJson>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const UserPoolByUserPoolName: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
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
        <title>User Pool</title>
        <meta name="description" content="Crudify user pool page" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto max-w-7xl px-8 py-12">
          {router.query.userID && router.query.userPoolName && (
            <UserPoolPage
              userPoolName={router.query.userPoolName + ""}
              userID={router.query.userID + ""}
            ></UserPoolPage>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default UserPoolByUserPoolName;
