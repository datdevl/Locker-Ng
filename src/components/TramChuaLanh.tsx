import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/soundEngine';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  Flame, 
  Heart, 
  Radio, 
  CloudRain, 
  Droplets, 
  Send, 
  MessageCircleHeart, 
  PhoneCall, 
  Trees,
  Sparkles
} from 'lucide-react';

export const TramChuaLanh: React.FC = () => {
  const { 
    setCurrentView, 
    healingWishes, 
    addWish, 
    hugWish, 
    candleWish,
    plantWaterCount,
    waterPlant,
    isRainActive,
    toggleRain,
    isLofiActive,
    toggleLofi,
    myLocker,
    showToast
  } = useApp();

  // Active Sub-tab
  const [activeTab, setActiveTab] = useState<'burn' | 'wishes' | 'plant' | 'counselor'>('burn');

  // Xả Muộn Phiền State & Refs
  const [worryText, setWorryText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState(false);
  const worryBoxRef = useRef<HTMLDivElement>(null);
  const flameIconRef = useRef<HTMLDivElement>(null);

  // Plant ref for watering bounce animation
  const plantIconRef = useRef<HTMLDivElement>(null);

  // Viết Tâm Sự Mới State
  const [wishContent, setWishContent] = useState('');
  const [wishTag, setWishTag] = useState('Năng lượng tích cực');

  // Đặt Hẹn Tham Vấn State
  const [counselorTopic, setCounselorTopic] = useState('Áp lực giờ dạy & quản lý lớp');
  const [counselorNote, setCounselorNote] = useState('');
  const [counselorSubmitted, setCounselorSubmitted] = useState(false);

  // ĐỐT PHIỀN MUỘN VỚI GSAP FLAME CHÂN THỰC
  const handleBurnWorry = () => {
    if (!worryText.trim()) return;
    setIsBurning(true);
    sound.playFireCrackle();

    if (flameIconRef.current && worryBoxRef.current) {
      const tl = gsap.timeline();

      // Ngọn lửa bùng lên dữ dội
      tl.to(flameIconRef.current, {
        scale: 1.8,
        rotate: 15,
        duration: 0.3,
        repeat: 3,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Hòm giấy rung lắc và cháy thành tro tàn
      tl.to(worryBoxRef.current, {
        x: -5,
        duration: 0.05,
        repeat: 12,
        yoyo: true,
        ease: 'none',
      }, '<');

      tl.to(worryBoxRef.current, {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.8,
        ease: 'power2.in',
      });
    }

    // Hiệu ứng tàn lửa bay lên
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f97316', '#ef4444', '#78716c', '#000000']
    });

    setTimeout(() => {
      setIsBurning(false);
      setBurnSuccess(true);
      setWorryText('');
      if (worryBoxRef.current) {
        gsap.set(worryBoxRef.current, { scale: 1, opacity: 1, filter: 'none', x: 0 });
      }
      if (flameIconRef.current) {
        gsap.set(flameIconRef.current, { scale: 1, rotate: 0 });
      }
    }, 1400);
  };

  // TƯỚI NƯỚC CÂY VỚI GSAP SQUASH & STRETCH
  const handleWaterPlant = () => {
    waterPlant();
    if (plantIconRef.current) {
      gsap.fromTo(
        plantIconRef.current,
        { scaleY: 0.8, scaleX: 1.2 },
        { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' }
      );
    }
  };

  // Gửi tâm sự lên Cây Đom Đóm
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishContent.trim()) return;

    addWish(
      wishContent.trim(),
      myLocker ? myLocker.alias : 'Đồng Nghiệp Á Châu',
      myLocker ? myLocker.campus : 'Tập đoàn GAIE',
      [wishTag]
    );

    setWishContent('');
    showToast('Lời nhắn ấm áp của bạn đã được treo lên Cây Đom Đóm!', 'success');
  };

  // Gửi đăng ký tư vấn 1:1
  const handleCounselorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCounselorSubmitted(true);
    sound.playHugChime();
    showToast('Yêu cầu tham vấn đã được gửi kín đáo đến Chuyên viên Tâm lý!', 'success');
  };

  // Tính giai đoạn lớn của Cây Hạnh Phúc
  const getPlantStage = (count: number) => {
    if (count < 5) return { stage: 'Mầm Xanh Bé Nhỏ 🌱', desc: 'Mầm cây vừa nhú khỏi đất ấm', emoji: '🌱' };
    if (count < 12) return { stage: 'Cành Non Xanh Mướt 🌿', desc: 'Cây đang vươn mình đón nắng sớm', emoji: '🌿' };
    if (count < 25) return { stage: 'Cây Hoa Nở Rộ 🌸', desc: 'Những đóa hoa thơm ngát đã bung nở', emoji: '🌸' };
    return { stage: 'Đại Thụ Tỏa Bóng Mát 🌳', desc: 'Che chở và lan tỏa năng lượng bình yên', emoji: '🌳' };
  };

  const plantInfo = getPlantStage(plantWaterCount);

  return (
    <div className="relative min-h-[calc(100vh-70px)] p-4 md:p-8 flex flex-col items-center select-none text-stone-200 z-10">
      
      {/* HEADER QUAY LẠI & TIÊU ĐỀ */}
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setCurrentView('locker-room')}
          className="flex items-center gap-2 text-xs md:text-sm text-emerald-300 hover:text-emerald-100 bg-black/60 border border-emerald-800/60 px-4 py-2 rounded-2xl transition backdrop-blur-md shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Phòng Locker</span>
        </button>

        {/* CỤM ĐIỀU HƯỚNG NHANH CỦA TRẠM CHỮA LÀNH */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-800/50 shadow-lg">
          <button
            onClick={() => setActiveTab('burn')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'burn'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Xả Muộn Phiền</span>
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'wishes'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
            <span>Cây Đom Đóm ({healingWishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('plant')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'plant'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-lime-400" />
            <span>Vườn Cây ({plantWaterCount}💧)</span>
          </button>

          <button
            onClick={() => setActiveTab('counselor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'counselor'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Tư Vấn 1:1</span>
          </button>
        </div>
      </div>

      {/* MINI AUDIO DOCK TIỆN LỢI TẠI TRẠM CHỮA LÀNH */}
      <div className="max-w-4xl w-full mb-6 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <span className="font-serif font-bold text-emerald-200">
            Không gian an yên & chữa lành tâm hồn (Inspired by ngheban.com)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleRain}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              isRainActive ? 'bg-sky-800 text-white font-bold' : 'bg-stone-800/80 text-stone-300'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span>{isRainActive ? 'Tắt mưa' : 'Bật tiếng mưa'}</span>
          </button>

          <button
            onClick={toggleLofi}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              isLofiActive ? 'bg-amber-800 text-white font-bold' : 'bg-stone-800/80 text-stone-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>{isLofiActive ? 'Tắt Lofi' : 'Bật Lofi chill'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: HÒM XẢ MUỘN PHIỀN & ĐỐT CHÁY ÂU LO (GSAP FIRE) */}
      {activeTab === 'burn' && (
        <div 
          ref={worryBoxRef}
          className="max-w-2xl w-full bg-[#1c1815]/90 border-2 border-orange-700/70 rounded-3xl p-6 md:p-8 shadow-2xl text-center relative overflow-hidden backdrop-blur-md"
        >
          <div 
            ref={flameIconRef}
            className="w-16 h-16 rounded-full bg-orange-950/80 border border-orange-500/60 flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_30px_rgba(249,115,22,0.5)]"
          >
            🔥
          </div>

          <h3 className="text-2xl font-serif font-bold text-amber-200">
            Hòm Xả Muộn Phiền & Đốt Cháy Âu Lo
          </h3>
          <p className="text-xs text-stone-300 mt-1.5 max-w-md mx-auto">
            Hôm nay có điều gì làm bạn phiền lòng, mệt mỏi hay áp lực? Hãy viết hết ra đây. Sau đó, nhấn nút châm lửa để biến tất cả thành tro bụi bay đi.
          </p>

          <div className="mt-5 relative">
            <textarea
              rows={5}
              disabled={isBurning}
              value={worryText}
              onChange={(e) => {
                setWorryText(e.target.value);
                setBurnSuccess(false);
              }}
              placeholder="Ví dụ: Tiết dạy hôm nay có bạn học sinh chưa hiểu bài làm mình thấy hơi hụt hẫng... hoặc công việc báo cáo dồn dập khiến mình thấy kiệt sức..."
              className="w-full bg-black/60 border border-stone-700 rounded-2xl p-4 text-xs md:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-orange-500 transition-all font-sans leading-relaxed shadow-inner"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-400 italic">
              🔒 Nội dung này sẽ biến mất vĩnh viễn, không ai có thể đọc được.
            </span>

            <button
              onClick={handleBurnWorry}
              disabled={isBurning || !worryText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-xl transition flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>{isBurning ? 'Đang bùng cháy...' : 'Đốt Cháy Thành Tro Bụi'}</span>
            </button>
          </div>

          {burnSuccess && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs text-left flex items-start gap-3 shadow-xl animate-fade-in">
              <span className="text-2xl">🌿</span>
              <div>
                <p className="font-bold text-sm">Mọi âu lo đã hóa thành tro tàn và tan biến!</p>
                <p className="text-stone-300 mt-0.5">
                  Thầy cô và anh chị hãy hít một hơi thật sâu, nhấp một ngụm nước ấm và mỉm cười nhé. Bạn đã làm việc rất tận tâm hôm nay rồi!
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-VIEW 2: CÂY ĐOM ĐÓM - SẺ CHIA & GỬI CÁI ÔM */}
      {activeTab === 'wishes' && (
        <div className="max-w-4xl w-full space-y-6">
          
          {/* KHUNG GẮN LỜI NHẮN MỚI LÊN CÂY */}
          <form onSubmit={handleAddWish} className="bg-[#132219]/90 border border-emerald-700/60 p-5 rounded-3xl shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✨</span>
              <h4 className="font-serif font-bold text-emerald-200 text-sm">
                Treo Một Đốm Sáng Yêu Thương Lên Cây
              </h4>
            </div>

            <textarea
              required
              rows={2}
              value={wishContent}
              onChange={(e) => setWishContent(e.target.value)}
              placeholder="Viết một lời chúc, một niềm vui nhỏ trong ngày để lan tỏa năng lượng tích cực đến đồng nghiệp Á Châu..."
              className="w-full bg-black/50 border border-emerald-800 rounded-xl p-3 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-emerald-500 shadow-inner"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Chủ đề:</span>
                {['Năng lượng tích cực', 'Thương quý học trò', 'Lời cảm ơn', 'Sức khỏe'].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setWishTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      wishTag === tag
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-stone-800/80 text-stone-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Thắp Sáng Đom Đóm</span>
              </button>
            </div>
          </form>

          {/* DANH SÁCH LỜI NHẮN ĐOM ĐÓM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healingWishes.map((wish) => (
              <div
                key={wish.id}
                className="bg-[#14241b]/90 border border-emerald-800/60 hover:border-emerald-500 p-5 rounded-2xl shadow-xl transition flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300">
                      🌟 {wish.authorAlias}
                    </span>
                    <span className="text-[10px] text-stone-400">{wish.date}</span>
                  </div>

                  <p className="text-xs text-stone-200 leading-relaxed font-serif my-2">
                    "{wish.content}"
                  </p>

                  <div className="flex gap-1.5 my-2">
                    {wish.tags.map((t, i) => (
                      <span key={i} className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-950/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {wish.campus}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => hugWish(wish.id)}
                      className="px-2.5 py-1 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 flex items-center gap-1.5 transition font-semibold"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{wish.hugs} Cái ôm</span>
                    </button>

                    <button
                      onClick={() => candleWish(wish.id)}
                      className="px-2.5 py-1 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/60 flex items-center gap-1.5 transition font-semibold"
                    >
                      <span>🕯️</span>
                      <span>{wish.candles} Nến</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-VIEW 3: VƯỜN CÂY HẠNH PHÚC (MINI-GAME GSAP) */}
      {activeTab === 'plant' && (
        <div className="max-w-xl w-full bg-[#14231b]/90 border-2 border-emerald-700/60 rounded-3xl p-6 md:p-8 shadow-2xl text-center backdrop-blur-md">
          
          <div 
            ref={plantIconRef}
            className="w-28 h-28 rounded-full bg-emerald-900/60 border-2 border-emerald-400/60 flex items-center justify-center text-6xl mx-auto mb-4 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
          >
            {plantInfo.emoji}
          </div>

          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700 shadow">
            CẤP ĐỘ {Math.floor(plantWaterCount / 5) + 1}
          </span>

          <h3 className="text-2xl font-serif font-bold text-emerald-200 mt-2">
            {plantInfo.stage}
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto">
            {plantInfo.desc}. Mỗi ngày bạn vào ghé thăm và tưới 1 giọt nước, cây đại diện cho tình yêu giáo dục của bạn sẽ lớn lên từng ngày.
          </p>

          <div className="my-6 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>Đã tích lũy nước ngọt:</span>
              <span className="font-bold text-emerald-300">{plantWaterCount} Giọt 💧</span>
            </div>
            <div className="w-full h-3.5 bg-black/60 rounded-full border border-emerald-800 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-700"
                style={{ width: `${Math.min(100, (plantWaterCount % 5) * 20 + 20)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleWaterPlant}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm shadow-2xl transition flex items-center justify-center gap-2 mx-auto transform hover:scale-105 active:scale-95"
          >
            <Droplets className="w-5 h-5 text-sky-300 animate-bounce" />
            <span>Tưới Nước Cho Cây Hôm Nay</span>
          </button>
        </div>
      )}

      {/* SUB-VIEW 4: BỐT THAM VẤN 1:1 CÙNG CHUYÊN VIÊN TÂM LÝ */}
      {activeTab === 'counselor' && (
        <div className="max-w-2xl w-full bg-[#111e28]/95 border-2 border-sky-700/60 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-400/50 flex items-center justify-center text-2xl shadow-lg">
              🛋️
            </div>
            <div>
              <h3 className="font-serif font-bold text-sky-200 text-lg">
                Bốt Tham Vấn Tâm Lý & Đồng Hành 1:1
              </h3>
              <p className="text-xs text-stone-300">
                Bộ phận tham vấn tâm lý học đường & HR Á Châu luôn sẵn sàng lắng nghe bạn trong không gian bảo mật tuyệt đối.
              </p>
            </div>
          </div>

          {counselorSubmitted ? (
            <div className="p-6 rounded-2xl bg-sky-950/80 border border-sky-500 text-center space-y-2 shadow-xl">
              <span className="text-4xl">🕊️</span>
              <h4 className="font-serif font-bold text-sky-200 text-base">
                Yêu Cầu Tham Vấn Đã Được Tiếp Nhận Kín Đáo
              </h4>
              <p className="text-xs text-stone-300 max-w-md mx-auto">
                Chuyên viên tâm lý phụ trách sẽ gửi một phong bì thư hẹn riêng vào chiếc tủ Locker #{myLocker?.number || ''} của bạn. Chúc bạn luôn bình an!
              </p>
              <button
                onClick={() => setCounselorSubmitted(false)}
                className="mt-3 text-xs bg-sky-700 hover:bg-sky-600 px-4 py-2 rounded-xl text-white font-bold transition shadow-md"
              >
                Đặt thêm lịch khác nếu cần
              </button>
            </div>
          ) : (
            <form onSubmit={handleCounselorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Vấn đề bạn đang muốn tìm sự đồng hành:
                </label>
                <select
                  value={counselorTopic}
                  onChange={(e) => setCounselorTopic(e.target.value)}
                  className="w-full bg-black/60 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-sky-500"
                >
                  <option value="Áp lực giờ dạy & quản lý lớp">Áp lực giờ dạy & quản lý lớp học</option>
                  <option value="Cân bằng giữa công việc và gia đình">Cân bằng giữa công việc và đời sống cá nhân</option>
                  <option value="Căng thẳng tâm lý / Mất ngủ kéo dài">Căng thẳng tâm lý / Kiệt sức (Burnout)</option>
                  <option value="Khó khăn trong giao tiếp đồng nghiệp">Trở ngại trong phối hợp công việc</option>
                  <option value="Chỉ muốn tìm một người lắng nghe">Chỉ muốn tìm một người lắng nghe không phán xét</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Thời gian hoặc lời nhắn bạn muốn gửi trước (Tùy chọn):
                </label>
                <textarea
                  rows={3}
                  value={counselorNote}
                  onChange={(e) => setCounselorNote(e.target.value)}
                  placeholder="Ví dụ: Mình mong muốn được gặp gỡ vào chiều thứ Sáu sau 16:30 tại phòng tư vấn kín cơ sở SIU..."
                  className="w-full bg-black/60 border border-stone-700 rounded-xl p-3 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-sky-500"
                />
              </div>

              <div className="bg-sky-950/60 p-3 rounded-xl border border-sky-800/60 text-[11px] text-sky-200">
                🔒 Cam kết đạo đức nghề nghiệp: Mọi buổi trò chuyện đều tuân thủ nguyên tắc bảo mật thông tin tuyệt đối của chuyên viên tâm lý.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-xl transition"
              >
                Gửi Lời Hẹn Ẩn Danh Đến Chuyên Viên
              </button>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
