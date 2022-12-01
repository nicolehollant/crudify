import { httpRequest } from "@hooks/httpRequest";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const UserPool: React.FC<{ userID: string; poolName: string }> = (props) => {
  return (
    <Link
      href={`/user/${props.userID}/pool/${props.poolName}`}
      className="rounded-lg border border-fuchsia-600/20  bg-gradient-to-br from-slate-800 to-slate-800 p-4 text-xl text-fuchsia-100 shadow-md transition duration-200 hover:to-fuchsia-900/50"
    >
      {props.poolName}
    </Link>
  );
};

const UserPools: React.FC<{ userID: string }> = (props) => {
  const userPools = useQuery({
    queryKey: [`userPools-${props.userID}`],
    queryFn: () => httpRequest().get(`/api/user/${props.userID}/userPool`),
  });
  if (userPools.isLoading || userPools.isError || !userPools.data) {
    return null;
  }
  return (
    <>
      {userPools.data?.userPools?.length === 0 && (
        <p className="text-slate-400">No User Pools found...</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {userPools.data?.userPools?.map((a: any, i: number) => (
          <UserPool key={i} poolName={a.name} userID={props.userID}></UserPool>
        ))}
      </div>
    </>
  );
};

export default UserPools;
