import type { JsonValidator } from "@server/utils";
import { NextPage } from "next";
import React, { Children, useEffect, useRef, useState } from "react";
import { get, set, ensureExists } from "object-path";
import { debounce } from "debounce";
import AppModal from "./app-modal";
import FakerGroup from "./faker-group";
import { Virtuoso } from "react-virtuoso";
import { execFaker, fakerModules } from "src/assets/client-utils";

const ZodValueModal: React.FC<{
  title?: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  setValue: (v: string) => void;
}> = (props) => {
  return (
    <AppModal
      open={props.open}
      setOpen={props.setOpen}
      className="flex flex-col gap-4 overflow-auto pt-0"
    >
      <header className="sticky top-0 grid gap-4 bg-slate-900 pt-6 shadow">
        <h3 className="text-3xl capitalize">{props.title} Value</h3>
        <hr className="border-t-2 border-fuchsia-900/40" />
      </header>
      <Virtuoso
        increaseViewportBy={400}
        style={{ height: "100%" }}
        data={Object.entries(fakerModules)}
        itemContent={(index, [moduleName, moduleValues]) => {
          return (
            <div className="pb-8" key={moduleName}>
              <FakerGroup
                onSelect={props.setValue}
                nodes={moduleValues}
                title={moduleName}
              ></FakerGroup>
            </div>
          );
        }}
      ></Virtuoso>
    </AppModal>
  );
};

type Types =
  | "any"
  | "string"
  | "boolean"
  | "number"
  | "null"
  | "array"
  | "object";

const ZodSchemaProperty: React.FC<{
  fieldName: string;
  fieldValue: JsonValidator[string];
  onUpdateFieldName?: (v: string) => void;
  onUpdateFieldType?: (v: Types) => void;
  onUpdateFieldValue?: (v: any) => void;
  isArrayParent?: boolean;
}> = (props) => {
  const [modalUp, setModalUp] = useState(false);
  const [fieldName, setFieldName] = useState(props.fieldName);
  const [entriesLength, setEntriesLength] = useState("1");
  const updateFieldName = (e: any) => {
    props.onUpdateFieldName?.(e.target.value);
  };
  const debounceUpdateFieldName = debounce(updateFieldName, 1500);
  const updateEntriesLength = (e: any) => {
    props.onUpdateFieldValue?.(e.target.value);
  };
  const debounceUpdateEntriesLength = debounce(updateEntriesLength, 1500);
  return (
    <div className="space-y-2 pl-4">
      <div
        className={
          "flex flex-col sm:flex-row sm:gap-2 " +
          (props.isArrayParent ? "-my-1" : "py-1")
        }
      >
        <div className="flex gap-px">
          <input
            type="text"
            className="w-28 rounded-l-md border-2 border-slate-800 bg-slate-900 p-2 text-xs text-slate-200"
            value={fieldName}
            readOnly={true}
            onChange={(e) => {
              debounceUpdateFieldName(e);
              setFieldName(e.target.value);
            }}
          />
          <p className="inline-flex w-max items-center rounded-r-md border-2 border-slate-800 bg-slate-900 p-2 text-xs text-slate-400">
            {props.fieldValue.type}
          </p>
        </div>
        <div className="flex gap-px">
          {props.fieldValue.type !== "object" &&
            props.fieldValue.type !== "array" && (
              <div className="flex gap-px">
                <div className="relative w-max min-w-[20ch] rounded-l-md border-2 border-blue-800/50 bg-slate-900 p-2">
                  <p className="absolute top-0.5 left-2 text-[10px] font-medium text-slate-400">
                    {(props.fieldValue as any)?._value}{" "}
                  </p>
                  <p className="flex h-full max-w-[40ch] items-end overflow-auto pb-0.5 pt-2 text-sm">
                    {execFaker((props.fieldValue as any)?._value)}
                  </p>
                </div>
                <button
                  className="w-[8ch] rounded-r-md border-2 border-fuchsia-800 bg-fuchsia-900/20 p-2 text-center text-sm transition duration-200 hover:bg-fuchsia-700/60 sm:text-base"
                  onClick={() => setModalUp(true)}
                >
                  value
                </button>
              </div>
            )}
          {props.fieldValue.type == "array" && (
            <div className="flex gap-px">
              <input
                type="text"
                className={
                  "w-40 rounded-l-md border-2 border-green-700 bg-green-900/30 p-2 text-sm font-bold sm:text-base"
                }
                value={entriesLength}
                onChange={(e) => {
                  debounceUpdateEntriesLength(e);
                  setEntriesLength(e.target.value);
                }}
              />
              <p className="inline-flex w-[8ch] items-center justify-center rounded-r-md border-2 border-teal-700  bg-teal-900/20 p-2 text-center text-sm text-slate-300 sm:text-base">
                length
              </p>
            </div>
          )}
        </div>
        <ZodValueModal
          title={props.fieldName}
          open={modalUp}
          setOpen={setModalUp}
          value={(props?.fieldValue as any)?._value ?? ""}
          setValue={(v) => {
            props?.onUpdateFieldValue?.(v);
          }}
        ></ZodValueModal>
      </div>
    </div>
  );
};

const ZodTreeEditor: React.FC<{
  properties: JsonValidator;
  children?: React.ReactNode;
  dotpath: string[];
  isArrayParent?: boolean;
  onUpdate: (dotpath: string[], v: any) => void;
}> = (props) => {
  return (
    <>
      {Object.entries(props.properties).map(([k, value]) => {
        return (
          <div key={[...props.dotpath, k].join("-")} className="my-1">
            <ZodSchemaProperty
              fieldName={k}
              fieldValue={value}
              onUpdateFieldName={(v) => {
                const _properties = JSON.parse(
                  JSON.stringify(props.properties)
                );
                delete _properties[k];
                _properties[v] = props.properties[k];
                props.onUpdate([...props.dotpath], _properties);
              }}
              onUpdateFieldType={(v) =>
                props.onUpdate([...props.dotpath, k], { ...value, type: v })
              }
              onUpdateFieldValue={(v) =>
                props.onUpdate([...props.dotpath, k], { ...value, _value: v })
              }
            ></ZodSchemaProperty>
            <div className="my-1 pl-4">
              {value.type === "object" && (
                <>
                  <ZodTreeEditor
                    dotpath={[...props.dotpath, k, "properties"]}
                    onUpdate={props.onUpdate}
                    properties={value?.properties ?? { properties: {} }}
                  ></ZodTreeEditor>
                </>
              )}
              {value.type === "array" && (
                <>
                  <ZodSchemaProperty
                    isArrayParent={true}
                    fieldName={"entries"}
                    fieldValue={value?.entries ?? { entries: { type: "any" } }}
                    onUpdateFieldType={(v) =>
                      props.onUpdate([...props.dotpath, k, "entries"], {
                        ...value.entries,
                        type: v,
                      })
                    }
                    onUpdateFieldValue={(v) =>
                      props.onUpdate([...props.dotpath, k, "entries"], {
                        ...value.entries,
                        _value: v,
                      })
                    }
                  ></ZodSchemaProperty>
                  {value?.entries?.type === "object" && (
                    <div className="pl-4">
                      <ZodTreeEditor
                        dotpath={[...props.dotpath, k, "entries", "properties"]}
                        onUpdate={props.onUpdate}
                        properties={value?.entries?.properties ?? {}}
                      ></ZodTreeEditor>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ZodTreeEditor;
