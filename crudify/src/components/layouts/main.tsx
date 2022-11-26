import AppHeader from "@components/app-header";
import AuthStatus from "@components/auth-status";

const MainLayout: React.FC<{
  children?: React.ReactNode;
  withAuthStatus?: boolean;
}> = (props) => {
  if (props.withAuthStatus ?? true) {
    return (
      <div className="grid h-full w-full grid-rows-[auto,1fr] overflow-hidden bg-gradient-to-br from-slate-900 to-fuchsia-700/20">
        <AppHeader></AppHeader>
        <div className="h-full overflow-auto">{props.children}</div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-br from-slate-900 to-fuchsia-700/20">
      {props.children}
    </div>
  );
};

export default MainLayout;
