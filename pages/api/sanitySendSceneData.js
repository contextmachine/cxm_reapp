import { client } from "../../lib/sanity";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      let body = await JSON.parse(req.body);

      try {
        let data = {};

        await client.create({ _type: "scene", ...body }).then((res) => {
          data = res;
        });

        res.status(200).json({ data });
      } catch (err) {
        res.status(500);
      }

      break;
  }
}
