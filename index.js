import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { db_connect } from "./db_connect.js";
import dotenv from "dotenv"
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json())
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
app.get("/", (req, res) => {
  res.send("working fine");
});

db_connect().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Backend is working at : ${PORT} and API key is ${process.env.GEMINI_API_KEY}`
    );
})
});
