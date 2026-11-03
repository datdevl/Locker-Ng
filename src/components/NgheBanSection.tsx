import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  Feather,
  Inbox
} from 'lucide-react';

export const NgheBanSection: React.FC = () => {
  const { 
    myLocker, 
    setCurrentView, 
    sendFeedbackLetter, 
    myLetters, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'compose' | 'inbox'>('compose');
  
  // Form State
  const [category, setCategory] = useState<'Cơ sở vật chất & Thiết bị' | 'Đời sống & Chế độ' | 'Chuyên môn & Học cụ' | 'Quy trình & Vận hành' | 'Ý tưởng & Đổi mới'>('Cơ sở vật chất & Thiết bị');
  const [urgency, setUrgency] = useState<'Bình thường' | 'Cần lưu tâm' | 'Khẩn cấp'>('Bình thường');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const paperRef = useRef<HTMLDivElement>(null);
  const pigeonRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (!myLocker) {
      showToast('Vui lòng chọn 1 tủ locker tại phòng trước khi gửi thư nhé!', 'warn');
      return;
    }

    setIsSending(true);

    // GSAP ANIMATION: GẤP THƯ & CHIM BỒ CÂU BAY VÚT QUA CỬA SỔ
    if (paperRef.current && pigeonRef.current) {
      const tl = gsap.timeline();

      // Cuộn tròn bức thư lại
      tl.to(paperRef.current, {
        scale: 0.7,
        rotation: 4,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      // Xuất hiện chim bồ câu trắng
      tl.set(pigeonRef.current, { opacity: 1, scale: 0.5, x: 0, y: 0 });

      // Chim vỗ cánh bay lượn theo đường cong hình sin bay vút lên góc phải màn hình
      tl.to(pigeonRef.current, {
        x: 450,
        y: -350,
        scale: 1.5,
        rotation: 20,
        duration: 1.2,
        ease: 'power1.in',
      });

      // Mờ dần bức thư gốc
      tl.to(paperRef.current, {
        opacity: 0,
        y: -150,
        duration: 0.5,
      }, '<0.2');
    }

    // Bắn hiệu ứng lông vũ & ánh sáng
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fef3c7', '#ca8a04', '#eab308', '#ffffff']
    });

    sendFeedbackLetter({
      lockerId: myLocker.id,
      lockerNumber: myLocker.number,
      alias: myLocker.alias,
      category,
      urgency,
      title: title.trim(),
      content: content.trim(),
    });

    setTimeout(() => {
      setIsSending(false);
      setTitle('');
      setContent('');
      if (paperRef.current) {
        gsap.set(paperRef.current, { scale: 1, rotation: 0, opacity: 1, y: 0 });
      }
      if (pigeonRef.current) {
        gsap.set(pigeonRef.current, { opacity: 0 });
      }
      setActiveTab('inbox');
    }, 1300);
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] p-4 md:p-8 flex flex-col items-center z-10">
      
      {/* CHIM BỒ CÂU GSAP BAY (ẨN MẶC ĐỊNH) */}
      <div 
        ref={pigeonRef}
        className="fixed z-50 pointer-events-none opacity-0 text-5xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        🕊️
      </div>

      {/* HEADER & QUAY LẠI */}
      <div className="max-w-4xl w-full flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('locker-room')}
          className="flex items-center gap-2 text-xs md:text-sm text-amber-200 hover:text-white bg-black/60 border border-amber-600/60 px-4 py-2 rounded-2xl transition shadow-lg backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Phòng Locker</span>
        </button>

        <div className="flex gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-amber-800/60 shadow-lg">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'compose'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-wood-950 shadow-md border border-amber-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Viết Thư Góp Ý</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-wood-950 shadow-md border border-amber-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Hòm Thư Của Tôi ({myLetters.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SOẠN THƯ TAY TRÊN GIẤY DA CỔ ĐIỂN VỚI GSAP ANIMATION */}
      {activeTab === 'compose' && (
        <div 
          ref={paperRef}
          className="max-w-3xl w-full parchment-paper text-stone-900 p-6 md:p-10 rounded-3xl border-4 border-amber-700/60 shadow-2xl relative"
        >
          
          {/* Con dấu sáp đỏ Á Châu */}
          <div className="absolute top-6 right-6 hidden sm:flex flex-col items-center opacity-90">
            <div className="w-16 h-16 rounded-full bg-red-700 border-2 border-red-900 flex items-center justify-center shadow-xl transform rotate-12">
              <span className="text-[10px] font-bold text-amber-200 text-center leading-tight">
                GAIE<br/>BẢO MẬT
              </span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-xs font-mono text-amber-900 uppercase tracking-widest font-black">
              KÊNH GÓP Ý NỘI BỘ • TRƯỜNG QUỐC TẾ Á CHÂU & SIU
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
              Lá Thư Gửi Ban PR Nội Bộ
            </h2>
            <p className="text-xs text-stone-700 mt-1 max-w-lg font-serif">
              Mỗi ý kiến xây dựng của thầy cô và anh chị em là động lực quý giá để nâng cao chất lượng giảng dạy và đời sống tại Á Châu.
            </p>
            {myLocker ? (
              <p className="text-xs text-amber-900 mt-1 font-semibold">
                👤 Đang gửi dưới danh nghĩa: <span className="underline font-bold">{myLocker.alias}</span> (#{myLocker.number})
              </p>
            ) : (
              <p className="text-xs text-red-700 mt-1 font-semibold">
                ⚠️ Bạn chưa nhận tủ locker nào! Bạn vẫn có thể gửi nhưng thư phản hồi sẽ không lưu vào tủ của bạn.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Chủ đề phản hồi / góp ý:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as unknown as typeof category)}
                  className="w-full bg-amber-50/90 border border-amber-400/80 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-amber-700"
                >
                  <option value="Cơ sở vật chất & Thiết bị">Cơ sở vật chất & Thiết bị</option>
                  <option value="Đời sống & Chế độ">Đời sống & Chế độ</option>
                  <option value="Chuyên môn & Học cụ">Chuyên môn & Học cụ</option>
                  <option value="Quy trình & Vận hành">Quy trình & Vận hành</option>
                  <option value="Ý tưởng & Đổi mới">Ý tưởng & Đổi mới phát triển</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Mức độ cần lưu tâm:
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as unknown as typeof urgency)}
                  className="w-full bg-amber-50/90 border border-amber-400/80 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-amber-700"
                >
                  <option value="Bình thường">Bình thường (Đóng góp dài hạn)</option>
                  <option value="Cần lưu tâm">Cần lưu tâm (Nên xử lý sớm)</option>
                  <option value="Khẩn cấp">Khẩn cấp (Ảnh hưởng ngay tiết học/công việc)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Tiêu đề ngắn gọn:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đề xuất lắp thêm máy lọc nước tại phòng giáo viên lầu 2..."
                className="w-full bg-amber-50/90 border border-amber-400/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-amber-700 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Nội dung chi tiết:
              </label>
              <textarea
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hãy chia sẻ thật cụ thể để Ban PR và các phòng ban nắm rõ vấn đề và có giải pháp hỗ trợ kịp thời nhất..."
                className="w-full bg-amber-50/90 border border-amber-400/80 rounded-xl p-3.5 text-xs text-stone-900 focus:outline-amber-700 font-serif placeholder:font-sans placeholder:text-stone-500 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-stone-700 italic flex items-center gap-1 font-serif">
                🕊️ Sau khi gửi, chim bồ câu sẽ bay qua cửa sổ tới Dashboard Ban PR Nội Bộ.
              </span>

              <button
                type="submit"
                disabled={isSending}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-100 rounded-xl font-serif font-bold text-xs shadow-xl transition flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition" />
                <span>{isSending ? 'Đang gấp thư gửi đi...' : 'Thả Chim Bồ Câu Gửi Thư'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* VIEW 2: HÒM THƯ ĐÃ GỬI & XEM PHẢN HỒI HAI CHIỀU */}
      {activeTab === 'inbox' && (
        <div className="max-w-3xl w-full space-y-4">
          <div className="bg-[#2a140b]/80 border border-amber-700/60 p-4 rounded-2xl flex items-center justify-between text-stone-200 backdrop-blur-md shadow-xl">
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-sm">
                Danh Sách Thư Của Tủ #{myLocker?.number || 'Ẩn danh'}
              </h3>
              <p className="text-xs text-stone-400">
                Theo dõi tiến trình giải quyết và đọc thư phản hồi từ các phòng ban.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('compose')}
              className="text-xs bg-amber-600 hover:bg-amber-500 text-wood-950 font-bold px-3.5 py-2 rounded-xl transition shadow-lg"
            >
              + Viết Thư Mới
            </button>
          </div>

          {myLetters.length === 0 ? (
            <div className="text-center py-12 bg-black/50 rounded-3xl border border-amber-950 p-6 backdrop-blur-md">
              <span className="text-4xl">📭</span>
              <p className="text-sm font-serif text-amber-200 mt-2 font-bold">
                Bạn chưa gửi lá thư nào!
              </p>
              <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto">
                Khi bạn gửi một tâm tư hoặc đề xuất, toàn bộ quá trình xử lý và hồi âm sẽ được lưu an toàn tại đây.
              </p>
              <button
                onClick={() => setActiveTab('compose')}
                className="mt-4 px-4 py-2 bg-amber-700 text-amber-100 text-xs font-semibold rounded-xl hover:bg-amber-600 transition"
              >
                Gửi lá thư đầu tiên ngay
              </button>
            </div>
          ) : (
            myLetters.map((letter) => (
              <div
                key={letter.id}
                className="bg-[#2d180f]/90 border-2 border-amber-800/60 hover:border-amber-600 rounded-2xl p-5 text-stone-200 shadow-xl transition backdrop-blur-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/40 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-black/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                      Mã: {letter.id}
                    </span>
                    <span className="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                      {letter.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400">{letter.date}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        letter.status === 'Đã phản hồi'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700 animate-pulse'
                      }`}
                    >
                      {letter.status === 'Đã phản hồi' ? '✓ Đã Có Hồi Âm' : '⏳ Đang Xử Lý'}
                    </span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-amber-100 text-base mb-1">
                  {letter.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-sans mb-3 whitespace-pre-wrap">
                  {letter.content}
                </p>

                {/* KHUNG THƯ HỒI ÂM NẾU PR ĐÃ TRẢ LỜI */}
                {letter.prReply && (
                  <div className="mt-3 p-4 rounded-xl parchment-paper text-stone-900 border border-amber-700/50 shadow-inner">
                    <div className="flex items-center justify-between border-b border-amber-900/20 pb-1.5 mb-2">
                      <span className="font-serif font-bold text-amber-950 text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-800" />
                        Thư Trả Lời Từ: {letter.prReply.responder}
                      </span>
                      <span className="text-[10px] text-stone-600 font-mono">
                        {letter.prReply.replyDate}
                      </span>
                    </div>

                    <p className="text-xs text-stone-800 font-serif leading-relaxed whitespace-pre-wrap">
                      {letter.prReply.content}
                    </p>

                    {letter.prReply.actionPlan && (
                      <div className="mt-2 text-[11px] bg-amber-900/10 p-2 rounded-lg border border-amber-900/20 text-amber-900 font-semibold">
                        ⚡ Hành động: {letter.prReply.actionPlan}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
