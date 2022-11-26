import MainLayout from "@components/layouts/main";
import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  signIn,
  getCsrfToken,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import IconEmail from "~icons/mdi/email-check-outline.jsx";

const SigninPage: NextPage = () => {
  return (
    <MainLayout withAuthStatus={false}>
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-6 py-4">
        <div className="mx-auto grid w-full gap-4">
          <h1 className=" text-4xl font-medium tracking-wide text-transparent">
            <span className="bg-gradient-to-tr from-orange-400 via-rose-400  to-pink-500 bg-clip-text">
              🚀
            </span>
            <span className="ml-4 bg-gradient-to-tr from-slate-500 via-[rgb(151,109,194)] to-fuchsia-400 bg-clip-text">
              CRUDIFY
            </span>
          </h1>
          <h2 className="text-[3.5rem] font-medium leading-tight transition-all duration-200">
            Check your email
          </h2>
        </div>
        <div className="w-full pb-[16vh] ">
          <p className="text-2xl font-light text-fuchsia-50">
            A sign in link has been sent to your email address.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SigninPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
};
