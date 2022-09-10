import "../styles/globals.css";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

/*import React from "react";
import { withIronSessionSsr } from "iron-session/next";

export default function Profile(props = {}) {
  console.log("props", props);

  console.log("process.env.NODE_ENV ", process.env.NODE_ENV);

  return <>sdffssdf</>;
}

const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        props: {
          user: null,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  {
    cookieName: "myapp_cookiename",
    password: "cx5fiZYe1AqdU72KttCVNqzzRpUjHsMi",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);*/
