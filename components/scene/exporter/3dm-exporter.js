import { useEffect, useState } from "react";

const Exporter3dm = ({ rhinoConnected }) => {
  const [module, setModule] = useState(null);
  const [model, setModel] = useState({
    curves: [],
    points: null,
    viewport: null,
  });

  useEffect(() => {
    if (rhinoConnected) {
      window.rhino3dm().then((res) => {
        let Module = res;
        setModule(res);

        const points = new Module.Point3dList();
        let viewport = new Module.ViewportInfo();
        viewport.screenPort = [0, 0, window.innerWidth, window.innerHeight];

        let ptA = [0, 0, 0];
        const ptB = [10, 0, 0];
        const ptC = [10, 10, 0];
        const ptD = [0, 10, 0];
        const ptE = [20, 20, 20];
        const ptF = [30, 0, 0];
        const ptG = [35, 5, 0];
        const ptH = [40, -5, 0];
        const ptI = [45, 5, 0];
        const ptJ = [50, 0, 0];

        const polyline = new Module.Polyline(4);
        polyline.add(ptA[0], ptA[1], ptA[2]);
        polyline.add(ptB[0], ptB[1], ptB[2]);
        polyline.add(ptC[0], ptC[1], ptC[2]);
        polyline.add(ptD[0], ptD[1], ptD[2]);

        let curves = [];
        curves.push(polyline);

        setModel({
          curves,
          //points,
          viewport,
        });
      });
    }
  }, [rhinoConnected]);

  const handleDownloading = () => {
    let doc = new module.File3dm();

    /* adding curves */
    /*for (let i = 0; i < model.curves.length; i++) {
      doc.objects().add(model.curves[i], null);
    }*/

    const ptB = [10, 0, 0];
    const ptC = [10, 10, 0];
    const ptD = [0, 10, 0];
    const ptE = [20, 20, 20];
    const ptF = [30, 0, 0];
    const ptG = [35, 5, 0];
    const ptH = [40, -5, 0];
    const ptI = [45, 5, 0];
    const ptJ = [50, 0, 0];

    const curvePoints = new module.Point3dList();
    curvePoints.add(ptF[0], ptF[1], ptF[2]);
    curvePoints.add(ptG[0], ptG[1], ptG[2]);
    curvePoints.add(ptH[0], ptH[1], ptH[2]);
    curvePoints.add(ptI[0], ptI[1], ptI[2]);
    curvePoints.add(ptJ[0], ptJ[1], ptJ[2]);

    const nurbsCurve = module.NurbsCurve.create(false, 3, curvePoints);

    let cPts = [];
    let domain = nurbsCurve.domain;
    let pointCount = 20;
    let divisions = pointCount - 1.0;

    /* Polyline */
    const polyline = new module.Polyline();
    polyline.add(ptF[0], ptF[1], ptF[2]);
    polyline.add(ptG[0], ptG[1], ptG[2]);
    polyline.add(ptH[0], ptH[1], ptH[2]);
    polyline.add(ptI[0], ptI[1], ptI[2]);
    polyline.add(ptJ[0], ptJ[1], ptJ[2]);

    doc.objects().add(polyline.toNurbsCurve(), null);

    doc.objects().add(nurbsCurve, null);

    let options = new module.File3dmWriteOptions();
    options.version = 7;

    let buffer = doc.toByteArray(options);
    saveByteArray("online-scene.3dm", buffer);
    doc.delete();
  };

  const saveByteArray = (filename, byte) => {
    let blob = new Blob([byte], { type: "application/octect-stream" });

    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return <button onClick={handleDownloading}>Export 3dm</button>;
};

export default Exporter3dm;
