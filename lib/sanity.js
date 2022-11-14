import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const options = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_ID,
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_KEY,
  apiVersion: "2022-11-12",
  //useCdn: process.env.NODE_ENV === "production",
};

export async function getAllScenes() {
  return await client.fetch(`*[_type == "scene"]`);
}

export async function getAccountInfo({ user_id }) {
  return await client.fetch(`*[_type == "account" && id == "${user_id}"]`);
}

export async function getSceneData({ pid }) {
  return await client.fetch(`*[_type == "scene" && scene_id == "${pid}"]`);
}

export const client = createClient(options);

const builder = imageUrlBuilder(client);
// parameters:
export function urlFor(source) {
  return builder.image(source);
}
