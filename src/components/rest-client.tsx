import { JSONValue, httpRequest } from "@hooks/httpRequest";
import { useEffect, useState } from "react";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

import Prism from "prismjs";
import "prismjs/components/prism-json";
import ToggledMenu from "./toggled-menu";
import IconMenu from "~icons/mdi/menu.jsx";

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

const NavMenu: React.FC<{
  routes: Route[];
  className?: string;
  onClick?: (route: Route) => void;
}> = (props) => {
  return (
    <nav
      className={
        "flex h-full flex-col gap-4 bg-black/20 px-8 py-4 " + props.className
      }
    >
      {props.routes.map((route) => (
        <button
          className="text-left"
          key={route.method + "-" + route.pathResolved}
          onClick={() => {
            props?.onClick?.(route);
          }}
        >
          <p className="text-sm">
            {(Methods as any)[route.method.toUpperCase()]}{" "}
            <span>{route.title}</span>
          </p>
        </button>
      ))}
    </nav>
  );
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
  const [mode, setMode] = useState<"request" | "response">("request");
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
    <div className="flex h-full flex-col sm:grid sm:grid-cols-[auto,minmax(0,1fr)] sm:grid-rows-1">
      <div className="hidden h-full grid-rows-[auto,minmax(0,1fr)] sm:grid">
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
        <NavMenu
          routes={props.routes}
          onClick={(route) => {
            setActiveRoute(props.baseURL + route.pathResolved);
            setActiveMethod(route.method);
            setBody(String(route.body));
          }}
        />
      </div>
      <div className="grid h-full grid-rows-[auto,auto,minmax(0,1fr)] sm:grid-rows-[auto,minmax(0,1fr)]">
        <div className="flex h-12 items-center gap-4 border-t-2 border-fuchsia-800/50 bg-black/30 px-4 sm:h-20 sm:border-t-0">
          {(Methods as any)[activeMethod.toUpperCase()]}{" "}
          <input
            type="text"
            value={activeRoute}
            onChange={(e) => setActiveRoute(e.target.value)}
            className="w-full bg-transparent focus:outline-none focus:ring"
          />
          <button
            className="fixed bottom-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-blue-50 transition duration-200 hover:bg-blue-700 sm:static sm:h-auto sm:w-auto sm:rounded sm:px-2 sm:py-1"
            onClick={() => makeRequest()}
          >
            Send
          </button>
        </div>
        <div className="flex justify-between border-y-2 border-fuchsia-800/20 bg-black/30 px-4 sm:hidden">
          <div className="flex items-center gap-8 from-black/20 to-fuchsia-900/5  shadow-lg sm:bg-gradient-to-br">
            <button
              className={
                "-mb-0.5 border-b-2 px-2 py-2 text-sm " +
                (mode === "request"
                  ? "border-fuchsia-800"
                  : "border-transparent")
              }
              onClick={() => setMode("request")}
            >
              Request
            </button>
            <button
              className={
                "-mb-0.5 border-b-2 px-2 py-2 text-sm " +
                (mode === "response"
                  ? "border-fuchsia-800"
                  : "border-transparent")
              }
              onClick={() => setMode("response")}
            >
              Response
            </button>
          </div>
          <div className="h-full border-l-2 border-fuchsia-800/20"></div>
          <ToggledMenu
            trigger={
              <div className="flex items-center gap-2 py-2">
                <p className="text-sm">Endpoints</p>
                <IconMenu></IconMenu>
              </div>
            }
            align="RIGHT"
          >
            <div className="max-w-[50vw] pb-3">
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
            <NavMenu
              className="!bg-transparent !px-0 !py-0"
              routes={props.routes}
              onClick={(route) => {
                setActiveRoute(props.baseURL + route.pathResolved);
                setActiveMethod(route.method);
                setBody(String(route.body));
              }}
            />
          </ToggledMenu>
        </div>
        <div className="h-full w-full overflow-hidden sm:hidden">
          <div
            className={
              "h-full w-full overflow-auto bg-black/10 p-3 " +
              (mode === "response" ? "hidden" : "block")
            }
          >
            <textarea
              name=""
              id=""
              className="h-full w-full resize-none rounded-lg  bg-black/10 p-2 focus:outline-none focus:ring"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>

          <pre
            className={
              "!m-0 h-full w-full overflow-auto !bg-slate-900 !p-3 " +
              (mode === "request" ? "hidden" : "block")
            }
          >
            <code className="language-json  !text-xs">
              {JSON.stringify(response, null, 2)}
            </code>
          </pre>
        </div>
        <SplitPane
          className="hidden h-full bg-slate-900 sm:block"
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
