import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Router from "next/router";
import { Skeleton } from "antd";

import axios from "axios";

const Wrapper = styled.div`
  padding: 30px 15px;

  display: flex;
  flex-direction: column;

  && > * + * {
    margin-top: 24px;
  }
`;

const HeadTitle = styled.div`
  font-size: 20px;
  font-weight: 900;
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
    max-width: 200px;

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

const Account = () => {
  const [loadingProjects, setLoadingProjects] = useState(true);

  const handleProjectRedirect = ({ name }) => {
    Router.push(`/scene/${name}`);
  };

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
      <Wrapper>
        <HeadTitle>Проекты</HeadTitle>

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
    </>
  );
};

export default Account;
