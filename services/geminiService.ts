import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getTadabbur = async (surahName: string, ayahNumber: number, arabic: string, translation: string) => {
  const client = getClient();
  if (!client) return "API Key is missing. Cannot generate insight.";

  try {
    const prompt = `
      Berikan tadabbur (renungan mendalam) singkat dan inspiratif untuk ayat berikut dalam Bahasa Indonesia.
      Konteks: Surah ${surahName} Ayat ${ayahNumber}.
      Teks Arab: ${arabic}
      Terjemahan: ${translation}

      Fokus pada pesan moral, penerapan dalam kehidupan sehari-hari, atau keindahan bahasanya. Maksimal 2 paragraf singkat.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Maaf, tidak dapat memuat tadabbur saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi AI.";
  }
};
