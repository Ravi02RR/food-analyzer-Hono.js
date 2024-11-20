import { GoogleGenerativeAI } from '@google/generative-ai';

const analysisPrompt = `
Analyze this food image and provide detailed information in the following JSON format:
{
    "foodIdentification": {
        "name": "Main food item name",
        "category": "Food category",
        "ingredients": ["List of visible ingredients"]
    },
    "nutritionalAnalysis": {
        "calories": "Estimated calories",
        "macronutrients": {
            "proteins": "Amount in grams",
            "carbohydrates": "Amount in grams",
            "fats": "Amount in grams",
            "fiber": "Amount in grams"
        },
        "micronutrients": {
            "vitamins": ["Present vitamins"],
            "minerals": ["Present minerals"]
        }
    },
    "healthInsights": {
        "nutritionalGaps": ["List of lacking nutrients and should we avoid eatting or not"],
        "recommendations": {
            "foodSuggestions": ["Foods to add for balance"],
            "dietaryTips": ["Nutritionist recommendations"]
        },
        "healthBenefits": ["List of health benefits"],
        "cautionaryNotes": ["Any warnings or considerations"]
    }
}`;

export type AnalysisResult = {
  foodIdentification: {
    name: string;
    category: string;
    ingredients: string[];
  };
  nutritionalAnalysis: {
    calories: string;
    macronutrients: {
      proteins: string;
      carbohydrates: string;
      fats: string;
      fiber: string;
    };
    micronutrients: {
      vitamins: string[];
      minerals: string[];
    };
  };
  healthInsights: {
    nutritionalGaps: string[];
    recommendations: {
      foodSuggestions: string[];
      dietaryTips: string[];
    };
    healthBenefits: string[];
    cautionaryNotes: string[];
  };
};

export async function analyzeFoodImage(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<AnalysisResult> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([analysisPrompt, imagePart]);
    const response = await result.response;
    const analysisText = response.text();
    const cleanedText = analysisText.replace(/```json|\```/g, '').trim();

    return JSON.parse(cleanedText) as AnalysisResult;
  } catch (error) {
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
