import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LockerItem } from '../utils/storage';
import { sound } from '../utils/soundEngine';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  Shuffle, 
  HelpCircle
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
    recoveryWords
  } = useApp();

  const [filterCampus, setFilterCampus] = useState<string>('Tất Cả');
  const [claimTarget, setClaimTarget] = useState<LockerItem | null>(null);
  const [aliasInput, setAliasInput] = useState<string>('');
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [recoveryInputWords, setRecoveryInputWords] = useState<string>('');
  const [lockedNoticeLocker, setLockedNoticeLocker] = useState<LockerItem | null>(null);

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
      sound.playLockerOpen();
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
    <div className="relative min-h-[calc(100vh-70px)] bg-gradient-to-b from-wood-950 via-[#23150e] to-[#1a0e09] p-4 md:p-8 flex flex-col items-center">
      
      {/* KHUNG CẢNH 2D: Biển hiệu trường & ánh đèn hành lang */}
      <div className="max-w-5xl w-full flex flex-col items-center mb-6 text-center">
        
        {/* Biển hiệu gỗ vàng truyền thống Á Châu */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-950 via-wood-900 to-amber-950 border-2 border-amber-600/60 px-6 py-2.5 rounded-2xl shadow-2xl mb-3">
          <span className="text-xl">🏛️</span>
          <span className="font-serif font-bold text-amber-200 tracking-wider text-sm md:text-base">
            HÀNH LANG TỦ LOCKER NỘI BỘ • GAIE
          </span>
          <span className="text-xl">🔑</span>
        </div>

        <p className="text-xs md:text-sm text-stone-300 max-w-xl">
          Mỗi chiếc tủ là một không gian cá nhân được mã hóa riêng. Không cần đăng nhập, hoàn toàn bảo mật để bạn gửi gắm tâm tư hoặc tìm kiếm sự an yên.
        </p>

        {/* BỘ LỌC CƠ SỞ & NÚT TÌM TỦ CỦA TÔI */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {['Tất Cả', 'IPS Á Châu', 'SIU Đại học', 'IAS Viện', 'Khối Văn Phòng'].map((campus) => (
            <button
              key={campus}
              onClick={() => setFilterCampus(campus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                filterCampus === campus
                  ? 'bg-amber-700/80 text-amber-100 border-amber-500 shadow-sm'
                  : 'bg-wood-900/60 text-stone-300 border-amber-900/40 hover:bg-wood-800'
              }`}
            >
              {campus}
            </button>
          ))}

          {myLocker && (
            <button
              onClick={() => {
                sound.playLockerOpen();
                setSelectedLocker(myLocker);
              }}
              className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 text-wood-950 hover:bg-amber-400 transition flex items-center gap-1.5 shadow-lg animate-pulse"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Mở Tủ Của Tôi (#{myLocker.number})</span>
            </button>
          )}
        </div>
      </div>

      {/* DÃY TỦ LOCKER BẰNG GỖ 2D COZY */}
      <div className="max-w-5xl w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-wood-950/70 rounded-3xl border-4 border-amber-950 shadow-2xl backdrop-blur-md">
        {filteredLockers.map((locker) => {
          const isMine = locker.isOwnedByMe;

          return (
            <div
              key={locker.id}
              onClick={() => handleLockerClick(locker)}
              className={`group relative h-52 rounded-2xl border-2 flex flex-col justify-between p-3.5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 select-none ${
                isMine
                  ? 'bg-gradient-to-b from-amber-900/80 to-wood-950 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/30'
                  : locker.isVacant
                  ? 'bg-wood-900/30 border-dashed border-amber-700/40 hover:border-amber-400/80 hover:bg-wood-900/60'
                  : 'bg-gradient-to-b from-wood-900/90 to-wood-950 border-amber-950/90 hover:border-amber-800 opacity-90'
              }`}
            >
              {/* VÂN GỖ TRANG TRÍ & KHUNG SỐ */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-black/50 text-amber-300/90 border border-amber-900/50">
                  {locker.number}
                </span>

                <span className="text-[10px] text-stone-400 font-sans truncate max-w-[80px]">
                  {locker.campus.replace('Tập đoàn ', '')}
                </span>
              </div>

              {/* LÁ THƯ ĐỎ NHẤP NHÁY NẾU CÓ PHẢN HỒI MỚI TỪ BAN PR */}
              {locker.hasUnreadReply && isMine && (
                <div className="absolute -top-3.5 -right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-xl flex items-center gap-1 border border-red-300 animate-bounce z-20">
                  <span>💌</span>
                  <span>Có thư mới!</span>
                </div>
              )}

              {/* PHẦN GIỮA TỦ: KHÓA & BẢNG TÊN BÍ DANH */}
              <div className="my-auto text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-black/30 border border-amber-700/30 flex items-center justify-center text-2xl mb-1.5 shadow-inner group-hover:scale-110 transition">
                  {isMine ? (
                    <Unlock className="w-6 h-6 text-amber-400" />
                  ) : locker.isVacant ? (
                    <span className="text-amber-500/70 text-xl font-mono">+</span>
                  ) : (
                    <Lock className="w-5 h-5 text-stone-500" />
                  )}
                </div>

                <div className="w-full px-1">
                  {locker.isVacant ? (
                    <span className="text-xs text-amber-400 font-medium italic">
                      + Chạm để nhận tủ
                    </span>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-stone-200 truncate">
                        {locker.alias}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {isMine ? 'Tủ của bạn (Đã mở)' : 'Đã khóa riêng tư'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* BẢN LỀ GỖ & KHE THÔNG KHÍ TỦ 2D */}
              <div className="pt-2 border-t border-amber-950/80 flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="w-4 h-1 bg-stone-700/60 rounded-full" />
                  <div className="w-4 h-1 bg-stone-700/60 rounded-full" />
                </div>
                {isMine && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/40">
                    Sở hữu
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CHÂN TRANG: HƯỚNG DẪN BẢO MẬT & PHỤC HỒI MẬT MÃ 4 TỪ */}
      <div className="max-w-xl w-full mt-6 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
        {recoveryWords && (
          <div className="bg-amber-950/60 border border-amber-800/60 px-4 py-2 rounded-xl text-amber-200 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Mật mã khẩn cấp thiết bị của bạn: </span>
            <code className="bg-black/40 px-2 py-0.5 rounded font-mono font-bold text-amber-300">
              {recoveryWords}
            </code>
          </div>
        )}

        <button
          onClick={() => setShowRecoveryInput(!showRecoveryInput)}
          className="text-stone-400 hover:text-amber-300 underline transition text-[11px] flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Bạn đổi điện thoại hoặc lỡ xóa lịch sử? Nhấp vào đây để khôi phục tủ</span>
        </button>

        {showRecoveryInput && (
          <form onSubmit={handleRecoverySubmit} className="mt-2 flex gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Nhập 4 từ bí mật (ví dụ: mai-vang-nang-am)..."
              value={recoveryInputWords}
              onChange={(e) => setRecoveryInputWords(e.target.value)}
              className="flex-1 bg-wood-900 border border-amber-700/60 rounded-xl px-3 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
            >
              Khôi Phục
            </button>
          </form>
        )}
      </div>

      {/* MODAL 1: NHẬN TỦ TRỐNG & ĐẶT BÍ DANH */}
      {claimTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-wood-900 to-wood-950 border-2 border-amber-600/70 rounded-3xl p-6 max-w-md w-full shadow-2xl text-stone-100">
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
                    className="flex-1 bg-wood-950 border border-amber-700/60 rounded-xl px-3.5 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleRandomAlias}
                    title="Đổi tên ngẫu nhiên"
                    className="p-2.5 bg-wood-800 hover:bg-wood-700 border border-amber-700/50 rounded-xl text-amber-300 transition"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-amber-950/60 border border-amber-900/60 p-3 rounded-xl text-[11px] text-amber-200 space-y-1">
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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-wood-950 font-bold text-xs shadow-lg transition"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-wood-950 border-2 border-stone-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center text-stone-200">
            <div className="w-14 h-14 bg-stone-900 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-3 text-2xl text-stone-400">
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
              className="mt-5 w-full py-2.5 rounded-xl bg-wood-800 hover:bg-wood-700 text-xs font-semibold text-stone-200 transition"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
