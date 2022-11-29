import useClickOutside from "@hooks/useClickOutside";
import { useEffect, useRef, useState } from "react";

const AppModal: React.FC<{
  open: boolean;
  setOpen: (v: boolean) => void;
  children: React.ReactNode;
  className?: string;
}> = (props) => {
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => props.setOpen(false));
  if (props.open) {
    return (
      <div className="fixed inset-0 z-10">
        <button
          onClick={() => props.setOpen(false)}
          className="absolute inset-0 z-10 bg-black/30 backdrop-blur backdrop-filter focus:outline-none"
        ></button>
        <div className="absolute inset-0 z-20 h-full overflow-hidden p-[12vmin]">
          <div
            ref={menuRef}
            className={
              "relative h-full w-full rounded-xl border-2 border-fuchsia-900/30 bg-slate-900 p-6 shadow-xl " +
              props.className
            }
          >
            {props.children}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default AppModal;
