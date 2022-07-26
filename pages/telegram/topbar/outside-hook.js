import { useEffect } from "react";

const useClickedOutside = (ref, setState) => {
  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setState(false);
    };

    window.addEventListener("click", clickOutside);

    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, []);
};

export default useClickedOutside;
