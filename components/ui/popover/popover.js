import useStatusStore from "../../../store/status-store";
import styled, { createGlobalStyle } from "styled-components";
import { Popover as AntPopover } from "antd";
import FocusIcon from "../../../pages/scene/topbar/blocks/icons/focus";

import * as THREE from "three";

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
  const controlsData = useStatusStore(({ controlsData }) => controlsData);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const handleZoomingToBox = (
    objBox,
    camera,
    controls,
    fitOffset = 1.2 * 20
  ) => {
    if (objBox && camera && controls) {
      console.log("camera", camera.type);
      const box = objBox;

      if (camera.type === "PerspectiveCamera") {
        const size = box.size;
        const center = box.center;

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance =
          maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance =
          fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

        const direction = controls.target
          .clone()
          .sub(camera.position)
          .normalize()
          .multiplyScalar(distance);

        controls.maxDistance = distance * 10;
        controls.target.copy(center);

        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();

        camera.position.copy(controls.target).sub(direction);
        controls.update();
      } else if (camera.type === "OrthographicCamera") {
        const size = box.size;
        const center = box.center;

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance =
          maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance =
          fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

        const direction = controls.target
          .clone()
          .sub(camera.position)
          .normalize()
          .multiplyScalar(distance);

        controls.maxDistance = distance * 10;
        controls.target.copy(center);

        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();

        camera.position.copy(controls.target).sub(direction);
        controls.update();

        /* const size = box.size;
        const center = box.center;

        const maxSize = Math.max(size.x, size.y, size.z);

        let newPositionCamera = new THREE.Vector3(maxSize, maxSize, maxSize);
        camera.zoom = 1;
        camera.left = -(2 * maxSize);
        camera.bottom = -(2 * maxSize);
        camera.top = 2 * maxSize;
        camera.right = 2 * maxSize;
        camera.near = -maxSize * 4;
        camera.far = maxSize * 4;
        // camera;
        camera.position.set(
          newPositionCamera.x,
          newPositionCamera.y,
          newPositionCamera.z
        );
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

        controls.target.copy(center);
        controls.update(); */

        /* */
        const width = objBox.canvasSize.width;
        const height = objBox.canvasSize.height;

        camera.zoom =
          Math.min(
            width / (objBox.max.x - objBox.min.x) / 1.5,
            height / (objBox.max.y - objBox.min.y) / 1.5
          ) / 1.5;
        camera?.updateProjectionMatrix();
      }
    }
  };

  if (!(bb && bb.e)) return <></>;

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
                handleZoomingToBox(bb, cameraData, controlsData);

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
