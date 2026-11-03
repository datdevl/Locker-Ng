import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode, Download, ExternalLink, RefreshCw } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>(() => {
    return window.location.href;
  });

  // Sinh mã QR THẬT 100% bằng thư viện qrcode chuẩn quốc tế
  useEffect(() => {
    if (!isQrModalOpen) return;

    QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#261208', // Màu nâu gỗ sồi truyền thống
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Lỗi sinh mã QR:', err);
      });
  }, [qrUrl, isQrModalOpen]);

  if (!isQrModalOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    showToast('Đã sao chép liên kết vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-[#2e180f] via-[#1f0e08] to-black border-2 border-amber-500/80 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.9)] text-stone-100 relative text-center">
        
        {/* NÚT ĐÓNG */}
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-lg">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-200">
          Mã QR Quét Thật 100%
        </h3>
        <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
          Dùng camera điện thoại hoặc Zalo quét trực tiếp mã này trên màn hình để vào phòng Locker ngay!
        </p>

        {/* ẢNH MÃ QR THẬT CHUẨN ISO 18004 */}
        <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-amber-600/80">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Mã QR Truy Cập Thật"
              className="w-52 h-52 mx-auto rounded-lg"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-xs text-stone-600 font-mono">
              Đang tạo mã QR...
            </div>
          )}
          <p className="text-[10px] text-stone-500 font-sans mt-1.5 font-bold tracking-wider">
            ★ TẬP ĐOÀN GIÁO DỤC QUỐC TẾ Á CHÂU ★
          </p>
        </div>

        {/* Ô NHẬP & SAO CHÉP LIÊN KẾT */}
        <div className="space-y-2 text-left mb-4">
          <label className="block text-[11px] text-stone-400">
            Địa chỉ URL được mã hóa vào QR:
          </label>
          <div className="bg-black/60 border border-amber-800/60 p-2 rounded-xl flex items-center justify-between text-xs text-stone-300">
            <input
              type="text"
              value={qrUrl}
              onChange={(e) => setQrUrl(e.target.value)}
              className="w-full bg-transparent text-amber-300 font-mono text-[11px] focus:outline-none pr-2"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-amber-700 hover:bg-amber-600 text-wood-950 px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>

        {/* CÁC NÚT THAO TÁC: TẢI ẢNH QR VỀ IN */}
        <div className="flex gap-2">
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="Ma-QR-Locker-GAIE.png"
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-wood-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh QR Về Để In</span>
            </a>
          )}
          <button
            onClick={() => setQrUrl(window.location.href)}
            title="Lấy lại URL hiện tại"
            className="p-2.5 bg-[#3a1d11] hover:bg-[#4a2617] border border-amber-600/50 rounded-xl text-amber-300 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-stone-400 space-y-1 text-left bg-black/40 p-3 rounded-xl border border-stone-800 mt-4">
          <p className="font-semibold text-amber-300">💡 Lưu ý khi đưa vào vận hành:</p>
          <p>- Khi bạn đẩy lên GitHub Pages (`https://...`), mã QR sẽ tự động khớp với đường dẫn web của trường.</p>
          <p>- In mã này dán tại bảng tin giáo viên IPS & SIU để nhân viên quét vào trải nghiệm!</p>
        </div>

      </div>
    </div>
  );
};
