import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, LockerItem, FeedbackLetter, HealingWish } from '../utils/storage';
import { cloudService } from '../services/cloudService';
import { isSupabaseConfigured } from '../lib/supabase';
import { sound } from '../utils/soundEngine';

export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night';

interface AppContextType {
  // Navigation & View
  currentView: 'locker-room' | 'nghe-ban' | 'tram-chua-lanh';
  setCurrentView: (view: 'locker-room' | 'nghe-ban' | 'tram-chua-lanh') => void;

  // Time & Space Environment (Bối cảnh không gian & thời gian 2D)
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;

  // Lockers
  lockers: LockerItem[];
  myLocker: LockerItem | null;
  recoveryWords: string | null;
  claimLocker: (lockerId: number, alias: string) => Promise<{ success: boolean; recoveryWords: string }>;
  recoverLocker: (words: string) => boolean;
  selectedLocker: LockerItem | null;
  setSelectedLocker: (locker: LockerItem | null) => void;

  // Feedback Letters
  letters: FeedbackLetter[];
  myLetters: FeedbackLetter[];
  sendFeedbackLetter: (data: Omit<FeedbackLetter, 'id' | 'date' | 'status'>) => Promise<void>;
  replyToLetter: (letterId: string, replyContent: string, responderName: string, lockerId: number) => Promise<void>;

  // Healing Space
  healingWishes: HealingWish[];
  addWish: (content: string, authorAlias: string, campus: string, tags: string[]) => Promise<void>;
  hugWish: (id: string, currentHugs: number) => Promise<void>;
  candleWish: (id: string) => void;
  plantWaterCount: number;
  waterPlant: () => void;

  // Audio Ambient
  isRainActive: boolean;
  isLofiActive: boolean;
  volume: number;
  toggleRain: () => void;
  toggleLofi: () => void;
  setVolume: (val: number) => void;

  // Season & Theme
  seasonTheme: 'tet' | 'xmas' | 'normal';
  setSeasonTheme: (theme: 'tet' | 'xmas' | 'normal') => void;

  // Modals
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  isPrModalOpen: boolean;
  setIsPrModalOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isCloudConnected: boolean;

  // Toast / Status Message
  showToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
  toast: { msg: string; type: 'success' | 'info' | 'warn' } | null;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'locker-room' | 'nghe-ban' | 'tram-chua-lanh'>('locker-room');
  const [lockers, setLockers] = useState<LockerItem[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<LockerItem | null>(null);
  const [recoveryWords, setRecoveryWords] = useState<string | null>(null);
  const [letters, setLetters] = useState<FeedbackLetter[]>([]);
  const [healingWishes, setHealingWishes] = useState<HealingWish[]>([]);
  const [plantWaterCount, setPlantWaterCount] = useState<number>(3);
  const [seasonTheme, setSeasonThemeState] = useState<'tet' | 'xmas' | 'normal'>('tet');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Time of Day state: Mặc định tự động theo giờ hệ thống
  const [timeOfDay, setTimeOfDayState] = useState<TimeOfDay>(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 19) return 'sunset';
    return 'night';
  });

  // Audio
  const [isRainActive, setIsRainActive] = useState<boolean>(false);
  const [isLofiActive, setIsLofiActive] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.4);

  // Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const setTimeOfDay = (t: TimeOfDay) => {
    setTimeOfDayState(t);
    const labels = {
      dawn: 'Bình Minh Ấm Áp 🌅',
      day: 'Ban Ngày Nắng Sân Trường ☀️',
      sunset: 'Hoàng Hôn Trầm Lắng 🌇',
      night: 'Đêm Ngàn Sao & Đèn Dầu 🌙'
    };
    showToast(`Không gian đã chuyển sang: ${labels[t]}`, 'info');
  };

  // Nạp dữ liệu đồng bộ (Cloud hoặc Local Storage)
  const refreshData = async () => {
    setIsCloudConnected(isSupabaseConfigured());
    const [cloudLockers, cloudLetters, cloudWishes] = await Promise.all([
      cloudService.fetchLockers(),
      cloudService.fetchLetters(),
      cloudService.fetchWishes(),
    ]);

    setLockers(cloudLockers);
    setLetters(cloudLetters);
    setHealingWishes(cloudWishes);

    const myId = storage.getMyLockerId();
    if (myId) {
      const my = cloudLockers.find(l => l.id === myId) || null;
      if (my?.hasUnreadReply) {
        sound.playNotification();
      }
    }
  };

  useEffect(() => {
    refreshData();
    setRecoveryWords(storage.getRecoveryWords());
    setSeasonThemeState(storage.getSeasonTheme());
    setPlantWaterCount(storage.getPlantWaterCount());

    // Lắng nghe Realtime từ Supabase khi có thay đổi trên bất kỳ máy nào
    const unsubscribe = cloudService.subscribeRealtime(() => {
      refreshData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const myLocker = lockers.find(l => l.isOwnedByMe) || null;
  const myLetters = myLocker ? letters.filter(l => l.lockerId === myLocker.id) : [];

  const claimLocker = async (lockerId: number, alias: string) => {
    const res = await cloudService.claimLocker(lockerId, alias);
    if (res.success) {
      await refreshData();
      setRecoveryWords(res.recoveryWords);
      sound.playLockerOpen();
      showToast(`Đã nhận tủ thành công! Mật mã khẩn cấp của bạn: ${res.recoveryWords}`);
    }
    return res;
  };

  const recoverLocker = (words: string) => {
    const ok = storage.recoverLockerByWords(words);
    if (ok) {
      refreshData();
      setRecoveryWords(words);
      sound.playLockerOpen();
      showToast('Đã khôi phục thành công quyền mở tủ của bạn!', 'success');
      return true;
    }
    showToast('Mật mã 4 từ không chính xác, vui lòng thử lại.', 'warn');
    return false;
  };

  const sendFeedbackLetter = async (data: Omit<FeedbackLetter, 'id' | 'date' | 'status'>) => {
    await cloudService.sendLetter(data);
    sound.playLetterSend();
    await refreshData();
    showToast('Lá thư đã được chim bồ câu chuyển tới Ban PR Nội Bộ!', 'success');
  };

  const replyToLetter = async (letterId: string, replyContent: string, responderName: string, lockerId: number) => {
    await cloudService.replyLetter(letterId, replyContent, responderName, lockerId);
    await refreshData();
    sound.playNotification();
    showToast('Đã gửi phản hồi thành công vào tủ của nhân viên!', 'success');
  };

  const addWish = async (content: string, authorAlias: string, campus: string, tags: string[]) => {
    await cloudService.addWish(content, authorAlias, campus, tags);
    await refreshData();
    sound.playHugChime();
    showToast('Thông điệp ấm áp của bạn đã được treo lên Cây Đom Đóm!', 'success');
  };

  const hugWish = async (id: string, currentHugs: number) => {
    await cloudService.giveHug(id, currentHugs);
    await refreshData();
    sound.playHugChime();
  };

  const candleWish = (id: string) => {
    storage.giveCandle(id);
    refreshData();
  };

  const waterPlant = () => {
    const count = storage.waterPlant();
    setPlantWaterCount(count);
    sound.playHugChime();
    showToast('Mầm cây hạnh phúc đã nhận thêm 1 giọt nước ngọt lành!', 'success');
  };

  // Audio toggles
  const toggleRain = () => {
    const next = !isRainActive;
    setIsRainActive(next);
    sound.toggleRain(next, volume);
    if (next) showToast('Đang phát tiếng mưa rơi trên mái trường Á Châu...', 'info');
  };

  const toggleLofi = () => {
    const next = !isLofiActive;
    setIsLofiActive(next);
    sound.toggleLofi(next);
    if (next) showToast('Đang phát giai điệu Lofi thư giãn...', 'info');
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    sound.setVolume(val);
    if (isRainActive) sound.toggleRain(true, val);
  };

  const setSeasonTheme = (theme: 'tet' | 'xmas' | 'normal') => {
    setSeasonThemeState(theme);
    storage.setSeasonTheme(theme);
    showToast(`Đã chuyển sang không gian: ${theme === 'tet' ? 'Tết Nguyên Đán 🌸' : theme === 'xmas' ? 'Giáng Sinh Ấm Áp ❄️' : 'Mùa Tựu Trường ☀️'}`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        timeOfDay,
        setTimeOfDay,
        lockers,
        myLocker,
        recoveryWords,
        claimLocker,
        recoverLocker,
        selectedLocker,
        setSelectedLocker,
        letters,
        myLetters,
        sendFeedbackLetter,
        replyToLetter,
        healingWishes,
        addWish,
        hugWish,
        candleWish,
        plantWaterCount,
        waterPlant,
        isRainActive,
        isLofiActive,
        volume,
        toggleRain,
        toggleLofi,
        setVolume,
        seasonTheme,
        setSeasonTheme,
        isQrModalOpen,
        setIsQrModalOpen,
        isPrModalOpen,
        setIsPrModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isCloudConnected,
        showToast,
        toast,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
