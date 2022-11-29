const FakerGroup: React.FC<{
  title: string;
  nodes: { name: string; example: string | number | boolean | null }[];
  onSelect: (v: string) => void;
}> = (props) => {
  return (
    <section title={props.title} className="grid gap-2">
      <h4 className="text-lg font-semibold capitalize text-slate-400">
        {props.title}
      </h4>
      <div className="flex flex-wrap gap-4">
        {props.nodes.map((v) => (
          <button
            onClick={() => props.onSelect(`${props.title}.${v.name}`)}
            key={`${props.title}.${v.name}`}
            className="w-max rounded-lg border-2 border-slate-800/30 bg-slate-700/20 py-1 px-2 hover:border-fuchsia-900/30"
          >
            <abbr title={"" + v.example} className="border-0 no-underline">
              {v.name}
            </abbr>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FakerGroup;
