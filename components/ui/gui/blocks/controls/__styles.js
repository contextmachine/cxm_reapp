import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  &&&&&&&&&&&&&& {
    & .margin {
      width: 40px !important;

      & .margin-view-overlays {
        width: 40px !important;

        & .line-numbers {
          width: 22px !important;
        }
      }
    }

    & .editor-scrollable {
      width: calc(100% - 40px) !important;
      left: 40px !important;
    }
  }
`;
