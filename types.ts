export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
  latin?: string; // Added for transliteration
  description?: string; // Added for description of popular ayahs
  // When fetching by Juz, the API includes the Surah object in the Ayah
  surah?: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
}

export interface Doa {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
}

export enum AppView {
  HOME = 'HOME',
  READER = 'READER',
  SEARCH = 'SEARCH',
}

export enum HomeTab {
  ALL = 'ALL',
  POPULAR = 'POPULAR',
  AYAT = 'AYAT',
  DOA = 'DOA',
  KHATAM = 'KHATAM',
}
