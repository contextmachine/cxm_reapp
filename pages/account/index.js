import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Router from "next/router";
import { Skeleton } from "antd";

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
  display: flex;
  flex-direction: column;

  && > * + * {
    margin-top: 16px;
  }
`;

const Project = styled.div`
  width: 100%;
  padding-bottom: 60%;
  overflow: hidden;
  box-shadow: 0 4px 20px -5px rgb(0 0 0 / 40%);
  border-radius: 10px;
  position: relative;

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
  const handleProjectRedirect = () => {
    Router.push("/telegram");
  };

  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const loadProjects = setTimeout(() => {
      setLoadingProjects(false);
    }, 900);

    return () => {
      clearTimeout(loadProjects);
    };
  }, []);

  return (
    <>
      <Wrapper>
        <HeadTitle>Проекты</HeadTitle>

        <ProjectList>
          {loadingProjects ? (
            <>
              {Array(4)
                .fill(1)
                .map((_, i) => (
                  <Project skeleton key={`project:${i}`}>
                    <Project.Wrapper>
                      <Skeleton.Input
                        style={{ width: "100%", height: "180px" }}
                        active
                      />
                    </Project.Wrapper>
                  </Project>
                ))}
            </>
          ) : (
            <Project onClick={() => handleProjectRedirect()}>
              <Project.Wrapper>
                <Project.Preview></Project.Preview>
                <Project.Header>
                  <Project.Title>Сцена #1</Project.Title>
                </Project.Header>
              </Project.Wrapper>
            </Project>
          )}
        </ProjectList>
      </Wrapper>
    </>
  );
};

export default Account;
