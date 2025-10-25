
import { GoogleGenAI, Type } from "@google/genai";
import { Quote } from '../types';

// IMPORTANT: Do not expose this key publicly.
// It's assumed that process.env.API_KEY is securely managed in the deployment environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using fallback quotes.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fallbackQuotes: Quote[] = [
    { text: "Cách tốt nhất để dự đoán tương lai là tạo ra nó.", author: "Peter Drucker" },
    { text: "Thành công không phải là cuối cùng, thất bại không phải là chết người: lòng can đảm đi tiếp mới là điều quan trọng.", author: "Winston Churchill" },
    { text: "Hãy tin rằng bạn có thể và bạn đã đi được nửa đường.", author: "Theodore Roosevelt" },
    { text: "Hành trình ngàn dặm bắt đầu bằng một bước chân.", author: "Lão Tử" }
];

export const generateQuote = async (): Promise<Quote> => {
  if (!API_KEY) {
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Tạo một câu trích dẫn ngắn gọn, truyền cảm hứng bằng tiếng Việt. Trả về dưới dạng JSON với các khóa 'text' và 'author'.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: 'Nội dung câu trích dẫn.' },
            author: { type: Type.STRING, description: 'Tác giả của câu trích dẫn.' },
          },
          required: ['text', 'author'],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedQuote: Quote = JSON.parse(jsonString);
    return parsedQuote;

  } catch (error) {
    console.error("Error generating quote with Gemini, using fallback:", error);
    // Return a random fallback quote on API error
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
};
