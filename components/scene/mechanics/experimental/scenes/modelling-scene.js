import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { Box, Plane, Line, Text } from "@react-three/drei";
import useStatusStore from "../../../../../store/status-store";
import functions from "./data/functions.json";

const paramsData = {
  depth: 16,
  offsets: 0.6,
  segments: [
    {
      length: 40,
      angle: 0,
      radius: 5,
    },
    {
      length: 20,
      angle: -60,
      radius: 2,
    },
    {
      length: 15,
      angle: 60,
      radius: 5,
    },
    {
      length: 15,
      angle: 0,
      radius: 5,
    },
  ],
};

const ModellingScene = () => {
  const [metalPlane, setMetalPlane] = useState();

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  useEffect(() => {
    fetch("/api/modelling/metal-plane", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(paramsData),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (res) setMetalPlane(res);
      })
      .catch(() => {});
  }, []);

  const { scene } = useThree();

  useEffect(() => {
    if (metalPlane) {
      let foundWrapper;

      scene.traverse((obj) => {
        const { userData = {} } = obj;
        const { properties = [] } = userData;

        const property = properties["metal_planes"];

        if (property === "original") foundWrapper = obj;
      });

      if (foundWrapper) {
        foundWrapper.remove(...foundWrapper.children);

        const loader = new THREE.ObjectLoader();
        loader.parse(metalPlane, (e) => {
          foundWrapper.add(e);

          setNeedsRender(true);
        });
      }
    }
  }, [metalPlane, scene]);

  return (
    <>
      <group>
        <group
          name="Form #1"
          userData={{
            gui: [
              {
                type: "controls",
                data: paramsData,
                post: {
                  endpoint: "/api/modelling/metal-plane",
                  mutation: {
                    scene: {
                      where: {
                        userData: {
                          properties: {
                            metal_planes: { _eq: "original" },
                          },
                        },
                      },
                    },
                  },
                },
                version: `1.0`,
              },
            ],
          }}
        >
          <group
            name="form"
            userData={{
              properties: {
                metal_planes: "original",
              },
            }}
          ></group>
        </group>

        <group position={[40, -6, 0]}>
          <Line
            points={[
              [-50, 20],
              [50, 20],
              [50, -20],
              [-50, -20],
              [-50, 20],
            ]}
            color="white"
            lineWidth={1}
            dashed={false}
          />

          <Text
            scale={[20, 20, 20]}
            position={[-54, 0, 0]}
            rotation={[0, 0, -0.5 * Math.PI]}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Example Form #1
          </Text>
        </group>
      </group>
    </>
  );
};

export default ModellingScene;
