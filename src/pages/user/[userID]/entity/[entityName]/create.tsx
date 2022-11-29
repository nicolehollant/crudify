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
import IconBack from "~icons/mdi/arrow-left.jsx";
import IconPlus from "~icons/mdi/plus.jsx";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import { useEffect, useState } from "react";
import IconArrowRight from "~icons/mdi/arrow-right.jsx";
import RestClient from "@components/rest-client";
import ZodTreeEditor from "@components/zod-tree-editor";
import type { JsonValidator } from "@server/utils";
import { get, set, ensureExists } from "object-path";
import AppModal from "@components/app-modal";
import {
  createEntityFromJson,
  tryParseOrGiveEmptyObject,
  parseNStringify,
  createValidatorFromJson,
} from "src/assets/client-utils";
import RenderJson from "@components/render-json";
import { z } from "zod";
import ToggledMenu from "@components/toggled-menu";
import TextInput from "@components/text-input";
import { toast } from "react-toastify";

const TreeMode: React.FC<{
  schema: any;
  name: string;
  setName: (v: string) => void;
  setSchema: (v: string | (() => string)) => void;
}> = (props) => {
  const [schema, setSchema] = useState({
    [props.name]: { type: "object", properties: props.schema },
  });
  useEffect(() => {
    const properties = parseNStringify(JSON.stringify(schema));
    props.setSchema(JSON.stringify(properties?.properties ?? properties));
  }, []);
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
        ⚠️ entity generator is a work in progress
      </p>
      <p className="pl-6 text-sm">Entity Name</p>
      <ZodTreeEditor
        properties={schema as any}
        dotpath={[]}
        onUpdate={onUpdateProperties}
      ></ZodTreeEditor>
    </>
  );
};

const CreateEntityPage: React.FC<{
  userID: string;
  entityName: string;
}> = (props) => {
  const router = useRouter();
  const entity = useQuery({
    queryKey: [`getEntityValidator-${props.entityName}`],
    queryFn: () =>
      httpRequest().get(
        `/api/user/${props.userID}/${props.entityName}/validator`
      ),
  });
  const createEntities = useMutation({
    mutationFn: (num: any) => {
      return Promise.all(
        Array.from({ length: Number(num) }).map(() => {
          const parsed = tryParseOrGiveEmptyObject(schema);
          const entity = createEntityFromJson(parsed);
          return httpRequest().post(
            `/api/user/${props.userID}/${props.entityName}`,
            entity
          );
        })
      );
    },
  });
  const [numEntities, setNumEntities] = useState(1);
  const [schema, setSchema] = useState("");
  const [zodError, setZodError] = useState("");
  useEffect(() => {
    if (!entity.isLoading) {
      Prism.highlightAll();
    }
  }, [entity.isLoading]);
  useEffect(() => {
    try {
      const parsed = tryParseOrGiveEmptyObject(schema);
      const entity = createEntityFromJson(parsed);
      const validator = z.object(createValidatorFromJson(parsed));
      validator.parse(entity);
      setZodError("");
    } catch (error: any) {
      setZodError(
        JSON.stringify(
          error?.issues?.map((issue: any) => {
            if (issue?.code === "invalid_type") {
              return {
                reason: "Invalid Type",
                msg: `${issue?.message} at '${issue?.path.join(".")}'`,
              };
            }
            return issue;
          }) ?? error,
          // error,
          null,
          2
        )
      );
    }
  }, [zodError, schema]);

  if (entity.isLoading) {
    return <p className="animate-pulse text-slate-500">loading...</p>;
  }
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="-ml-6 overflow-auto p-4 sm:p-8">
          <Link
            href={`/user/${router.query.userID}/entity/${router.query.entityName}`}
            className="ml-4 mb-4 flex w-max items-center gap-2 py-2 px-2 text-sm capitalize text-blue-300 hover:underline sm:text-lg"
          >
            <IconBack></IconBack>
            <p>{props.entityName}</p>
          </Link>
          <p className="pl-6 text-lg font-semibold sm:text-2xl">
            Entity Generator
          </p>
          <TreeMode
            name={entity.data?.entities.name}
            schema={tryParseOrGiveEmptyObject(
              JSON.stringify(entity.data?.entities.validator)
            )}
            setName={(v) => {
              console.log(v);
            }}
            setSchema={setSchema}
          ></TreeMode>
        </div>
        <div className="flex flex-col gap-4 overflow-auto p-4 sm:p-8">
          <p className="text-lg font-semibold sm:text-2xl">Example Value</p>
          <div className="relative">
            <RenderJson
              value={createEntityFromJson(tryParseOrGiveEmptyObject(schema))}
              className="rounded-xl shadow-lg"
            ></RenderJson>
            {!zodError && (
              <div className="absolute top-2 right-2 rounded-lg bg-blue-900 px-4 py-2">
                Valid
              </div>
            )}
            {zodError && (
              <>
                <ToggledMenu
                  className="!absolute top-2 right-2"
                  align="RIGHT"
                  menuClass="!px-0 !py-0 !max-w-[80vw] "
                  trigger={
                    <div className="rounded-lg bg-rose-900 px-4 py-2">
                      Invalid
                    </div>
                  }
                >
                  <RenderJson
                    className="w-full rounded-lg !bg-rose-900/20 px-4 py-2"
                    value={JSON.parse(zodError)}
                  ></RenderJson>
                </ToggledMenu>
              </>
            )}
          </div>
          <p className="pt-6 text-lg font-semibold sm:text-2xl">
            Insert Entities
          </p>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Number of Entities"
              name="numEntities"
              value={numEntities as any}
              onInput={setNumEntities as any}
              type="number"
            ></TextInput>
            {!zodError && (
              <button
                onClick={() => {
                  createEntities.mutateAsync(numEntities).then((v) => {
                    console.log(v);
                    if (v.every((val) => val?.message === "Success")) {
                      toast("Inserted Entries", {
                        type: "success",
                      });
                    } else {
                      toast("Failed to insert entries", {
                        type: "error",
                      });
                    }
                  });
                }}
                className="group flex w-full items-center justify-between gap-2 rounded-md border-2 border-blue-700 bg-blue-900/30 px-2 py-1 text-lg text-blue-100 transition duration-300 hover:bg-blue-800/60 hover:text-blue-200 sm:w-max sm:justify-around sm:px-6 sm:py-2 sm:text-xl"
              >
                <p>Insert Entities</p>
                <IconPlus className=" animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
              </button>
            )}
          </div>
          <div className="h-24"></div>
        </div>
      </div>
    </>
  );
};

const CreateEntityByEntityNamePage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Entity Playground</title>
        <meta name="description" content="Crudify playground" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MainLayout>
        <hr className="hidden border-2 border-fuchsia-900/50 sm:block" />
        {router.query.userID && router.query.entityName && (
          <CreateEntityPage
            entityName={router.query.entityName + ""}
            userID={router.query.userID + ""}
          ></CreateEntityPage>
        )}
      </MainLayout>
    </>
  );
};

export default CreateEntityByEntityNamePage;
