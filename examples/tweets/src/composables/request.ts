export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
type QueryParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams;
type RequestOptions<U = QueryParams> = { query?: U; headers?: HeadersInit };

const _get = async <T extends JSONValue = any, U = QueryParams>(
  path: string,
  options?: RequestOptions<U>
) => {
  const query = new URLSearchParams(options?.query as any).toString();
  const headers = options?.headers ?? {};
  const response = await fetch([path, query].filter((a) => !!a).join("?"), {
    method: "GET",
    headers,
  });
  const json: T = await response.json();
  return json;
};

const _delete = async <T extends JSONValue = any, U = QueryParams>(
  path: string,
  options?: RequestOptions<U>
) => {
  const query = new URLSearchParams(options?.query as any).toString();
  const headers = options?.headers ?? {};
  const response = await fetch([path, query].filter((a) => !!a).join("?"), {
    method: "DELETE",
    headers,
  });
  const json: T = await response.json();
  return json;
};

const _post = async <
  R extends JSONValue = any,
  T extends JSONValue = any,
  U = QueryParams
>(
  path: string,
  body: R,
  options?: RequestOptions<U>
) => {
  const query = new URLSearchParams(options?.query as any).toString();
  const headers = options?.headers ?? {};
  const response = await fetch([path, query].filter((a) => !!a).join("?"), {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
  const json: T = await response.json();
  return json;
};

const _put = async <
  R extends JSONValue = any,
  T extends JSONValue = any,
  U = QueryParams
>(
  path: string,
  body: R,
  options?: RequestOptions<U>
) => {
  const query = new URLSearchParams(options?.query as any).toString();
  const headers = options?.headers ?? {};
  const response = await fetch([path, query].filter((a) => !!a).join("?"), {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  });
  const json: T = await response.json();
  return json;
};

const _any = async <
  R extends JSONValue = any,
  T extends JSONValue = any,
  U = QueryParams
>(
  method: "GET" | "PUT" | "POST" | "DELETE",
  path: string,
  body: R,
  options?: RequestOptions<U>
) => {
  const query = new URLSearchParams(options?.query as any).toString();
  const headers = options?.headers ?? {};
  const response = await fetch([path, query].filter((a) => !!a).join("?"), {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
  const json: T = await response.json();
  return json;
};
export const request = {
  get: _get,
  post: _post,
  put: _put,
  delete: _delete,
  any: _any,
};
