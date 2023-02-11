import { client } from "../../lib/sanity";
import { v4 as uuidv4 } from "uuid";

const Jimp = require("jimp");

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      let { id, thumbnail_img } = req.body;

      try {
        let data = {};

        const imageBuffer = Buffer.from(
          thumbnail_img.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        const image = await Jimp.read(imageBuffer);
        const thumbnail_image = await image
          .quality(100)
          .getBufferAsync(Jimp.MIME_JPEG);

        await client.assets
          .upload("image", thumbnail_image, {
            filename: `preview-${uuidv4()}-${id}`,
            contentType: "image/jpeg",
          })
          .then((imageAsset) => {
            const { url } = imageAsset;

            res.status(200).json({ data, url, msg: "edited" });
          })
          .then((e) => {});
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to update scene preview", error: err });
      }

      break;
  }
}
