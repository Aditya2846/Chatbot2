import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a helpful and knowledgeable assistant for the National Museum. 
    Your goal is to assist visitors with information about exhibitions, tickets, and general queries. 
    If the user asks to book a ticket, guide them or confirm that you can help with that context.
    
    User: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error communicating with AI:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};
