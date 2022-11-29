import fakerExamples from "./faker-examples.json";
import { faker } from "@faker-js/faker";
import { z } from "zod";

const numbers = {
  float: {
    "0Digit": () => Number((Math.random() % 1).toFixed(4)),
    "1Digit": () => Number(((Math.random() * 10) % 10).toFixed(4)),
    "2Digit": () => Number(((Math.random() * 100) % 100).toFixed(4)),
    "3Digit": () => Number(((Math.random() * 1000) % 1000).toFixed(4)),
    "4Digit": () => Number(((Math.random() * 10000) % 10000).toFixed(4)),
    "5Digit": () => Number(((Math.random() * 100000) % 100000).toFixed(4)),
    "6Digit": () => Number(((Math.random() * 1000000) % 1000000).toFixed(4)),
    "7Digit": () => Number(((Math.random() * 10000000) % 10000000).toFixed(4)),
    "8Digit": () =>
      Number(((Math.random() * 100000000) % 100000000).toFixed(4)),
    "9Digit": () =>
      Number(((Math.random() * 1000000000) % 1000000000).toFixed(4)),
  },
  int: {
    "1Digit": () => Math.floor(Math.random() * 10) % 10,
    "2Digit": () => Math.floor(Math.random() * 100) % 100,
    "3Digit": () => Math.floor(Math.random() * 1000) % 1000,
    "4Digit": () => Math.floor(Math.random() * 10000) % 10000,
    "5Digit": () => Math.floor(Math.random() * 100000) % 100000,
    "6Digit": () => Math.floor(Math.random() * 1000000) % 1000000,
    "7Digit": () => Math.floor(Math.random() * 10000000) % 10000000,
    "8Digit": () => Math.floor(Math.random() * 100000000) % 100000000,
    "9Digit": () => Math.floor(Math.random() * 1000000000) % 1000000000,
    "10Digit": () => Math.floor(Math.random() * 10000000000) % 10000000000,
  },
};

export const fakerModules: {
  [k: string]: { name: string; example: string | number | boolean | null }[];
} = fakerExamples;

export const execFaker = (
  dotpath: string,
  type: "string" | "number" | "boolean" | "any" | "array" | "object" = "string"
) => {
  try {
    const [_module, method] = dotpath.split(".");
    if (_module === "float" || _module === "int") {
      return (numbers[_module] as any)[method as any]();
    }
    const res = (faker as any)[_module as any][method as any]();
    if (res instanceof Date) {
      return res.toISOString();
    }
    return res;
  } catch (error) {
    const defaults = {
      string: "",
      number: 1,
      boolean: Math.random() < 0.5,
      any: "",
      array: [],
      object: {},
    };
    return defaults[type];
  }
};

export const tryParseOrGiveEmptyObject = (schemaStr: string) => {
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

export const createValidatorFromJson = (input: string | any) => {
  const shape: any = {};
  const validatorInput = typeof input === "string" ? JSON.parse(input) : input;
  const primitives = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
    any: z.any(),
  };
  Object.entries(validatorInput).forEach(([key, val]: [string, any]) => {
    const base = Object.keys(primitives).includes(val?.type)
      ? primitives[val.type as keyof typeof primitives]
      : null;
    if (base) {
      shape[key] = base;
    } else if (val.type === "object") {
      shape[key] = z.object({
        ...createValidatorFromJson(JSON.stringify(val.properties)),
      });
    } else if (val.type === "array") {
      shape[key] = z.array(
        createValidatorFromJson({ _base: val.entries })._base
      );
    }
  });
  return shape;
};

const getArrLength = (v: string) => {
  try {
    if (v.toLowerCase().includes("rand")) {
      const randParams = v
        .toLowerCase()
        .replace("rand", "")
        .replace("(", "")
        .replace(")", "");
      const [max, min] = randParams.split(",");
      const nMax = parseInt(max?.trim?.() ?? "1");
      if (min) {
        const nMin = parseInt(min.trim());
        return Math.floor(Math.random() * (nMax - nMin) + nMin);
      }
      return Math.floor(Math.random() * nMax);
    }
    return parseInt(v);
  } catch (error) {
    return 1;
  }
};

export const createEntityFromJson = (input: string | any) => {
  const shape: any = {};
  const validatorInput =
    typeof input === "string" ? tryParseOrGiveEmptyObject(input) : input;
  const primitives = ["string", "number", "boolean", "any"];
  Object.entries(validatorInput).forEach(([key, val]: [string, any]) => {
    const isPrimitive = primitives.includes(val?.type);
    if (isPrimitive) {
      shape[key] = execFaker(val._value, val?.type);
    } else if (val.type === "object") {
      shape[key] = {
        ...createEntityFromJson(JSON.stringify(val.properties)),
      };
    } else if (val.type === "array") {
      shape[key] = Array.from({ length: getArrLength(val?._value) }).map(
        () => createEntityFromJson({ _base: val.entries })._base
      );
    }
  });
  return shape;
};

export const parseNStringify = (val: any): any => {
  try {
    const res = JSON.parse(val);
    const recursed = parseNStringify(res);
    if (recursed) {
      return recursed;
    }
    return res;
  } catch (error) {
    if (typeof val === "object") {
      return val;
    }
    return false;
  }
};
