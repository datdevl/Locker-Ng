import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { FeedbackLetter } from '../utils/storage';

export const PrDashboardModal: React.FC = () => {
  const { 
    isPrModalOpen, 
    setIsPrModalOpen, 
    letters, 
    replyToLetter 
  } = useApp();

  const [selectedLetter, setSelectedLetter] = useState<FeedbackLetter | null>(null);
  const [replyText, setReplyText] = useState('');
  const [responderName, setResponderName] = useState('Ban PR Nội Bộ & Ban Giám Hiệu');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isPrModalOpen) return null;

  const filteredLetters = letters.filter(l => {
    if (filterStatus === 'all') return true;
    return l.status === filterStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLetter || !replyText.trim()) return;

    replyToLetter(selectedLetter.id, replyText.trim(), responderName);
    setReplyText('');
    setSelectedLetter(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-600/70 rounded-3xl max-w-4xl w-full h-[85vh] shadow-2xl flex flex-col text-stone-200 overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-amber-900/40 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-200 text-base md:text-lg">
                  Bảng Điều Phối Phản Hồi • Ban PR Nội Bộ Á Châu
                </h3>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono">
                  Operator Panel
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Tiếp nhận góp ý ẩn danh từ các tủ locker và gửi thư phản hồi trực tiếp cho nhân viên
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPrModalOpen(false)}
            className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY: 2 CỘT (DANH SÁCH & SOẠN HỒI ÂM) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* CỘT TRÁI (5 CỘT): DANH SÁCH TICKET */}
          <div className="md:col-span-5 border-r border-amber-900/30 flex flex-col bg-stone-950/40 overflow-hidden">
            
            {/* Lọc trạng thái */}
            <div className="p-3 border-b border-stone-800 flex gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Đã gửi', label: 'Chưa xử lý' },
                { id: 'Đã phản hồi', label: 'Đã hồi âm' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    filterStatus === f.id
                      ? 'bg-amber-800 text-amber-100 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Danh sách ticket */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredLetters.length === 0 ? (
                <div className="text-center py-10 text-stone-500 text-xs">
                  Không có thư góp ý nào trong mục này.
                </div>
              ) : (
                filteredLetters.map(letter => (
                  <div
                    key={letter.id}
                    onClick={() => setSelectedLetter(letter)}
                    className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                      selectedLetter?.id === letter.id
                        ? 'bg-amber-950/70 border-amber-500'
                        : 'bg-stone-900/60 border-stone-800 hover:border-amber-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-amber-400 font-bold">
                        #{letter.lockerNumber} ({letter.alias})
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        letter.status === 'Đã phản hồi' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300 animate-pulse'
                      }`}>
                        {letter.status}
                      </span>
                    </div>

                    <p className="font-semibold text-stone-200 truncate">
                      {letter.title}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400">
                      <span>{letter.category}</span>
                      <span>{letter.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* CỘT PHẢI (7 CỘT): CHI TIẾT & FORM PHẢN HỒI */}
          <div className="md:col-span-7 flex flex-col p-5 overflow-y-auto bg-stone-900/30">
            {selectedLetter ? (
              <div className="space-y-4">
                
                {/* Thông tin Ticket */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                        TỦ #{selectedLetter.lockerNumber} • {selectedLetter.category}
                      </span>
                      <h4 className="text-base font-serif font-bold text-amber-100 mt-0.5">
                        {selectedLetter.title}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                      Mức độ: {selectedLetter.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 font-serif leading-relaxed mt-2 whitespace-pre-wrap bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
                    "{selectedLetter.content}"
                  </p>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-stone-400">
                    <span>Người gửi ẩn danh: <b>{selectedLetter.alias}</b></span>
                    <span>Ngày gửi: {selectedLetter.date}</span>
                  </div>
                </div>

                {/* Nếu đã phản hồi trước đó */}
                {selectedLetter.prReply && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs">
                    <p className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thư đã hồi âm vào ngày {selectedLetter.prReply.replyDate}:
                    </p>
                    <p className="text-stone-300 font-serif italic whitespace-pre-wrap">
                      "{selectedLetter.prReply.content}"
                    </p>
                  </div>
                )}

                {/* Form Soạn Phản Hồi Mới */}
                <form onSubmit={handleSendReply} className="space-y-3 bg-stone-950 p-4 rounded-2xl border border-amber-900/60">
                  <h5 className="font-serif font-bold text-amber-200 text-xs flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    Soạn Thư Hồi Âm Gửi Vào Tủ Nhân Viên:
                  </h5>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Đơn vị ký tên phản hồi:
                    </label>
                    <input
                      type="text"
                      value={responderName}
                      onChange={(e) => setResponderName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Nội dung thư phản hồi chân thành:
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Chào bạn, Ban PR và bộ phận phụ trách xin chân thành cảm ơn ý kiến đóng góp của bạn. Chúng tôi xin thông báo phương án giải quyết cụ thể như sau..."
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 focus:outline-amber-500 leading-relaxed font-serif"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400 italic">
                      * Tủ #{selectedLetter.lockerNumber} sẽ lập tức nhấp nháy đèn thư đỏ.
                    </span>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Hồi Âm Vào Tủ</span>
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 text-xs">
                <FileText className="w-10 h-10 mb-2 opacity-30 text-amber-400" />
                <p className="font-semibold text-stone-300">
                  Chọn một lá thư góp ý ở cột bên trái để đọc và hồi âm
                </p>
                <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
                  Khi bạn gửi phản hồi, chiếc tủ locker của nhân viên đó sẽ tự động kích hoạt thông báo lá thư đỏ nhấp nháy.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
