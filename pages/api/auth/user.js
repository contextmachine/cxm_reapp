import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    const env = process.env.APP_ENV;

    if (env === "development") {
      res.json({
        user: {
          id: "1d5756ee-4cae-48d7-b1b4-ef6a231ce0ae",
          first_name: "Isaac",
          last_name: "New Tone",
        },
      });
    } else {
      res.json({ user: req.session.user });
    }
  },
  {
    cookieName: "myapp_cookiename",
    password: "cx5fiZYe1AqdU72KttCVNqzzRpUjHsMi",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: false,
    },
  }
);
