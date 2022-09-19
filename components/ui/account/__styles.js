import { Typography } from "antd";
import styled from "styled-components";
const { Text } = Typography;

const Wrapper = styled.div`
  padding: 30px 15px;
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  && > * + * {
    margin-top: 24px;
  }
`;

const HeadTitle = styled(Text)`
  font-size: 18px;
  font-weight: 500;
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
    max-width: 350px;

    margin-right: 16px;
    margin-bottom: 16px;
  }

  @media (min-width: 1920px) {
    max-width: 450px;
  }

  width: 100%;
  max-height: 200px;
  min-height: 200px;
  height: 200px;
  background: white;

  cursor: pointer;

  overflow: hidden;
  box-shadow: 0 4px 20px -5px rgb(0 0 0 / 30%);
  border-radius: 5px;
  position: relative;

  &&:hover {
    box-shadow: 0 4px 20px -5px rgb(0 0 0 / 70%);

    & *[data-type="headTitle"] {
      text-decoration: underline;
    }
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
  font-size: 18px;
  font-weight: 500;
`;

const Photo = styled.div`
  width: 30px;
  height: 30px;
  background: #ff9351;
  border-radius: 10px;

  transform: rotate(45deg);
`;

export { Wrapper, HeadTitle, ProjectList, Project, Photo };
