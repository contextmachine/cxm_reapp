import { client } from "../../lib/sanity";
import { basename } from "path";
import { createReadStream } from "fs";
import sharp from "sharp";

//return a promise that resolves with a File instance
// https://stackoverflow.com/questions/16968945/convert-base64-png-data-to-javascript-file-objects
export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      let body = await JSON.parse(req.body);
      const { _id, thumbnail_img, thumbnail_last_updated, ...otherData } = body;

      try {
        let data = {};

        const thumbnail_buffer = Buffer.from(
          thumbnail_img.split(";base64,").pop(),
          "base64"
        );

        const thumbnail_image = await sharp(thumbnail_buffer)
          .jpeg({ quality: 100 })
          .toBuffer();

        await client.assets
          .upload("image", thumbnail_image, {
            filename: `preview-${thumbnail_last_updated}-${_id}`,
          })
          .then((imageAsset) => {
            return client
              .patch(_id)
              .set({
                thumbnail_img: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: imageAsset._id,
                  },
                },
              })
              .commit();
          })
          .then(() => {});

        res.status(200).json({ data, msg: "edited" });
      } catch (err) {
        res.status(500);
      }

      break;
  }
}
