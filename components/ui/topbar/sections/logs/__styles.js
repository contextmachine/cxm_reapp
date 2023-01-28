import styled from "styled-components";

export const Message = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 0px;
  padding: 10px;
  max-width: 320px;
  border-bottom: 1px solid #bfbfbf;

  &&,
  && * {
    font-size: 12px;
  }

  ${({last}) => last ? `
    & {
        border-bottom: 0px;
    }
  ` : ``}
`;
