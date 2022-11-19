import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { Box } from "@react-three/drei";
import useStatusStore from "../../../../../store/status-store";
import functions from "./data/functions.json";

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
    const res = new Function("n1", "n2", functions.something);

    // const result = eval(functions.something);

    console.log("res", res(5, 3.5));
  }, [functions]);

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
          gui: [
            {
              type: "controls",
              data: {
                name: "main Settings",
                children: [
                  {
                    name: "first",
                    value: {
                      min: 5,
                      max: 10,
                      value: 7,
                    },
                  },
                  {
                    name: "select",
                    value: {
                      options: ["first option", "second option"],
                    },
                  },
                  {
                    name: "interval",
                    value: {
                      min: 0,
                      max: 10,
                      value: [2, 6],
                    },
                  },
                  {
                    name: "color",
                    value: {
                      r: 255,
                      g: 255,
                      b: 0,
                      a: 0,
                    },
                  },
                  {
                    name: "number",
                    value: 0,
                  },
                  {
                    name: "folder 2",
                    children: [
                      {
                        name: "boolean",
                        value: false,
                      },
                      {
                        name: "textarea",
                        value: {
                          value:
                            "Some longread heresdfkjsdfdsfsdlfjdslkjfsldjfsdf",
                        },
                      },
                      {
                        name: "folder 3",
                        children: [
                          {
                            name: "save",
                            value: {
                              type: "button",
                              value: `(scene, data) => {console.log(scene,data)}`,
                            },
                          },
                          {
                            name: "folder 4",
                            children: [
                              {
                                name: "some",
                                value: "some",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              version: `1.0`,
            },
          ],
        }}
      >
        <group
          userData={{
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
