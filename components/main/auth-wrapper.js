import React from "react";
import AuthTg from "./auth-tg";

const AuthWrapper = (props = {}) => {
  const { user, children } = props;

  console.log("user", user);

  if (!user) return <AuthTg />;

  return <>{children}</>;
};

export default AuthWrapper;
