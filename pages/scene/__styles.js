import styled from "styled-components";

const CoreLayout = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

const Screen = styled.div`
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background: white;

  position: relative;
`;

const Space3D = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  /* background: #f2f2f2; */

  background: #474141;
`;

export { CoreLayout, Screen, Space3D };
