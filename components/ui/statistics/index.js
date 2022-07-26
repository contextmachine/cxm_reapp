import React from "react";
import styled from "styled-components";
import handleColor from "../../models/utils/handle-color";

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  align-items: flex-end;

  bottom: 40px;
  right: 40px;

  && > * + * {
    margin-left: 20px;
  }

  z-index: 99;

  pointer-events: none;
`;

const CardWrapper = styled.div`
  width: max-content;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.7);
`;

const Item = styled.div`
  padding: 2px 0;
  font-weight: 500;

  &,
  & * {
    font-size: 11px;
    color: white;
  }

  display: flex;

  &&::before {
    content: "";
    width: 13px;
    height: 14px;
    background: ${({ color }) => (color ? color : "red")};
    margin-right: 8px;
  }

  &&[data-gradient="visible"] {
    &&::before {
      filter: brightness(${({ index }) => (index ? index * 2 : 1)});
    }
  }
`;

const Name = styled.div`
  color: white;
  font-size: 13px;

  max-width: 150px;
  margin-bottom: 18px;
`;

const Statistics = ({ data = [] }) => {
  return (
    <Wrapper>
      {data.map((sectionMeta = {}, i) => {
        const { data: section = [], name, type: sectionType } = sectionMeta;

        return (
          <CardWrapper key={`wrapper${i}`}>
            {name && <Name>{name}</Name>}

            {section.map(({ type, count }, b) => {
              let color = "red";

              if (sectionType === "labels") {
                const [_, c] = handleColor(parseInt(type));

                color = c;
              }

              return (
                <Item
                  key={`st:${b}:${i}`}
                  color={color}
                  index={b}
                  data-gradient={
                    sectionType === "labels" ? "hidden" : "visible"
                  }
                >
                  {type}: {count}x
                </Item>
              );
            })}
          </CardWrapper>
        );
      })}
    </Wrapper>
  );
};

export default Statistics;
