import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../styles/globals.css";
import "../styles/prism-dark.css";
import "react-toastify/dist/ReactToastify.css";
import "../components/editor/codemirror.css";

import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastContainer
          theme="colored"
          toastClassName="backdrop-filter backdrop-blur shadow-xl"
        ></ToastContainer>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default MyApp;
