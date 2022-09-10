import Script from "next/script";

const LocalScripts = ({
  setRhinoConnected = () => {},
  setTgLoaded = () => {},
}) => {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => {
          setTgLoaded(true);
          return true;
        }}
      ></Script>

      <Script
        src="https://cdn.jsdelivr.net/npm/rhino3dm@0.12.0/rhino3dm.min.js"
        onLoad={() => setRhinoConnected(true)}
      ></Script>
    </>
  );
};

export default LocalScripts;
