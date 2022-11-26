import { useFetch } from "@hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const Entity: React.FC<{ userID: string; entityName: string }> = (props) => {
  return (
    <Link
      href={`/user/${props.userID}/entity/${props.entityName}`}
      className="rounded-lg border border-fuchsia-600/20  bg-gradient-to-br from-slate-800 to-slate-800 p-4 text-xl text-fuchsia-100 shadow-md transition duration-200 hover:to-fuchsia-900/50"
    >
      {props.entityName}
    </Link>
  );
};

const UserEntities: React.FC<{ userID: string }> = (props) => {
  const entities = useQuery({
    queryKey: [`userEntities-${props.userID}`],
    queryFn: () => useFetch().get(`/api/user/${props.userID}`),
  });
  if (entities.isLoading || entities.isError || !entities.data) {
    return null;
  }
  return (
    <>
      {entities.data?.entities?.length === 0 && (
        <p className="text-slate-400">No entities found...</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {entities.data?.entities?.map((a: any, i: number) => (
          <Entity key={i} entityName={a.name} userID={props.userID}></Entity>
        ))}
      </div>
    </>
  );
};

export default UserEntities;
