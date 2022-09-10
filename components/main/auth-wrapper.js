import React from "react";
import AuthTg from "./auth-tg";
import { useRouter } from "next/router";
import LocalScripts from "../ui/main/hooks/local-scripts";

const AuthWrapper = (props = {}) => {
  const { user, userFetched, children } = props;

  const router = useRouter();
  const { query } = router;
  const { needsLogin } = query;

  if (needsLogin) {
    const { id, first_name, last_name } = query;

    const body = JSON.stringify({
      id,
      first_name,
      last_name,
    });

    fetch("/api/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    })
      .then((res) => {
        const { pathname } = router;

        router.replace({ pathname }).then(() => router.reload());
        return;
      })
      .catch(() => {
        console.log("error");
      });
  }

  if (!userFetched)
    return (
      <>
        <LocalScripts />
      </>
    );
  if (!user)
    return (
      <>
        <LocalScripts />
        <AuthTg />
      </>
    );

  return <>{children}</>;
};

export default AuthWrapper;
