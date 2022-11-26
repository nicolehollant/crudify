import { JsonValidator, nanoid } from "@server/utils";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { get, set, ensureExists } from "object-path";
import { debounce } from "debounce";

type Types =
  | "any"
  | "string"
  | "boolean"
  | "number"
  | "null"
  | "array"
  | "object";

const SchemaProperty: React.FC<{
  fieldName: string;
  fieldValue: JsonValidator[string];
  onUpdateFieldName: (v: string) => void;
  onUpdateFieldType: (v: Types) => void;
  isReadOnlyKey?: boolean;
}> = (props) => {
  const [fieldName, setFieldName] = useState(props.fieldName);
  const updateFieldName = (e: any) => {
    props.onUpdateFieldName(e.target.value);
  };
  const debounceUpdateFieldName = debounce(updateFieldName, 1500);
  return (
    <div className="space-y-2 pl-6">
      <div className="flex gap-px">
        <input
          type="text"
          className={
            "w-40 border-2 border-blue-800 bg-slate-900 p-2 " +
            (props.fieldName === "entries" && props.isReadOnlyKey
              ? "text-slate-500"
              : "")
          }
          value={fieldName}
          readOnly={props.fieldName === "entries" && props.isReadOnlyKey}
          onChange={(e) => {
            debounceUpdateFieldName(e);
            setFieldName(e.target.value);
          }}
        />
        <select
          className="w-max border-2 border-green-800 bg-slate-900 p-2"
          name=""
          id=""
          onChange={(e) => {
            props.onUpdateFieldType(e.target.value as any);
          }}
          value={props.fieldValue.type}
        >
          <option value="any">any</option>
          <option value="string">string</option>
          <option value="boolean">boolean</option>
          <option value="number">number</option>
          <option value="null">null</option>
          <option value="array">array</option>
          <option value="object">object</option>
        </select>
      </div>
    </div>
  );
};

const Schema: React.FC<{
  properties: JsonValidator;
  children?: React.ReactNode;
  dotpath: string[];
  isReadOnlyKey?: boolean;
  onUpdate: (dotpath: string[], v: any) => void;
}> = (props) => {
  return (
    <>
      {Object.entries(props.properties).map(([k, value]) => {
        return (
          <div key={[...props.dotpath, k].join("-")}>
            <SchemaProperty
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
            ></SchemaProperty>
            <div className="pl-6">
              {value.type === "object" && (
                <>
                  <Schema
                    dotpath={[...props.dotpath, k, "properties"]}
                    onUpdate={props.onUpdate}
                    properties={value?.properties ?? { properties: {} }}
                  ></Schema>
                  <button
                    className="ml-6 bg-green-900 p-2"
                    onClick={() => {
                      props.onUpdate([...props.dotpath, k, "properties"], {
                        ...value.properties,
                        ["property_" +
                        (Object.keys(value?.properties ?? {}).length + 1)]: {
                          type: "any",
                        },
                      });
                    }}
                  >
                    Add Property +
                  </button>
                </>
              )}
              {value.type === "array" && (
                <SchemaProperty
                  isReadOnlyKey={true}
                  fieldName={"entries"}
                  fieldValue={value?.entries ?? { entries: { type: "any" } }}
                  onUpdateFieldName={() => {}}
                  onUpdateFieldType={(v) =>
                    props.onUpdate([...props.dotpath, k, "entries"], {
                      ...value.entries,
                      type: v,
                    })
                  }
                ></SchemaProperty>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Playground: NextPage = () => {
  const [schema, setSchema] = useState<JsonValidator>({
    title: {
      type: "string",
    },
    created: {
      type: "number",
    },
    completed: {
      type: "boolean",
    },
    user: {
      type: "object",
      properties: {
        favoriteStuff: {
          type: "any",
        },
        items: {
          type: "array",
          entries: {
            type: "string",
          },
        },
      },
    },
  });

  const onUpdateProperties = (dotpath: string[], updatedProperties: any) => {
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
      <div className="p-[12vmin]">
        <Schema
          properties={schema}
          dotpath={[]}
          onUpdate={onUpdateProperties}
        ></Schema>
        <pre>
          <code>{JSON.stringify(schema, null, 2)}</code>
        </pre>
      </div>
    </>
  );
};

export default Playground;
