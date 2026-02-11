import { GoogleGenAI } from "@google/genai";

const USER_API_KEY_STORAGE = 'hafizai_user_api_key';
// Default fallback key if no Env var or User key is present
const DEFAULT_API_KEY = "AIzaSyDyFoJXEJnqHI_vZhdqT9k2LK9-8Z5Ktt8";

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

// Helper to safely access env vars without triggering strict bundler replacements
const getSafeEnvApiKey = () => {
  try {
    // Check global scope first (from index.html polyfill)
    // @ts-ignore
    if (typeof window !== 'undefined' && window.process && window.process.env && window.process.env.API_KEY) {
       // @ts-ignore
       return window.process.env.API_KEY;
    }
    
    // Check standard process.env (for Node/Build environments)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    return undefined;
  }
  return undefined;
};

const getClient = () => {
  // 1. Prioritize User API Key (from Settings)
  let apiKey = getUserApiKey();

  // 2. Fallback to Environment Variable (Netlify/System)
  if (!apiKey) {
    const envKey = getSafeEnvApiKey();
    if (envKey) apiKey = envKey;
  }

  // 3. Final Fallback to Default Hardcoded Key
  if (!apiKey) {
    apiKey = DEFAULT_API_KEY;
  }

  if (!apiKey) {
    console.warn("API Key not found. Please add it in settings or environment.");
    // Return null instead of crashing, UI handles the error message
    return null;
  }
  
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    return null;
  }
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