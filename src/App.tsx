import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SeasonalDecor } from './components/SeasonalDecor';
import { LockerRoom } from './components/LockerRoom';
import { LockerModal } from './components/LockerModal';
import { NgheBanSection } from './components/NgheBanSection';
import { TramChuaLanh } from './components/TramChuaLanh';
import { PrDashboardModal } from './components/PrDashboardModal';
import { QRCodeModal } from './components/QRCodeModal';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const MainContent: React.FC = () => {
  const { currentView, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-wood-950 text-stone-100 relative overflow-x-hidden">
      
      {/* TRANG TRÍ MÙA LỄ HỘI ĐỘNG (TẾT / NOEL / TỰU TRƯỜNG) */}
      <SeasonalDecor />

      {/* THANH ĐIỀU HƯỚNG CHÍNH */}
      <Navbar />

      {/* NỘI DUNG CHÍNH THEO TAB ĐIỀU HƯỚNG */}
      <main className="flex-1 relative z-20">
        {currentView === 'locker-room' && <LockerRoom />}
        {currentView === 'nghe-ban' && <NgheBanSection />}
        {currentView === 'tram-chua-lanh' && <TramChuaLanh />}
      </main>

      {/* CHÂN TRANG THƯƠNG HIỆU Á CHÂU */}
      <footer className="relative z-20 bg-black/60 border-t border-amber-950/80 py-6 px-4 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <p className="font-serif font-bold text-amber-300">
              TẬP ĐOÀN GIÁO DỤC QUỐC TẾ Á CHÂU (GAIE)
            </p>
            <p className="text-[11px] text-stone-400">
              Trường Quốc tế Á Châu (IPS) • Trường Đại học Quốc tế Sài Gòn (SIU) • Viện Nghiên cứu Châu Á (IAS)
            </p>
          </div>

          <div className="text-right text-[11px] text-stone-400">
            <p>Hệ thống Góp Ý Ẩn Danh & Chăm Sóc Sức Khỏe Tinh Thần Nội Bộ</p>
            <p className="text-amber-500/80">Tương thích 100% GitHub Pages • 0 Đồng Chi Phí Server</p>
          </div>
        </div>
      </footer>

      {/* CÁC HỘP THOẠI POPUP MODAL */}
      <LockerModal />
      <PrDashboardModal />
      <QRCodeModal />

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-stone-900 border-2 border-amber-500/70 text-stone-100 px-5 py-3 rounded-2xl shadow-2xl animate-bounce text-xs font-medium">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          {toast.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return <MainContent />;
}
