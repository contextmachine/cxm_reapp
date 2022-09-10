import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async (req, res) => {
    const body = await req.body;
    const { id, first_name, last_name } = body;

    // get user from database then:
    const user = {
      id,
      first_name,
      last_name,
    };

    req.session.user = user;

    await req.session.save();

    res.status(200).json(user);
    //res.send({ ok: true, somethin: "dfsf" });
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
