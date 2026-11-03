import React from 'react';
import { useApp } from '../context/AppContext';

export const SeasonalDecor: React.FC = () => {
  const { seasonTheme } = useApp();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {/* MÙA TẾT: Hoa mai vàng, đèn lồng và câu chúc */}
      {seasonTheme === 'tet' && (
        <>
          {/* Đèn lồng đỏ treo góc trên */}
          <div className="absolute top-0 left-6 flex flex-col items-center animate-sway origin-top">
            <div className="w-1 h-8 bg-amber-600"></div>
            <div className="w-10 h-14 bg-gradient-to-b from-red-600 to-red-800 rounded-full border border-amber-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-amber-300">TẾT</span>
            </div>
            <div className="w-1.5 h-6 bg-amber-400 mt-0.5"></div>
          </div>

          <div className="absolute top-0 right-6 flex flex-col items-center animate-sway origin-top" style={{ animationDelay: '1.5s' }}>
            <div className="w-1 h-8 bg-amber-600"></div>
            <div className="w-10 h-14 bg-gradient-to-b from-red-600 to-red-800 rounded-full border border-amber-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-amber-300">XUÂN</span>
            </div>
            <div className="w-1.5 h-6 bg-amber-400 mt-0.5"></div>
          </div>

          {/* Cành mai vàng góc trên */}
          <div className="absolute top-1 left-24 hidden md:flex items-center gap-1.5 text-amber-400 text-xs font-serif bg-red-950/60 border border-red-700/50 px-3 py-1 rounded-full backdrop-blur-sm">
            <span>🌸</span>
            <span className="text-amber-200">Xuân Như Ý - Trọn Vẹn Tâm Tình Thầy Trò Á Châu</span>
            <span>🌸</span>
          </div>

          {/* Cánh hoa mai rơi nhẹ */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-amber-400 text-base opacity-75 select-none animate-float"
                style={{
                  top: `${(i * 17) % 95}%`,
                  left: `${(i * 23) % 96}%`,
                  animationDuration: `${4 + (i % 5)}s`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                🌸
              </span>
            ))}
          </div>
        </>
      )}

      {/* MÙA GIÁNG SINH: Tuyết rơi, nơ đỏ, cây thông */}
      {seasonTheme === 'xmas' && (
        <>
          <div className="absolute top-2 left-6 hidden md:flex items-center gap-2 text-emerald-300 text-xs font-serif bg-emerald-950/70 border border-emerald-700/60 px-3 py-1 rounded-full">
            <span>🎄</span>
            <span className="text-stone-200">Giáng Sinh An Lành & Ấm Áp Cùng Đại Gia Đình GAIE</span>
            <span>🔔</span>
          </div>

          {/* Tuyết rơi rải rác */}
          <div className="absolute inset-0">
            {[...Array(18)].map((_, i) => (
              <span
                key={i}
                className="absolute text-white text-xs opacity-70 select-none animate-float"
                style={{
                  top: `${(i * 13) % 92}%`,
                  left: `${(i * 19) % 98}%`,
                  animationDuration: `${3.5 + (i % 4)}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                ❄️
              </span>
            ))}
          </div>
        </>
      )}

      {/* MÙA THƯỜNG: Ánh nắng ấm áp dịu dàng */}
      {seasonTheme === 'normal' && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      )}
    </div>
  );
};
