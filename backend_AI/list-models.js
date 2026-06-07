const dotenv = require("dotenv");
const path = require("path");

// Load backend .env file
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function checkModels() {
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in .env file.");
        return;
    }
    
    console.log("Checking available models with API key starting with:", apiKey.substring(0, 8));
    
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }
        
        if (data.models && Array.isArray(data.models)) {
            console.log("\nAvailable Models for your API Key:");
            data.models.forEach(m => {
                console.log(`- ID: ${m.name.replace('models/', '')} | Methods: ${m.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.log("No models returned or invalid format:", data);
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

checkModels();
