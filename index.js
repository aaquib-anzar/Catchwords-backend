import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { db_connect } from "./db_connect.js";
import Caption from "./models/captionModel.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin:  process.env.PROD_URL || "http://localhost:5173", // your React app
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(API_KEY);
app.post("/generate", async (req, res) => {
  const { type, tone, keywords, emoji, length, language } = req.body;
  const prompt = `
                    Generate 5 Instagram captions for a ${type} post.
                    Tone: ${tone}.
                    Include keywords: ${keywords || "none"}.
                    Use ${emoji.toLowerCase()} emoji style.
                    Make the captions ${length.toLowerCase()}. Language is ${language}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const caption = response.text;
  return res.status(200).json({ caption });
});
app.post("/savecaption", async (req, res) => {
  const { email, caption } = req.body;
  if (!email || email === "") {
    return;
  }
  try {
    const existingUser = await Caption.findOne({ user: email });

    if (existingUser) {
      existingUser.captions.push(caption);
      await existingUser.save();
    } else {
      await Caption.create({ user: email, captions: caption });
    }
    return res.status(200).json({ message: "Caption saved successfully." });
  } catch (error) {
    console.error("Failed to save the caption", error);
  }
});
app.get("/getCaption", async (req, res) => {
  const { email } = req.query;
  try {
    const history = await Caption.findOne({ user: email });
    if (!history || !history.captions || history.captions.length === 0) {
      return res.status(200).json({ message: "No interaction found" });
    }
    return res.status(200).json({ captions: history.captions });
  } catch (error) {
    console.error("Failed to retrieve the caption", error);
  }
});
app.get("/", (req, res) => {
  res.send("working fine");
});

db_connect().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Backend is working at : ${PORT} and API key is ${process.env.GEMINI_API_KEY}`
    );
  });
});
