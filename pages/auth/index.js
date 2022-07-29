import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";

const LogAuth = () => {
  const [tgLoaded, setTgLoaded] = useState(false);

  const [user_id, setUser_id] = useState(null);
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState(null);
  const [photo_url, setPhoto_url] = useState(null);

  useEffect(() => {
    if (tgLoaded) {
      const webapp = window.Telegram.WebApp;

      const initDataUnsafe = webapp.initDataUnsafe;

      const { user = {} } = initDataUnsafe;
      const {
        id,
        is_bot,
        first_name,
        last_name,
        username,
        language_code,
        photo_url,
      } = user;

      setUser_id(id);
      setFirst_name(first_name);
      setLast_name(last_name);
      setPhoto_url(photo_url);
    }
  }, [tgLoaded]);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => setTgLoaded(true)}
      ></Script>

      <div>
        <div>user id: ${user_id}</div>
        <div>first_name: ${first_name}</div>
        <div>last_name: ${last_name}</div>
        <div>photo_url: ${photo_url}</div>
      </div>
    </>
  );
};

export default LogAuth;
