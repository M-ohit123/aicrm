const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

const generateLeadInsights = async (req, res) => {
try {
const {
name,
email,
phone,
company,
source,
status,
priority,
notes,
} = req.body;


console.log("AI REQUEST BODY:", req.body);

if (!name) {
  return res.status(400).json({
    success: false,
    message: "Lead name is required",
  });
}

const prompt =
  "You are an AI CRM lead analysis assistant.\n\n" +
  "Analyze the following customer lead:\n\n" +
  "Name: " + (name || "N/A") + "\n" +
  "Email: " + (email || "N/A") + "\n" +
  "Phone: " + (phone || "N/A") + "\n" +
  "Company: " + (company || "N/A") + "\n" +
  "Source: " + (source || "N/A") + "\n" +
  "Status: " + (status || "N/A") + "\n" +
  "Priority: " + (priority || "N/A") + "\n" +
  "Notes: " + (notes || "N/A") + "\n\n" +

  "Return ONLY valid JSON.\n\n" +

  "Use exactly this structure:\n\n" +

  "{\n" +
  '  "leadScore": 0,\n' +
  '  "leadPotential": "Low",\n' +
  '  "recommendedAction": "Short professional action",\n' +
  '  "reason": "Short professional reason",\n' +
  '  "followUpMessage": "Professional customer follow-up message"\n' +
  "}\n\n" +

  "Rules:\n" +
  "1. leadScore must be a number between 0 and 100.\n" +
  "2. leadPotential must be exactly High, Medium, or Low.\n" +
  "3. High score means strong buying intent and clear requirements.\n" +
  "4. Medium score means some interest but more qualification is required.\n" +
  "5. Low score means incomplete, vague, suspicious, test, spam, or weak information.\n" +
  "6. recommendedAction must be short and practical.\n" +
  "7. reason must briefly explain the score.\n" +
  "8. followUpMessage must be professional and personalized.\n" +
  "9. Do not use markdown.\n" +
  "10. Do not use code fences.\n" +
  "11. Do not add anything outside the JSON.\n" +
  "12. Return valid JSON only.";

const models = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

let finalText = null;
let lastError = null;

for (const modelName of models) {
  try {
    console.log(
      "Trying Gemini model:",
      modelName
    );

    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    const result =
      await model.generateContent(prompt);

    finalText =
      result.response.text().trim();

    console.log(
      "GEMINI RESPONSE (" +
        modelName +
        "):",
      finalText
    );

    if (finalText) {
      break;
    }

  } catch (error) {
    lastError = error;

    console.error(
      modelName + " ERROR:",
      error.message
    );

    if (error.status === 503) {
      console.log(
        modelName +
          " is temporarily busy. Trying fallback..."
      );
    }
  }
}

if (!finalText) {
  throw (
    lastError ||
    new Error(
      "Gemini did not return a response"
    )
  );
}

// Remove markdown code fences
let cleanedText = finalText
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

// Find JSON object
const firstBrace =
  cleanedText.indexOf("{");

const lastBrace =
  cleanedText.lastIndexOf("}");

if (
  firstBrace !== -1 &&
  lastBrace !== -1
) {
  cleanedText =
    cleanedText.substring(
      firstBrace,
      lastBrace + 1
    );
}

let insights;

try {
  insights = JSON.parse(cleanedText);

} catch (parseError) {
  console.error(
    "JSON PARSE ERROR:",
    parseError.message
  );

  console.error(
    "GEMINI RAW RESPONSE:",
    finalText
  );

  return res.status(500).json({
    success: false,
    message:
      "AI returned an invalid response. Please try again.",
  });
}

// Validate lead score
let leadScore =
  Number(insights.leadScore);

if (Number.isNaN(leadScore)) {
  leadScore = 0;
}

leadScore = Math.min(
  Math.max(
    Math.round(leadScore),
    0
  ),
  100
);

// Validate potential
let leadPotential =
  insights.leadPotential;

if (
  !["High", "Medium", "Low"].includes(
    leadPotential
  )
) {
  if (leadScore >= 70) {
    leadPotential = "High";
  } else if (leadScore >= 40) {
    leadPotential = "Medium";
  } else {
    leadPotential = "Low";
  }
}

insights = {
  leadScore: leadScore,

  leadPotential: leadPotential,

  recommendedAction:
    insights.recommendedAction ||
    "Follow up with the lead and understand their requirements.",

  reason:
    insights.reason ||
    "More information is required to properly qualify this lead.",

  followUpMessage:
    insights.followUpMessage ||
    "Hi " +
      name +
      ", thank you for your interest. Please let us know how we can assist you.",
};

console.log(
  "FINAL AI INSIGHTS:",
  insights
);

return res.status(200).json({
  success: true,
  data: {
    insights: insights,
  },
});


} catch (error) {
console.error(
"========== AI ERROR =========="
);


console.error(
  "Message:",
  error.message
);

console.error(
  "Status:",
  error.status
);

console.error(
  "Full Error:",
  error
);

console.error(
  "=============================="
);

if (error.status === 503) {
  return res.status(503).json({
    success: false,
    message:
      "AI service is temporarily busy. Please try again in a few seconds.",
  });
}

return res.status(500).json({
  success: false,
  message:
    "Failed to generate AI insights",
  error: error.message,
});


}
};

module.exports = {
generateLeadInsights,
};
