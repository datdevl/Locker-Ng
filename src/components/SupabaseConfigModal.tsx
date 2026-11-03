import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Zap, 
  HelpCircle,
  Server
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  isSupabaseConfigured, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials 
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setIsConfigured(isSupabaseConfigured());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) return;

    saveSupabaseCredentials(url.trim(), anonKey.trim());
    setIsConfigured(true);
    onConfigChanged();
    alert('Đã kết nối thành công với Supabase Cloud! Hệ thống đang đồng bộ đa thiết bị theo thời gian thực.');
    onClose();
  };

  const handleDisconnect = () => {
    if (confirm('Bạn có chắc muốn ngắt kết nối Supabase và quay lại chế độ lưu trữ cục bộ (Local Demo)?')) {
      clearSupabaseCredentials();
      setUrl('');
      setAnonKey('');
      setIsConfigured(false);
      onConfigChanged();
      onClose();
    }
  };

  const copySqlNotice = () => {
    navigator.clipboard.writeText('Vui lòng mở file supabase-schema.sql trong thư mục dự án và dán vào Supabase SQL Editor');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-[#24130a] via-[#1a0c06] to-black border-2 border-amber-500/80 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-stone-100 relative">
        
        {/* NÚT ĐÓNG */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-2xl shadow-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-200">
              Kết Nối Đám Mây Supabase
            </h3>
            <p className="text-xs text-stone-400">
              Đồng bộ dữ liệu hai chiều tức thì giữa các điện thoại và máy tính
            </p>
          </div>
        </div>

        {/* TRẠNG THÁI HIỆN TẠI */}
        <div className={`p-3.5 rounded-2xl border mb-5 flex items-center justify-between text-xs ${
          isConfigured 
            ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200' 
            : 'bg-amber-950/70 border-amber-700 text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="font-semibold">
              {isConfigured 
                ? 'Đã kết nối Supabase Cloud (Đa thiết bị Realtime)' 
                : 'Đang ở chế độ Cục Bộ (Chưa kết nối Supabase)'}
            </span>
          </div>

          {isConfigured && (
            <button
              onClick={handleDisconnect}
              className="text-[11px] bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 px-2 py-0.5 rounded transition"
            >
              Ngắt kết nối
            </button>
          )}
        </div>

        {/* FORM NHẬP THÔNG TIN KẾT NỐI */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Project URL (Đường dẫn Supabase của bạn):
            </label>
            <input
              type="url"
              required
              placeholder="https://xyzabcdefg.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black/60 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Anon Public Key (Khóa công khai):
            </label>
            <textarea
              required
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full bg-black/60 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Lưu & Kích Hoạt Đồng Bộ Đa Thiết Bị</span>
          </button>
        </form>

        {/* HƯỚNG DẪN 3 BƯỚC TẠO SUPABASE MIỄN PHÍ */}
        <div className="mt-5 p-3.5 bg-black/50 border border-amber-900/40 rounded-2xl text-[11px] text-stone-300 space-y-2 text-left">
          <p className="font-bold text-amber-300 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Cách tạo tài khoản Supabase chỉ trong 2 phút (0đ):
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-stone-400">
            <li>
              Vào <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">supabase.com</a> bấm <b>Start your project</b> (Đăng nhập bằng tài khoản GitHub).
            </li>
            <li>
              Tạo Project mới tên là <code>gaie-locker</code>.
            </li>
            <li>
              Vào mục <b>SQL Editor</b> trên thanh trái, mở file <code>supabase-schema.sql</code> có sẵn trong thư mục dự án của bạn, copy toàn bộ nội dung dán vào và bấm <b>Run</b>!
            </li>
            <li>
              Vào mục <b>Project Settings &gt; API</b>, copy <b>Project URL</b> và <b>anon public key</b> dán vào 2 ô phía trên!
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
};
