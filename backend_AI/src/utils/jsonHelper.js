const cleanAndParseJSON = (text) => {
    if (!text) {
        throw new Error("Empty response received from AI.");
    }
    
    let cleaned = text.trim();
    // Remove markdown code block wrappers (```json ... ```)
    if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }
    cleaned = cleaned.trim();
    
    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.warn("Initial JSON parsing failed, attempting cleanup. Error:", err.message);
        
        // Attempt automatic corrections for common LLM JSON syntax errors
        // 1. Remove trailing commas before closing braces/brackets: ,} -> } and ,] -> ]
        // 2. Remove single-line comments: // comment
        let corrected = cleaned
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]")
            .replace(/\/\/.*/g, ""); // strip standard single-line comments
            
        try {
            return JSON.parse(corrected);
        } catch (retryErr) {
            console.error("JSON parsing retry failed. Raw snippet:", cleaned.substring(0, 300));
            throw new Error(`AI generated invalid JSON structure: ${retryErr.message}`);
        }
    }
};

module.exports = {
    cleanAndParseJSON
};
