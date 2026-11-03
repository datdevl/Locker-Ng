import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';
import { 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const LockerModal: React.FC = () => {
  const { 
    selectedLocker, 
    setSelectedLocker, 
    setCurrentView, 
    myLetters, 
    lockers 
  } = useApp();

  const [readingLetterId, setReadingLetterId] = useState<string | null>(null);

  if (!selectedLocker) return null;

  const currentLockerData = lockers.find(l => l.id === selectedLocker.id) || selectedLocker;
  const lettersWithReplies = myLetters.filter(l => l.status === 'Đã phản hồi');
  const activeReadingLetter = myLetters.find(l => l.id === readingLetterId) || lettersWithReplies[0] || null;

  const handleOpenNgheBan = () => {
    setSelectedLocker(null);
    setCurrentView('nghe-ban');
  };

  const handleOpenChuaLanh = () => {
    setSelectedLocker(null);
    setCurrentView('tram-chua-lanh');
  };

  const handleReadLetter = (letterId: string) => {
    setReadingLetterId(letterId);
    storage.markLockerReplyRead(selectedLocker.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative bg-gradient-to-b from-wood-900 via-wood-950 to-black border-4 border-amber-600/60 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.9)] text-stone-100">
        
        {/* NÚT ĐÓNG */}
        <button
          onClick={() => setSelectedLocker(null)}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TIÊU ĐỀ NỘI DUNG TỦ */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs mb-2">
            <span>TỦ CÁ NHÂN #{currentLockerData.number}</span>
            <span>•</span>
            <span>{currentLockerData.campus}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-200">
            Xin chào, {currentLockerData.alias}!
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-md mx-auto">
            Đây là không gian riêng tư được bảo mật tuyệt đối của bạn. Hôm nay bạn muốn gửi gắm điều gì?
          </p>
        </div>

        {/* THÔNG BÁO LÁ THƯ HỒI ÂM NẾU CÓ */}
        {currentLockerData.hasUnreadReply && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-amber-950 to-red-950/90 border-2 border-red-500/70 shadow-lg flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💌</span>
              <div>
                <p className="font-serif font-bold text-amber-200 text-sm">
                  Ban PR Nội Bộ vừa gửi thư hồi âm cho bạn!
                </p>
                <p className="text-[11px] text-stone-300">
                  Ý kiến đóng góp của bạn đã được các phòng ban liên quan giải quyết chu đáo.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (lettersWithReplies.length > 0) {
                  handleReadLetter(lettersWithReplies[0].id);
                } else {
                  handleOpenNgheBan();
                }
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-md shrink-0"
            >
              Mở Đọc Ngay
            </button>
          </div>
        )}

        {/* XEM THƯ PHẢN HỒI CHI TIẾT DẠNG GIẤY DA (NẾU ĐANG CHỌN ĐỌC) */}
        {readingLetterId && activeReadingLetter && (
          <div className="mb-6 p-5 rounded-2xl parchment-paper text-stone-900 border-2 border-amber-700/60 shadow-inner">
            <div className="flex justify-between items-center border-b border-amber-900/30 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <span className="font-serif font-bold text-amber-950 text-sm md:text-base">
                  Thư Hồi Âm Từ Ban PR Nội Bộ Á Châu
                </span>
              </div>
              <button
                onClick={() => setReadingLetterId(null)}
                className="text-xs text-amber-900 hover:text-black font-semibold underline"
              >
                Đóng Thư
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-2">
              <span className="font-semibold">Về việc:</span> {activeReadingLetter.title}
            </p>

            <div className="bg-white/70 p-3 rounded-xl border border-amber-200 text-xs md:text-sm text-stone-800 leading-relaxed font-serif my-2 whitespace-pre-wrap">
              {activeReadingLetter.prReply?.content}
            </div>

            <div className="flex justify-between items-center text-[11px] text-stone-600 pt-2 border-t border-amber-900/20">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                {activeReadingLetter.prReply?.responder}
              </span>
              <span>{activeReadingLetter.prReply?.replyDate}</span>
            </div>
          </div>
        )}

        {/* 2 BẢNG GỖ ĐIỀU HƯỚNG CỐT LÕI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* LỰA CHỌN 1: NGHE BẠN */}
          <div
            onClick={handleOpenNgheBan}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-amber-900/70 via-wood-900 to-amber-950 border-2 border-amber-600/50 hover:border-amber-400 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-800/60 border border-amber-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                📬
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/40">
                Góp ý nội bộ
              </span>
            </div>

            <div className="my-3">
              <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition">
                Mục "Nghe Bạn"
              </h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Soạn thư tay gửi bồ câu đến Ban PR Nội bộ & Ban Giám Hiệu. Nhận hồi âm trực tiếp vào chiếc tủ này.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition">
              <span>Mở giấy da viết thư</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* LỰA CHỌN 2: TRẠM CHỮA LÀNH */}
          <div
            onClick={handleOpenChuaLanh}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-wood-950 to-stone-900 border-2 border-emerald-700/50 hover:border-emerald-400 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                🌿
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/40">
                Chữa lành & An yên
              </span>
            </div>

            <div className="my-3">
              <h3 className="text-lg font-serif font-bold text-emerald-100 group-hover:text-emerald-300 transition">
                Mục "Trạm Chữa Lành"
              </h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Đốt cháy muộn phiền, nghe Radio Lofi Á Châu, gửi cái ôm cho đồng nghiệp và tư vấn tâm lý kín đáo.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition">
              <span>Bước vào góc bình yên</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
