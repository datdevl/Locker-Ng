import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import gsap from 'gsap';

export const RoomEnvironment2D: React.FC = () => {
  const { timeOfDay } = useApp();
  const lanternRef = useRef<HTMLDivElement>(null);
  const lanternGlowRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<HTMLDivElement>(null);
  const dustParticlesRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng GSAP cho đèn dầu đung đưa, ánh sáng bập bùng và bụi nắng/đom đóm
  useEffect(() => {
    // Đèn dầu đung đưa tự nhiên
    if (lanternRef.current) {
      gsap.to(lanternRef.current, {
        rotation: 3.5,
        transformOrigin: 'top center',
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Ánh sáng đèn bập bùng ấm áp
    if (lanternGlowRef.current) {
      gsap.to(lanternGlowRef.current, {
        opacity: 0.85,
        scale: 1.1,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Lá cây lay nhẹ nhàng
    if (plantRef.current) {
      gsap.to(plantRef.current, {
        rotation: 2.5,
        transformOrigin: 'bottom center',
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Hạt bụi nắng hoặc đom đóm bay lượn ngẫu nhiên khắp toàn màn hình
    if (dustParticlesRef.current) {
      const particles = dustParticlesRef.current.children;
      Array.from(particles).forEach((p, idx) => {
        gsap.to(p, {
          y: `-=${30 + (idx % 25)}`,
          x: `+=${(idx % 2 === 0 ? 1 : -1) * 20}`,
          opacity: idx % 2 === 0 ? 0.9 : 0.3,
          duration: 3.5 + (idx % 4),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: idx * 0.15,
        });
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
      
      {/* 1. NỀN BẦU TRỜI & KHÔNG GIAN TOÀN DIỆN (FULL-BLEED COHESIVE ATMOSPHERE)
          Bao phủ 100% màn hình, chuyển màu liền mạch không bị cắt nửa hay đứt đoạn */}
      
      {/* KHÔNG GIAN 1: BÌNH MINH (DAWN) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          timeOfDay === 'dawn' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1236] via-[#52294e] via-[#7d3b48] to-[#1e0d08]" />
        {/* Vầng hồng bình minh trên cao */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(251, 146, 60, 0.45) 0%, rgba(244, 63, 94, 0.25) 40%, transparent 75%)',
          }}
        />
        {/* Sương mù sớm */}
        <div className="absolute top-1/4 inset-x-0 h-48 bg-gradient-to-b from-transparent via-rose-300/10 to-transparent blur-xl" />
      </div>

      {/* KHÔNG GIAN 2: BAN NGÀY (DAYLIGHT) - ẤM ÁP, SANG TRỌNG, KHÔNG BỊ XANH GẮT */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          timeOfDay === 'day' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Chuyển sắc dịu dàng từ bầu trời xanh ngọc qua vệt nắng ấm xuống nền phòng gỗ */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b3d5e] via-[#27537e] via-[#3d3832] to-[#180d08]" />
        
        {/* Quầng sáng mặt trời rọi qua cửa sổ (Sunlight Core) */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 15%, rgba(56, 189, 248, 0.35) 0%, rgba(253, 224, 71, 0.2) 40%, transparent 75%)',
          }}
        />

        {/* Các vệt nắng xiên nhẹ nhàng (God Rays) */}
        <div className="absolute -top-20 left-1/4 w-96 h-[800px] bg-gradient-to-b from-amber-100/20 via-amber-200/5 to-transparent transform rotate-12 blur-2xl" />
        <div className="absolute -top-20 right-1/4 w-96 h-[800px] bg-gradient-to-b from-amber-100/15 via-amber-200/5 to-transparent transform -rotate-12 blur-2xl" />
      </div>

      {/* KHÔNG GIAN 3: HOÀNG HÔN (SUNSET) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          timeOfDay === 'sunset' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#280c3a] via-[#5c1c44] via-[#853328] to-[#1c0d08]" />
        {/* Vầng hoàng hôn rực rỡ */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 18%, rgba(249, 115, 22, 0.45) 0%, rgba(217, 70, 239, 0.25) 45%, transparent 80%)',
          }}
        />
      </div>

      {/* KHÔNG GIAN 4: BAN ĐÊM (NIGHT) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          timeOfDay === 'night' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#060913] via-[#0c1426] via-[#141b2c] to-[#0d0907]" />
        {/* Ánh trăng khuyết dịu nhẹ */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 15%, rgba(147, 197, 253, 0.3) 0%, transparent 60%)',
          }}
        />
        {/* Mặt trăng */}
        <div className="absolute top-16 right-36 w-14 h-14 rounded-full bg-amber-100/90 shadow-[0_0_40px_rgba(253,230,138,0.7)]" />
        <div className="absolute top-14 right-32 w-14 h-14 rounded-full bg-[#0c1426]" />
        
        {/* Bầu trời ngàn sao lấp lánh */}
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute text-amber-200 text-[10px] animate-pulse"
            style={{
              top: `${(i * 17) % 85}%`,
              left: `${(i * 23) % 96}%`,
              animationDuration: `${1.2 + (i % 3)}s`,
              opacity: 0.3 + ((i % 5) * 0.15),
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* 2. HỌA TIẾT KHUNG CỬA SỔ VÒM NGHỆ THUẬT (ARCHED SCHOOL WINDOW SILHOUETTE)
          Hòa quyện tự nhiên mờ dần vào không gian, không tạo vệt cắt ngang */}
      <div className="absolute top-0 inset-x-0 h-96 flex items-start justify-center gap-10 px-8 pt-4 opacity-25">
        <div className="w-60 h-80 rounded-t-full border-4 border-amber-900/60 bg-gradient-to-b from-white/10 to-transparent relative shadow-2xl">
          <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-900/60" />
          <div className="absolute inset-y-0 left-1/2 w-1 bg-amber-900/60" />
        </div>
        <div className="w-72 h-96 rounded-t-full border-4 border-amber-900/60 bg-gradient-to-b from-white/10 to-transparent relative shadow-2xl hidden md:block">
          <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-900/60" />
          <div className="absolute inset-y-0 left-1/2 w-1 bg-amber-900/60" />
        </div>
        <div className="w-60 h-80 rounded-t-full border-4 border-amber-900/60 bg-gradient-to-b from-white/10 to-transparent relative shadow-2xl hidden lg:block">
          <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-900/60" />
          <div className="absolute inset-y-0 left-1/2 w-1 bg-amber-900/60" />
        </div>
      </div>

      {/* 3. XÀ NGANG GỖ MÁI VÒM TRÊN CÙNG (CEILING BEAM) - NƠI TREO ĐÈN */}
      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-[#3a1d10] via-[#2b1308] to-transparent border-b border-amber-800/40 shadow-lg z-10" />

      {/* 4. SÀN GỖ NỀN DƯỚI ĐÁY MỜ DẦN (SEAMLESS FLOOR TEXTURE) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-96 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(245, 158, 11, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '45px 120px',
          transform: 'perspective(500px) rotateX(25deg)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, transparent 100%)',
        }}
      />

      {/* 5. ĐÈN DẦU ĐỒNG TREO TỪ XÀ TRÊN ĐUNG ĐƯA (GSAP LANTERN) */}
      <div 
        ref={lanternRef}
        className="absolute top-0 left-10 hidden sm:flex flex-col items-center z-20"
      >
        {/* Dây xích đồng buông từ xà trần */}
        <div className="w-1 h-20 bg-gradient-to-b from-amber-700 via-stone-500 to-amber-800 shadow" />
        
        {/* Thân đèn dầu đồng */}
        <div className="relative w-12 h-16 bg-gradient-to-b from-[#854d0e] via-[#5c3008] to-[#291203] rounded-2xl border-2 border-amber-400 shadow-2xl flex items-center justify-center">
          {/* Ngọn lửa bập bùng */}
          <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 to-amber-200 animate-pulse shadow-[0_0_20px_rgba(245,158,11,1)]" />
          
          {/* Vầng sáng vàng ấm lan tỏa */}
          <div 
            ref={lanternGlowRef}
            className="absolute -inset-14 rounded-full bg-amber-500/25 blur-2xl pointer-events-none"
          />
        </div>
      </div>

      {/* 6. BẢNG GHIM NỈ CỔ ĐIỂN TREO TƯỜNG (CORK BULLETIN BOARD) */}
      <div className="absolute top-16 right-6 hidden xl:block w-48 bg-[#4d2c16] border-4 border-[#2b1408] rounded-2xl p-2.5 shadow-2xl z-20 transform rotate-1">
        <div className="w-full bg-[#875529] rounded-xl p-2.5 border border-[#a86e39] text-[10px] text-wood-950 font-serif space-y-1.5 shadow-inner">
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

      {/* 7. CHẬU CÂY CẢNH GHIBLI GÓC PHÒNG (GSAP PLANT) */}
      <div 
        ref={plantRef}
        className="absolute bottom-6 left-6 hidden lg:flex flex-col items-center z-20"
      >
        <span className="text-5xl drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] filter">🌿</span>
        <div className="w-10 h-10 bg-gradient-to-b from-[#b45309] to-[#78350f] rounded-b-xl border-2 border-[#d97706] shadow-2xl mt-[-6px]" />
      </div>

      {/* 8. HẠT BỤI NẮNG / ĐOM ĐÓM BAY BỔNG KHẮP KHÔNG GIAN (GSAP PARTICLES) */}
      <div ref={dustParticlesRef} className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              timeOfDay === 'night' 
                ? 'w-2 h-2 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]' 
                : timeOfDay === 'sunset'
                ? 'w-1.5 h-1.5 bg-amber-400 shadow-[0_0_10px_rgba(251,146,60,0.9)]'
                : 'w-1.5 h-1.5 bg-amber-200/70 shadow-[0_0_8px_rgba(253,230,138,0.8)]'
            }`}
            style={{
              top: `${10 + (i * 17) % 82}%`,
              left: `${5 + (i * 23) % 90}%`,
            }}
          />
        ))}
      </div>

    </div>
  );
};
