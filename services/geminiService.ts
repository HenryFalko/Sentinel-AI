import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Transaction, FraudAnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating the probability of fraud. 100 is certain fraud.",
    },
    riskLevel: {
      type: Type.STRING,
      description: "Categorical risk level: Faible, Moyen, Élevé, Critique.",
    },
    isFraud: {
      type: Type.BOOLEAN,
      description: "Binary classification based on the score.",
    },
    anomalies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific anomalies detected (e.g., 'Location Mismatch', 'Amount Outlier').",
    },
    modelConfidence: {
      type: Type.NUMBER,
      description: "Confidence of the AI model in its prediction (0.0 to 1.0).",
    },
    explanation: {
      type: Type.STRING,
      description: "A concise technical explanation of why this transaction was flagged or cleared, referencing simulated logic like Isolation Forest or Velocity Checks.",
    },
    recommendedAction: {
      type: Type.STRING,
      description: "Action to take: ALLOW, REVIEW, or BLOCK.",
    },
  },
  required: ["riskScore", "riskLevel", "isFraud", "anomalies", "explanation", "recommendedAction"],
};

export const analyzeTransactionWithGemini = async (transaction: Transaction): Promise<FraudAnalysisResult> => {
  try {
    const prompt = `
      You are SentinelAI, an advanced banking fraud detection system.
      Your task is to analyze the following transaction metadata and detect potential fraud.
      
      Simulate the logic of the following algorithms:
      1. Isolation Forest (for outlier detection in amount and location).
      2. XGBoost (for pattern recognition based on historical fraud data).
      3. Velocity Rules (impossible travel, high frequency).

      Transaction Details:
      - ID: ${transaction.id}
      - Amount: ${transaction.amount} ${transaction.currency}
      - Merchant: ${transaction.merchant}
      - Type: ${transaction.type}
      - Location: ${transaction.location}
      - Time: ${transaction.timestamp.toISOString()}
      - Card Holder: ${transaction.cardHolder}

      Context for Analysis (Simulated History):
      - The card holder usually spends in Paris, France.
      - Average transaction size is around 50-150 EUR.
      - Last known location was Paris, 2 hours ago.
      
      Analyze strictly. If the location is far from Paris within 2 hours, flag it. If the amount is significantly higher than average, flag it.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for consistent, analytical results
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText) as FraudAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback safe response if API fails
    return {
      riskScore: 0,
      riskLevel: "Inconnu",
      isFraud: false,
      anomalies: ["Erreur d'analyse API"],
      modelConfidence: 0,
      explanation: "Impossible de contacter le moteur d'IA. Transaction marquée pour révision manuelle.",
      recommendedAction: "REVIEW"
    };
  }
};
