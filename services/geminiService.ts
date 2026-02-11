import { GoogleGenAI } from "@google/genai";

const USER_API_KEY_STORAGE = 'hafizai_user_api_key';

export const getUserApiKey = () => {
  try {
    return localStorage.getItem(USER_API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
};

export const saveUserApiKey = (key: string) => {
  try {
    localStorage.setItem(USER_API_KEY_STORAGE, key);
  } catch (e) {
    console.error("Failed to save API Key", e);
  }
};

const getClient = () => {
  // 1. Prioritize User API Key
  let apiKey = getUserApiKey();

  // 2. Fallback to Default Env Key (Safe Access)
  if (!apiKey) {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        // @ts-ignore
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      // Ignore reference error if process is not defined
    }
  }

  if (!apiKey) {
    console.warn("API Key not found. Please add it in settings or environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getTadabbur = async (surahName: string, ayahNumber: number, arabic: string, translation: string) => {
  const client = getClient();
  if (!client) return "Kunci API tidak ditemukan. Silakan masukkan Gemini API Key Anda di menu Pengaturan (ikon gerigi).";

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
    return "Terjadi kesalahan saat menghubungi AI. Periksa koneksi atau API Key Anda.";
  }
};