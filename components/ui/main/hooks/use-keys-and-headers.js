import { useEffect } from "react";
import { globalUrl } from "../../../../store/server";
import { useRouter } from "next/router";
import axios from "axios";
import useStatusStore from "../../../../store/status-store";

const useKeysAndHeaders = ({
  pid,
  setIncludedKeys = () => {},
  setViewType = () => {},
  setHeaders = () => {},
}) => {
  const setLoadingMessage = useStatusStore(
    ({ setLoadingMessage }) => setLoadingMessage
  );

  /* Шаг 1: Берем PID из ссылки */

  const getIncludedKeys = (pid) => {
    if (pid === "all") return setIncludedKeys(null);

    const url = `${globalUrl}scenes/${pid}`;

    return axios.get(url).then((response) => {
      const { data } = response;
      const { includes = [], metadata = {}, chart = {} } = data;
      const { headers = [] } = chart;
      const { default_view } = metadata;

      /* Шаг 2. Устанавливаем headers */
      setHeaders(headers);

      /* Шаг 2.1: Настраиваем камеру */
      if (
        default_view === "top" ||
        (default_view === "perspective" && default_view === "ortho")
      ) {
        setViewType(default_view);
      }

      setIncludedKeys(includes);
    });
  };

  useEffect(() => {
    if (pid) {
      getIncludedKeys(pid);

      setLoadingMessage({ message: "Загружаем ключи с сервера", type: "full" });
    }
  }, [pid]);
};

export default useKeysAndHeaders;
