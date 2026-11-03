import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  SUPABASE_URL: 'gaie_supabase_url',
  SUPABASE_KEY: 'gaie_supabase_anon_key',
};

// Lấy thông tin từ Vite ENV hoặc từ bộ nhớ người dùng cấu hình
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '';

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
  };
}

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const { url, anonKey } = getSupabaseCredentials();
  if (url && anonKey) {
    try {
      clientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: false, // Ẩn danh không cần lưu session người dùng
        },
      });
      return clientInstance;
    } catch (e) {
      console.warn('Lỗi khởi tạo Supabase Client:', e);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, anonKey.trim());
  clientInstance = null; // Reset để tạo client mới
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
  clientInstance = null;
}
