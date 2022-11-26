import { z } from "zod";

export type Entity<T extends z.ZodRawShape = any> = {
  _id?: string;
  data: any[];
  validator: T;
};
export type User = {
  email: string;
  name: string;
  slug: string;
  userID: string;
  entities: Entity[];
  _id?: string;
};
export type TErrorResponse = { error: any; data?: any };

// API Types
export type Endpoint<
  Req = any,
  Res = any,
  Q = any,
  Params = any,
  Locals = any
> = {
  params: Params;
  res: Res;
  req: Req;
  query: Q;
  locals: Locals;
};
export type Get<Res = any, Q = any> = Endpoint<never, Res, Q>;
export type GetResponse<T extends { GET: Endpoint }> =
  | T["GET"]["res"]
  | TErrorResponse;
export type GetQuery<T extends { GET: Endpoint }> = T["GET"]["query"];
export type Post<Req = any, Res = any, Q = any> = Endpoint<Req, Res, Q>;
export type PostResponse<T extends { POST: Endpoint }> =
  | T["POST"]["res"]
  | TErrorResponse;
export type PostRequest<T extends { POST: Endpoint }> = T["POST"]["req"];
export type PostQuery<T extends { POST: Endpoint }> = T["POST"]["query"];
export type Put<Req = any, Res = any, Q = any> = Endpoint<Req, Res, Q>;
export type PutResponse<T extends { PUT: Endpoint }> =
  | T["PUT"]["res"]
  | TErrorResponse;
export type PutRequest<T extends { PUT: Endpoint }> = T["PUT"]["req"];
export type PutQuery<T extends { PUT: Endpoint }> = T["PUT"]["query"];
export type Delete<Res = any, Q = any> = Endpoint<never, Res, Q>;
export type DeleteResponse<T extends { DELETE: Endpoint }> =
  | T["DELETE"]["res"]
  | TErrorResponse;
export type DeleteQuery<T extends { DELETE: Endpoint }> = T["DELETE"]["query"];
export interface API {
  health: {
    GET: Get<string>;
  };
  user: {
    POST: Post<{ email: string; slug: string; name: string }, User>;
    $userID: {
      GET: Get<User>;
      entity: {
        POST: Post<{ name: string; schema: z.ZodRawShape }, User>;
      };
      $entityName: {
        validator: {
          GET: Get<{ name: string; validator: z.ZodRawShape }>;
        };
        GET: Get<any[]>;
        POST: Post<any, any>;
        where: {
          GET: Get<any[]>;
        };
        $entityID: {
          GET: Get<any>;
          PUT: Put<any, any>;
          DELETE: Delete<any>;
        };
      };
    };
  };
}
