import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useHandleStatus = ({ pid, isExportScreen, tools, user }) => {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;

      if (isExportScreen) {
        webapp.setBackgroundColor("#8F8F8F");
      } else {
        webapp.setBackgroundColor("#f2f2f2");
      }
    }
  }, [isExportScreen]);

  const handleStatus = (pid, user) => {
    if (window.Telegram && user) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      webapp.setBackgroundColor("#f2f2f2");

      webapp.expand();

      setVersion(webapp.version);

      if (mainbutton) {
        mainbutton.enable();
        mainbutton.show();
        mainbutton.setText("Открыть в новом окне");

        mainbutton.onClick(() => {
          window.open(
            `https://cxm-reapp.vercel.app/scene/${pid}?needsLogin=true&id=${user.id}&first_name=${user.first_name}&last_name=${user.last_name}`,
            "_blank"
          );
        });
      }
    }
  };

  useEffect(() => {
    handleStatus(pid, user);
  }, [pid, user]);

  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;

      const mainbutton = webapp.MainButton;

      if (mainbutton) {
        if (tools) {
          mainbutton.setText("Открыть в новом окне");
        } else {
          mainbutton.setText("Открыть в новом окне");
        }
      }
    }
  }, [tools]);
};

export default useHandleStatus;
