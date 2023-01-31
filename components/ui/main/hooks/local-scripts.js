import Script from "next/script";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    &&&&& {
        .ant-notification-bottom {
          transform: translate(-50%, -100px) !important;
        }

        & .ant-notification-notice {
          background: #00000082;
          padding: 12px;
          border-radius: 10px;
          width: max-content;

          &, & * {
            color: white
          }
        }

        & .ant-notification-notice-close-x {
          display: none;
        }
    }
`;

const LocalScripts = ({
  setRhinoConnected = () => {},
  setTgLoaded = () => {},
}) => {
  return (
    <>
      <GlobalStyles />

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
