import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { storage, LockerItem, FeedbackLetter, HealingWish, generate4RecoveryWords } from '../utils/storage';

export const cloudService = {
  // LẤY DANH SÁCH TỦ LOCKER
  async fetchLockers(): Promise<LockerItem[]> {
    const supabase = getSupabaseClient();
    const myId = storage.getMyLockerId();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('lockers')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            number: d.number,
            campus: d.campus,
            alias: d.alias,
            isOwnedByMe: myId !== null && d.id === myId,
            isVacant: d.is_vacant,
            hasUnreadReply: d.has_unread_reply,
            lastReplySnippet: d.last_reply_snippet,
            avatarSeed: '🔑',
          }));
        }
      } catch (err) {
        console.warn('Không thể tải từ Supabase, chuyển sang bộ nhớ máy:', err);
      }
    }

    return storage.getLockers();
  },

  // NHẬN TỦ TRÊN ĐÁM MÂY
  async claimLocker(lockerId: number, alias: string): Promise<{ success: boolean; recoveryWords: string }> {
    const recoveryWords = generate4RecoveryWords();
    const supabase = getSupabaseClient();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('lockers')
          .update({
            alias,
            is_vacant: false,
            recovery_words: recoveryWords,
          })
          .eq('id', lockerId);

        if (!error) {
          storage.setMyLockerId(lockerId, recoveryWords);
          return { success: true, recoveryWords };
        }
      } catch (err) {
        console.warn('Lỗi nhận tủ trên Supabase:', err);
      }
    }

    // Fallback sang storage cục bộ
    return storage.claimLocker(lockerId, alias);
  },

  // LẤY DANH SÁCH THƯ GÓP Ý
  async fetchLetters(): Promise<FeedbackLetter[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('feedback_letters')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            lockerId: d.locker_id,
            lockerNumber: d.locker_number,
            alias: d.alias,
            category: d.category,
            urgency: d.urgency,
            title: d.title,
            content: d.content,
            date: new Date(d.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            status: d.status,
            prReply: d.pr_reply_content ? {
              replyDate: d.pr_reply_date || '',
              responder: d.pr_reply_responder || '',
              content: d.pr_reply_content || '',
            } : undefined,
          }));
        }
      } catch (err) {
        console.warn('Lỗi tải thư từ Supabase:', err);
      }
    }

    return storage.getLetters();
  },

  // GỬI THƯ GÓP Ý LÊN ĐÁM MÂY (CHIM BỒ CÂU BAY ĐẾN DASHBOARD PR MỌI THIẾT BỊ)
  async sendLetter(letter: Omit<FeedbackLetter, 'id' | 'date' | 'status'>): Promise<void> {
    const supabase = getSupabaseClient();
    const id = 'fb-' + Math.floor(1000 + Math.random() * 9000);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase
          .from('feedback_letters')
          .insert([
            {
              id,
              locker_id: letter.lockerId,
              locker_number: letter.lockerNumber,
              alias: letter.alias,
              category: letter.category,
              urgency: letter.urgency,
              title: letter.title,
              content: letter.content,
              status: 'Đã gửi',
            },
          ]);
      } catch (err) {
        console.warn('Lỗi gửi thư lên Supabase:', err);
      }
    }

    // Luôn lưu bản sao vào máy
    storage.sendLetter(letter);
  },

  // BAN PR TRẢ LỜI THƯ TRÊN ĐÁM MÂY (KÍCH HOẠT ĐÈN ĐỎ TRÊN MÁY NHÂN VIÊN)
  async replyLetter(letterId: string, replyContent: string, responderName: string, lockerId: number): Promise<void> {
    const supabase = getSupabaseClient();
    const dateStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    if (supabase && isSupabaseConfigured()) {
      try {
        // Cập nhật thư
        await supabase
          .from('feedback_letters')
          .update({
            status: 'Đã phản hồi',
            pr_reply_date: dateStr,
            pr_reply_responder: responderName || 'Ban PR Nội Bộ Á Châu',
            pr_reply_content: replyContent,
          })
          .eq('id', letterId);

        // Kích hoạt lá thư đỏ trên tủ tương ứng trên đám mây
        await supabase
          .from('lockers')
          .update({
            has_unread_reply: true,
            last_reply_snippet: replyContent.slice(0, 50) + '...',
          })
          .eq('id', lockerId);
      } catch (err) {
        console.warn('Lỗi phản hồi trên Supabase:', err);
      }
    }

    storage.replyLetter(letterId, replyContent, responderName);
  },

  // ĐÁNH DẤU ĐÃ ĐỌC THƯ TRÊN TỦ
  async markLockerRead(lockerId: number): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase
          .from('lockers')
          .update({ has_unread_reply: false })
          .eq('id', lockerId);
      } catch (err) {
        console.warn('Lỗi cập nhật đã đọc trên Supabase:', err);
      }
    }
    storage.markLockerReplyRead(lockerId);
  },

  // LẤY DANH SÁCH LỜI NHẮN ĐOM ĐÓM
  async fetchWishes(): Promise<HealingWish[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('healing_wishes')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            authorAlias: d.author_alias,
            campus: d.campus,
            content: d.content,
            date: new Date(d.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            hugs: d.hugs || 0,
            candles: d.candles || 0,
            tags: d.tags || ['Năng lượng tích cực'],
          }));
        }
      } catch (err) {
        console.warn('Lỗi lấy đom đóm từ Supabase:', err);
      }
    }
    return storage.getHealingWishes();
  },

  // THÊM LỜI NHẮN ĐOM ĐÓM LÊN ĐÁM MÂY
  async addWish(content: string, authorAlias: string, campus: string, tags: string[]): Promise<void> {
    const supabase = getSupabaseClient();
    const id = 'w-' + Date.now();

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('healing_wishes').insert([
          {
            id,
            author_alias: authorAlias || 'Đồng Nghiệp Á Châu',
            campus: campus || 'Tập đoàn GAIE',
            content,
            hugs: 1,
            candles: 1,
            tags: tags.length > 0 ? tags : ['Năng lượng tích cực'],
          },
        ]);
      } catch (err) {
        console.warn('Lỗi thêm đom đóm lên Supabase:', err);
      }
    }
    storage.addHealingWish(content, authorAlias, campus, tags);
  },

  // GỬI CÁI ÔM LÊN ĐÁM MÂY
  async giveHug(wishId: string, currentHugs: number): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase
          .from('healing_wishes')
          .update({ hugs: currentHugs + 1 })
          .eq('id', wishId);
      } catch (err) {
        console.warn('Lỗi gửi cái ôm lên Supabase:', err);
      }
    }
    storage.giveHug(wishId);
  },

  // LẮNG NGHE REALTIME TỪ SUPABASE (THÔNG BÁO TỨC THÌ ĐA THIẾT BỊ)
  subscribeRealtime(onUpdate: () => void) {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return () => {};

    try {
      const channel = supabase
        .channel('gaie-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lockers' }, () => {
          onUpdate();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback_letters' }, () => {
          onUpdate();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'healing_wishes' }, () => {
          onUpdate();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Lỗi khởi tạo Realtime:', e);
      return () => {};
    }
  },
};
