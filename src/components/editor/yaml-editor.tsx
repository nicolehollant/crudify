import { FC } from "react";
import { useCallback } from "react";
import { EditorView } from "codemirror";
import { keymap, KeyBinding } from "@codemirror/view";
import ReactCodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { dracula } from "@uiw/codemirror-theme-dracula";

// TODO: look into https://discuss.codemirror.net/t/keymap-for-bold-text-in-lang-markdown/3150
const YamlEditor: FC<
  {
    themeDefinition?: {
      background: string;
      foreground: string;
      caret: string;
      selection: string;
      selectionMatch: string;
      lineHighlight: string;
      gutterBackground: string;
      gutterForeground: string;
    };
    handleSubmit?: (value?: string) => void;
  } & ReactCodeMirrorProps &
    React.RefAttributes<ReactCodeMirrorRef>
> = (props) => {
  const { onChange, handleSubmit, themeDefinition, ...restProps } = props;
  const handleChange = useCallback(
    (value: string) => onChange?.(value, undefined as any),
    [onChange]
  );
  return (
    <ReactCodeMirror
      {...restProps}
      basicSetup={{
        lineNumbers: false,
        foldGutter: true,
        highlightActiveLine: true,
        defaultKeymap: false,
      }}
      theme={dracula}
      extensions={[EditorView.lineWrapping, StreamLanguage.define(yaml)]}
      onChange={handleChange}
    />
  );
};

export default YamlEditor;
