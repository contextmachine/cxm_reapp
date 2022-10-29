import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { Box } from "@react-three/drei";
import useStatusStore from "../../../../../store/status-store";

const paramsData = {
  segments: [
    {
      length: 40,
      angle: 0,
      radius: 0.71199999999999997,
    },
    {
      length: 18.489999999999998,
      angle: 45,
      radius: 2.4550000000000001,
    },
    {
      length: 18.489999999999998,
      angle: -45,
      radius: 2.4550000000000001,
    },
    {
      length: 18.489999999999998,
      angle: 20,
      radius: 2.4550000000000001,
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
      .catch(() => {
        console.log("error");
      });
  }, []);

  const { scene } = useThree();

  useEffect(() => {
    if (metalPlane) {
      let foundWrapper;

      scene.traverse((obj) => {
        const { userData = {} } = obj;
        const { properties = [] } = userData;

        const property = properties.find(({ id }) => id === "metal_planes");
        if (property) {
          const { value } = property;

          if (value === "original") foundWrapper = obj;
        }
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
      <group
        userData={{
          infographics: [
            {
              type: ["controls"],
              name: "Блок управления геометрией metal plane",
              button: {
                label: "Сохранить",
              },
              fetch: {
                body: paramsData,
                endpoint: "/api/modelling/metal-plane",
                response: ["replace", ["metal_planes", "eq", "original"]],
              },
            },
          ],
        }}
      >
        <group
          userData={{
            needsFetch: true,
            fetchOptions: {
              endpoint: "/api/modelling/metal-plane",
            },
            properties: [
              {
                id: "metal_planes",
                name: "принадлежность категории metal_planes",
                value: "original",
              },
            ],
          }}
        ></group>
      </group>
    </>
  );
};

export default ModellingScene;
