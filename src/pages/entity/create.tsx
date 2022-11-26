import { type NextPage } from "next";
import Head from "next/head";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@components/layouts/main";
import { useRouter } from "next/router";
import { useFetch } from "@hooks/useFetch";
import AppHeader from "@components/app-header";
import UserEntities from "@components/user-entities";
import Avatar from "@components/avatar";
import IconPlus from "~icons/mdi/plus.jsx";
import { useState } from "react";
import TextInput from "@components/text-input";
import SchemaTreeEditor from "@components/schema-tree-editor";
import { JsonValidator } from "@server/utils";
import { get, set, ensureExists } from "object-path";

const TextMode: React.FC<{
  schema: string;
  name: string;
  setName: (v: string) => void;
  setSchema: (v: string) => void;
}> = (props) => {
  return (
    <>
      <TextInput
        label="Entity Name"
        name="name"
        onInput={(v) => props.setName(v)}
        value={props.name}
        placeholder="My entity..."
      ></TextInput>
      <TextInput
        label="Schema"
        name="schema"
        multiline={true}
        onInput={(v) => props.setSchema(v)}
        value={props.schema}
      ></TextInput>
    </>
  );
};
const TreeMode: React.FC<{
  schema: any;
  name: string;
  setName: (v: string) => void;
  setSchema: (v: string | (() => string)) => void;
}> = (props) => {
  const [schema, setSchema] = useState({
    [props.name]: { type: "object", properties: props.schema },
  });
  const onUpdateProperties = (dotpath: string[], updatedProperties: any) => {
    let wholeSchema: any = { properties: {} };
    const newSchema: any = JSON.parse(JSON.stringify(schema));
    if (dotpath.length) {
      set(newSchema, dotpath, updatedProperties);
      wholeSchema = newSchema;
    } else {
      wholeSchema = updatedProperties;
    }
    props.setSchema(
      JSON.stringify(
        wholeSchema?.[Object.keys(wholeSchema)[0] ?? props.name]?.properties ??
          wholeSchema,
        null,
        2
      )
    );
    props.setName(Object.keys(wholeSchema)[0] ?? props.name);
    setSchema((v) => {
      const newSchema: JsonValidator = JSON.parse(JSON.stringify(v));
      if (dotpath.length) {
        set(newSchema, dotpath, updatedProperties);
        return newSchema;
      } else {
        return updatedProperties;
      }
    });
  };
  return (
    <>
      <p className="py-4 pl-6 text-sm text-rose-300">
        ⚠️ tree editor is a work in progress
      </p>
      <p className="pl-6 text-sm">Entity Name</p>
      <SchemaTreeEditor
        properties={schema as any}
        dotpath={[]}
        onUpdate={onUpdateProperties}
      ></SchemaTreeEditor>
    </>
  );
};

const CreateEntity: NextPage = () => {
  const [mode, setMode] = useState<"TEXT" | "TREE">("TEXT");
  const [name, setName] = useState("");
  const [schema, setSchema] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => useFetch().get("/api/user"),
  });
  const createEntity = useMutation({
    mutationFn: (val: any) => {
      // setErr("");
      return useFetch().post(
        `/api/user/${currentUser.data?.userID}/entity`,
        val
      );
    },
  });
  const tryParseOrGiveEmptyObject = (schemaStr: string) => {
    try {
      const parsed = JSON.parse(schemaStr);
      if (!Object.keys(parsed)) {
        throw new Error("invalid object");
      }
      return parsed;
    } catch (err) {
      return {};
    }
  };
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
        <meta
          name="description"
          content="Create an entity based on a JSON schema"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <div className="m-auto grid max-w-4xl gap-6 px-8 py-12">
          <div className="grid gap-1">
            <h2 className="text-2xl">Create a new entity</h2>
            <p className="text-slate-400">
              An entity is based on a JSON schema and represents the shape of
              the data that your API will consume.
            </p>
          </div>
          <hr className="border-t-2 border-fuchsia-900/30" />
          <section className="grid gap-4">
            <div className="flex w-max rounded-lg bg-fuchsia-900/20 p-1">
              <button
                className={
                  "rounded-lg px-4 font-semibold " +
                  (mode === "TEXT" ? "bg-fuchsia-900" : "")
                }
                onClick={() => setMode("TEXT")}
              >
                Text
              </button>
              <button
                className={
                  "rounded-lg px-4 font-semibold " +
                  (mode === "TREE" ? "bg-fuchsia-900" : "")
                }
                onClick={() => setMode("TREE")}
              >
                Tree
              </button>
            </div>
            {mode === "TEXT" && (
              <TextMode
                name={name}
                schema={schema}
                setName={setName}
                setSchema={setSchema}
              ></TextMode>
            )}
            {mode === "TREE" && (
              <div className="-ml-6">
                <TreeMode
                  name={name}
                  schema={tryParseOrGiveEmptyObject(schema)}
                  setName={setName}
                  setSchema={setSchema}
                ></TreeMode>
              </div>
            )}
            <button
              onClick={() =>
                createEntity
                  .mutateAsync({
                    name: name.trim(),
                    schema: tryParseOrGiveEmptyObject(schema),
                  })
                  .then((v) => {
                    if (v.modifiedCount) {
                      router.push(
                        `/user/${
                          currentUser.data?.userID
                        }/entity/${name.trim()}`
                      );
                    }
                  })
              }
              className="group flex w-max items-center justify-around gap-2 rounded-md border-2 border-blue-400 bg-transparent px-6 py-2 text-xl text-blue-400 transition duration-300 hover:bg-blue-900/30 hover:text-blue-300"
            >
              <p>Create Entity</p>
              <IconPlus className="animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
            </button>
            {createEntity.data?.error && (
              <p className="w-max animate-wiggle-sm text-rose-400">
                {createEntity.data.error + ""}
              </p>
            )}
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default CreateEntity;
