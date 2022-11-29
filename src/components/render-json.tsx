import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";

const RenderJson: React.FC<{ value: any; className?: string }> = (props) => {
  useEffect(() => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 500);
  }, [props.value]);
  return (
    <pre className={"!m-0 overflow-auto !bg-slate-900 !p-3 " + props.className}>
      <code className="language-json  !text-xs">
        {JSON.stringify(props.value, null, 2)}
      </code>
    </pre>
  );
};

export default RenderJson;
