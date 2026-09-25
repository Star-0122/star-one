import {
  mockUsers,
  mockServices,
  mockNotifications,
  mockCalendarEvents,
  mockFaq
} from '../../data/mockData.js';

const STORAGE_KEY = 'star-one-mock-session-uid';
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// メモリ上のミュータブルな状態（デモ用）。Supabase/Firebase版ではDB側が真実の情報源になる。
let services = [...mockServices];
let notifications = [...mockNotifications];
let users = [...mockUsers]; // 新規登録したユーザーもここに積み上がる（デモ専用・永続化なし）
const listeners = new Set();

function currentUserFromStorage() {
  const uid = localStorage.getItem(STORAGE_KEY);
  if (!uid) return null;
  const u = users.find((x) => x.id === uid);
  if (!u) return null;
  const { password, ...safe } = u;
  return safe;
}

function notifyAuthListeners(user) {
  listeners.forEach((cb) => cb(user));
}

/** @type {import('../types.js').AuthService} */
const auth = {
  async signIn(email, password) {
    await wait();
    const found = users.find(
      (u) => (u.email === email || u.starId === email) && u.password === password
    );
    if (!found) {
      const err = new Error('メールアドレス（またはSTAR ID）かパスワードが正しくありません。');
      err.code = 'auth/invalid-credentials';
      throw err;
    }
    localStorage.setItem(STORAGE_KEY, found.id);
    const { password: _pw, ...safe } = found;
    notifyAuthListeners(safe);
    return safe;
  },
  async signUp(email, password, displayName) {
    await wait();
    if (users.some((u) => u.email === email)) {
      const err = new Error('このメールアドレスは既に登録されています。');
      err.code = 'auth/email-in-use';
      throw err;
    }
    const id = `usr_${Date.now()}`;
    // 新規登録者には常に "user"（利用者）ロールのみを自動付与する。
    // 権限をユーザー自身に選ばせることはしない仕様のため。
    const created = {
      id,
      starId: `sora${id.slice(-6)}`,
      displayName: displayName || email.split('@')[0],
      email,
      avatarUrl: '',
      phone: '',
      affiliation: '',
      roles: ['user'],
      serviceIds: [],
      notificationSettings: { important: true, sky: true, event: true, system: true },
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users = [...users, created];
    localStorage.setItem(STORAGE_KEY, id);
    const { password: _pw, ...safe } = created;
    notifyAuthListeners(safe);
    // MockAdapterは確認メールを送らないため、常に即ログイン扱いにする。
    return { user: safe, needsEmailConfirmation: false };
  },
  async signOut() {
    await wait(150);
    localStorage.removeItem(STORAGE_KEY);
    notifyAuthListeners(null);
  },
  async getCurrentUser() {
    await wait(150);
    return currentUserFromStorage();
  },
  onAuthStateChange(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  async sendPasswordReset() {
    await wait();
    return;
  }
};

/** @type {import('../types.js').DatabaseService} */
const db = {
  async getServices() {
    await wait();
    return services.filter((s) => s.status === 'published');
  },
  async getMyServices(userId) {
    await wait();
    const user = users.find((u) => u.id === userId);
    if (!user) return [];
    return services.filter(
      (s) => s.status === 'published' && user.serviceIds.includes(s.id)
    );
  },
  async getNotifications() {
    await wait();
    return [...notifications].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },
  async markNotificationRead(id) {
    await wait(150);
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  },
  async getCalendarEvents() {
    await wait();
    return [...mockCalendarEvents].sort((a, b) => (a.startAt > b.startAt ? 1 : -1));
  },
  async getFaq() {
    await wait();
    return mockFaq;
  },
  async adminListUsers() {
    await wait();
    return users.map(({ password, ...safe }) => safe);
  },
  async adminUpsertService(service) {
    await wait();
    if (service.id && services.some((s) => s.id === service.id)) {
      services = services.map((s) => (s.id === service.id ? { ...s, ...service } : s));
      return services.find((s) => s.id === service.id);
    }
    const created = { ...service, id: service.id || `svc_${Date.now()}` };
    services = [...services, created];
    return created;
  },
  async adminDeleteService(id) {
    await wait();
    services = services.filter((s) => s.id !== id);
  }
};

/** @type {import('../types.js').StorageService} */
const storage = {
  async uploadFile(path, file) {
    await wait();
    return URL.createObjectURL(file);
  },
  async deleteFile() {
    await wait(150);
  }
};

/** @type {import('../types.js').NotificationService} */
const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return false;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  },
  async sendLocal(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
};

/** @type {import('../types.js').BackendAdapter} */
export const MockAdapter = {
  auth,
  db,
  storage,
  notifications: notificationService
};
