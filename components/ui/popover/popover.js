import useStatusStore from "../../../store/status-store";
import styled, { createGlobalStyle } from "styled-components";
import { Popover as AntPopover } from "antd";
import FocusIcon from "../../../pages/scene/topbar/blocks/icons/focus";

const Focus = styled.div`
  width: 25px;
  height: 25px;
  //border: 1px solid blue;

  position: fixed;
  left: ${({ x }) => (x ? `${x}px` : "50%")};
  top: ${({ y }) => (y ? `${y}px` : "50%")};

  transform: translate(-50%, -50%);

  z-index: 100;
`;

export const Panel = styled.div`
  background: white;
  border-radius: 8px;
  padding: 6px 12px;

  position: absolute;
  left: 50%;
  top: 0px;

  transform: translate(-50%, -120%);
  box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px,
    rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px;
`;

export const GlobalStyles = createGlobalStyle`
    &&&&& {
        & .ant-popover-arrow {
            display: none
        }
    }
`;

export const Btn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;

  &&:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  && > * + * {
    margin-left: 8px;
  }

  && > *:nth-child(1) {
    height: 19px;
  }
`;

const Popover = () => {
  const bb = useStatusStore(({ boundingBox }) => boundingBox);

  const cameraData = useStatusStore(({ cameraData }) => cameraData);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const handleZoomingToBox = (objBox, camera) => {
    if (objBox) {
      camera.zoom =
        Math.min(
          objBox.canvasSize.width / (objBox.max.x - objBox.min.x) / 1.5,
          objBox.canvasSize.height / (objBox.max.y - objBox.min.y) / 1.5
        ) / 1.5;
      camera?.updateProjectionMatrix();
    }
  };

  if (!bb) return <></>;

  return (
    <>
      <GlobalStyles />

      <Focus x={bb.e.x} y={bb.e.y}>
        <Panel>
          <Btn
            onClick={() => {
              if (bb && cameraData) {
                /* let offset = 300;
                offset = offset || 1.5;

                const { center, size } = bb;
                const camera = cameraData;

                const startDistance = center.distanceTo(camera.position);
                // here we must check if the screen is horizontal or vertical, because camera.fov is
                // based on the vertical direction.
                const endDistance =
                  camera.aspect > 1
                    ? (size.y / 2 + offset) / Math.abs(Math.tan(camera.fov / 2))
                    : (size.y / 2 + offset) /
                      Math.abs(Math.tan(camera.fov / 2)) /
                      camera.aspect;

                camera.position.set(
                  (camera.position.x * endDistance) / startDistance,
                  (camera.position.y * endDistance) / startDistance,
                  (camera.position.z * endDistance) / startDistance
                );
                camera.lookAt(center); */
                handleZoomingToBox(bb, cameraData);

                setNeedsRender(true);
              }
            }}
          >
            <FocusIcon />
            <div>Приблизить</div>
          </Btn>
        </Panel>
      </Focus>
    </>
  );
};

export default Popover;
