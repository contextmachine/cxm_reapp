import { NextApiRequest, NextApiResponse } from "next";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const prompt = req.body.prompt;

  if (!prompt || prompt === "") {
    return new Response("Please send your prompt", { status: 400 });
  }

  try {
    const aiResult = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.9,
      max_tokens: 2048,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const response =
      aiResult.data.choices[0].text?.trim() || "Sorry, there was a problem";
    res.status(200).json({ text: response, data: aiResult.data });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
