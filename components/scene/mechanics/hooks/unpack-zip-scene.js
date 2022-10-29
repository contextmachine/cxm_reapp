import pako from "pako";
import * as THREE from "three";

const unpackZipScene = async ({
  path,
  setDataGeometry = () => {},
  SetFetched = () => {},
  onFailing = () => {},
}) => {
  const url = `${path}?f=gzip`;

  /* Шаг 1: fetch ссылки и превращение в unit8Array */
  let ss = await fetch(url);
  const sdata = await ss.arrayBuffer();
  const byteArray = new Uint8Array(sdata);

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
};

export default unpackZipScene;
