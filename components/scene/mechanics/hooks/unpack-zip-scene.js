import pako from "pako";
import * as THREE from "three";
import useStatusStore from "../../../../store/status-store";

const unpackZipScene = async ({
  path,
  setDataGeometry = () => {},
  SetFetched = () => {},
  onFailing = () => {},
  setLoadingFilesDownload,
  setLoadingFilesUnarchive,
  setLoadingFilesDownloadTotal,
  loadingFilesDownload,
  loadingFilesUnarchive,
  loadingFilesDownloadTotal,
}) => {
  const url = `${path}?f=gzip`;

  setLoadingFilesDownload(0);
  setLoadingFilesUnarchive(0);
  setLoadingFilesDownloadTotal(0);
  /* Шаг 1: fetch ссылки и превращение в unit8Array */
  let sceneDownloadStart = performance.now();
  try {
    let ss = await fetch(url);
    const sdata = await ss.arrayBuffer();
    const byteArray = new Uint8Array(sdata);
    let sceneUnzipStart = performance.now();
    try {
      /* Шаг 2: Распаковать архив с помощью pako */
      let inflated = JSON.parse(pako.inflate(byteArray, { to: "string" }));

      if (typeof inflated === "object" && inflated?.geometries) {
        /* Шаг 2.1: тип сцены — цельная с дочерними вложениями */
        const loader = new THREE.ObjectLoader();
        loader.parse(
          inflated,
          function (obj) {
            setDataGeometry(obj);
            SetFetched(true);
          },

          function (err) {
            console.error("An error happened");
          }
        );
      } else {
        /* Шаг 2.2: тип сцены - массив с элементами, надо разбирать каждую */
        setDataGeometry(inflated);

        SetFetched(true);
      }
    } catch (error) {
      onFailing();
    }
    let sceneUnzipEnd = performance.now();
    setLoadingFilesUnarchive(
      loadingFilesUnarchive + (sceneUnzipEnd - sceneUnzipStart)
    );
  } catch (err) {
    onFailing();
  }
  let sceneDownloadEnd = performance.now();
  setLoadingFilesDownloadTotal(
    loadingFilesDownloadTotal + (sceneDownloadEnd - sceneDownloadStart)
  );
  setLoadingFilesDownload(
    loadingFilesDownload +
      (sceneDownloadEnd - sceneDownloadStart) -
      loadingFilesUnarchive
  );
};

export default unpackZipScene;
