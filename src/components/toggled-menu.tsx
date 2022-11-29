import useClickOutside from "@hooks/useClickOutside";
import { useEffect, useRef, useState } from "react";

const ToggledMenu: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
  menuClass?: string;
  align?: "LEFT" | "RIGHT";
}> = (props) => {
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false));

  const [menuOpen, setMenuOpen] = useState(props.open ?? false);
  useEffect(() => {
    setMenuOpen(props.open ?? false);
  }, [props.open]);
  return (
    <div
      className={
        "relative flex flex-col justify-center gap-2 " + props.className
      }
      ref={menuRef}
    >
      <button onClick={() => setMenuOpen((v) => !v)}>{props.trigger}</button>
      {menuOpen && (
        <div
          className={
            " absolute top-[calc(100%+0.75rem)] z-10 w-max max-w-sm rounded-md border-2 border-fuchsia-500/20 bg-slate-900 px-6 py-4 shadow-md shadow-fuchsia-600/10 " +
            (props.align === "RIGHT" ? " right-0 " : " left-0 ") +
            props.menuClass
          }
        >
          <div
            className={
              "absolute top-0 h-3 w-3 translate-y-[calc(-50%-1.5px)] rotate-45 transform rounded-sm border-t-2 border-l-2 border-fuchsia-500/20 bg-slate-900 " +
              (props.align === "RIGHT" ? "right-3" : "left-3")
            }
          ></div>
          {props.children}
        </div>
      )}
    </div>
  );
};

export default ToggledMenu;
