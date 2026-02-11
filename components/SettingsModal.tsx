import React, { useState, useEffect } from 'react';
import { Reciter } from '../types';
import { RECITERS } from '../services/quranService';
import { getUserApiKey, saveUserApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReciter: string;
  onSelectReciter: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentReciter,
  onSelectReciter,
}) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(getUserApiKey());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveUserApiKey(apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Pengaturan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-6">
          {/* API Key Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gemini API Key (Opsional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Masukkan API Key Anda sendiri jika fitur Tadabbur AI tidak berjalan atau limit habis.
            </p>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan API Key..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <hr className="border-gray-100" />

          {/* Reciter Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Qori (Reciter)
            </label>
            <div className="space-y-1">
              {RECITERS.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => onSelectReciter(reciter.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                    currentReciter === reciter.id
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{reciter.name}</div>
                    <div className="text-[10px] text-gray-500">{reciter.style}</div>
                  </div>
                  {currentReciter === reciter.id && (
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={handleSave}
            className="w-full py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
};