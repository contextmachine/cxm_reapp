import styled from "styled-components";

export const Thumb = styled.div`
  width: 100%;
  height: 86px;
  border-radius: 10px;
  background-color: lightgrey;
  background-image: url("/thumbs/${({ index }) => (index ? index : `1`)}.png");
  background-size: cover;
  margin-top: 10px;
  opacity: 0.8;

  &&:hover {
    opacity: 1;
  }
`;
