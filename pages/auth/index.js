import React, { useEffect, useState } from "react";
import Script from "next/script";
import styled from "styled-components";
import Router from "next/router";
import { Skeleton, Spin, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import moment from "moment";

export const HeadTitle = styled.div`
  font-size: 30px;

  && span {
    font-weight: 900;
  }
`;

export const Wrapper = styled.div`
  padding: 15px;
  padding-top: 80px;
`;

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 64,
      color: "black",
    }}
    spin
  />
);

const LoadWrapper = styled(Row)`
  position: absolute;
  width: 100%;
  top: 50%;
  transition: all 0.8s ease-in-out;

  &&[data-status="hidden"] {
    opacity: 0;
  }

  &&[data-status="default"] {
    opacity: 1;
  }
`;

const LogAuth = () => {
  const [tgLoaded, setTgLoaded] = useState(false);

  const [user_id, setUser_id] = useState(null);
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState(null);

  const [loadingMeta, setLoadingMeta] = useState(true);

  const [isDone, setDone] = useState(null);
  const [isError, setError] = useState(null);

  /* шаг 1. Подключением к telegram API и сохранение учетной */
  useEffect(() => {
    if (tgLoaded) {
      const webapp = window.Telegram.WebApp;

      /* Шаг 1.1: Берем данные о юзере из тг */
      const initDataUnsafe = webapp.initDataUnsafe;

      const { user = {} } = initDataUnsafe;
      const { id = "111", first_name = "Василий", last_name = "Куприн" } = user;

      setUser_id(id);
      setFirst_name(first_name);
      setLast_name(last_name);

      /* Шаг 1.2: Разворачиваем окно */
      webapp.expand();

      /* Шаг 1.3: отправляем данные для сохранения учетной в куки */

      const body = JSON.stringify({
        id: id,
        first_name: first_name,
        last_name: last_name,
      });

      fetch("/api/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body,
      })
        .then((res) => {
          const body = res.json().then((a) => console.log("a", a));

          if (id) {
            setDone(true);
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [tgLoaded]);

  /* Шаг 2: визуальная подгрузка имени */
  useEffect(() => {
    if (tgLoaded) {
      const loadMeta = setTimeout(() => {
        setLoadingMeta(false);
      }, 500);

      return () => {
        clearTimeout(loadMeta);
      };
    }
  }, [tgLoaded, user_id]);

  /* Шаг 3: Редирект на страницу аккаунта */
  useEffect(() => {
    if (isDone && tgLoaded) {
      const accountRedirect = setTimeout(() => {
        Router.push("/account");
      }, 1500);

      return () => {
        clearTimeout(accountRedirect);
      };
    }
  }, [tgLoaded, isDone]);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => setTgLoaded(true)}
      ></Script>

      <LoadWrapper
        data-status={loadingMeta ? "hidden" : "default"}
        justify="center"
      >
        <Spin indicator={antIcon} />
      </LoadWrapper>

      <Wrapper>
        <div>
          {!isError && (
            <HeadTitle>
              Вы авторизированы как{" "}
              {loadingMeta ? (
                <Skeleton.Input
                  active
                  style={{
                    height: "40px",
                    width: "200px",
                    borderRadius: "20px",
                  }}
                />
              ) : (
                <span>
                  {first_name} {last_name}
                </span>
              )}
            </HeadTitle>
          )}

          {isError && (
            <HeadTitle>
              Произошел сбой при авторизации. Пожалуйста, попробуйте позже
            </HeadTitle>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default LogAuth;
