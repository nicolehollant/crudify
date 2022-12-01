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
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import { useEffect } from "react";
import IconArrowRight from "~icons/mdi/arrow-right.jsx";

const toZodString = (value: any): string =>
  JSON.stringify(
    value,
    (_k, v) => {
      if (typeof v === "object" && "properties" in v) {
        const _v = { ...v.properties };
        delete v.properties;
        delete v.type;
        return `z.object(${toZodString(_v).split("\n").join("\n\t")})`;
      }
      if (typeof v === "object" && "entries" in v) {
        const _v = { ...v.entries };
        delete v.entries;
        delete v.type;
        return `z.array(${toZodString(_v).split("\n").join("\n\t")})`;
      }
      if (typeof v === "object" && "type" in v && v.type === "string") {
        return "z.string()";
      }
      if (typeof v === "object" && "type" in v && v.type === "number") {
        return "z.number()";
      }
      if (typeof v === "object" && "type" in v && v.type === "boolean") {
        return "z.boolean()";
      }
      if (typeof v === "object" && "type" in v && v.type === "null") {
        return "z.null()";
      }
      if (typeof v === "object" && "type" in v && v.type === "any") {
        return "z.any()";
      }
      return v;
    },
    2
  );

const undoStringify = (val: string) => {
  val = val.replaceAll("\\t", "\t");
  val = val.replaceAll("\\n", "\n");
  val = val.replaceAll('\\"', '"');
  val = val.replaceAll("\\", "");
  val = val.replaceAll('"z.string()"', "z.string()");
  val = val.replaceAll('"z.number()"', "z.number()");
  val = val.replaceAll('"z.boolean()"', "z.boolean()");
  val = val.replaceAll('"z.null()"', "z.null()");
  val = val.replaceAll('"z.any()"', "z.any()");
  val = val.replaceAll('"z.object(', "z.object(");
  val = val.replaceAll('"z.array(', "z.array(");
  val = val.replaceAll(')"', ")");
  val = val.replaceAll("\\n", "\n");
  return val;
};

const EntityPage: React.FC<{
  userID: string;
  entityName: string;
}> = (props) => {
  const entity = useQuery({
    queryKey: [`getEntityValidator-${props.entityName}`],
    queryFn: () =>
      httpRequest().get(
        `/api/user/${props.userID}/${props.entityName}/validator`
      ),
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
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex items-center justify-between">
        <p className="text-2xl capitalize tracking-wide">
          {entity.data?.entities?.name}
        </p>
        <div className="grid gap-2 sm:flex ">
          <Link href={`/user/${props.userID}/entity/${props.entityName}/try`}>
            <div className="group flex w-full items-center justify-around gap-2 rounded-lg border border-fuchsia-400 px-4 py-2 text-xl text-fuchsia-400 transition duration-300 hover:border-fuchsia-300 hover:bg-fuchsia-900/20 hover:text-fuchsia-300 sm:w-40">
              <p>Try API</p>
              <IconArrowRight className="delay-500 duration-300 group-hover:translate-x-2" />
            </div>
          </Link>
          <Link
            href={`/user/${props.userID}/entity/${props.entityName}/create`}
          >
            <div className="group flex w-max items-center justify-around gap-2 rounded-lg border border-blue-400 px-4 py-2 text-xl text-blue-400 transition duration-300 hover:border-blue-300 hover:bg-blue-900/20 hover:text-blue-300">
              <p>Create Entities</p>
              <IconPlus className="delay-500 duration-300 group-hover:animate-wiggle" />
            </div>
          </Link>
        </div>
      </div>
      <hr className="border-t-2 border-fuchsia-900/30" />
      <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-12">
        <section className="flex flex-1 flex-col gap-4">
          <h3 className="text-2xl">JSON Schema</h3>
          <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
            <code className="language-json">
              {JSON.stringify(entity.data?.entities?.validator, null, 2)}
            </code>
          </pre>
        </section>
        <section className="flex flex-1 flex-col gap-4">
          <h3 className="text-2xl">Zod Validator</h3>
          <p className="text-sm text-rose-300">
            ⚠️ zod validator is a work in progress
          </p>
          <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
            <code className="language-typescript">
              const validator = z.object(
              {undoStringify(
                toZodString(
                  JSON.parse(JSON.stringify(entity.data?.entities?.validator))
                )
              )}
              )
            </code>
          </pre>
        </section>
      </div>
      <hr className="border-t-2 border-fuchsia-900/30" />
      <section className="flex flex-1 flex-col gap-16 pb-[70vh]">
        <h3 className="text-2xl">API Documentation</h3>
        <section title="GET ALL" className="grid gap-4">
          <p>
            <span className="font-bold tracking-wider text-green-500">GET</span>{" "}
            <span className="ml-2 break-all text-fuchsia-300">
              {`${window.origin}/api/user/${props.userID}/${props.entityName}`}
            </span>
          </p>
          <p className="text-slate-400">- Gets all data for entity</p>
          <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12">
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Request Body</p>
              <code className="language-json">null</code>
            </pre>
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Response Body</p>
              <code className="language-typescript">
                type Response = (typeof validator._input & {"{"} id: string{" "}
                {"}"})[]
              </code>
            </pre>
          </div>
        </section>
        <section title="CREATE ONE" className="grid gap-4">
          <p>
            <span className="font-bold tracking-wider text-orange-500">
              POST
            </span>{" "}
            <span className="ml-2 break-all text-fuchsia-300">
              {`${window.origin}/api/user/${props.userID}/${props.entityName}`}
            </span>
          </p>
          <p className="text-slate-400">- Creates a data entry for entity</p>
          <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12">
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Request Body</p>
              <code className="language-typescript">
                type Request = typeof validator._input
              </code>
            </pre>
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Response Body</p>
              <code className="language-typescript">
                type Response = (typeof validator._input & {"{"} id: string{" "}
                {"}"})
              </code>
            </pre>
          </div>
        </section>
        <section title="GET ONE" className="grid gap-4">
          <p>
            <span className="font-bold tracking-wider text-green-500">GET</span>{" "}
            <span className="ml-2 break-all text-fuchsia-300">
              {`${window.origin}/api/user/${props.userID}/${props.entityName}/:entityID`}
            </span>
          </p>
          <p className="text-slate-400">- Gets a data entry for entity by id</p>
          <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12">
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Request Body</p>
              <code className="language-json">null</code>
            </pre>
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Response Body</p>
              <code className="language-typescript">
                type Response = (typeof validator._input & {"{"} id: string{" "}
                {"}"})
              </code>
            </pre>
          </div>
        </section>
        <section title="MATCH ONE" className="grid gap-4">
          <p>
            <span className="font-bold tracking-wider text-orange-500">
              POST
            </span>{" "}
            <span className="ml-2 break-all text-fuchsia-300">
              {`${window.origin}/api/user/${props.userID}/${props.entityName}/where`}
            </span>
          </p>
          <p className="text-slate-400">
            - Finds one entity matching the query
          </p>
          <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12">
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Request Body</p>
              <code className="language-typescript">
                type Request = {"{"} [dotpath: string]: any {"}"}
              </code>
            </pre>
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Response Body</p>
              <code className="language-typescript">
                type Response = (typeof validator._input & {"{"} id: string{" "}
                {"}"})
              </code>
            </pre>
          </div>
        </section>
        <section title="UPDATE ONE" className="grid gap-4">
          <p>
            <span className="font-bold tracking-wider text-blue-500">PUT</span>{" "}
            <span className="ml-2 break-all text-fuchsia-300">
              {`${window.origin}/api/user/${props.userID}/${props.entityName}/:entityID`}
            </span>
          </p>
          <p className="text-slate-400">
            - Updates a data entry for entity by id
          </p>
          <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12">
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Request Body</p>
              <code className="language-typescript">
                type Request = typeof validator._input
              </code>
            </pre>
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Response Body</p>
              <code className="language-typescript">
                type Response = (typeof validator._input & {"{"} id: string{" "}
                {"}"})
              </code>
            </pre>
          </div>
        </section>
        <section title="DELETE ONE" className="grid gap-4">
          <p>
            <span className="font-bold tracking-wider text-red-500">
              DELETE
            </span>{" "}
            <span className="ml-2 break-all text-fuchsia-300">
              {`${window.origin}/api/user/${props.userID}/${props.entityName}/:entityID`}
            </span>
          </p>
          <p className="text-slate-400">
            - Deletes a data entry for entity by id
          </p>
          <div className="grid justify-between gap-8 md:grid-cols-2 md:gap-12">
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Request Body</p>
              <code className="language-json">null</code>
            </pre>
            <pre className="rounded-lg border-2 border-fuchsia-600/10 shadow-lg shadow-fuchsia-700/10">
              <p className="pb-2">Response Body</p>
              <code className="language-typescript">
                type Response = (typeof validator._input & {"{"} id: string{" "}
                {"}"})
              </code>
            </pre>
          </div>
        </section>
      </section>
    </div>
  );
};

const EntityByEntityNamePage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Entity</title>
        <meta name="description" content="Crudify entity page" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto max-w-7xl px-8 py-12">
          {router.query.userID && router.query.entityName && (
            <EntityPage
              entityName={router.query.entityName + ""}
              userID={router.query.userID + ""}
            ></EntityPage>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default EntityByEntityNamePage;
