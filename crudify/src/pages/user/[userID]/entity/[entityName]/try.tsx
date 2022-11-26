import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useRouter } from "next/router";
import { useFetch } from "@hooks/useFetch";
import AppHeader from "@components/app-header";
import UserEntities from "@components/user-entities";
import Avatar from "@components/avatar";
import IconPlus from "~icons/mdi/plus.jsx";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import { useEffect } from "react";
import IconArrowRight from "~icons/mdi/arrow-right.jsx";
import RestClient from "@components/rest-client";

const TryEntityPage: React.FC<{
  userID: string;
  entityName: string;
}> = (props) => {
  const entity = useQuery({
    queryKey: [`getEntityValidator-${props.entityName}`],
    queryFn: () =>
      useFetch().get(`/api/user/${props.userID}/${props.entityName}/validator`),
  });
  useEffect(() => {
    if (!entity.isLoading) {
      Prism.highlightAll();
    }
  }, [entity.isLoading]);
  if (entity.isLoading) {
    return <p className="animate-pulse text-slate-500">loading...</p>;
  }
  return (
    <RestClient
      entityName={entity.data?.entities?.name}
      routes={[
        {
          title: "Get Validator",
          method: "GET",
          path: `/:userID/:entityName/validator`,
          pathResolved: `/${props.userID}/${props.entityName}/validator`,
          body: null,
          pathParameters: {
            ":userID": props.userID,
            ":entityName": props.entityName,
          },
        },
        {
          title: "Get All",
          method: "GET",
          path: `/:userID/:entityName`,
          pathResolved: `/${props.userID}/${props.entityName}`,
          body: null,
          pathParameters: {
            ":userID": props.userID,
            ":entityName": props.entityName,
          },
        },
        {
          title: "Create One",
          method: "POST",
          path: `/:userID/:entityName`,
          pathResolved: `/${props.userID}/${props.entityName}`,
          body: {},
          pathParameters: {
            ":userID": props.userID,
            ":entityName": props.entityName,
          },
        },
        {
          title: "Get One",
          method: "GET",
          path: `/:userID/:entityName/:entityID`,
          pathResolved: `/${props.userID}/${props.entityName}/:entityID`,
          body: null,
          pathParameters: {
            ":userID": props.userID,
            ":entityName": props.entityName,
          },
        },
        {
          title: "Update One",
          method: "PUT",
          path: `/:userID/:entityName/:entityID`,
          pathResolved: `/${props.userID}/${props.entityName}/:entityID`,
          body: {},
          pathParameters: {
            ":userID": props.userID,
            ":entityName": props.entityName,
          },
        },
        {
          title: "Delete One",
          method: "DELETE",
          path: `/:userID/:entityName/:entityID`,
          pathResolved: `/${props.userID}/${props.entityName}/:entityID`,
          body: null,
          pathParameters: {
            ":userID": props.userID,
            ":entityName": props.entityName,
          },
        },
      ]}
      baseURL={window.origin + "/api/user"}
    ></RestClient>
  );
};

const TryEntityByEntityNamePage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Entity Playground</title>
        <meta name="description" content="Crudify playground" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <hr className="border-2 border-fuchsia-900/50" />
        {router.query.userID && router.query.entityName && (
          <TryEntityPage
            entityName={router.query.entityName + ""}
            userID={router.query.userID + ""}
          ></TryEntityPage>
        )}
      </MainLayout>
    </>
  );
};

export default TryEntityByEntityNamePage;
