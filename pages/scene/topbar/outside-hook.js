import { useEffect } from "react";

const useClickedOutside = (ref, setState, exception, exceptionState) => {
  useEffect(() => {
    if (!exception || (exception && !exceptionState)) {
      const clickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setState(false);
      };

      window.addEventListener("click", clickOutside);

      return () => {
        window.removeEventListener("click", clickOutside);
      };
    }
  }, [exception, exceptionState]);
};

export default useClickedOutside;
