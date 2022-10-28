import { useEffect, useRef, useState } from "react";
import {
  OrthographicCamera,
  OrbitControls,
  TrackballControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { Vector3 } from "three";
import useStatusStore from "../../store/status-store";
import { v4 as uuidv4 } from "uuid";

/* Настраиваем камеру */
const Camera = (props = {}) => {
  const { viewType } = props;

  /* Шаг 1: refs и useThree */

  const perspectiveCam = useRef();
  const orthoCam = useRef();
  const controls = useRef();

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const controlsInProccess = useStatusStore(
    ({ controlsInProccess }) => controlsInProccess
  );
  const setControlsInProcess = useStatusStore(
    ({ setControlsInProcess }) => setControlsInProcess
  );

  const { get, set } = useThree(({ get, set }) => ({ get, set }));

  useEffect(() => {
    const changeView = () => {
      setTarget0([0, 0, 0]);

      if (viewType === "perspective") {
        set({ camera: perspectiveCam.current });

        setZoom(20);
        setPosition([-500, 900, 800]);
      } else {
        set({ camera: orthoCam.current });

        if (viewType === "top") {
          setZoom(6);
          setPosition([0, 0, 1900]);
        } else {
          setZoom(6);
          setPosition([-500, 900, 800]);
        }
      }
    };

    changeView();
    setNeedsRender(true);
  }, [get, set, viewType]);

  /* useEffect(() => {

    const activeRender = () => {
      setNeedsRender(true);
    };

    const activeNorender = () => {
      setNeedsRender(false);
    };

    controls.current.addEventListener("start", activeRender);
    controls.current.addEventListener("end", activeNorender);
    return () => {
      controls.current.removeEventListener("start", activeRender);
      controls.current.removeEventListener("end", activeNorender);
    };
  }, [controls]); */

  const [zoom, setZoom] = useState(0);
  const [position, setPosition] = useState([0, 0, 50]);
  const [target0, setTarget0] = useState([0, 0, 0]);

  const [changeLogId, setChangeLogId] = useState(uuidv4());

  useEffect(() => {
    if (controlsInProccess) {
      const timer = setTimeout(() => {
        setControlsInProcess(false);
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [changeLogId, controlsInProccess]);

  return (
    <>
      <PerspectiveCamera
        name="perspective"
        ref={perspectiveCam}
        fov={100}
        up={new Vector3(0, 0, 1)}
        {...{ zoom, position, rotation: [0, 0, 0] }}
      />

      <OrthographicCamera
        name="ortho"
        ref={orthoCam}
        up={new Vector3(0, 0, 1)}
        {...{ zoom, position, rotation: [0, 0, 0] }}
      />

      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.7}
        enableRotate={viewType === "top" ? false : true}
        enableZoom
        enablePan
        rev
        ref={controls}
        panSpeed={viewType === "perspective" ? 0.06 : 2}
        rotateSpeed={2}
        target={target0}
        /* onEnd={() => setControlsInProcess(false)} */
        onStart={(e) => {
          setNeedsRender(true);
          setControlsInProcess(true);
        }}
        onChange={(e) => {
          setChangeLogId(uuidv4());
        }}
        makeDefault
        up={new Vector3(0, 0, 1)}
      />
    </>
  );
};

export default Camera;
