import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  QrCode, 
  Volume2, 
  CloudRain, 
  Radio, 
  ShieldCheck, 
  Mail, 
  Home, 
  HeartHandshake,
  Sliders,
  Database
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    seasonTheme, 
    setSeasonTheme,
    isRainActive, 
    toggleRain, 
    isLofiActive, 
    toggleLofi,
    volume,
    setVolume,
    setIsQrModalOpen,
    setIsPrModalOpen,
    setIsSupabaseModalOpen,
    isCloudConnected,
    letters,
    myLocker
  } = useApp();

  const [showAudioControls, setShowAudioControls] = useState(false);

  // Số lượng thư đang chờ PR xử lý
  const pendingCount = letters.filter(l => l.status === 'Đã gửi' || l.status === 'Đang xử lý').length;

  return (
    <header className="relative z-30 bg-wood-950/90 border-b border-amber-900/40 backdrop-blur-md px-4 py-3 text-stone-200 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* LOGO & BRANDING */}
        <div 
          onClick={() => setCurrentView('locker-room')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-wood-900 border border-amber-500/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
            <span className="text-xl">🏫</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-300 text-sm md:text-base tracking-wide">
                GAIE • TẬP ĐOÀN Á CHÂU
              </span>
              <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800/60 px-1.5 py-0.2 rounded">
                Nội Bộ
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans">
              Hành Lang Locker & Trạm Chữa Lành
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="flex items-center gap-1.5 bg-wood-900/80 p-1 rounded-xl border border-amber-900/50 shadow-inner">
          <button
            onClick={() => setCurrentView('locker-room')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              currentView === 'locker-room'
                ? 'bg-amber-800 text-amber-100 shadow-sm border border-amber-600/50 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-wood-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Phòng Locker</span>
            {myLocker?.hasUnreadReply && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setCurrentView('nghe-ban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              currentView === 'nghe-ban'
                ? 'bg-amber-800 text-amber-100 shadow-sm border border-amber-600/50 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-wood-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Nghe Bạn (Góp ý)</span>
          </button>

          <button
            onClick={() => setCurrentView('tram-chua-lanh')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              currentView === 'tram-chua-lanh'
                ? 'bg-emerald-900/90 text-emerald-100 shadow-sm border border-emerald-600/50 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-wood-800/60'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Trạm Chữa Lành</span>
          </button>
        </nav>

        {/* TOOLS & CONTROLS */}
        <div className="flex items-center gap-2">
          
          {/* SUPABASE CLOUD STATUS PILL */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            title="Trạng thái kết nối Supabase Cloud"
            className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition ${
              isCloudConnected
                ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-amber-950/60 border-amber-700/60 text-amber-300 hover:bg-amber-900/80'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">
              {isCloudConnected ? 'Cloud Online' : 'Kết nối Supabase'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
          </button>

          {/* AUDIO CONTROLS TOGGLE */}
          <div className="relative">
            <button
              onClick={() => setShowAudioControls(!showAudioControls)}
              title="Cài đặt âm thanh thư giãn"
              className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
                isRainActive || isLofiActive
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-wood-900 border-amber-900/60 text-stone-300 hover:text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {(isRainActive || isLofiActive) && (
                <span className="text-[10px] hidden sm:inline font-mono">Bật</span>
              )}
            </button>

            {/* Audio Dropdown Popover */}
            {showAudioControls && (
              <div className="absolute right-0 mt-2 w-64 bg-wood-950 border-2 border-amber-800/80 rounded-2xl p-3.5 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-amber-900/60 mb-2">
                  <span className="font-semibold text-amber-200 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Âm Thanh Thư Giãn
                  </span>
                  <button 
                    onClick={() => setShowAudioControls(false)}
                    className="text-stone-400 hover:text-stone-100 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-300">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" /> Tiếng Mưa Trường
                    </span>
                    <button
                      onClick={toggleRain}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                        isRainActive ? 'bg-sky-700 text-white' : 'bg-wood-800 text-stone-400'
                      }`}
                    >
                      {isRainActive ? 'Đang bật' : 'Tắt'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-300">
                      <Radio className="w-3.5 h-3.5 text-amber-400" /> Radio Lofi Á Châu
                    </span>
                    <button
                      onClick={toggleLofi}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                        isLofiActive ? 'bg-amber-700 text-white' : 'bg-wood-800 text-stone-400'
                      }`}
                    >
                      {isLofiActive ? 'Đang bật' : 'Tắt'}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-amber-900/60">
                    <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                      <span>Âm lượng</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEASON THEME TOGGLE */}
          <div className="flex items-center bg-wood-900/90 rounded-lg border border-amber-900/60 p-0.5">
            <button
              onClick={() => setSeasonTheme('tet')}
              title="Chủ đề Tết Nguyên Đán"
              className={`p-1.5 rounded text-xs transition ${seasonTheme === 'tet' ? 'bg-red-900 text-amber-300' : 'text-stone-400 hover:text-white'}`}
            >
              🌸
            </button>
            <button
              onClick={() => setSeasonTheme('xmas')}
              title="Chủ đề Giáng Sinh"
              className={`p-1.5 rounded text-xs transition ${seasonTheme === 'xmas' ? 'bg-emerald-900 text-stone-100' : 'text-stone-400 hover:text-white'}`}
            >
              ❄️
            </button>
            <button
              onClick={() => setSeasonTheme('normal')}
              title="Chủ đề Tựu Trường"
              className={`p-1.5 rounded text-xs transition ${seasonTheme === 'normal' ? 'bg-amber-800 text-amber-100' : 'text-stone-400 hover:text-white'}`}
            >
              ☀️
            </button>
          </div>

          {/* QR CODE BUTTON */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            title="Mở mã QR quét trên điện thoại"
            className="p-2 rounded-lg bg-wood-900 hover:bg-wood-800 border border-amber-900/60 text-stone-300 hover:text-white transition flex items-center gap-1 text-xs"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Quét QR</span>
          </button>

          {/* OPERATOR / PR DASHBOARD PORTAL */}
          <button
            onClick={() => setIsPrModalOpen(true)}
            title="Bảng điều phối phản hồi dành cho Ban PR Nội Bộ"
            className="p-2 rounded-lg bg-amber-950/70 hover:bg-amber-900/90 border border-amber-700/60 text-amber-200 transition flex items-center gap-1.5 text-xs font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Ban PR</span>
            {pendingCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
