import { JSONValue, httpRequest } from "@hooks/httpRequest";
import { useEffect, useState } from "react";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

import Prism from "prismjs";
import "prismjs/components/prism-json";

const MySashContent: any = SashContent;

const Methods = {
  POST: (
    <span className="inline-block w-16 text-left font-medium tracking-wider text-orange-500">
      POST
    </span>
  ),

  GET: (
    <span className="inline-block w-16 text-left font-medium tracking-wider text-green-500">
      GET
    </span>
  ),
  PUT: (
    <span className="inline-block w-16 text-left font-medium tracking-wider text-blue-500">
      PUT
    </span>
  ),
  DELETE: (
    <span className="inline-block w-16 text-left font-medium tracking-wider text-red-500">
      DEL
    </span>
  ),
};

type Route = {
  path: string;
  pathResolved: string;
  title: string;
  method: string;
  body: JSONValue;
  pathParameters?: { [k: string]: string };
};
const RestClient: React.FC<{
  routes: Route[];
  baseURL: string;
  entityName: string;
}> = (props) => {
  const [activeMethod, setActiveMethod] = useState(
    props.routes[0]?.method ?? "GET"
  );
  const [activeRoute, setActiveRoute] = useState(
    props.baseURL + (props.routes[0]?.pathResolved ?? "")
  );
  const [body, setBody] = useState(
    JSON.stringify(props.routes[0]?.body, null, 2)
  );
  const [response, setResponse] = useState(null);
  const [paneSizes, setPaneSizes] = useState<(string | number)[]>(["auto"]);

  const makeRequest = async () => {
    try {
      console.log({
        activeMethod,
        activeRoute,
        body: JSON.parse(body),
      });
      const res = await httpRequest().any(
        activeMethod as any,
        activeRoute,
        JSON.parse(body)
      );
      setResponse(res);
    } catch (error) {
      setResponse(error as any);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 500);
  }, [response]);

  return (
    <div className="grid h-full grid-cols-[auto,minmax(0,1fr)]">
      <div className="grid h-full grid-rows-[auto,minmax(0,1fr)]">
        <div className="flex h-20 items-center bg-gradient-to-br from-black/20 to-fuchsia-900/5 p-4 px-4 shadow-lg">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300/70">
              trying entity:
            </p>
            <p className="capitalize">
              <span className="mr-2 bg-gradient-to-tr from-blue-400 via-teal-400  to-pink-500 bg-clip-text text-transparent">
                🏗
              </span>
              {props.entityName}
            </p>
          </div>
        </div>
        <nav className="flex h-full flex-col gap-4 bg-black/20 px-8 py-4">
          {props.routes.map((route) => (
            <button
              className="text-left"
              key={route.method + "-" + route.pathResolved}
              onClick={() => {
                setActiveRoute(props.baseURL + route.pathResolved);
                setActiveMethod(route.method);
                setBody(String(route.body));
              }}
            >
              <p className="text-sm">
                {(Methods as any)[route.method.toUpperCase()]}{" "}
                <span>{route.title}</span>
              </p>
            </button>
          ))}
        </nav>
      </div>
      <div className="grid h-full grid-rows-[auto,minmax(0,1fr)]">
        <div className="flex h-20 items-center bg-black/30 px-4">
          {(Methods as any)[activeMethod.toUpperCase()]}{" "}
          <input
            type="text"
            value={activeRoute}
            onChange={(e) => setActiveRoute(e.target.value)}
            className="w-full bg-transparent focus:outline-none focus:ring"
          />
          <button
            className="rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-blue-50 transition duration-200 hover:bg-blue-700"
            onClick={() => makeRequest()}
          >
            Send
          </button>
        </div>
        <SplitPane
          className="h-full bg-slate-900"
          sashRender={(index, active) => (
            <MySashContent className="group flex h-full w-full items-center justify-center bg-slate-900">
              <span
                className={
                  "flex h-8 w-full items-center justify-center  transition duration-200 group-hover:bg-blue-500 " +
                  (active ? "bg-blue-500" : "bg-blue-500/20")
                }
              ></span>
            </MySashContent>
          )}
          split="vertical"
          sizes={paneSizes}
          onChange={setPaneSizes as any}
        >
          <Pane minSize="20%" maxSize="80%">
            <div className="h-full w-full bg-black/10 p-4">
              <textarea
                name=""
                id=""
                className="h-full w-full resize-none rounded-lg  bg-black/10 p-2 focus:outline-none focus:ring"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>
          </Pane>
          <pre className="h-full w-full !bg-slate-900">
            <code className="language-json">
              {JSON.stringify(response, null, 2)}
            </code>
          </pre>
        </SplitPane>
      </div>
    </div>
  );
};

export default RestClient;
