const Button: React.FC<{
  children?: React.ReactNode;
  onClick: (v: string) => void;
  value: string;
  label?: string;
  isActive: boolean;
  className?: string;
}> = (props) => {
  return (
    <button
      className={
        props.className +
        " rounded-lg px-4 font-semibold " +
        (props.isActive ? "bg-fuchsia-900" : "")
      }
      onClick={() => props.onClick(props.value)}
    >
      {!!((props.children as any)?.length ?? props.children)
        ? props.children
        : props.label ?? props.value}
    </button>
  );
};

const Row: React.FC<{ children?: React.ReactNode; className?: string }> = (
  props
) => {
  return (
    <div
      className={
        props.className + " flex w-max rounded-lg bg-fuchsia-900/20 p-1"
      }
    >
      {props.children}
    </div>
  );
};

const Tab = { Button, Row };
export default Tab;
