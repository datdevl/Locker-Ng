import React, { useState, useEffect, useRef } from 'react';
import { useApp, TimeOfDay } from '../context/AppContext';
import { LockerItem } from '../utils/storage';
import { LockerDoor3D } from './LockerDoor3D';
import gsap from 'gsap';
import { 
  KeyRound, 
  HelpCircle, 
  Shuffle, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon
} from 'lucide-react';

const RANDOM_ALIASES = [
  'Cánh Én Vàng', 'Mầm Cây Nhỏ', 'Ngọn Hải Đăng', 'Hoa Hướng Dương',
  'Gió Mùa Thu', 'Đom Đóm Đêm', 'Họa Mi Á Châu', 'Ánh Sao Mai',
  'Trà Hoa Cúc', 'Sách Cổ Nâu', 'Búp Sen Xanh', 'Giọt Nắng Sớm'
];

export const LockerRoom: React.FC = () => {
  const { 
    lockers, 
    myLocker, 
    claimLocker, 
    recoverLocker, 
    setSelectedLocker, 
    recoveryWords,
    timeOfDay,
    setTimeOfDay
  } = useApp();

  const [filterCampus, setFilterCampus] = useState<string>('Tất Cả');
  const [claimTarget, setClaimTarget] = useState<LockerItem | null>(null);
  const [aliasInput, setAliasInput] = useState<string>('');
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [recoveryInputWords, setRecoveryInputWords] = useState<string>('');
  const [lockedNoticeLocker, setLockedNoticeLocker] = useState<LockerItem | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng GSAP xuất hiện mềm mại cho dãy tủ
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: 'back.out(1.2)' }
      );
    }
  }, [filterCampus]);

  const filteredLockers = lockers.filter(l => {
    if (filterCampus === 'Tất Cả') return true;
    return l.campus === filterCampus;
  });

  const handleLockerClick = (locker: LockerItem) => {
    if (locker.isVacant) {
      setClaimTarget(locker);
      setAliasInput(RANDOM_ALIASES[Math.floor(Math.random() * RANDOM_ALIASES.length)]);
      return;
    }

    if (locker.isOwnedByMe) {
      setSelectedLocker(locker);
      return;
    }

    // Tủ của người khác
    setLockedNoticeLocker(locker);
  };

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTarget || !aliasInput.trim()) return;

    const res = claimLocker(claimTarget.id, aliasInput.trim());
    if (res.success) {
      const updated = { ...claimTarget, alias: aliasInput.trim(), isOwnedByMe: true, isVacant: false };
      setClaimTarget(null);
      setSelectedLocker(updated);
    }
  };

  const handleRandomAlias = () => {
    const picked = RANDOM_ALIASES[Math.floor(Math.random() * RANDOM_ALIASES.length)];
    setAliasInput(picked);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryInputWords.trim()) return;
    const ok = recoverLocker(recoveryInputWords.trim());
    if (ok) {
      setShowRecoveryInput(false);
      setRecoveryInputWords('');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] p-4 md:p-8 flex flex-col items-center z-10">
      
      {/* KHUNG CẢNH GAME 2D: BIỂN HIỆU TRƯỜNG & ĐIỀU KHIỂN THỜI KHẮC */}
      <div className="max-w-5xl w-full flex flex-col items-center mb-6 text-center">
        
        {/* BIỂN HIỆU GỖ TRUYỀN THỐNG Á CHÂU */}
        <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#4d2818] via-[#6d3c22] to-[#4d2818] border-2 border-amber-400/70 px-6 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.6)] mb-3">
          <span className="text-xl">🏛️</span>
          <span className="font-serif font-bold text-amber-200 tracking-wider text-sm md:text-base drop-shadow">
            HÀNH LANG TỦ LOCKER NỘI BỘ • GAIE
          </span>
          <span className="text-xl">🔑</span>
        </div>

        <p className="text-xs md:text-sm text-stone-200 drop-shadow max-w-xl font-medium">
          Mỗi chiếc tủ là một không gian cá nhân được bảo vệ bằng cơ chế mã hóa thiết bị riêng. Chọn tủ của bạn để mở khóa.
        </p>

        {/* BỘ CHUYỂN ĐỔI KHÔNG GIAN BẦU TRỜI & THỜI GIAN THẬT */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-900/60 shadow-lg">
          <span className="text-[11px] text-amber-300 font-serif mr-1">Thời khắc:</span>
          
          <button
            onClick={() => setTimeOfDay('dawn')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              timeOfDay === 'dawn' ? 'bg-rose-900 text-rose-200 border border-rose-500 shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Sunrise className="w-3.5 h-3.5 text-rose-400" />
            <span>Bình Minh</span>
          </button>

          <button
            onClick={() => setTimeOfDay('day')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              timeOfDay === 'day' ? 'bg-sky-900 text-sky-200 border border-sky-400 shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>Ban Ngày</span>
          </button>

          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              timeOfDay === 'sunset' ? 'bg-amber-900 text-amber-200 border border-amber-500 shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span>Hoàng Hôn</span>
          </button>

          <button
            onClick={() => setTimeOfDay('night')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              timeOfDay === 'night' ? 'bg-indigo-950 text-indigo-200 border border-indigo-500 shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span>Ban Đêm</span>
          </button>
        </div>

        {/* BỘ LỌC CƠ SỞ TRƯỜNG & NÚT MỞ NHANH TỦ CỦA TÔI */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {['Tất Cả', 'IPS Á Châu', 'SIU Đại học', 'IAS Viện', 'Khối Văn Phòng'].map((campus) => (
            <button
              key={campus}
              onClick={() => setFilterCampus(campus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                filterCampus === campus
                  ? 'bg-amber-700 text-amber-100 border-amber-400 shadow-md font-bold'
                  : 'bg-black/50 text-stone-300 border-amber-900/40 hover:bg-black/70'
              }`}
            >
              {campus}
            </button>
          ))}

          {myLocker && (
            <button
              onClick={() => setSelectedLocker(myLocker)}
              className="ml-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-wood-950 hover:from-amber-300 hover:to-amber-400 transition flex items-center gap-1.5 shadow-xl animate-pulse"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Mở Tủ Của Tôi (#{myLocker.number})</span>
            </button>
          )}
        </div>
      </div>

      {/* DÃY TỦ LOCKER 3D GSAP TRONG PHÒNG GAME */}
      <div 
        ref={gridRef}
        className="max-w-5xl w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-6 p-5 md:p-8 bg-[#2d180f]/80 rounded-3xl border-4 border-[#4a2617] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-md"
      >
        {filteredLockers.map((locker) => (
          <LockerDoor3D
            key={locker.id}
            locker={locker}
            onClick={() => handleLockerClick(locker)}
          />
        ))}
      </div>

      {/* CHÂN TRANG: PHỤC HỒI MẬT MÃ 4 TỪ */}
      <div className="max-w-xl w-full mt-6 text-center text-xs text-stone-300 flex flex-col items-center gap-2">
        {recoveryWords && (
          <div className="bg-[#3e1f14]/80 border border-amber-500/60 px-4 py-2 rounded-2xl text-amber-200 flex items-center gap-2 shadow-lg">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Mật mã khẩn cấp thiết bị của bạn: </span>
            <code className="bg-black/60 px-2.5 py-0.5 rounded font-mono font-bold text-amber-300 border border-amber-600/50">
              {recoveryWords}
            </code>
          </div>
        )}

        <button
          onClick={() => setShowRecoveryInput(!showRecoveryInput)}
          className="text-stone-300 hover:text-amber-300 underline transition text-[11px] flex items-center gap-1 drop-shadow"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Bạn đổi máy tính hoặc dùng điện thoại mới? Bấm vào đây để nhập 4 từ bí mật</span>
        </button>

        {showRecoveryInput && (
          <form onSubmit={handleRecoverySubmit} className="mt-2 flex gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Nhập 4 từ bí mật (ví dụ: mai-vang-nang-am)..."
              value={recoveryInputWords}
              onChange={(e) => setRecoveryInputWords(e.target.value)}
              className="flex-1 bg-black/60 border border-amber-600/60 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 font-mono shadow-inner"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-wood-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg"
            >
              Khôi Phục Tủ
            </button>
          </form>
        )}
      </div>

      {/* MODAL 1: NHẬN TỦ TRỐNG & ĐẶT BÍ DANH */}
      {claimTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#3a1e12] to-[#1c0d07] border-2 border-amber-500/70 rounded-3xl p-6 max-w-md w-full shadow-2xl text-stone-100">
            <div className="text-center mb-5">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                {claimTarget.number} • {claimTarget.campus}
              </span>
              <h3 className="text-2xl font-serif font-bold text-amber-200 mt-1">
                Nhận Tủ Locker Của Bạn
              </h3>
              <p className="text-xs text-stone-300 mt-1.5">
                Hãy đặt một biệt danh ngộ nghĩnh để bảo đảm 100% tính ẩn danh khi gửi thư góp ý cho trường.
              </p>
            </div>

            <form onSubmit={handleConfirmClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Biệt danh ẩn danh của bạn:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    placeholder="Ví dụ: Hoa Hướng Dương, Gió Ban Mai..."
                    className="flex-1 bg-black/50 border border-amber-600/60 rounded-xl px-3.5 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleRandomAlias}
                    title="Đổi tên ngẫu nhiên"
                    className="p-2.5 bg-[#4d2818] hover:bg-[#5e321e] border border-amber-600/50 rounded-xl text-amber-300 transition"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[#241109] border border-amber-900/60 p-3 rounded-xl text-[11px] text-amber-200 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  🔒 Cam kết bảo mật của hệ thống:
                </p>
                <p className="text-stone-300">
                  - Thiết bị của bạn sẽ được cấp một khóa bí mật lưu trong máy.
                </p>
                <p className="text-stone-300">
                  - Bạn không cần nhập bất kỳ thông tin nào như email, số điện thoại hay họ tên thật.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-600 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-wood-950 font-bold text-xs shadow-lg transition"
                >
                  Nhận Tủ & Khóa Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THÔNG BÁO TỦ CỦA NGƯỜI KHÁC ĐANG KHÓA */}
      {lockedNoticeLocker && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#2a140b] border-2 border-stone-600 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center text-stone-200">
            <div className="w-14 h-14 bg-stone-900 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-3 text-2xl text-stone-400 shadow-inner">
              🔒
            </div>
            <h4 className="font-serif font-bold text-lg text-amber-200">
              Chiếc Tủ Đang Được Khóa
            </h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              Tủ <span className="font-mono font-bold text-amber-400">#{lockedNoticeLocker.number}</span> thuộc về đồng nghiệp mang bí danh <span className="italic font-semibold">"{lockedNoticeLocker.alias}"</span>. Để bảo vệ quyền riêng tư, chỉ chủ sở hữu của tủ mới có thể mở.
            </p>
            <p className="text-[11px] text-stone-400 mt-3">
              Nếu đây là tủ của bạn nhưng bạn đang dùng máy mới, hãy dùng tính năng khôi phục 4 từ bí mật ở cuối trang nhé!
            </p>
            <button
              onClick={() => setLockedNoticeLocker(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-xs font-semibold text-white transition shadow-lg"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
