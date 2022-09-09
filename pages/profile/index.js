import React from "react";
import { withIronSessionSsr } from "iron-session/next";

export default function Profile(props = {}) {
  console.log("props", props);

  console.log("process.env.NODE_ENV ", process.env.NODE_ENV);

  return <>sdffssdf</>;
}

export const getServerSideProps = withIronSessionSsr(
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
);
