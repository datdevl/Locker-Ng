// Quản lý lưu trữ bảo mật ẩn danh trên thiết bị (LocalStorage)

export interface LockerItem {
  id: number;
  number: string; // Vd: "IPS-101", "SIU-205", "AIE-301"
  campus: 'IPS Á Châu' | 'SIU Đại học' | 'IAS Viện' | 'Khối Văn Phòng';
  alias: string; // Bí danh ẩn danh
  isOwnedByMe: boolean;
  isVacant: boolean;
  hasUnreadReply: boolean;
  lastReplySnippet?: string;
  avatarSeed: string; // Emoji bí mật đại diện
}

export interface FeedbackLetter {
  id: string;
  lockerId: number;
  lockerNumber: string;
  alias: string;
  category: 'Cơ sở vật chất & Thiết bị' | 'Đời sống & Chế độ' | 'Chuyên môn & Học cụ' | 'Quy trình & Vận hành' | 'Ý tưởng & Đổi mới';
  urgency: 'Bình thường' | 'Cần lưu tâm' | 'Khẩn cấp';
  title: string;
  content: string;
  date: string;
  status: 'Đã gửi' | 'Đang xử lý' | 'Đã phản hồi';
  prReply?: {
    replyDate: string;
    responder: string;
    content: string;
    actionPlan?: string;
  };
}

export interface HealingWish {
  id: string;
  authorAlias: string;
  campus: string;
  content: string;
  date: string;
  hugs: number;
  candles: number;
  tags: string[];
}

export interface CounselorBooking {
  id: string;
  lockerId: number;
  preferredDate: string;
  topic: string;
  notes: string;
  status: 'Đã tiếp nhận' | 'Đã xếp lịch kín đáo';
  counselorNote?: string;
}

const STORAGE_KEYS = {
  MY_LOCKER_ID: 'gaie_my_locker_id',
  DEVICE_KEY: 'gaie_device_secret_key',
  RECOVERY_WORDS: 'gaie_recovery_words',
  LOCKERS_DATA: 'gaie_lockers_data_v2',
  LETTERS_DATA: 'gaie_letters_data_v2',
  HEALING_DATA: 'gaie_healing_data_v2',
  PLANT_DATA: 'gaie_plant_water_count_v2',
  SEASON: 'gaie_season_theme_v2',
};

// Từ vựng tiếng Việt ấm áp để tạo mã khẩn cấp 4 từ
const SEED_WORDS = [
  'mai', 'dao', 'nang', 'am', 'nho', 'thuong', 'xanh', 'ngoc',
  'song', 'nui', 'sao', 'trang', 'gio', 'may', 'binh', 'an',
  'yeu', 'doi', 'vung', 'vang', 'mam', 'cay', 'niem', 'tin',
  'hy', 'vong', 'hoa', 'sen', 'duong', 'chanh', 'lac', 'quan'
];

export function generate4RecoveryWords(): string {
  const selected: string[] = [];
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * SEED_WORDS.length);
    selected.push(SEED_WORDS[idx]);
  }
  return selected.join('-');
}

// Khởi tạo danh sách tủ mô phỏng cho các cơ sở Á Châu
const INITIAL_LOCKERS: LockerItem[] = [
  { id: 101, number: 'IPS-101', campus: 'IPS Á Châu', alias: 'Cánh Én Vàng', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '🕊️' },
  { id: 102, number: 'IPS-102', campus: 'IPS Á Châu', alias: 'Chưa có chủ', isOwnedByMe: false, isVacant: true, hasUnreadReply: false, avatarSeed: '🌱' },
  { id: 103, number: 'SIU-201', campus: 'SIU Đại học', alias: 'Mầm Cây Nhỏ', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '🌿' },
  { id: 104, number: 'SIU-202', campus: 'SIU Đại học', alias: 'Ngọn Gió Mát', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '🍃' },
  { id: 105, number: 'AIE-301', campus: 'Khối Văn Phòng', alias: 'Chưa có chủ', isOwnedByMe: false, isVacant: true, hasUnreadReply: false, avatarSeed: '⭐' },
  { id: 106, number: 'AIE-302', campus: 'Khối Văn Phòng', alias: 'Đom Đóm Đêm', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '✨' },
  { id: 107, number: 'IPS-103', campus: 'IPS Á Châu', alias: 'Chưa có chủ', isOwnedByMe: false, isVacant: true, hasUnreadReply: false, avatarSeed: '🌸' },
  { id: 108, number: 'SIU-203', campus: 'SIU Đại học', alias: 'Họa Mi Buổi Sáng', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '🐦' },
  { id: 109, number: 'IAS-401', campus: 'IAS Viện', alias: 'Sách Cổ Nâu', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '📖' },
  { id: 110, number: 'IPS-104', campus: 'IPS Á Châu', alias: 'Chưa có chủ', isOwnedByMe: false, isVacant: true, hasUnreadReply: false, avatarSeed: '☀️' },
  { id: 111, number: 'SIU-204', campus: 'SIU Đại học', alias: 'Chưa có chủ', isOwnedByMe: false, isVacant: true, hasUnreadReply: false, avatarSeed: '☕' },
  { id: 112, number: 'AIE-303', campus: 'Khối Văn Phòng', alias: 'Ngọn Nến Ấm', isOwnedByMe: false, isVacant: false, hasUnreadReply: false, avatarSeed: '🕯️' },
];

const INITIAL_HEALING_WISHES: HealingWish[] = [
  {
    id: 'w-1',
    authorAlias: 'Cô Giáo Lớp 3 (IPS Thăng Long)',
    campus: 'IPS Á Châu',
    content: 'Hôm nay trời mưa to nhưng các bạn nhỏ vẫn ngoan ngoãn vào lớp đúng giờ. Nụ cười của học trò là liều thuốc chữa lành mọi mệt mỏi trong tuần!',
    date: 'Hôm nay, 10:15',
    hugs: 24,
    candles: 12,
    tags: ['Năng lượng tích cực', 'Học trò'],
  },
  {
    id: 'w-2',
    authorAlias: 'Trợ Giảng Thầm Lặng (SIU Lewis Campus)',
    campus: 'SIU Đại học',
    content: 'Tuần bảo vệ đề án tốt nghiệp thật căng thẳng, nhưng nhìn thấy sinh viên hoàn thành bài thuyết trình tự tin, mình thấy công sức hướng dẫn bấy lâu thật xứng đáng.',
    date: 'Hôm qua, 16:40',
    hugs: 38,
    candles: 19,
    tags: ['Sinh viên SIU', 'Tận tâm'],
  },
  {
    id: 'w-3',
    authorAlias: 'Nhân Viên Hành Chính Bận Rộn',
    campus: 'Khối Văn Phòng',
    content: 'Nhắc nhở bản thân và mọi người: Uống đủ 2 lít nước mỗi ngày và đứng dậy vươn vai sau 45 phút nhìn màn hình nhé đồng nghiệp ơi!',
    date: '2 ngày trước',
    hugs: 45,
    candles: 27,
    tags: ['Chăm sóc sức khỏe', 'Đồng nghiệp'],
  },
];

export const storage = {
  getMyLockerId(): number | null {
    const val = localStorage.getItem(STORAGE_KEYS.MY_LOCKER_ID);
    return val ? parseInt(val, 10) : null;
  },

  setMyLockerId(id: number, recoveryWords?: string) {
    localStorage.setItem(STORAGE_KEYS.MY_LOCKER_ID, id.toString());
    if (recoveryWords) {
      localStorage.setItem(STORAGE_KEYS.RECOVERY_WORDS, recoveryWords);
    }
  },

  getRecoveryWords(): string | null {
    return localStorage.getItem(STORAGE_KEYS.RECOVERY_WORDS);
  },

  getLockers(): LockerItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCKERS_DATA);
    let list: LockerItem[] = raw ? JSON.parse(raw) : INITIAL_LOCKERS;
    const myId = this.getMyLockerId();

    return list.map(l => ({
      ...l,
      isOwnedByMe: myId !== null && l.id === myId,
    }));
  },

  saveLockers(lockers: LockerItem[]) {
    localStorage.setItem(STORAGE_KEYS.LOCKERS_DATA, JSON.stringify(lockers));
  },

  claimLocker(lockerId: number, alias: string): { success: boolean; recoveryWords: string } {
    const lockers = this.getLockers();
    const target = lockers.find(l => l.id === lockerId);
    if (!target || !target.isVacant) {
      return { success: false, recoveryWords: '' };
    }

    const recoveryWords = generate4RecoveryWords();
    const updated = lockers.map(l => {
      if (l.id === lockerId) {
        return {
          ...l,
          alias,
          isVacant: false,
          isOwnedByMe: true,
        };
      }
      return l;
    });

    this.saveLockers(updated);
    this.setMyLockerId(lockerId, recoveryWords);
    return { success: true, recoveryWords };
  },

  recoverLockerByWords(words: string): boolean {
    const cleanWords = words.trim().toLowerCase();
    // Giả lập khôi phục nếu khớp mã hoặc khôi phục mặc định tủ #102 nếu người dùng test
    const stored = this.getRecoveryWords();
    if (stored && stored.toLowerCase() === cleanWords) {
      return true;
    }
    // Hỗ trợ mã test thông dụng: "mai-vang-nang-am"
    if (cleanWords === 'mai-vang-nang-am') {
      this.claimLocker(102, 'Người Bạn Trở Về');
      return true;
    }
    return false;
  },

  getLetters(): FeedbackLetter[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LETTERS_DATA);
    if (!raw) {
      // Dữ liệu thư mẫu sẵn sàng trải nghiệm
      const sampleLetters: FeedbackLetter[] = [
        {
          id: 'fb-001',
          lockerId: 101,
          lockerNumber: 'IPS-101',
          alias: 'Cánh Én Vàng',
          category: 'Cơ sở vật chất & Thiết bị',
          urgency: 'Cần lưu tâm',
          title: 'Đề xuất bảo dưỡng micro và máy chiếu phòng học lầu 3',
          content: 'Kính gửi Ban Giám Hiệu và Ban PR Nội Bộ, em nhận thấy dàn âm thanh micro phòng học 302 thỉnh thoảng bị rè khi giảng bài, khiến học trò khó nghe rõ bài giảng môn Tiếng Anh. Rất mong trường cho đội ngũ kỹ thuật kiểm tra giúp ạ.',
          date: '02/11/2026',
          status: 'Đã phản hồi',
          prReply: {
            replyDate: '03/11/2026',
            responder: 'Ban PR Nội Bộ & Bộ Phận Cơ Sở Vật Chất',
            content: 'Chào Cánh Én Vàng! Rất cảm ơn phản ánh kịp thời của thầy/cô. Đội ngũ Kỹ thuật - CSVC đã lên lịch thay mới đầu thu micro không dây phòng 302 vào 17:30 chiều nay sau giờ tan học. Chúc thầy/cô luôn dồi dào năng lượng trong từng tiết giảng!',
            actionPlan: 'Đã hoàn thành thay thế thiết bị lúc 18:00.',
          },
        },
      ];
      localStorage.setItem(STORAGE_KEYS.LETTERS_DATA, JSON.stringify(sampleLetters));
      return sampleLetters;
    }
    return JSON.parse(raw);
  },

  saveLetters(letters: FeedbackLetter[]) {
    localStorage.setItem(STORAGE_KEYS.LETTERS_DATA, JSON.stringify(letters));
  },

  sendLetter(letter: Omit<FeedbackLetter, 'id' | 'date' | 'status'>): FeedbackLetter {
    const letters = this.getLetters();
    const newLetter: FeedbackLetter = {
      ...letter,
      id: 'fb-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: 'Đã gửi',
    };
    letters.unshift(newLetter);
    this.saveLetters(letters);
    return newLetter;
  },

  replyLetter(letterId: string, replyContent: string, responderName: string) {
    const letters = this.getLetters();
    let repliedLockerId: number | null = null;

    const updated = letters.map(item => {
      if (item.id === letterId) {
        repliedLockerId = item.lockerId;
        return {
          ...item,
          status: 'Đã phản hồi' as const,
          prReply: {
            replyDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            responder: responderName || 'Ban PR Nội Bộ & BGH Á Châu',
            content: replyContent,
          },
        };
      }
      return item;
    });

    this.saveLetters(updated);

    // Kích hoạt lá thư đỏ trên tủ tương ứng
    if (repliedLockerId !== null) {
      const lockers = this.getLockers();
      const updatedLockers = lockers.map(l => {
        if (l.id === repliedLockerId) {
          return {
            ...l,
            hasUnreadReply: true,
            lastReplySnippet: replyContent.slice(0, 50) + '...',
          };
        }
        return l;
      });
      this.saveLockers(updatedLockers);
    }
  },

  markLockerReplyRead(lockerId: number) {
    const lockers = this.getLockers();
    const updated = lockers.map(l => {
      if (l.id === lockerId) {
        return { ...l, hasUnreadReply: false };
      }
      return l;
    });
    this.saveLockers(updated);
  },

  getHealingWishes(): HealingWish[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALING_DATA);
    return raw ? JSON.parse(raw) : INITIAL_HEALING_WISHES;
  },

  saveHealingWishes(wishes: HealingWish[]) {
    localStorage.setItem(STORAGE_KEYS.HEALING_DATA, JSON.stringify(wishes));
  },

  addHealingWish(content: string, authorAlias: string, campus: string, tags: string[]): HealingWish {
    const wishes = this.getHealingWishes();
    const newWish: HealingWish = {
      id: 'w-' + Date.now(),
      authorAlias: authorAlias || 'Đồng Nghiệp Ẩn Danh',
      campus: campus || 'Tập đoàn Á Châu',
      content,
      date: 'Vừa xong',
      hugs: 1,
      candles: 1,
      tags: tags.length > 0 ? tags : ['Tâm sự'],
    };
    wishes.unshift(newWish);
    this.saveHealingWishes(wishes);
    return newWish;
  },

  giveHug(wishId: string): number {
    const wishes = this.getHealingWishes();
    let newCount = 0;
    const updated = wishes.map(w => {
      if (w.id === wishId) {
        newCount = w.hugs + 1;
        return { ...w, hugs: newCount };
      }
      return w;
    });
    this.saveHealingWishes(updated);
    return newCount;
  },

  giveCandle(wishId: string): number {
    const wishes = this.getHealingWishes();
    let newCount = 0;
    const updated = wishes.map(w => {
      if (w.id === wishId) {
        newCount = w.candles + 1;
        return { ...w, candles: newCount };
      }
      return w;
    });
    this.saveHealingWishes(updated);
    return newCount;
  },

  getPlantWaterCount(): number {
    const val = localStorage.getItem(STORAGE_KEYS.PLANT_DATA);
    return val ? parseInt(val, 10) : 3; // Mặc định đã tưới 3 lần
  },

  waterPlant(): number {
    const count = this.getPlantWaterCount() + 1;
    localStorage.setItem(STORAGE_KEYS.PLANT_DATA, count.toString());
    return count;
  },

  getSeasonTheme(): 'tet' | 'xmas' | 'normal' {
    const raw = localStorage.getItem(STORAGE_KEYS.SEASON);
    if (raw === 'tet' || raw === 'xmas' || raw === 'normal') return raw;
    // Tự động nhận diện tháng trong năm
    const month = new Date().getMonth() + 1;
    if (month === 1 || month === 2) return 'tet';
    if (month === 12) return 'xmas';
    return 'tet'; // Mặc định Tết tươi vui chào đón năm mới
  },

  setSeasonTheme(theme: 'tet' | 'xmas' | 'normal') {
    localStorage.setItem(STORAGE_KEYS.SEASON, theme);
  },
};
