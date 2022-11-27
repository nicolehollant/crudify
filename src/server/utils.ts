import { TErrorResponse } from "~types/app";
import { nanoid as _nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Users } from "./db";
import { getSession } from "next-auth/react";
import { DefaultSession, Session } from "next-auth";
import Cors from "cors";
export const ErrorResponse = (e: any): TErrorResponse => ({ error: e });
export const nanoid = () => _nanoid(16);

export const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

type TNextFn = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
type TNextMethods = {
  GET: TNextFn;
  PUT: TNextFn;
  DELETE: TNextFn;
  POST: TNextFn;
  ANY: TNextFn;
};
export const toMethods =
  (handlers: Partial<TNextMethods>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "GET" && handlers.GET) {
      return handlers.GET(req, res);
    }
    if (req.method === "POST" && handlers.POST) {
      return handlers.POST(req, res);
    }
    if (req.method === "PUT" && handlers.PUT) {
      return handlers.PUT(req, res);
    }
    if (req.method === "DELETE" && handlers.DELETE) {
      return handlers.DELETE(req, res);
    }
    if (handlers.ANY) {
      return handlers.ANY(req, res);
    }
  };

export class CrudifyError extends Error {
  statusCode: number;
  data: any;
  constructor(message: string, statusCode = 400, data?: any) {
    super(message);
    this.name = "CrudifyError";
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

export const catchErrors =
  (
    f: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
    msg = "Something went wrong"
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await f(req, res);
    } catch (err: any) {
      console.log(err);
      return res.status(err.statusCode ?? 400).json({
        error: err?.message ?? msg,
        data:
          err?.data ??
          (err instanceof CrudifyError ? undefined : err) ??
          undefined,
        stringified: JSON.stringify(err, null, 2),
      });
    }
  };

export const getValidator = async (userID: string, entityName: string) => {
  const { connection, collection } = await Users();
  const [result] = await collection
    .aggregate([
      {
        $match: { $or: [{ userID }, { slug: userID }] },
      },
      {
        $unwind: { path: "$entities" },
      },
      {
        $match: { "entities.name": entityName },
      },
      {
        $project: { "entities.validator": 1 },
      },
    ])
    .toArray();
  return result;
};

type SessionWithEmail = {
  user: {
    id: string;
  } & {
    name?: string | null;
    email: string;
    image?: string | null;
  };
};
export const requireAuth = async (
  req: NextApiRequest
): Promise<SessionWithEmail> => {
  const session = await getSession({ req });
  if (!session?.user?.email) {
    throw new CrudifyError("Unauthenticated", 401);
  }
  return session as any as SessionWithEmail;
};

export const getEmailByIdentifier = async (email: string) => {
  const { connection, collection } = await Users();
  const [existing] = await collection
    .find({ $or: [{ email }, { slug: email }, { userID: email }] })
    .toArray();
  return existing?.email;
};

export const requireAuthAsEmail = async (
  req: NextApiRequest,
  email: string | undefined
) => {
  const session = await requireAuth(req);
  if (session?.user?.email !== email) {
    throw new CrudifyError("Forbidden", 403);
  }
  return session;
};

// validator parsing:

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

export const AppEntity = <T extends z.ZodRawShape>(_validator: T) => {
  const validator = z.object(_validator);
  const store: (typeof validator._type & { id: string })[] = [];

  const getAll = () => {
    return store;
  };

  const getWhere = (predicate: (entry: typeof store[number]) => boolean) => {
    return store.filter(predicate);
  };

  const getOne = (id: string) => {
    return store.find((a) => a.id === id);
  };

  const create = async (data: typeof validator._input) => {
    const id = nanoid();
    const parsed = await validator.parseAsync(data);
    return store.push({ id, ...parsed });
  };

  const updateOne = async (id: string, data: typeof validator._input) => {
    const index = store.findIndex((a) => a.id === id);
    if (index < 0) {
      throw new Error("not found");
    }
    const parsed = await validator.parseAsync(data);
    const updated = { id, ...parsed };
    store[index] = updated;
    return updated;
  };

  const deleteOne = (id: string) => {
    const index = store.findIndex((a) => a.id === id);
    if (index < 0) {
      throw new Error("not found");
    }
    const deleted = store.splice(index, 1);
    return deleted;
  };

  return {
    getAll,
    getOne,
    getWhere,
    create,
    validator,
    store,
    updateOne,
    deleteOne,
  };
};

type JsonValidatorKey =
  | {
      type: "string";
    }
  | {
      type: "number";
    }
  | {
      type: "boolean";
    }
  | {
      type: "any";
    }
  | {
      type: "object";
      properties: JsonValidator;
    }
  | {
      type: "array";
      entries: JsonValidatorKey;
    };

export type JsonValidator = {
  [k: string]: JsonValidatorKey;
};
