import React, { useRef, useEffect } from 'react';
import { LockerItem } from '../utils/storage';
import { sound } from '../utils/soundEngine';
import gsap from 'gsap';
import { Lock, Unlock, Mail, Sparkles } from 'lucide-react';

interface LockerDoor3DProps {
  locker: LockerItem;
  onClick: () => void;
}

export const LockerDoor3D: React.FC<LockerDoor3DProps> = ({ locker, onClick }) => {
  const doorRef = useRef<HTMLDivElement>(null);
  const mailBeaconRef = useRef<HTMLDivElement>(null);
  const isMine = locker.isOwnedByMe;

  // Hiệu ứng GSAP cho lá thư đỏ nhấp nháy phát sáng
  useEffect(() => {
    if (locker.hasUnreadReply && isMine && mailBeaconRef.current) {
      gsap.to(mailBeaconRef.current, {
        y: -8,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to(mailBeaconRef.current, {
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.9)',
        duration: 0.9,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, [locker.hasUnreadReply, isMine]);

  const handleMouseEnter = () => {
    if (!doorRef.current) return;
    if (isMine) {
      // Hé mở cánh tủ 35 độ chào đón chủ nhân
      gsap.to(doorRef.current, {
        rotateY: -35,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else if (locker.isVacant) {
      gsap.to(doorRef.current, {
        rotateY: -20,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!doorRef.current) return;
    gsap.to(doorRef.current, {
      rotateY: 0,
      duration: 0.6,
      ease: 'bounce.out',
    });
  };

  const handleClick = () => {
    if (!doorRef.current) return;

    if (isMine) {
      // Mở toang 105 độ với độ nảy GSAP cơ học chân thật
      gsap.to(doorRef.current, {
        rotateY: -105,
        duration: 0.7,
        ease: 'back.out(1.5)',
        onComplete: () => {
          onClick();
          // Tự động khép nhẹ lại sau khi mở modal
          gsap.to(doorRef.current, { rotateY: 0, duration: 0.5, delay: 0.2 });
        },
      });
    } else if (locker.isVacant) {
      gsap.to(doorRef.current, {
        rotateY: -45,
        duration: 0.4,
        ease: 'back.out',
        onComplete: () => {
          onClick();
          gsap.to(doorRef.current, { rotateY: 0, duration: 0.4 });
        },
      });
    } else {
      // Rung lắc báo ổ khóa đang khóa cứng
      sound.playLockerOpen();
      gsap.to(doorRef.current, {
        x: -4,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: 'none',
        onComplete: () => {
          gsap.set(doorRef.current, { x: 0 });
          onClick();
        },
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-60 w-full cursor-pointer select-none group"
      style={{ perspective: '1000px' }}
    >
      {/* 1. KHUNG TỦ GỖ CỐ ĐỊNH PHÍA SAU (CABINET INTERIOR & SHADOW) */}
      <div className="absolute inset-0 rounded-2xl bg-[#1c0f0a] border-4 border-[#3e1f14] shadow-2xl overflow-hidden flex flex-col justify-between p-3">
        {/* Ngăn kéo bên trong tủ */}
        <div className="w-full flex justify-between items-center text-[10px] text-amber-500/40 font-mono">
          <span>TỦ BÊN TRONG</span>
          <span>{locker.campus}</span>
        </div>

        {/* Đồ vật bí mật bên trong tủ của người dùng */}
        <div className="my-auto text-center flex flex-col items-center">
          {isMine ? (
            <div className="flex flex-col items-center animate-fade-in">
              <span className="text-3xl filter drop-shadow">🎁</span>
              <span className="text-[11px] text-amber-200 font-serif font-bold mt-1">
                Không Gian Của Bạn
              </span>
              <span className="text-[10px] text-amber-400/80 italic">
                Chạm để mở menu
              </span>
            </div>
          ) : locker.isVacant ? (
            <div className="text-center text-amber-400/60">
              <span className="text-2xl">🌱</span>
              <p className="text-[10px] mt-1 font-semibold">Tủ đang trống</p>
            </div>
          ) : (
            <div className="text-stone-600 text-center">
              <Lock className="w-6 h-6 mx-auto opacity-40" />
              <p className="text-[9px] mt-1">Khóa bảo mật</p>
            </div>
          )}
        </div>

        {/* Đáy tủ */}
        <div className="w-full h-1 bg-amber-950/60 rounded" />
      </div>

      {/* 2. CÁNH CỬA TỦ 3D XOAY THEO BẢN LỀ TRÁI (GSAP ROTATING DOOR) */}
      <div
        ref={doorRef}
        className={`absolute inset-0 rounded-2xl border-2 flex flex-col justify-between p-3.5 transition-shadow duration-300 z-10 ${
          isMine
            ? 'bg-gradient-to-br from-[#804222] via-[#5c2e17] to-[#3a190b] border-amber-400 shadow-[0_10px_25px_rgba(0,0,0,0.8)]'
            : locker.isVacant
            ? 'bg-gradient-to-br from-[#4a2b1d] via-[#3d2014] to-[#2b140b] border-dashed border-amber-600/70 hover:border-amber-400'
            : 'bg-gradient-to-br from-[#542d1b] via-[#401f11] to-[#2e140a] border-amber-950/90 shadow-xl'
        }`}
        style={{
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* VÂN GỖ 3D & BIỂN TÊN ĐỒNG KHẮC SỐ */}
        <div className="flex items-center justify-between">
          {/* Biển đồng số tủ */}
          <div className="px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 text-wood-950 font-mono font-black text-xs shadow-md border border-amber-200">
            {locker.number}
          </div>

          {/* Huy hiệu tình trạng */}
          {isMine ? (
            <span className="text-[10px] bg-amber-400 text-wood-950 font-bold px-2 py-0.5 rounded-full shadow-sm">
              Tủ của tôi
            </span>
          ) : locker.isVacant ? (
            <span className="text-[9px] text-amber-300/80 bg-black/40 px-1.5 py-0.5 rounded">
              Trống
            </span>
          ) : (
            <span className="text-[9px] text-stone-400 bg-black/40 px-1.5 py-0.5 rounded">
              Đã khóa
            </span>
          )}
        </div>

        {/* 3 KHE THOÁNG KHÍ CỦA TỦ GAME 2D */}
        <div className="flex flex-col items-center gap-1 my-1">
          <div className="w-12 h-1 bg-[#221008] rounded-full shadow-inner border-b border-amber-700/30" />
          <div className="w-12 h-1 bg-[#221008] rounded-full shadow-inner border-b border-amber-700/30" />
          <div className="w-12 h-1 bg-[#221008] rounded-full shadow-inner border-b border-amber-700/30" />
        </div>

        {/* PHẦN GIỮA: BIỆT DANH & TAY NẮM ĐỒNG SÁNG BÓNG */}
        <div className="my-auto text-center flex flex-col items-center">
          {/* Ổ khóa đồng */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#3a1d11] to-[#210f08] border border-amber-600/50 flex items-center justify-center text-amber-300 shadow-inner mb-2 group-hover:scale-110 transition">
            {isMine ? (
              <Unlock className="w-5 h-5 text-amber-300 drop-shadow" />
            ) : locker.isVacant ? (
              <span className="text-xl font-bold text-amber-400">+</span>
            ) : (
              <Lock className="w-4 h-4 text-stone-500" />
            )}
          </div>

          {/* Tên bí danh nhân viên */}
          <div className="w-full px-1">
            {locker.isVacant ? (
              <p className="text-xs text-amber-300 font-medium italic">
                Chạm để nhận tủ
              </p>
            ) : (
              <>
                <p className="text-xs font-bold text-stone-100 truncate tracking-wide">
                  {locker.alias}
                </p>
                <p className="text-[9px] text-stone-400 truncate">
                  {locker.campus.replace('Tập đoàn ', '')}
                </p>
              </>
            )}
          </div>
        </div>

        {/* TAY NẮM CỬA KIM LOẠI SÁNG BÓNG BÊN PHẢI */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-10 rounded-full bg-gradient-to-r from-stone-400 via-amber-200 to-amber-700 shadow-md border border-amber-900" />

        {/* BẢN LỀ SẮT GÓC TRÁI (HINGES) */}
        <div className="absolute left-1 top-4 w-1.5 h-5 bg-gradient-to-r from-stone-400 to-stone-700 rounded shadow-sm" />
        <div className="absolute left-1 bottom-4 w-1.5 h-5 bg-gradient-to-r from-stone-400 to-stone-700 rounded shadow-sm" />
      </div>

      {/* 3. LÁ THƯ ĐỎ PHÁT SÁNG NỔI BẬT NẾU CÓ THƯ HỒI ÂM (GSAP FLOATING BEACON) */}
      {locker.hasUnreadReply && isMine && (
        <div
          ref={mailBeaconRef}
          className="absolute -top-4 -right-2 z-30 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-2xl flex items-center gap-1.5 border border-red-200"
        >
          <Mail className="w-3.5 h-3.5 fill-white text-white" />
          <span>Thư Mới!</span>
        </div>
      )}
    </div>
  );
};
