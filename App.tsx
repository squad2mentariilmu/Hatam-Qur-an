import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  fetchSurahList, fetchSurahDetails, fetchPopularAyahsAsPlaylist, fetchJuzDetails, 
  getKhatamProgress, toggleJuzComplete,
  RECITERS, POPULAR_SURAH_IDS, DOA_LIST, POPULAR_AYATS_REF, saveSurahOffline, isSurahOffline 
} from './services/quranService';
import { getTadabbur } from './services/geminiService';
import { Surah, SurahDetail, AppView, Ayah, HomeTab } from './types';
import { 
  PlayIcon, PauseIcon, ChevronLeftIcon, BookOpenIcon, 
  SparklesIcon, SettingsIcon, EyeIcon, EyeOffIcon, BrainIcon,
  DownloadIcon, CheckIcon, RepeatIcon, HeartIcon, GaugeIcon, TypeIcon
} from './components/Icon';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.ALL);
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentReciter, setCurrentReciter] = useState<string>(RECITERS[0].id);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Khatam Progress
  const [completedJuz, setCompletedJuz] = useState<number[]>([]);

  // Audio State
  const [playingAyah, setPlayingAyah] = useState<Ayah | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [repeatOne, setRepeatOne] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Offline State
  const [isOfflineSaved, setIsOfflineSaved] = useState<boolean>(false);

  // Memorization / UX State
  const [hideTranslation, setHideTranslation] = useState<boolean>(false);
  const [showLatin, setShowLatin] = useState<boolean>(true); 
  const [blurArabic, setBlurArabic] = useState<boolean>(false);
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());

  // Tadabbur AI State
  const [tadabburLoading, setTadabburLoading] = useState<boolean>(false);
  const [tadabburContent, setTadabburContent] = useState<{ayah: number, text: string} | null>(null);

  // --- Effects ---
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const list = await fetchSurahList();
      setSurahList(list);
      setCompletedJuz(getKhatamProgress());
      setLoading(false);
    };
    init();
  }, []);

  // Update offline status when surah changes
  useEffect(() => {
    if (currentSurah) {
      setIsOfflineSaved(isSurahOffline(currentSurah.number, currentReciter));
    }
  }, [currentSurah, currentReciter]);

  // Apply playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, playingAyah]);

  // Handle Audio Logic
  const playNextAyah = useCallback(() => {
    if (!currentSurah || !playingAyah) return;
    
    // Find current index
    const currentIndex = currentSurah.ayahs.findIndex(a => a.number === playingAyah.number);
    
    // Repeat One logic
    if (repeatOne) {
       if (audioRef.current) {
         audioRef.current.currentTime = 0;
         audioRef.current.play();
       }
       return;
    }

    // Play Next if available
    if (currentIndex >= 0 && currentIndex < currentSurah.ayahs.length - 1) {
      const nextAyah = currentSurah.ayahs[currentIndex + 1];
      playAyah(nextAyah);
      
      const element = document.getElementById(`ayah-${nextAyah.number}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setIsPlaying(false);
      setPlayingAyah(null);
    }
  }, [currentSurah, playingAyah, repeatOne]);

  const handleAudioEnded = () => {
    if (autoPlay) {
      playNextAyah();
    } else {
      setIsPlaying(false);
      setPlayingAyah(null);
    }
  };

  const playAyah = (ayah: Ayah) => {
    if (audioRef.current) {
      if (playingAyah?.number === ayah.number) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      audioRef.current.src = ayah.audio;
      audioRef.current.playbackRate = playbackSpeed; 
      audioRef.current.play();
      setPlayingAyah(ayah);
      setIsPlaying(true);
    }
  };

  const playAll = () => {
    if (currentSurah && currentSurah.ayahs.length > 0) {
      setAutoPlay(true);
      playAyah(currentSurah.ayahs[0]);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const loadSurah = async (surahNumber: number) => {
    setLoading(true);
    const details = await fetchSurahDetails(surahNumber, currentReciter);
    setCurrentSurah(details);
    setView(AppView.READER);
    setLoading(false);
    setRevealedAyahs(new Set()); 
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingAyah(null);
    }
  };

  const loadJuz = async (juzNumber: number) => {
    setLoading(true);
    const details = await fetchJuzDetails(juzNumber, currentReciter);
    setCurrentSurah(details);
    setView(AppView.READER);
    setLoading(false);
    setRevealedAyahs(new Set());
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingAyah(null);
    }
  };

  const loadPopularAyahs = async () => {
    setLoading(true);
    const details = await fetchPopularAyahsAsPlaylist(currentReciter);
    setCurrentSurah(details);
    setView(AppView.READER);
    setLoading(false);
    setRevealedAyahs(new Set());
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingAyah(null);
    }
  };

  const handleDownload = () => {
    if (currentSurah) {
      const success = saveSurahOffline(currentSurah, currentReciter);
      if (success) setIsOfflineSaved(true);
    }
  };

  const handleTadabbur = async (ayah: Ayah) => {
    if (!currentSurah) return;
    setTadabburLoading(true);
    setTadabburContent(null);
    
    // If we are in Juz mode, we can try to get Surah name from the specific ayah if available, or use the surah list mapping
    // But for simplicity, we pass what we have. API usually returns surah info in Ayah object for Juz queries.
    const surahNameForPrompt = ayah.surah ? ayah.surah.englishName : currentSurah.englishName;

    const text = await getTadabbur(
      surahNameForPrompt, 
      ayah.numberInSurah, 
      ayah.text, 
      ayah.translation || ''
    );
    
    setTadabburContent({ ayah: ayah.number, text });
    setTadabburLoading(false);
  };

  const toggleKhatam = (e: React.MouseEvent, juz: number) => {
    e.stopPropagation();
    const updated = toggleJuzComplete(juz);
    setCompletedJuz(updated);
  };

  // --- Render Components ---

  const renderHomeHeader = () => (
    <div className="sticky top-0 z-10 bg-[#f5f5f4]/95 backdrop-blur-sm pt-6 pb-2 border-b border-gray-200 shadow-sm">
      <div className="px-6 flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">HafizAI</h1>
          <p className="text-sm text-gray-500">Asisten Al-Qur'an Pribadi</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 active:scale-95 transition-transform"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex px-4 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: HomeTab.ALL, label: 'Semua Surat' },
          { id: HomeTab.KHATAM, label: 'Khatam' },
          { id: HomeTab.POPULAR, label: 'Surat Populer' },
          { id: HomeTab.AYAT, label: 'Ayat Pilihan' },
          { id: HomeTab.DOA, label: 'Doa Harian' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setHomeTab(tab.id as HomeTab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              homeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSurahList = () => {
    let listToRender = surahList;
    if (homeTab === HomeTab.POPULAR) {
      listToRender = surahList.filter(s => POPULAR_SURAH_IDS.includes(s.number));
    }

    return (
      <div className="px-4 py-4 space-y-3 pb-24">
        {listToRender.map((surah) => (
          <div 
            key={surah.number}
            onClick={() => loadSurah(surah.number)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer group hover:border-emerald-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold rounded-full text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {surah.number}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{surah.englishName}</h3>
                <p className="text-xs text-gray-500">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayat</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-arabic text-xl text-gray-800 block">{surah.name}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderKhatamTracker = () => {
    const juzList = Array.from({ length: 30 }, (_, i) => i + 1);
    
    // Calculate percentage
    const progress = Math.round((completedJuz.length / 30) * 100);

    return (
      <div className="px-4 py-4 pb-24">
        {/* Progress Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Progress Khatam</h3>
            <span className="font-bold text-2xl">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-emerald-100">{completedJuz.length} dari 30 Juz selesai</p>
        </div>

        {/* Juz Grid */}
        <div className="grid grid-cols-2 gap-3">
          {juzList.map(juz => {
             const isDone = completedJuz.includes(juz);
             return (
               <div 
                  key={juz}
                  onClick={() => loadJuz(juz)}
                  className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
               >
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDone ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {juz}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Juz {juz}</h4>
                      <span className="text-[10px] text-gray-500">Baca Sekarang</span>
                    </div>
                 </div>
                 <button 
                  onClick={(e) => toggleKhatam(e, juz)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-transparent hover:border-emerald-400'}`}
                 >
                   <CheckIcon className="w-4 h-4" />
                 </button>
               </div>
             )
          })}
        </div>
      </div>
    );
  }

  const renderAyatList = () => {
    return (
      <div className="px-4 py-4 space-y-3 pb-24">
        {POPULAR_AYATS_REF.map((item, idx) => (
          <div 
            key={idx}
            onClick={loadPopularAyahs}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer group hover:border-emerald-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-600 font-bold rounded-full text-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-1">QS. {item.surah}:{item.ayah}</p>
              </div>
            </div>
            <div className="text-right">
               <PlayIcon className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
            </div>
          </div>
        ))}
        <div className="text-center text-xs text-gray-400 mt-4">
          Ketuk salah satu untuk memutar playlist ayat pilihan
        </div>
      </div>
    );
  };

  const renderDoaList = () => (
    <div className="px-4 py-4 space-y-3 pb-24">
      {DOA_LIST.map((doa) => (
        <div key={doa.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
             <HeartIcon className="w-5 h-5 text-pink-500" fill />
             <h3 className="font-bold text-gray-800">{doa.title}</h3>
          </div>
          <p className="font-arabic text-2xl text-right text-gray-800 leading-[2.2] mb-3">{doa.arabic}</p>
          <p className="text-emerald-700 text-sm font-medium italic mb-1">{doa.latin}</p>
          <p className="text-gray-600 text-sm">{doa.translation}</p>
          <p className="text-xs text-gray-400 mt-2 text-right">{doa.source}</p>
        </div>
      ))}
    </div>
  );

  const renderReader = () => {
    if (!currentSurah) return null;

    // Check if it's a Juz (negative ID convention)
    const isJuzReading = currentSurah.number < 0;

    return (
      <div className="pb-40 bg-white min-h-screen">
        {/* Reader Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setView(AppView.HOME)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon />
          </button>
          <div className="text-center">
            <h2 className="font-bold text-gray-800">{currentSurah.englishName}</h2>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
               <span>{currentSurah.englishNameTranslation}</span>
               {isOfflineSaved && <span className="text-emerald-600 flex items-center gap-0.5">• <CheckIcon className="w-3 h-3"/> Offline</span>}
            </div>
          </div>
          <button 
            onClick={handleDownload}
            disabled={isOfflineSaved}
            className={`p-2 -mr-2 rounded-full ${isOfflineSaved ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {isOfflineSaved ? <CheckIcon /> : <DownloadIcon />}
          </button>
        </div>

        {/* Controls */}
        <div className="bg-emerald-50 p-3 border-b border-emerald-100 sticky top-[61px] z-10 shadow-sm">
          <div className="flex justify-between items-center max-w-sm mx-auto overflow-x-auto no-scrollbar gap-2">
             <button 
              onClick={playAll}
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-700 transition whitespace-nowrap"
            >
              <PlayIcon className="w-3 h-3" />
              Putar Semua
            </button>
            <div className="flex gap-1.5">
              <button 
                onClick={cycleSpeed}
                className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                title="Kecepatan Baca"
              >
                <GaugeIcon className="w-3 h-3" />
                {playbackSpeed}x
              </button>

              <button 
                onClick={() => setRepeatOne(!repeatOne)}
                className={`p-1.5 rounded-lg transition ${repeatOne ? 'bg-emerald-200 text-emerald-800' : 'text-gray-500 hover:bg-white'}`}
                title="Ulangi Ayat Ini"
              >
                <RepeatIcon className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setShowLatin(!showLatin)}
                className={`p-1.5 rounded-lg transition ${showLatin ? 'bg-emerald-200 text-emerald-800' : 'text-gray-500 hover:bg-white'}`}
                title="Tampilkan Latin"
              >
                <TypeIcon className="w-5 h-5" />
              </button>

               <button 
                onClick={() => setHideTranslation(!hideTranslation)}
                className={`p-1.5 rounded-lg transition ${hideTranslation ? 'bg-emerald-200 text-emerald-800' : 'text-gray-500 hover:bg-white'}`}
                title="Sembunyikan Arti"
              >
                {hideTranslation ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setBlurArabic(!blurArabic)}
                className={`p-1.5 rounded-lg transition ${blurArabic ? 'bg-emerald-200 text-emerald-800' : 'text-gray-500 hover:bg-white'}`}
                title="Mode Hafalan"
              >
                <BrainIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bismillah (Only show for Surahs, not custom playlist or Juz Reading which handles headers internally) */}
        {!isJuzReading && currentSurah.number !== 0 && (
          <div className="text-center py-8 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
            <p className="font-arabic text-3xl text-gray-800">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          </div>
        )}

        {/* Ayah List */}
        <div className="px-4 space-y-8 mt-4">
          {currentSurah.ayahs.map((ayah, index) => {
            const isPlayingThis = playingAyah?.number === ayah.number && isPlaying;
            const isBlur = blurArabic && !revealedAyahs.has(ayah.number);

            // Determine if we need to show a Surah Header (For Juz Reading)
            let showSurahHeader = false;
            let headerName = "";
            if (isJuzReading && ayah.surah) {
               // Show if first ayah in list, or if surah number changed from previous
               if (index === 0 || currentSurah.ayahs[index - 1].surah?.number !== ayah.surah.number) {
                 showSurahHeader = true;
                 headerName = ayah.surah.englishName;
               }
            }

            return (
              <React.Fragment key={ayah.number}>
                {showSurahHeader && (
                  <div className="mt-8 mb-6 text-center">
                    <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 mb-2 tracking-widest uppercase">
                       Surah
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{headerName}</h3>
                    {ayah.surah?.number !== 1 && ( // Don't show Bismillah for Al-Fatihah again
                      <p className="font-arabic text-2xl text-gray-600">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                    )}
                    <hr className="my-4 border-gray-200"/>
                  </div>
                )}

                <div 
                  id={`ayah-${ayah.number}`}
                  className={`py-4 border-b border-gray-100 last:border-0 transition-all duration-500 ${isPlayingThis ? 'bg-emerald-50/70 -mx-4 px-4 rounded-xl scale-[1.01] shadow-sm' : ''}`}
                >
                  {/* Actions Bar */}
                  <div className="flex justify-between items-center mb-4">
                    <div className={`h-8 px-3 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isPlayingThis ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {ayah.description ? <span className="mr-1">{ayah.description}</span> : ayah.numberInSurah}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleTadabbur(ayah)}
                        className="p-1.5 text-amber-500 bg-amber-50 rounded-full hover:bg-amber-100 transition-colors"
                        title="Tadabbur AI"
                      >
                        <SparklesIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => playAyah(ayah)}
                        className={`p-1.5 rounded-full transition-colors ${isPlayingThis ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}
                      >
                        {isPlayingThis ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text - KARAOKE EFFECT */}
                  <div 
                    className="text-right w-full mb-3 cursor-pointer relative"
                    onClick={() => {
                      if (blurArabic) {
                        const newSet = new Set(revealedAyahs);
                        if (newSet.has(ayah.number)) newSet.delete(ayah.number);
                        else newSet.add(ayah.number);
                        setRevealedAyahs(newSet);
                      }
                    }}
                  >
                    <p className={`font-arabic text-3xl leading-[2.5] transition-colors duration-200 ${isPlayingThis ? 'text-emerald-600 drop-shadow-sm' : 'text-gray-900'} ${isBlur ? 'blur-md select-none opacity-40' : 'blur-0 opacity-100'}`}>
                      {ayah.text}
                    </p>
                    {isBlur && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs bg-black/10 px-2 py-1 rounded text-gray-600">Ketuk untuk melihat</span>
                      </div>
                    )}
                  </div>

                  {/* Transliteration (Latin) */}
                  {showLatin && ayah.latin && (
                    <p className={`text-sm italic mb-2 transition-colors ${isPlayingThis ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                      {ayah.latin}
                    </p>
                  )}

                  {/* Translation */}
                  {!hideTranslation && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {ayah.translation}
                    </p>
                  )}

                  {/* Tadabbur AI Result Area */}
                  {tadabburContent && tadabburContent.ayah === ayah.number && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-2 text-amber-800 font-semibold text-sm">
                        <SparklesIcon className="w-4 h-4" /> Tadabbur AI
                      </div>
                      <div className="text-gray-800 text-sm leading-relaxed">
                        {tadabburContent.text}
                      </div>
                    </div>
                  )}
                  {tadabburLoading && tadabburContent === null && playingAyah?.number === ayah.number /* trick to show loading nearby? no, need better logic */ }
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Tadabbur Loading Overlay */}
        {tadabburLoading && (
           <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 z-50">
             <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             Sedang merenungkan ayat...
           </div>
        )}
      </div>
    );
  };

  // --- Main Layout ---

  const renderContent = () => {
    switch (homeTab) {
      case HomeTab.POPULAR:
      case HomeTab.ALL:
        return renderSurahList();
      case HomeTab.KHATAM:
        return renderKhatamTracker();
      case HomeTab.AYAT:
        return renderAyatList();
      case HomeTab.DOA:
        return renderDoaList();
      default:
        return renderSurahList();
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl overflow-hidden font-sans">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded} 
        className="hidden"
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Memuat...</p>
        </div>
      )}

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        currentReciter={currentReciter}
        onSelectReciter={(id) => {
          setCurrentReciter(id);
          // If in reader view, reload to get new audio links
          if (view === AppView.READER && currentSurah) {
            if (currentSurah.number === 0) {
              loadPopularAyahs();
            } else if (currentSurah.number < 0) {
              loadJuz(Math.abs(currentSurah.number));
            } else {
              loadSurah(currentSurah.number);
            }
          }
        }}
      />

      {/* Main Content Area */}
      {view === AppView.HOME && (
        <div className="min-h-screen bg-[#f5f5f4]">
          {renderHomeHeader()}
          {renderContent()}
        </div>
      )}
      
      {view === AppView.READER && renderReader()}

      {/* Sticky Bottom Player (Only visible if something is playing or paused but active) */}
      {playingAyah && view === AppView.READER && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                {repeatOne && <RepeatIcon className="w-3 h-3"/>}
                Sedang memutar
              </span>
              <span className="text-sm text-gray-800 truncate max-w-[200px] font-medium">
                {currentSurah?.number === 0 ? playingAyah.description : `QS. ${currentSurah?.englishName} : ${playingAyah.numberInSurah}`}
              </span>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                   // Toggle Play Next or Previous could be added here
                   playNextAyah();
                }}
                className="text-gray-400 hover:text-gray-600 rotate-180"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button 
                onClick={() => {
                  if(isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
                  else { audioRef.current?.play(); setIsPlaying(true); }
                }}
                className="w-12 h-12 bg-emerald-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button 
                 onClick={playNextAyah}
                 className="text-gray-400 hover:text-gray-600"
              >
                <ChevronLeftIcon className="w-6 h-6 rotate-180" />
              </button>
           </div>
        </div>
      )}
      
      {/* Bottom Nav (Only on Home) */}
      {view === AppView.HOME && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around py-3 z-30 text-xs font-medium text-gray-500 shadow-lg">
          <button className="flex flex-col items-center gap-1 text-emerald-600">
            <BookOpenIcon className="w-6 h-6" />
            <span>Baca</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-emerald-600 transition-colors opacity-50 cursor-not-allowed">
            <BrainIcon className="w-6 h-6" />
            <span>Hafalan</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
