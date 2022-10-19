import React, { useMemo, useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import ExperimentalList from "./experimental/experimental-list";

const BufferExperimental = ({ pid }) => {
  const setLoadingMessage = useStatusStore(
    ({ setLoadingMessage }) => setLoadingMessage
  );

  let experimentalModule = useMemo(() => {
    const foundModule = ExperimentalList.find(({ id }) => id === pid);
    if (foundModule) {
      const { module } = foundModule;

      return module;
    }
  }, [pid]);

  useEffect(() => {
    setLoadingMessage(null);
  }, []);

  return <>{experimentalModule}</>;
};

export default BufferExperimental;
