import React from 'react';
import { Reciter } from '../types';
import { RECITERS } from '../services/quranService';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Pilih Qori (Reciter)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {RECITERS.map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => {
                onSelectReciter(reciter.id);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-colors flex items-center justify-between ${
                currentReciter === reciter.id
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div>
                <div className="font-semibold">{reciter.name}</div>
                <div className="text-xs text-gray-500">{reciter.style}</div>
              </div>
              {currentReciter === reciter.id && (
                <span className="text-emerald-600 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
        <div className="p-4 bg-gray-50 text-center">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
