import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import gsap from 'gsap';

export const RoomEnvironment2D: React.FC = () => {
  const { timeOfDay } = useApp();
  const lanternRef = useRef<HTMLDivElement>(null);
  const lanternGlowRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<HTMLDivElement>(null);
  const dustParticlesRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng GSAP cho đèn dầu đung đưa và các hạt bụi nắng/đom đóm
  useEffect(() => {
    // Đèn dầu đung đưa tự nhiên
    if (lanternRef.current) {
      gsap.to(lanternRef.current, {
        rotation: 4,
        transformOrigin: 'top center',
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Ánh sáng đèn bập bùng nhẹ
    if (lanternGlowRef.current) {
      gsap.to(lanternGlowRef.current, {
        opacity: 0.85,
        scale: 1.08,
        duration: 1.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Lá cây lay nhẹ
    if (plantRef.current) {
      gsap.to(plantRef.current, {
        rotation: 2.5,
        transformOrigin: 'bottom center',
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Hạt bụi nắng / đom đóm bay lơ lửng
    if (dustParticlesRef.current) {
      const particles = dustParticlesRef.current.children;
      Array.from(particles).forEach((p, idx) => {
        gsap.to(p, {
          y: `-=${25 + (idx % 20)}`,
          x: `+=${(idx % 2 === 0 ? 1 : -1) * 15}`,
          opacity: (idx % 2 === 0 ? 0.8 : 0.2),
          duration: 3 + (idx % 3),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: idx * 0.2,
        });
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      
      {/* 1. NỀN BẦU TRỜI ĐỔI THEO KHÔNG GIAN QUA KHUNG CỬA SỔ LỚN */}
      <div className="absolute top-0 inset-x-0 h-[480px] overflow-hidden transition-all duration-1000">
        
        {/* Bầu trời: Bình Minh */}
        {timeOfDay === 'dawn' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2b1055] via-[#7597de] to-[#ffd194] transition-all duration-1000">
            {/* Mặt trời hồng sớm */}
            <div className="absolute top-20 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-amber-200 to-rose-300 blur-md opacity-80" />
            <div className="absolute top-28 left-12 text-stone-200/40 text-xs font-serif italic">
              * Bình minh đang lên trên sân trường Á Châu...
            </div>
          </div>
        )}

        {/* Bầu trời: Ban Ngày */}
        {timeOfDay === 'day' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#bae6fd] transition-all duration-1000">
            {/* Mây trắng bồng bềnh */}
            <div className="absolute top-16 left-1/4 w-48 h-16 bg-white/40 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-10 right-1/3 w-64 h-20 bg-white/30 rounded-full blur-2xl" />
            {/* Vệt nắng ấm (God rays) rọi qua cửa sổ */}
            <div className="absolute -top-10 left-1/3 w-80 h-[500px] bg-gradient-to-b from-amber-100/25 via-amber-200/10 to-transparent transform rotate-12 blur-lg" />
          </div>
        )}

        {/* Bầu trời: Hoàng Hôn */}
        {timeOfDay === 'sunset' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#31103f] via-[#c2410c] to-[#f59e0b] transition-all duration-1000">
            {/* Vầng hoàng hôn đỏ rực */}
            <div className="absolute top-24 right-1/3 w-36 h-36 rounded-full bg-orange-400 blur-xl opacity-75" />
            <div className="absolute bottom-10 left-20 text-amber-200/50 text-xs font-serif italic">
              * Giờ tan trường rực ánh hoàng hôn SIU & IPS...
            </div>
          </div>
        )}

        {/* Bầu trời: Ban Đêm */}
        {timeOfDay === 'night' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#090b14] via-[#0f172a] to-[#1e1b4b] transition-all duration-1000">
            {/* Vầng trăng khuyết dịu dàng */}
            <div className="absolute top-12 right-24 w-16 h-16 rounded-full bg-amber-100 shadow-[0_0_35px_rgba(253,230,138,0.8)] opacity-90" />
            <div className="absolute top-10 right-20 w-16 h-16 rounded-full bg-[#0f172a]" />
            {/* Ngôi sao lấp lánh */}
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="absolute text-amber-200 text-[10px] animate-pulse"
                style={{
                  top: `${(i * 19) % 70}%`,
                  left: `${(i * 29) % 95}%`,
                  animationDuration: `${1.5 + (i % 3)}s`,
                }}
              >
                ✦
              </span>
            ))}
          </div>
        )}

        {/* DÃY KHUNG CỬA SỔ GỖ VÒM TRƯỜNG HỌC (2D Architectural Arched Window) */}
        <div className="absolute inset-x-0 bottom-0 h-44 flex items-end justify-center gap-8 px-6">
          <div className="w-64 h-40 rounded-t-full border-t-8 border-x-8 border-wood-950 bg-transparent relative shadow-2xl">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-wood-950" />
            <div className="absolute inset-y-0 left-1/2 w-2 bg-wood-950" />
          </div>
          <div className="w-80 h-44 rounded-t-full border-t-8 border-x-8 border-wood-950 bg-transparent relative shadow-2xl hidden md:block">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-wood-950" />
            <div className="absolute inset-y-0 left-1/2 w-2 bg-wood-950" />
          </div>
          <div className="w-64 h-40 rounded-t-full border-t-8 border-x-8 border-wood-950 bg-transparent relative shadow-2xl hidden lg:block">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-wood-950" />
            <div className="absolute inset-y-0 left-1/2 w-2 bg-wood-950" />
          </div>
        </div>
      </div>

      {/* 2. TƯỜNG GỖ ẤM CÚNG & SÀN GỖ PARQUET 2D */}
      <div className="absolute inset-x-0 top-[380px] bottom-0 bg-gradient-to-b from-[#2e1910] via-[#21110a] to-[#120905]">
        {/* Đường gờ chỉ phào chân tường bằng gỗ lim */}
        <div className="w-full h-4 bg-[#4a2617] border-y border-amber-600/40 shadow-md" />
        
        {/* Họa tiết sàn gỗ Parquet trải dài */}
        <div 
          className="w-full h-full opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px),
              linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 120px',
            transform: 'perspective(600px) rotateX(25deg)',
            transformOrigin: 'top center',
          }}
        />
      </div>

      {/* 3. ĐÈN DẦU ĐỒNG TREO TƯỜNG ĐUNG ĐƯA (GSAP SWING) */}
      <div 
        ref={lanternRef}
        className="absolute top-12 left-12 hidden sm:flex flex-col items-center z-10"
      >
        {/* Dây xích đồng */}
        <div className="w-1 h-14 bg-gradient-to-b from-stone-500 to-amber-700" />
        
        {/* Thân đèn lồng đồng */}
        <div className="relative w-12 h-16 bg-gradient-to-b from-amber-700 via-amber-900 to-stone-900 rounded-2xl border-2 border-amber-500/80 shadow-2xl flex items-center justify-center">
          {/* Ngọn lửa đèn bập bùng */}
          <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 to-amber-200 animate-pulse shadow-[0_0_15px_rgba(245,158,11,1)]" />
          
          {/* Ánh sáng tỏa tròn ấm áp */}
          <div 
            ref={lanternGlowRef}
            className="absolute -inset-10 rounded-full bg-amber-500/20 blur-xl pointer-events-none"
          />
        </div>
      </div>

      {/* 4. BẢNG GHIM NỈ CỔ ĐIỂN BÊN GÓC PHÒNG (CORK BULLETIN BOARD) */}
      <div className="absolute top-20 right-6 hidden xl:block w-44 bg-[#6b4728] border-4 border-[#3d2012] rounded-2xl p-2.5 shadow-2xl z-10 transform rotate-1">
        <div className="w-full h-full bg-[#9c6a38] rounded-xl p-2 border border-[#b88248] text-[10px] text-wood-950 font-serif space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-wood-900/40 pb-1">
            <span className="font-bold text-[9px] uppercase tracking-wider text-red-950">📌 GAIE NOTICES</span>
            <span className="text-red-700 font-bold">♥</span>
          </div>
          <p className="bg-[#fef9c3] p-1.5 rounded shadow-sm italic text-[9px] leading-tight">
            "Mỗi ngày lên lớp là một hành trình trao gửi tri thức và tình thương yêu."
          </p>
          <p className="bg-[#ecfccb] p-1.5 rounded shadow-sm text-[9px] leading-tight font-medium">
            🌱 Uống đủ nước và hít thở sâu sau giờ dạy nhé thầy cô ơi!
          </p>
        </div>
      </div>

      {/* 5. CHẬU CÂY CẢNH GÓC PHÒNG LAY NHẸ (GSAP PLANT) */}
      <div 
        ref={plantRef}
        className="absolute bottom-6 left-6 hidden lg:flex flex-col items-center z-10"
      >
        <span className="text-5xl drop-shadow-xl filter">🌿</span>
        <div className="w-10 h-10 bg-gradient-to-b from-[#b45309] to-[#78350f] rounded-b-xl border-2 border-[#d97706] shadow-lg mt-[-6px]" />
      </div>

      {/* 6. HẠT BỤI NẮNG HOẶC ĐOM ĐÓM BAY LƠ LỬNG (GSAP PARTICLES) */}
      <div ref={dustParticlesRef} className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              timeOfDay === 'night' 
                ? 'w-2 h-2 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]' 
                : 'w-1.5 h-1.5 bg-amber-200/60 shadow-[0_0_8px_rgba(253,230,138,0.8)]'
            }`}
            style={{
              top: `${15 + (i * 21) % 75}%`,
              left: `${8 + (i * 27) % 85}%`,
            }}
          />
        ))}
      </div>

    </div>
  );
};
