import React, { Suspense, useEffect, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

import dynamic from "next/dynamic";

//import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js";

const Buffer3dm = () => {
  /*const url = "http://localhost:3000/models/ff.3dm";
  const url1 =
    "https://mmodel.contextmachine.online:8181/rh/get_part/Arc_main_panels";

  const model = useLoader(Rhino3dmLoader, url, (loader) => {
    console.log("loader", loader);
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");
  });
  useEffect(() => {
    console.log("model", model);
  }, [model]);
  const { scene } = useThree();*/

  useEffect(() => {
    const rhino3dm = window.rhino3dm;

    const loader = new Rhino3dmLoader();
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");

    rhino3dm().then(async (m) => {
      console.log("Loaded rhino3dm.");
      const rhino = m; // global

      console.log("rhino", rhino);

      const rhinoObject = new rhino.GeometryBase();

      console.log("rhinoObject", rhinoObject);

      // create Rhino Document and add a point to it
      /*
      const doc = new rhino.File3dm();
      const ptA = [0, 0, 0];
      const point = new rhino.Point(ptA);
      doc.objects().add(point, null);

      console.log("doc", doc.encode());
      console.log("doc.toByteArray()", doc.toByteArray());
      console.log(
        "new Uint8Array(doc.toByteArray())",
        new Uint8Array(doc.toByteArray())
      );

      // create a copy of the doc.toByteArray data to get an ArrayBuffer
      const buffer = new Uint8Array(doc.toByteArray()).buffer;

      console.log("buffer", buffer);

      loader.parse(buffer, function (object) {
        scene.add(object);
      });*/
    });
  }, []);

  /*useEffect(() => {
    const loader = new Rhino3dmLoader();

    const path =
      "https://mmodel.contextmachine.online:8181/rh/get_part/Arc_main_panels";

    fetch(path)
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        const { rhino = {} } = responseJSON[0];
        const { data } = rhino;

        const stroke = window.atob(data);

        const rhino3dm = window.rhino3dm;

        rhino3dm().then(async (m) => {
          const rhino = m;

          const doc = new rhino.File3dm();

          console.log("doc", doc.Read);
          console.log(stroke);
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);*/

  return <></>;
};

export default Buffer3dm;
