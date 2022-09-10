import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Router from "next/router";
import { Skeleton, Space, Row, Col, Typography } from "antd";

import axios from "axios";
import useAuthProvider from "../../components/main/use-auth-provider";
import AuthWrapper from "../../components/main/auth-wrapper";
import LocalScripts from "../../components/ui/main/hooks/local-scripts";

const { Text } = Typography;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  padding: 30px 15px;
  width: 100%;

  display: flex;
  flex-direction: column;

  && > * + * {
    margin-top: 24px;
  }
`;

const HeadTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
`;

const ProjectList = styled.div`
  @media (max-width: 480px) {
    display: grid;

    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
  }

  @media (min-width: 480px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

const Project = styled.div`
  @media (min-width: 480px) {
    max-width: 250px;

    margin-right: 16px;
    margin-bottom: 16px;
  }

  width: 100%;
  max-height: 200px;
  min-height: 200px;
  height: 200px;

  cursor: pointer;

  overflow: hidden;
  box-shadow: 0 4px 20px -5px rgb(0 0 0 / 30%);
  border-radius: 10px;
  position: relative;

  &&:hover {
    box-shadow: 0 4px 20px -5px rgb(0 0 0 / 70%);
  }

  ${({ skeleton }) =>
    skeleton === true
      ? `
    & {
        height: 180px !important;
        padding-bottom: 0;
        box-shadow: 0 4px 20px -5px rgb(0 0 0 / 10%);
    }
  `
      : ``}
`;

Project.Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  position: absolute;
`;

Project.Preview = styled.div`
  width: 100%;
  height: 100%;
  background-image: linear-gradient(155deg, #1a56f554, #ec6baca6);
`;

Project.Header = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
`;

Project.Title = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const UserDrop = styled.div`
  display: flex;
  align-items: center;

  && > * + * {
    margin-left: 10px;
  }
`;

const Photo = styled.div`
  width: 30px;
  height: 30px;
  background: #ff9351;
  border-radius: 10px;
`;

const Account = (props = {}) => {
  const { user } = props;
  const { first_name = "", last_name = "" } = user ? user : {};

  const [loadingProjects, setLoadingProjects] = useState(true);

  const handleProjectRedirect = ({ name }) => {
    Router.push(`/scene/${name}`);
  };

  /* Взаимодействие с telegram API */
  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      webapp.expand();
      if (mainbutton) {
        mainbutton.enable();
        mainbutton.show();
        mainbutton.setText("Открыть в новом окне");

        mainbutton.onClick(() => {
          window.open("https://cxm-reapp.vercel.app/account/", "_blank");
        });
      }
    }
  }, []);

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
    const url = "https://mmodel.contextmachine.online:8181/scenes";

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
      <LocalScripts />

      <AuthWrapper user={user}>
        <Row>
          <Col flex="300px">
            <Wrapper>
              <Space>
                <Photo />
                <HeadTitle ellipsis={{ rows: 1 }} style={{ maxWidth: "200px" }}>
                  {`${first_name} ${last_name}`}
                </HeadTitle>
              </Space>
            </Wrapper>
          </Col>

          <Col flex="auto">
            <Wrapper>
              <Row justify="space-between">
                <HeadTitle>Проекты</HeadTitle>
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

const getServerSideProps = useAuthProvider;
