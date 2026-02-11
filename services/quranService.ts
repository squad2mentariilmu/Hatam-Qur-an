import { Surah, SurahDetail, Reciter, Doa, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murottal' },
  { id: 'ar.sudais', name: 'Abdurrahmaan As-Sudais', style: 'Grand Mosque' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit', style: 'Murattal' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify', style: 'Slow & Clear' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Tajweed Learning' },
];

export const POPULAR_SURAH_IDS = [18, 36, 55, 56, 67]; // Al-Kahf, Yasin, Ar-Rahman, Al-Waqi'ah, Al-Mulk

// Define 10 Popular Ayahs
export const POPULAR_AYATS_REF = [
  { surah: 2, ayah: 255, title: "Ayat Kursi", desc: "Ayat paling agung dalam Al-Qur'an" },
  { surah: 2, ayah: 285, title: "Akhir Al-Baqarah (1)", desc: "Dua ayat terakhir Al-Baqarah" },
  { surah: 2, ayah: 286, title: "Akhir Al-Baqarah (2)", desc: "Doa memohon ampunan dan kekuatan" },
  { surah: 65, ayah: 2, title: "Ayat 1000 Dinar (1)", desc: "Janji jalan keluar bagi yang bertakwa" },
  { surah: 65, ayah: 3, title: "Ayat 1000 Dinar (2)", desc: "Janji rezeki dari arah tak disangka" },
  { surah: 36, ayah: 82, title: "Kun Fayakun", desc: "Kekuasaan Allah menciptakan sesuatu" },
  { surah: 9, ayah: 128, title: "Laqod Ja'akum", desc: "Kasih sayang Rasulullah SAW" },
  { surah: 9, ayah: 129, title: "Hasbiyallah", desc: "Cukupkanlah Allah bagiku" },
  { surah: 21, ayah: 87, title: "Doa Nabi Yunus", desc: "Doa keselamatan dari kesusahan" },
  { surah: 59, ayah: 21, title: "Lau Anzalna", desc: "Kedahsyatan Al-Qur'an" },
];

export const DOA_LIST: Doa[] = [
  {
    id: 100,
    title: "Bacaan Tahlil Ringkas",
    arabic: "لَا إِلَهَ إِلَّا اللهُ",
    latin: "Laa ilaaha illallaah",
    translation: "Tiada Tuhan selain Allah. (Dibaca berulang-ulang, biasanya 33x atau 100x sebagai inti Tahlil)",
    source: "Tradisi"
  },
  {
    id: 101,
    title: "Doa Ziarah Kubur",
    arabic: "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللهُ بِكُمْ لَلَاحِقُونَ",
    latin: "Assalamu'alaikum ahlad-diyaari minal mu'miniina wal muslimiina, wa innaa insyaa alloohu bikum lalaahiquun",
    translation: "Semoga keselamatan tercurah kepada kalian, wahai penghuni kubur, dari (golongan) orang-orang beriman dan orang-orang Islam. Kami insya Allah akan menyusul kalian.",
    source: "HR. Muslim"
  },
  {
    id: 1,
    title: "Doa Sebelum Makan",
    arabic: "اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaa bannaar",
    translation: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.",
    source: "HR. Ibnu Sunni"
  },
  {
    id: 2,
    title: "Doa Sesudah Makan",
    arabic: "اَلْحَمْدُ ِللهِ الَّذِىْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ",
    latin: "Alhamdulillahilladzi ath-amanaa wa saqoonaa wa ja'alanaa minal muslimiin",
    translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk dari kaum muslimin.",
    source: "HR. Abu Daud"
  },
  {
    id: 3,
    title: "Doa Sebelum Tidur",
    arabic: "بِسْمِكَ اللّهُمَّ اَحْيَا وَ بِسْمِكَ اَمُوْتُ",
    latin: "Bismikallahumma ahyaa wa bismika amuut",
    translation: "Dengan nama-Mu Ya Allah aku hidup, dan dengan nama-Mu aku mati.",
    source: "HR. Bukhari"
  },
  {
    id: 4,
    title: "Doa Bangun Tidur",
    arabic: "اَلْحَمْدُ ِللهِ الَّذِى أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahil ladzi ahyana ba'da ma amatana wailaihin nusyur",
    translation: "Segala puji bagi Allah yang menghidupkan kami kembali setelah mematikan kami dan kepada Allah kami akan bangkit.",
    source: "HR. Bukhari"
  },
  {
    id: 5,
    title: "Doa Selamat Dunia Akhirat",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbana atina fiddunya hasanah wa fil akhiroti hasanah waqina 'adzabannar",
    translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.",
    source: "QS. Al-Baqarah: 201"
  },
  {
    id: 6,
    title: "Doa Masuk Masjid",
    arabic: "اَللّٰهُمَّ افْتَحْ لِيْ اَبْوَابَ رَحْمَتِكَ",
    latin: "Allahummaf tahlii abwaaba rohmatik",
    translation: "Ya Allah, bukalah untukku pintu-pintu rahmat-Mu.",
    source: "HR. Muslim"
  },
  {
    id: 7,
    title: "Doa Keluar Masjid",
    arabic: "اَللّٰهُمَّ اِنِّى اَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allahumma innii as-aluka min fadlik",
    translation: "Ya Allah, sesungguhnya aku memohon keutamaan dari-Mu.",
    source: "HR. Muslim"
  },
  {
    id: 8,
    title: "Doa Tolak Bala",
    arabic: "اللَّهُمَّ ادْفَعْ عَنَّا الْغَلَاءَ وَالْبَلَاءَ وَالْوَبَاءَ",
    latin: "Allahummadfa' 'annal gholaa-a wal balaa-a wal wabaa-a",
    translation: "Ya Allah, hindarkanlah kami dari kekurangan pangan, cobaan hidup, dan wabah penyakit.",
    source: "Tradisi"
  },
  {
    id: 9,
    title: "Doa Mohon Kesembuhan",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي",
    latin: "Allahumma rabban-nasi adzhibil-ba'sa isyfi antasy-syafi",
    translation: "Ya Allah, Tuhan manusia, hilangkanlah penyakit ini, sembuhkanlah, Engkaulah Yang Maha Menyembuhkan.",
    source: "HR. Bukhari"
  },
  {
    id: 10,
    title: "Doa Naik Kendaraan",
    arabic: "سُبْحَانَ الَّذِى سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    latin: "Subhanalladzi sakh-khoro lanaa haadzaa wa maa kunnaa lahu muqriniin",
    translation: "Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya.",
    source: "QS. Az-Zukhruf: 13"
  },
  {
    id: 11,
    title: "Doa Masuk Rumah",
    arabic: "بِسْمِ اللهِ وَلَجْنَا، وَ بِسْمِ اللهِ خَرَجْنَا",
    latin: "Bismillahi walajnaa wa bismillahi khorojnaa",
    translation: "Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar.",
    source: "HR. Abu Daud"
  },
  {
    id: 12,
    title: "Doa Keluar Rumah",
    arabic: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
    latin: "Bismillahi tawakkaltu 'alallahi, laa haula wa laa quwwata illaa billaah",
    translation: "Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan Allah.",
    source: "HR. Tirmidzi"
  },
  {
    id: 13,
    title: "Doa Bercermin",
    arabic: "اَللّٰهُمَّ كَمَا حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ",
    latin: "Allahumma kamaa hassanta kholqii fahassin khuluqii",
    translation: "Ya Allah, sebagaimana Engkau telah membaguskan penciptaanku, maka baguskanlah pula akhlakku.",
    source: "HR. Ibnu Hibban"
  },
  {
    id: 14,
    title: "Doa Memohon Ilmu",
    arabic: "رَبِّ زِدْنِي عِلْمًا وَرُزُقْنِي فَهْمًا",
    latin: "Robbi zidnii 'ilman warzuqnii fahman",
    translation: "Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan, dan berilah aku karunia untuk dapat memahaminya.",
    source: "Tradisi"
  },
  {
    id: 15,
    title: "Doa Penenang Hati",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    latin: "Alaa bidzikrillaahi tathma'innul quluub",
    translation: "Ingatlah, hanya dengan mengingat Allah-lah hati menjadi tenteram.",
    source: "QS. Ar-Ra'd: 28"
  }
];

// --- KHATAM PROGRESS LOGIC ---
const KHATAM_KEY = 'hafizai_khatam_progress';

export const getKhatamProgress = (): number[] => {
  try {
    const saved = localStorage.getItem(KHATAM_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const toggleJuzComplete = (juzNumber: number): number[] => {
  const current = getKhatamProgress();
  let updated;
  if (current.includes(juzNumber)) {
    updated = current.filter(j => j !== juzNumber);
  } else {
    updated = [...current, juzNumber];
  }
  localStorage.setItem(KHATAM_KEY, JSON.stringify(updated));
  return updated;
};

// --- DATA FETCHING ---

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching surah list:", error);
    return [];
  }
};

export const fetchSurahDetails = async (surahNumber: number, reciterId: string): Promise<SurahDetail | null> => {
  const cacheKey = `surah_cache_v2_${surahNumber}_${reciterId}`;
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.warn("Invalid cache", e);
    }
  }

  try {
    const [audioRes, transRes, latinRes] = await Promise.all([
      fetch(`${BASE_URL}/surah/${surahNumber}/${reciterId}`),
      fetch(`${BASE_URL}/surah/${surahNumber}/id.indonesian`),
      fetch(`${BASE_URL}/surah/${surahNumber}/en.transliteration`)
    ]);

    const audioData = await audioRes.json();
    const transData = await transRes.json();
    const latinData = await latinRes.json();

    if (audioData.code === 200 && transData.code === 200 && latinData.code === 200) {
      const result: SurahDetail = audioData.data;
      result.ayahs = result.ayahs.map((ayah, index) => ({
        ...ayah,
        translation: transData.data.ayahs[index].text,
        latin: latinData.data.ayahs[index].text
      }));
      return result;
    }
    return null;
  } catch (error) {
    console.error("Error fetching surah details:", error);
    return null;
  }
};

export const fetchJuzDetails = async (juzNumber: number, reciterId: string): Promise<SurahDetail | null> => {
  // Fetch full Juz data
  // Note: Juz response contains an array of Ayahs which may span multiple Surahs.
  // The API returns 'data' as { number: 30, ayahs: [...] }
  
  const cacheKey = `juz_cache_v1_${juzNumber}_${reciterId}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch(e) {}
  }

  try {
     const [audioRes, transRes, latinRes] = await Promise.all([
      fetch(`${BASE_URL}/juz/${juzNumber}/${reciterId}`),
      fetch(`${BASE_URL}/juz/${juzNumber}/id.indonesian`),
      fetch(`${BASE_URL}/juz/${juzNumber}/en.transliteration`)
    ]);

    const audioData = await audioRes.json();
    const transData = await transRes.json();
    const latinData = await latinRes.json();

    if (audioData.code === 200) {
       const ayahsRaw = audioData.data.ayahs;
       const transAyahs = transData.data.ayahs;
       const latinAyahs = latinData.data.ayahs;

       const mergedAyahs: Ayah[] = ayahsRaw.map((ayah: any, index: number) => ({
         ...ayah,
         translation: transAyahs[index]?.text || '',
         latin: latinAyahs[index]?.text || '',
       }));

       // Construct a virtual Surah object for the Juz
       const result: SurahDetail = {
         number: -1 * juzNumber, // Negative ID for Juz to differentiate
         name: `Juz ${juzNumber}`,
         englishName: `Juz ${juzNumber}`,
         englishNameTranslation: `Bagian ${juzNumber}`,
         revelationType: '',
         numberOfAyahs: mergedAyahs.length,
         ayahs: mergedAyahs
       };
       
       // Cache it (Juz data is large, be careful with storage limits in production)
       try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch(e) {}

       return result;
    }
    return null;
  } catch (error) {
    console.error("Error fetching juz:", error);
    return null;
  }
};

export const fetchPopularAyahsAsPlaylist = async (reciterId: string): Promise<SurahDetail | null> => {
  try {
    const promises = POPULAR_AYATS_REF.map(async (ref) => {
      const audioRes = await fetch(`${BASE_URL}/ayah/${ref.surah}:${ref.ayah}/${reciterId}`);
      const transRes = await fetch(`${BASE_URL}/ayah/${ref.surah}:${ref.ayah}/id.indonesian`);
      const latinRes = await fetch(`${BASE_URL}/ayah/${ref.surah}:${ref.ayah}/en.transliteration`);

      const audioData = await audioRes.json();
      const transData = await transRes.json();
      const latinData = await latinRes.json();

      if (audioData.code === 200 && transData.code === 200) {
        const ayah: Ayah = {
          ...audioData.data,
          translation: transData.data.text,
          latin: latinData.data.text,
          description: ref.desc, 
          numberInSurah: ref.ayah,
        };
        return { ayah, title: ref.title, surahName: audioData.data.surah.englishName };
      }
      return null;
    });

    const results = await Promise.all(promises);
    const validAyahs = results.filter(r => r !== null);

    if (validAyahs.length === 0) return null;

    return {
      number: 0,
      name: "Ayat Pilihan",
      englishName: "Ayat Pilihan",
      englishNameTranslation: "Popular Verses",
      revelationType: "",
      numberOfAyahs: validAyahs.length,
      ayahs: validAyahs.map(r => ({
        ...r!.ayah,
        text: r!.ayah.text
      }))
    };

  } catch (error) {
    console.error("Error fetching popular ayahs:", error);
    return null;
  }
};

export const saveSurahOffline = (surah: SurahDetail, reciterId: string) => {
  try {
    // Logic handles both regular surah and Juz (via negative ID)
    const type = surah.number < 0 ? 'juz' : 'surah';
    const id = surah.number < 0 ? Math.abs(surah.number) : surah.number;
    const cacheKey = `${type}_cache_v2_${id}_${reciterId}`;
    // Fallback for previous logic keys
    if (surah.number > 0) {
       localStorage.setItem(`surah_cache_v2_${id}_${reciterId}`, JSON.stringify(surah));
    } else {
       localStorage.setItem(`juz_cache_v1_${id}_${reciterId}`, JSON.stringify(surah));
    }
    return true;
  } catch (e) {
    console.error("Failed to save offline", e);
    return false;
  }
};

export const isSurahOffline = (surahNumber: number, reciterId: string): boolean => {
   if (surahNumber < 0) {
     const id = Math.abs(surahNumber);
     return !!localStorage.getItem(`juz_cache_v1_${id}_${reciterId}`);
   }
   const cacheKey = `surah_cache_v2_${surahNumber}_${reciterId}`;
   return !!localStorage.getItem(cacheKey);
};
