// backend/server.js

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // Loads variables from .env file

const app = express();
const port = 3001; // The port your backend server will run on

// Middleware
app.use(cors()); // Allows your frontend to make requests to this backend
app.use(express.json()); // Allows the server to understand JSON in request bodies

// The new, secure API endpoint
app.post('/api/generate', async (req, res) => {
    // Get the prompts and config from the frontend's request
    const { systemPrompt, userPrompt, isJson } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
    };
    if (isJson) {
        payload.generationConfig = { responseMimeType: "application/json" };
    }

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            // Forward the error from the Gemini API to your frontend for better debugging
            throw new Error(`Gemini API Error: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`);
        }

        const result = await apiResponse.json();
        
        // Extract the core text content and send just that back to the frontend
        const text = result.candidates[0].content.parts[0].text;
        res.json({ text }); // Send response as { "text": "..." }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`✅ Backend server running at http://localhost:${port}`);
});