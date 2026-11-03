import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, LockerItem, FeedbackLetter, HealingWish } from '../utils/storage';
import { sound } from '../utils/soundEngine';

interface AppContextType {
  // Navigation & View
  currentView: 'locker-room' | 'nghe-ban' | 'tram-chua-lanh';
  setCurrentView: (view: 'locker-room' | 'nghe-ban' | 'tram-chua-lanh') => void;

  // Lockers
  lockers: LockerItem[];
  myLocker: LockerItem | null;
  recoveryWords: string | null;
  claimLocker: (lockerId: number, alias: string) => { success: boolean; recoveryWords: string };
  recoverLocker: (words: string) => boolean;
  selectedLocker: LockerItem | null;
  setSelectedLocker: (locker: LockerItem | null) => void;

  // Feedback Letters
  letters: FeedbackLetter[];
  myLetters: FeedbackLetter[];
  sendFeedbackLetter: (data: Omit<FeedbackLetter, 'id' | 'date' | 'status'>) => void;
  replyToLetter: (letterId: string, replyContent: string, responderName: string) => void;

  // Healing Space
  healingWishes: HealingWish[];
  addWish: (content: string, authorAlias: string, campus: string, tags: string[]) => void;
  hugWish: (id: string) => void;
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

  // Toast / Status Message
  showToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
  toast: { msg: string; type: 'success' | 'info' | 'warn' } | null;
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

  // Audio
  const [isRainActive, setIsRainActive] = useState<boolean>(false);
  const [isLofiActive, setIsLofiActive] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.4);

  // Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  // Khởi tạo dữ liệu từ Storage
  useEffect(() => {
    refreshAllData();
    setRecoveryWords(storage.getRecoveryWords());
    setSeasonThemeState(storage.getSeasonTheme());
    setPlantWaterCount(storage.getPlantWaterCount());
  }, []);

  const refreshAllData = () => {
    const list = storage.getLockers();
    setLockers(list);
    setLetters(storage.getLetters());
    setHealingWishes(storage.getHealingWishes());

    const myId = storage.getMyLockerId();
    if (myId) {
      const my = list.find(l => l.id === myId) || null;
      if (my?.hasUnreadReply) {
        sound.playNotification();
      }
    }
  };

  const myLocker = lockers.find(l => l.isOwnedByMe) || null;
  const myLetters = myLocker ? letters.filter(l => l.lockerId === myLocker.id) : [];

  const claimLocker = (lockerId: number, alias: string) => {
    const res = storage.claimLocker(lockerId, alias);
    if (res.success) {
      refreshAllData();
      setRecoveryWords(res.recoveryWords);
      sound.playLockerOpen();
      showToast(`Đã nhận tủ thành công! Mật mã khẩn cấp của bạn: ${res.recoveryWords}`);
    }
    return res;
  };

  const recoverLocker = (words: string) => {
    const ok = storage.recoverLockerByWords(words);
    if (ok) {
      refreshAllData();
      setRecoveryWords(words);
      sound.playLockerOpen();
      showToast('Đã khôi phục thành công quyền mở tủ của bạn!', 'success');
      return true;
    }
    showToast('Mật mã 4 từ không chính xác, vui lòng thử lại.', 'warn');
    return false;
  };

  const sendFeedbackLetter = (data: Omit<FeedbackLetter, 'id' | 'date' | 'status'>) => {
    storage.sendLetter(data);
    sound.playLetterSend();
    refreshAllData();
    showToast('Lá thư đã được chim bồ câu chuyển tới Ban PR Nội Bộ!', 'success');
  };

  const replyToLetter = (letterId: string, replyContent: string, responderName: string) => {
    storage.replyLetter(letterId, replyContent, responderName);
    refreshAllData();
    sound.playNotification();
    showToast('Đã gửi phản hồi thành công vào tủ của nhân viên!', 'success');
  };

  const addWish = (content: string, authorAlias: string, campus: string, tags: string[]) => {
    storage.addHealingWish(content, authorAlias, campus, tags);
    refreshAllData();
    sound.playHugChime();
    showToast('Thông điệp ấm áp của bạn đã được gắn lên Cây Đom Đóm!', 'success');
  };

  const hugWish = (id: string) => {
    storage.giveHug(id);
    refreshAllData();
    sound.playHugChime();
  };

  const candleWish = (id: string) => {
    storage.giveCandle(id);
    refreshAllData();
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
        showToast,
        toast,
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
