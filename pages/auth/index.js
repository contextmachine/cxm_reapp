import React, { useEffect, useState } from "react";
import Script from "next/script";
import styled from "styled-components";
import Router from "next/router";
import { Skeleton, Spin, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const HeadTitle = styled.div`
  font-size: 30px;

  && span {
    font-weight: 900;
  }
`;

const Wrapper = styled.div`
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
  const [photo_url, setPhoto_url] = useState(null);

  const [loadingMeta, setLoadingMeta] = useState(true);

  const useFishMeta = false;

  useEffect(() => {
    if (tgLoaded) {
      const webapp = window.Telegram.WebApp;

      const initDataUnsafe = webapp.initDataUnsafe;

      const { user = {} } = initDataUnsafe;
      const { id, first_name, last_name } = user;

      webapp.expand();

      if (!useFishMeta) {
        setUser_id(id);
        setFirst_name(first_name);
        setLast_name(last_name);
      } else {
        setUser_id("310889849");
        setFirst_name("Ilya");
        setLast_name("Kuzmin");
      }
    }
  }, [tgLoaded, useFishMeta]);

  useEffect(() => {
    if (tgLoaded) {
      /* визуальная подгрузка имени */
      const loadMeta = setTimeout(() => {
        setLoadingMeta(false);
      }, 500);

      /* редирект на страницу аккаунта */
      const accountRedirect = setTimeout(() => {
        Router.push("/account");
      }, 2000);

      return () => {
        clearTimeout(loadMeta);
        clearTimeout(accountRedirect);
      };
    }
  }, [tgLoaded, user_id]);

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
          <HeadTitle>
            Вы авторизированы как{" "}
            {loadingMeta ? (
              <Skeleton.Input
                active
                style={{ height: "40px", width: "200px", borderRadius: "20px" }}
              />
            ) : (
              <span>
                {first_name} {last_name}
              </span>
            )}
          </HeadTitle>
        </div>
      </Wrapper>
    </>
  );
};

export default LogAuth;
