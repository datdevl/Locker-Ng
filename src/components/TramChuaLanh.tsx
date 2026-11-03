import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/soundEngine';
import confetti from 'canvas-confetti';
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
  Trees
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

  // Xả Muộn Phiền State
  const [worryText, setWorryText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState(false);

  // Viết Tâm Sự Mới State
  const [wishContent, setWishContent] = useState('');
  const [wishTag, setWishTag] = useState('Năng lượng tích cực');

  // Đặt Hẹn Tham Vấn State
  const [counselorTopic, setCounselorTopic] = useState('Áp lực giờ dạy & quản lý lớp');
  const [counselorNote, setCounselorNote] = useState('');
  const [counselorSubmitted, setCounselorSubmitted] = useState(false);

  // Đốt phiền muộn
  const handleBurnWorry = () => {
    if (!worryText.trim()) return;
    setIsBurning(true);
    sound.playFireCrackle();

    // Hiệu ứng tro tàn bay lên
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f97316', '#ef4444', '#78716c', '#44403c']
    });

    setTimeout(() => {
      setIsBurning(false);
      setBurnSuccess(true);
      setWorryText('');
    }, 1200);
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
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#18231c] via-[#101913] to-[#0a0f0c] p-4 md:p-8 flex flex-col items-center select-none text-stone-200">
      
      {/* HEADER QUAY LẠI & TIÊU ĐỀ */}
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setCurrentView('locker-room')}
          className="flex items-center gap-2 text-xs md:text-sm text-emerald-300 hover:text-emerald-100 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-1.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Phòng Locker</span>
        </button>

        {/* CỤM ĐIỀU HƯỚNG NHANH CỦA TRẠM CHỮA LÀNH */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-emerald-950/70 p-1 rounded-2xl border border-emerald-800/50 shadow-inner">
          <button
            onClick={() => setActiveTab('burn')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'burn'
                ? 'bg-emerald-800 text-white shadow-md border border-emerald-500/50'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Xả Muộn Phiền</span>
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'wishes'
                ? 'bg-emerald-800 text-white shadow-md border border-emerald-500/50'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
            <span>Cây Đom Đóm ({healingWishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('plant')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'plant'
                ? 'bg-emerald-800 text-white shadow-md border border-emerald-500/50'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-lime-400" />
            <span>Vườn Cây ({plantWaterCount}💧)</span>
          </button>

          <button
            onClick={() => setActiveTab('counselor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'counselor'
                ? 'bg-emerald-800 text-white shadow-md border border-emerald-500/50'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Tư Vấn 1:1</span>
          </button>
        </div>
      </div>

      {/* MINI AUDIO DOCK TIỆN LỢI TẠI TRẠM CHỮA LÀNH */}
      <div className="max-w-4xl w-full mb-6 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <span className="font-serif font-semibold text-emerald-200">
            Không gian chữa lành & xoa dịu tâm hồn (Inspired by ngheban.com)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleRain}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
              isRainActive ? 'bg-sky-800 text-white font-semibold' : 'bg-stone-800/60 text-stone-300'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span>{isRainActive ? 'Tắt mưa' : 'Bật tiếng mưa'}</span>
          </button>

          <button
            onClick={toggleLofi}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
              isLofiActive ? 'bg-amber-800 text-white font-semibold' : 'bg-stone-800/60 text-stone-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>{isLofiActive ? 'Tắt Lofi' : 'Bật Lofi chill'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: HÒM XẢ MUỘN PHIỀN & ĐỐT CHÁY ÂU LO */}
      {activeTab === 'burn' && (
        <div className="max-w-2xl w-full bg-gradient-to-b from-stone-900/90 to-stone-950 border-2 border-stone-700/80 rounded-3xl p-6 md:p-8 shadow-2xl text-center relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-orange-950/80 border border-orange-500/50 flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
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
              className={`w-full bg-stone-950 border border-stone-700 rounded-2xl p-4 text-xs md:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-orange-500 transition-all font-sans leading-relaxed ${
                isBurning ? 'opacity-20 scale-95 blur-sm' : ''
              }`}
            />

            {isBurning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl animate-pulse">
                <span className="text-4xl">🔥</span>
                <p className="text-sm font-serif font-bold text-orange-400 mt-2">
                  Ngọn lửa đang hóa tro những mệt mỏi của bạn...
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-400 italic">
              🔒 Nội dung này sẽ biến mất vĩnh viễn, không ai có thể đọc được.
            </span>

            <button
              onClick={handleBurnWorry}
              disabled={isBurning || !worryText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Đốt Cháy Thành Tro Bụi</span>
            </button>
          </div>

          {burnSuccess && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs text-left flex items-start gap-3 animate-fade-in">
              <span className="text-2xl">🌿</span>
              <div>
                <p className="font-bold">Mọi âu lo đã tan biến vào thinh không!</p>
                <p className="text-stone-300 mt-0.5">
                  Thầy cô và anh chị hãy hít một hơi thật sâu, nhấp một ngụm nước ấm và mỉm cười nhé. Bạn đã làm việc rất chăm chỉ hôm nay rồi!
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
          <form onSubmit={handleAddWish} className="bg-emerald-950/70 border border-emerald-700/60 p-5 rounded-3xl shadow-xl">
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
              className="w-full bg-stone-900 border border-emerald-800 rounded-xl p-3 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-emerald-500"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Chủ đề:</span>
                {['Năng lượng tích cực', 'Thương quý học trò', 'Lời cảm ơn', 'Sức khỏe'].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setWishTag(tag)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition ${
                      wishTag === tag
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5"
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
                className="bg-stone-900/80 border border-emerald-900/60 hover:border-emerald-600/70 p-5 rounded-2xl shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-300">
                      🌟 {wish.authorAlias}
                    </span>
                    <span className="text-[10px] text-stone-500">{wish.date}</span>
                  </div>

                  <p className="text-xs text-stone-200 leading-relaxed font-serif my-2">
                    "{wish.content}"
                  </p>

                  <div className="flex gap-1.5 my-2">
                    {wish.tags.map((t, i) => (
                      <span key={i} className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {wish.campus}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => hugWish(wish.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/50 flex items-center gap-1 transition"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{wish.hugs} Cái ôm</span>
                    </button>

                    <button
                      onClick={() => candleWish(wish.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/50 flex items-center gap-1 transition"
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

      {/* SUB-VIEW 3: VƯỜN CÂY HẠNH PHÚC (MINI-GAME) */}
      {activeTab === 'plant' && (
        <div className="max-w-xl w-full bg-gradient-to-b from-emerald-950/80 to-stone-950 border-2 border-emerald-700/60 rounded-3xl p-6 md:p-8 shadow-2xl text-center">
          
          <div className="w-24 h-24 rounded-full bg-emerald-900/60 border-2 border-emerald-500/50 flex items-center justify-center text-5xl mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-float">
            {plantInfo.emoji}
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            CẤP ĐỘ {Math.floor(plantWaterCount / 5) + 1}
          </span>

          <h3 className="text-2xl font-serif font-bold text-emerald-200 mt-2">
            {plantInfo.stage}
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto">
            {plantInfo.desc}. Mỗi ngày bạn vào ghé thăm và tưới 1 giọt nước, cây đại diện cho tình yêu giáo dục của bạn sẽ lớn lên từng ngày.
          </p>

          <div className="my-6 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>Đã tích lũy nước ngọt:</span>
              <span className="font-bold text-emerald-300">{plantWaterCount} Giọt 💧</span>
            </div>
            <div className="w-full h-3 bg-stone-900 rounded-full border border-emerald-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (plantWaterCount % 5) * 20 + 20)}%` }}
              />
            </div>
          </div>

          <button
            onClick={waterPlant}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 mx-auto"
          >
            <Droplets className="w-5 h-5 text-sky-300" />
            <span>Tưới Nước Cho Cây Hôm Nay</span>
          </button>
        </div>
      )}

      {/* SUB-VIEW 4: BỐT THAM VẤN 1:1 CÙNG CHUYÊN VIÊN TÂM LÝ */}
      {activeTab === 'counselor' && (
        <div className="max-w-2xl w-full bg-stone-900/90 border-2 border-sky-800/60 rounded-3xl p-6 md:p-8 shadow-2xl">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-500/50 flex items-center justify-center text-2xl">
              🛋️
            </div>
            <div>
              <h3 className="font-serif font-bold text-sky-200 text-lg">
                Bốt Tham Vấn Tâm Lý & Đồng Hành 1:1
              </h3>
              <p className="text-xs text-stone-400">
                Bộ phận tham vấn tâm lý học đường & HR Á Châu luôn sẵn sàng lắng nghe bạn trong không gian bảo mật tuyệt đối.
              </p>
            </div>
          </div>

          {counselorSubmitted ? (
            <div className="p-6 rounded-2xl bg-sky-950/80 border border-sky-600 text-center space-y-2">
              <span className="text-4xl">🕊️</span>
              <h4 className="font-serif font-bold text-sky-200 text-base">
                Yêu Cầu Tham Vấn Đã Được Tiếp Nhận Kín Đáo
              </h4>
              <p className="text-xs text-stone-300 max-w-md mx-auto">
                Chuyên viên tâm lý phụ trách sẽ gửi một phong bì thư hẹn riêng vào chiếc tủ Locker #{myLocker?.number || ''} của bạn. Chúc bạn luôn bình an!
              </p>
              <button
                onClick={() => setCounselorSubmitted(false)}
                className="mt-3 text-xs bg-sky-800 hover:bg-sky-700 px-4 py-2 rounded-xl text-white font-semibold transition"
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
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-sky-500"
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
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-sky-500"
                />
              </div>

              <div className="bg-sky-950/40 p-3 rounded-xl border border-sky-900/60 text-[11px] text-sky-200">
                🔒 Cam kết đạo đức nghề nghiệp: Mọi buổi trò chuyện đều tuân thủ nguyên tắc bảo mật thông tin tuyệt đối của chuyên viên tâm lý.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-600 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
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
