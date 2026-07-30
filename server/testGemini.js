import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const models = await ai.models.list();
for await (const model of models) {
  console.log(model.name);
}

try {
  const response = await ai.models.generateContent({
    model: "models/gemini-2.0-flash-lite",
    contents: "Reply with only: Hello",
  });

  console.log(response.text);
} catch (error) {
  console.error("FULL ERROR:");
  console.error(error);
}
