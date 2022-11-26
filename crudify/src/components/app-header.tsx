import Link from "next/link";
import AuthStatus from "./auth-status";
import IconShimmer from "~icons/mdi/shimmer.jsx";

const AppHeader: React.FC = () => {
  return (
    <>
      <header className="flex w-full items-center justify-between bg-black/20 px-6 py-2">
        <Link href="/">
          <h1 className=" text-xl font-medium tracking-wide text-transparent">
            <span className="bg-gradient-to-tr from-orange-400 via-rose-400  to-pink-500 bg-clip-text">
              🚀
            </span>
            <span className="ml-4 bg-gradient-to-tr from-slate-500 via-[rgb(151,109,194)] to-fuchsia-400 bg-clip-text">
              CRUDIFY
            </span>
          </h1>
        </Link>
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/explore">
            <div className="group flex items-center justify-around gap-2 transition duration-300 hover:text-fuchsia-300">
              <p>Explore</p>
              <IconShimmer className=" animation-delay-500 animation-duration-750 block group-hover:animate-wiggle" />
            </div>
          </Link>
          <AuthStatus></AuthStatus>
        </div>
      </header>
    </>
  );
};

export default AppHeader;
