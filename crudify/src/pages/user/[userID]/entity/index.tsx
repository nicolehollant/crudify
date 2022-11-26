import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectUserEntitiesPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);
  return null;
};

export default RedirectUserEntitiesPage;
