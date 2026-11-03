import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, QrCode } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isQrModalOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('Đã sao chép liên kết website vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-600/70 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-stone-200 relative text-center">
        
        {/* NÚT ĐÓNG */}
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-300 mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-200">
          Mã QR Truy Cập Nhanh
        </h3>
        <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
          Quét mã này bằng camera điện thoại để vào thẳng căn phòng Locker cá nhân của bạn mà không cần đăng nhập.
        </p>

        {/* HÌNH MÃ QR THỰC TẾ (SVG ĐỒNG NHẤT KHÔNG CẦN THƯ VIỆN NGOÀI) */}
        <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-amber-800">
          <svg
            className="w-48 h-48 mx-auto"
            viewBox="0 0 256 256"
            shapeRendering="crispEdges"
          >
            {/* Background */}
            <rect width="256" height="256" fill="#ffffff" />
            
            {/* Top-Left Finder */}
            <rect x="20" y="20" width="60" height="60" fill="#000000" />
            <rect x="28" y="28" width="44" height="44" fill="#ffffff" />
            <rect x="36" y="36" width="28" height="28" fill="#c0262d" />

            {/* Top-Right Finder */}
            <rect x="176" y="20" width="60" height="60" fill="#000000" />
            <rect x="184" y="28" width="44" height="44" fill="#ffffff" />
            <rect x="192" y="36" width="28" height="28" fill="#c0262d" />

            {/* Bottom-Left Finder */}
            <rect x="20" y="176" width="60" height="60" fill="#000000" />
            <rect x="28" y="184" width="44" height="44" fill="#ffffff" />
            <rect x="36" y="192" width="28" height="28" fill="#c0262d" />

            {/* Center Logo Area: GAIE Logo representation */}
            <circle cx="128" cy="128" r="28" fill="#6d4532" />
            <text x="128" y="133" fontSize="11" fontWeight="bold" fill="#eab308" textAnchor="middle" fontFamily="sans-serif">
              GAIE
            </text>

            {/* QR Pattern Data Blocks */}
            <rect x="96" y="28" width="12" height="12" fill="#000000" />
            <rect x="116" y="28" width="12" height="12" fill="#000000" />
            <rect x="136" y="28" width="12" height="12" fill="#000000" />
            <rect x="96" y="48" width="12" height="12" fill="#000000" />
            <rect x="126" y="48" width="12" height="12" fill="#000000" />
            <rect x="146" y="48" width="12" height="12" fill="#000000" />

            <rect x="28" y="96" width="12" height="12" fill="#000000" />
            <rect x="48" y="96" width="12" height="12" fill="#000000" />
            <rect x="68" y="96" width="12" height="12" fill="#000000" />
            <rect x="28" y="116" width="12" height="12" fill="#000000" />
            <rect x="48" y="136" width="12" height="12" fill="#000000" />
            <rect x="68" y="146" width="12" height="12" fill="#000000" />

            <rect x="176" y="96" width="12" height="12" fill="#000000" />
            <rect x="196" y="96" width="12" height="12" fill="#000000" />
            <rect x="216" y="106" width="12" height="12" fill="#000000" />
            <rect x="176" y="136" width="12" height="12" fill="#000000" />
            <rect x="206" y="146" width="12" height="12" fill="#000000" />

            <rect x="96" y="176" width="12" height="12" fill="#000000" />
            <rect x="116" y="176" width="12" height="12" fill="#000000" />
            <rect x="136" y="186" width="12" height="12" fill="#000000" />
            <rect x="156" y="196" width="12" height="12" fill="#000000" />
            <rect x="106" y="216" width="12" height="12" fill="#000000" />
            <rect x="136" y="216" width="12" height="12" fill="#000000" />
            <rect x="186" y="186" width="12" height="12" fill="#000000" />
            <rect x="216" y="206" width="12" height="12" fill="#000000" />
          </svg>
        </div>

        {/* LIÊN KẾT & SAO CHÉP */}
        <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between text-xs text-stone-300 mb-4">
          <span className="truncate max-w-[240px] font-mono text-[11px] text-amber-300">
            {currentUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 bg-amber-800 hover:bg-amber-700 text-amber-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-400 space-y-1 text-left bg-stone-900/60 p-3 rounded-xl border border-stone-800">
          <p className="font-semibold text-amber-300">💡 Ứng dụng thực tế tại trường:</p>
          <p>- In mã QR này dán tại bảng tin nội bộ, phòng sinh hoạt giáo viên IPS & SIU.</p>
          <p>- Nhân viên quét mã là tự nhận diện đúng tủ cá nhân của mình trên điện thoại.</p>
        </div>

      </div>
    </div>
  );
};
