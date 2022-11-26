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
import IconDiscord from "~icons/mdi/discord.jsx";

interface SignInProps {
  csrfToken?: string;
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

const ProviderIcons = {
  discord: <IconDiscord></IconDiscord>,
};

const SigninForm: FC<SignInProps> = ({ csrfToken, providers }) => {
  const [email, setEmail] = useState("");
  const {
    query: { callbackUrl },
  } = useRouter();
  return (
    <div className="grid w-full gap-10">
      <form
        method="post"
        action="/api/auth/signin/email"
        className="grid gap-3"
      >
        <div>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input
            placeholder="Email"
            type="email"
            id="email"
            name="email"
            onInput={(e: any) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-lg shadow-sm transition duration-200 hover:shadow-md focus:border-fuchsia-600 focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
          />
        </div>
        <button
          className="flex w-full items-center justify-between rounded-lg bg-fuchsia-600 px-4 py-2 text-center text-lg font-medium text-fuchsia-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
          disabled={!email}
        >
          <span>Sign in with Email</span>
          <IconEmail></IconEmail>
        </button>
      </form>
      {providers &&
        Object.values(providers).filter((provider) => provider.name !== "Email")
          .length > 0 && (
          <div className="relative">
            <hr className="border-fuchsia-900/40" />
            <div className="leading-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded border border-fuchsia-900/40 bg-slate-900 px-4 py-2 text-xs font-medium tracking-wide text-fuchsia-300/80">
              OR
            </div>
          </div>
        )}
      <div className="space-y-3">
        {providers &&
          Object.values(providers)
            .filter((provider) => provider.name !== "Email")
            .map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() =>
                    signIn(provider.id, {
                      callbackUrl: Array.isArray(callbackUrl)
                        ? callbackUrl[0]
                        : callbackUrl ?? "/",
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg bg-fuchsia-600 px-4 py-2 text-center text-lg font-medium text-fuchsia-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
                >
                  <span>Sign in with {provider.name} </span>
                  {(ProviderIcons as any)?.[provider.name.toLowerCase()] ??
                    null}
                </button>
              </div>
            ))}
      </div>
    </div>
  );
};

const SigninPage: NextPage<SignInProps> = ({ csrfToken, providers }) => {
  return (
    <MainLayout withAuthStatus={false}>
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-12 px-6 py-4">
        <div className="mx-auto grid w-full gap-4">
          <h1 className=" text-4xl font-medium tracking-wide text-transparent">
            <span className="bg-gradient-to-tr from-orange-400 via-rose-400  to-pink-500 bg-clip-text">
              🚀
            </span>
            <span className="ml-4 bg-gradient-to-tr from-slate-500 via-[rgb(151,109,194)] to-fuchsia-400 bg-clip-text">
              CRUDIFY
            </span>
          </h1>
        </div>
        <div className="w-full pb-[16vh] ">
          <SigninForm providers={providers} csrfToken={csrfToken} />
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
