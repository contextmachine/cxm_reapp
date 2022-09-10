import React, { useEffect, useState } from "react";
import { TLoginButton, TLoginButtonSize } from "react-telegram-auth";
import { useRouter } from "next/router";
import { Wrapper, HeadTitle } from "../../pages/auth";

const AuthTg = () => {
  const router = useRouter();

  const [isDone, setDone] = useState(null);
  const [isError, setError] = useState(null);

  const onAuthCallback = (user) => {
    const body = JSON.stringify({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    fetch("/api/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    })
      .then((res) => {
        console.log("res", res);

        const body = res.json().then((a) => console.log("a", a));
        console.log("body", body);

        setDone(true);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    if (isDone) {
      router.reload();
    }
  }, [isDone]);

  return (
    <Wrapper>
      <HeadTitle>Пожалуйста, авторизируйтесь через Telegram</HeadTitle>

      <TLoginButton
        botName="cxmAppBot"
        buttonSize={TLoginButtonSize.Large}
        lang="en"
        usePic={false}
        cornerRadius={20}
        onAuthCallback={onAuthCallback}
        requestAccess={"write"}
      />
    </Wrapper>
  );
};
export default AuthTg;
