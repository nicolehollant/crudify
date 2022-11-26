import { nanoid } from "@server/utils";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { get, set, ensureExists } from "object-path";

import useDeepCompareEffect from "use-deep-compare-effect";

// {
//   "userID": {
//     "type": "string"
//   },
//   "title": {
//     "type": "string"
//   },
//   "created": {
//     "type": "number"
//   },
//   "completed": {
//     "type": "boolean"
//   }
// }

type Types =
  | "any"
  | "string"
  | "boolean"
  | "number"
  | "null"
  | "array"
  | "object";

const Schema: React.FC<{
  fieldName?: string;
  fieldType?: Types;
  properties?: any[];
  children?: React.ReactNode;
  ref?: any;
  dotpath: string[];
  onRemoveProperty?: (i: number) => void;
  onUpdateFieldName?: (v: string) => void;
  onUpdateFieldType?: (v: Types) => void;
  onUpdateProperties?: (dotpath: string[], v: any) => void;
}> = (props) => {
  const [propertiesStringified, setPropertiesStringified] = useState("[]");
  const [properties, setProperties] = useState<any[]>([]);
  const [fieldName, setFieldName] = useState(props.fieldName ?? "");
  const [fieldType, setFieldType] = useState<Types>(props.fieldType ?? "any");
  // useDeepCompareEffect(() => {
  //   console.log("properties changed", props.dotpath, properties);
  //   // props.onUpdateProperties?.(props.dotpath, properties);
  //   setPropertiesStringified(JSON.stringify(properties));
  // }, [properties]);
  useEffect(() => {
    console.log(
      "properties changed",
      props.dotpath,
      JSON.parse(propertiesStringified)
    );
    setProperties(JSON.parse(propertiesStringified));
    props.onUpdateProperties?.(
      props.dotpath,
      { fieldName, fieldType, properties: JSON.parse(propertiesStringified) }
      // JSON.parse(propertiesStringified)
    );
  }, [propertiesStringified]);

  useEffect(() => {
    setPropertiesStringified(JSON.stringify(properties));
  }, [properties.length]);

  return (
    <>
      <div className="space-y-2 pl-6">
        <div className="flex gap-4">
          <input
            type="text"
            className="w-40 border-2 border-blue-800 bg-slate-900 p-2"
            value={fieldName}
            onChange={(e) => {
              props.onUpdateFieldName?.(e.target.value);
              setFieldName(e.target.value);
            }}
          />
          <select
            className="w-max border-2 border-green-800 bg-slate-900 p-2"
            name=""
            id=""
            onChange={(e) => {
              props.onUpdateFieldType?.(e.target.value as any);
              setFieldType(e.target.value as any);
            }}
            value={fieldType}
          >
            <option value="any">any</option>
            <option value="string">string</option>
            <option value="boolean">boolean</option>
            <option value="number">number</option>
            <option value="null">null</option>
            <option value="array">array</option>
            <option value="object">object</option>
          </select>
          <p>{JSON.stringify(props.dotpath)}</p>
        </div>
        {fieldType === "object" && (
          <>
            {/* {Array.from({ length: properties.length }).map((_, i) => ( */}
            {properties.map((_, i) => (
              <div className="flex gap-2" key={[properties[i].id, i].join("-")}>
                <Schema
                  dotpath={[...props.dotpath, "properties", i + ""]}
                  fieldName={properties[i].fieldName}
                  fieldType={properties[i].fieldType}
                  onUpdateFieldName={(v) => {
                    setPropertiesStringified((_v) => {
                      const p = JSON.parse(_v);
                      p[i].fieldName = v;
                      return JSON.stringify(p);
                    });
                    setProperties((p) => {
                      p[i].fieldName = v;
                      return p;
                    });
                  }}
                  onUpdateFieldType={(v) => {
                    setPropertiesStringified((_v) => {
                      const p = JSON.parse(_v);
                      p[i].fieldType = v;
                      return JSON.stringify(p);
                    });
                    setProperties((p) => {
                      p[i].fieldType = v;
                      return p;
                    });
                  }}
                  onUpdateProperties={(dotPath, vals) => {
                    props.onUpdateProperties?.(dotPath, vals);
                  }}
                ></Schema>
                <button
                  className="bg-red-900 p-2"
                  onClick={() => {
                    setPropertiesStringified((p) => {
                      const v = JSON.parse(p);
                      return JSON.stringify([
                        ...v.slice(0, i),
                        ...v.slice(i + 1),
                      ]);
                    });
                    setProperties((v) => [...v.slice(0, i), ...v.slice(i + 1)]);
                  }}
                >
                  x
                </button>
              </div>
            ))}
            <button
              className="ml-6 bg-green-900 p-2"
              onClick={() => {
                setProperties((v) => [
                  ...v,
                  {
                    id: Math.random().toString(),
                    fieldName: "",
                    fieldType: "any",
                  },
                ]);
              }}
            >
              Add Property +
            </button>
          </>
        )}
      </div>
    </>
  );
};

const Playground: NextPage = () => {
  const [properties, setProperties] = useState<{ properties: any[] }>({
    properties: [],
  });
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<Types>("object");

  const [schema, setSchema] = useState({});

  const onUpdateProperties = (dotpath: string[], updatedProperties: any) => {
    console.log(dotpath, updatedProperties);
    if (dotpath.length) {
      setProperties((v) => {
        console.log("UPDATE:", v);
        const newProperties = [...v.properties];
        dotpath.reduce((prev: string[], curr: string) => {
          if (prev[prev.length - 1] === "properties") {
            ensureExists(newProperties, prev, []);
          } else {
            ensureExists(newProperties, prev, { properties: [] });
          }
          return [...prev, curr];
        }, []);
        set(newProperties, dotpath, updatedProperties);
        return { properties: newProperties };
      });
    } else {
      setProperties({
        properties: updatedProperties?.properties ?? updatedProperties,
      });
    }
  };
  // const createSchema = (input: string | any) => {
  //   const shape: any = {};
  //   const validatorInput =
  //     typeof input === "string" ? JSON.parse(input) : input;
  //   const primitives = {
  //     string: (fieldName: string, fieldType: Types) => (
  //       <Schema fieldName={fieldName} fieldType={fieldType} />
  //     ),
  //     number: (fieldName: string, fieldType: Types) => (
  //       <Schema fieldName={fieldName} fieldType={fieldType} />
  //     ),
  //     boolean: (fieldName: string, fieldType: Types) => (
  //       <Schema fieldName={fieldName} fieldType={fieldType} />
  //     ),
  //     any: (fieldName: string, fieldType: Types) => (
  //       <Schema fieldName={fieldName} fieldType={fieldType} />
  //     ),
  //   };
  //   Object.entries(validatorInput).forEach(([key, val]: [string, any]) => {
  //     const base = Object.keys(primitives).includes(val?.type)
  //       ? primitives[val.type as keyof typeof primitives]
  //       : null;
  //     if (base) {
  //       shape[key] = base;
  //     } else if (val.type === "object") {
  //       // shape[key] = z.object({
  //       //   ...createSchema(JSON.stringify(val.properties)),
  //       // })
  //     } else if (val.type === "array") {
  //       // shape[key] = z.array(createSchema({ _base: val.entries })._base)
  //     }
  //   });
  //   return shape;
  // };
  return (
    <>
      <div className="p-[12vmin]">
        <Schema
          dotpath={[]}
          fieldName={fieldName}
          fieldType={fieldType}
          onUpdateFieldName={(v) => setFieldName(v)}
          onUpdateFieldType={(v) => setFieldType(v)}
          onUpdateProperties={(dotpath, v) => onUpdateProperties(dotpath, v)}
        ></Schema>
        <button
          onClick={() => {
            console.log(properties);
          }}
        >
          current valud
        </button>
        <pre>
          <code>{JSON.stringify(properties, null, 2)}</code>
        </pre>
        {/* {createSchema({
          userID: {
            type: "string",
          },
          title: {
            type: "string",
          },
          created: {
            type: "number",
          },
          completed: {
            type: "boolean",
          },
        })} */}
      </div>
    </>
  );
};

export default Playground;
