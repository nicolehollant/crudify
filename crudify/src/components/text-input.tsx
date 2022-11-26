const TextInput: React.FC<{
  onInput: (v: string) => void;
  value?: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  id?: string;
  multiline?: boolean;
  readOnly?: boolean;
}> = (props) => {
  if (props.multiline) {
    return (
      <label htmlFor="name" className="grid gap-1">
        <p className="text-sm">{props.label}</p>
        <div className="relative grid max-h-80 flex-1 overflow-auto break-all rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-sm transition duration-200 focus-within:border-fuchsia-600 focus-within:outline-none focus-within:ring focus-within:ring-fuchsia-500 focus-within:ring-opacity-50 hover:shadow-md sm:max-h-[50vh]">
          <textarea
            readOnly={props.readOnly}
            placeholder={props.placeholder}
            id={props.id}
            name={props.name}
            value={props.value}
            onInput={(e: any) => props.onInput(e.target.value)}
            className={
              "col-start-1 col-end-2 row-start-1 row-end-2 h-full w-full resize-none overflow-hidden !border-none bg-slate-900 p-0 font-[inherit] !ring-0 focus:!outline-none " +
              (props.readOnly
                ? "cursor-not-allowed !bg-slate-800 !text-slate-400"
                : "")
            }
          />
          <div className="invisible col-start-1 col-end-2 row-start-1 row-end-2 h-full w-full whitespace-pre-wrap font-[inherit]">
            {props.value + " "}
          </div>
        </div>
      </label>
    );
  }
  return (
    <label htmlFor="name" className="grid gap-1">
      <p className="text-sm">{props.label}</p>
      <input
        placeholder={props.placeholder}
        type={props.type ?? "text"}
        id={props.id}
        name={props.name}
        value={props.value}
        readOnly={props.readOnly}
        onInput={(e: any) => props.onInput(e.target.value)}
        className={
          " w-full rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-sm transition duration-200 hover:shadow-md focus:border-fuchsia-600 focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50" +
          (props.readOnly
            ? "cursor-not-allowed !bg-slate-800 !text-slate-400"
            : "")
        }
      />
    </label>
  );
};

export default TextInput;
