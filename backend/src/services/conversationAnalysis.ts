import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

interface ConversationAnalysis {
  overall_score: number;
  strengths: string[];
  improvements: string[];
  conversation_quality: string;
  speaking_time: number;
  word_count: number;
}

/**
 * Extract JSON safely from Gemini response
 */
function extractJSON(input: string): any {
  try {
    const cleaned = input
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No valid JSON found in Gemini response");
    }

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Invalid Gemini response:", input);
    throw err;
  }
}

/**
 * Add timeout wrapper to prevent hanging requests
 */
async function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini request timed out")), ms)
  );

  return Promise.race([promise, timeout]);
}

/**
 * Retry wrapper for robustness
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    console.warn("Retrying Gemini request...");
    return withRetry(fn, retries - 1);
  }
}

export const analyzeConversation = async (
  transcript: string
): Promise<ConversationAnalysis> => {
  const wordCount = transcript
    .split(" ")
    .filter((word) => word.length > 0).length;

  const estimatedSpeakingTime = Math.max(
    1,
    Math.round(wordCount / 150)
  );

  try {
    const prompt = `
You are a professional communication skills evaluator.

Analyze the following video chat conversation transcript and provide structured feedback.

Transcript:
"""
${transcript}
"""

Provide:
1. Overall communication score (1-10 scale)
2. 3-5 strengths
3. 2-4 areas for improvement
4. 1-2 sentence conversation quality summary
5. Estimated speaking time in seconds
6. Word count

Respond ONLY with valid raw JSON.
Do NOT wrap in markdown.
Do NOT use \`\`\`json.
Do NOT add explanation text.

Return JSON in this exact format:
{
  "overall_score": number,
  "strengths": ["string"],
  "improvements": ["string"],
  "conversation_quality": "string",
  "speaking_time": number,
  "word_count": number
}
`;

    const geminiCall = async () => {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const response = await result.response;
      return response.text();
    };

    const text = await withRetry(
      () => withTimeout(geminiCall(), 10000),
      2
    );

    const analysisData = extractJSON(text);

    return {
      overall_score: Math.min(
        10,
        Math.max(1, analysisData.overall_score || 5)
      ),
      strengths: Array.isArray(analysisData.strengths)
        ? analysisData.strengths
        : [],
      improvements: Array.isArray(analysisData.improvements)
        ? analysisData.improvements
        : [],
      conversation_quality:
        analysisData.conversation_quality ||
        "Conversation analysis completed.",
      speaking_time: estimatedSpeakingTime,
      word_count: wordCount,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);

    return {
      overall_score: 5,
      strengths: ["Clear pronunciation", "Good engagement"],
      improvements: [
        "Ask more follow-up questions",
        "Practice active listening",
      ],
      conversation_quality:
        "Basic conversation completed. Consider improving question variety and engagement.",
      speaking_time: estimatedSpeakingTime,
      word_count: wordCount,
    };
  }
};