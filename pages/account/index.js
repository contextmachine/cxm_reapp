import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Skeleton, Space, Row, Col, Grid } from "antd";

import axios from "axios";
import AuthWrapper from "../../components/main/auth-wrapper";
import LocalScripts from "../../components/ui/main/hooks/local-scripts";

import {
  Wrapper,
  HeadTitle,
  ProjectList,
  Project,
  Photo,
} from "../../components/ui/account/__styles";
import useSWR from "swr";
import { globalUrl } from "../../store/server";

const { useBreakpoint } = Grid;

const Account = () => {
  /*const user = useSWR("/api/auth/user", async (input, init) => {
    const response = await fetch(input, init);

    const data = await response.json();

    console.log("sdfsdf", data);

    if (data.user) {
      console.log("sd333");
      return data;
    }
  });*/
  const [tgLoaded, setTgLoaded] = useState(false);

  const [userFetched, setUserFetched] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          }

          setUserFetched(true);
        });
    }
  }, [user]);

  const { first_name = "", last_name = "" } = user ? user : {};

  const { md } = useBreakpoint();

  const [loadingProjects, setLoadingProjects] = useState(true);

  const handleProjectRedirect = ({ name }) => {
    Router.push(`/scene/${name}`);
  };

  /* Взаимодействие с telegram API */
  useEffect(() => {
    const webapp = window.Telegram.WebApp;
    const mainbutton = webapp.MainButton;

    console.log("mainbutton", mainbutton);
    console.log("user", user);

    webapp.expand();
    if (mainbutton && user) {
      mainbutton.enable();
      mainbutton.show();
      mainbutton.setText("Открыть в новом окне");

      mainbutton.onClick(() => {
        window.open(
          `${APP_PRODUCTION}account/?needsLogin=true&id=${user.id}&first_name=${user.first_name}&last_name=${user.last_name}`,
          "_blank"
        );
      });
    }
  }, [tgLoaded, user]);

  /* Шаг 1: Загрузка */
  useEffect(() => {
    const loadProjects = setTimeout(() => {
      setLoadingProjects(false);
    }, 900);

    return () => {
      clearTimeout(loadProjects);
    };
  }, []);

  /* Axios */
  let config = {
    onUploadProgress: function (progressEvent) {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );

      console.log("percentCompleted", percentCompleted);
    },
  };

  const [scenes, setScenes] = useState(null);

  const getScenes = () => {
    const url = `${globalUrl}scenes`;

    return axios.get(url, { ...config }).then((response) => {
      const { data } = response;

      setScenes(data);
    });
  };

  useEffect(() => {
    getScenes();
  }, []);

  return (
    <>
      <AuthWrapper user={user} userFetched={userFetched}>
        <Row>
          <LocalScripts {...{ setTgLoaded }} />

          {md && (
            <Col flex="300px">
              <Wrapper>
                <Space>
                  <Photo />
                  <HeadTitle
                    ellipsis={{ rows: 1 }}
                    style={{ maxWidth: "200px" }}
                  >
                    {`${first_name} ${last_name}`}
                  </HeadTitle>
                </Space>
              </Wrapper>
            </Col>
          )}

          <Col flex="auto">
            <Wrapper>
              <Row justify="space-between">
                <HeadTitle>Проекты</HeadTitle>

                {`tgLoaded: ${tgLoaded}`}
                {`user: ${user && JSON.stringify(user)}`}
              </Row>

              <ProjectList>
                {scenes && !loadingProjects ? (
                  ["all", ...scenes].map((name, i) => {
                    return (
                      <Project
                        key={`project:${i}`}
                        onClick={() => handleProjectRedirect({ name })}
                      >
                        <Project.Wrapper>
                          <Project.Preview></Project.Preview>
                          <Project.Header>
                            <Project.Title>
                              {name === "all" ? <>Вся сцена *</> : <>{name}</>}
                            </Project.Title>
                          </Project.Header>
                        </Project.Wrapper>
                      </Project>
                    );
                  })
                ) : (
                  <>
                    {Array(4)
                      .fill(1)
                      .map((_, i) => (
                        <Project skeleton key={`project:${i}`}>
                          <Project.Wrapper>
                            <Skeleton.Input
                              style={{
                                width: "100%",
                                height: "200px",
                                borderRadius: "10px",
                              }}
                              active
                            />
                          </Project.Wrapper>
                        </Project>
                      ))}
                  </>
                )}
              </ProjectList>
            </Wrapper>
          </Col>
        </Row>
      </AuthWrapper>
    </>
  );
};

export default Account;

//export const getServerSideProps = useAuthProvider;
