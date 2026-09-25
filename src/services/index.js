// STAR ONE Backend Adapter — エントリーポイント
//
// UIコンポーネントはこのファイルの関数だけを利用してください。
// Supabase/Firebaseの実装詳細（テーブル名・SDK呼び出しなど）は
// adapters/ 配下に閉じ込め、ここでは触れません。
//
// バックエンドを切り替えるときは、下の adapter 選択部分と
// FirebaseAdapter の追加だけで完結する設計です。

import { MockAdapter } from './adapters/MockAdapter.js';
import { SupabaseAdapter } from './adapters/SupabaseAdapter.js';

const provider = import.meta.env.VITE_BACKEND_PROVIDER || 'mock';

// 将来: provider === 'firebase' の場合に FirebaseAdapter を選択する分岐を追加するだけでよい。
const adapter = provider === 'supabase' ? SupabaseAdapter : MockAdapter;

// ---- Auth ----
export const signIn = (email, password) => adapter.auth.signIn(email, password);
export const signUp = (email, password, displayName) => adapter.auth.signUp(email, password, displayName);
export const signOut = () => adapter.auth.signOut();
export const getCurrentUser = () => adapter.auth.getCurrentUser();
export const onAuthStateChange = (cb) => adapter.auth.onAuthStateChange(cb);
export const sendPasswordReset = (email) => adapter.auth.sendPasswordReset(email);

// ---- Database ----
export const getServices = () => adapter.db.getServices();
export const getMyServices = (userId) => adapter.db.getMyServices(userId);
export const getNotifications = () => adapter.db.getNotifications();
export const markNotificationRead = (id) => adapter.db.markNotificationRead(id);
export const getCalendarEvents = () => adapter.db.getCalendarEvents();
export const getFaq = () => adapter.db.getFaq();
export const adminListUsers = () => adapter.db.adminListUsers();
export const adminUpsertService = (service) => adapter.db.adminUpsertService(service);
export const adminDeleteService = (id) => adapter.db.adminDeleteService(id);

// ---- Storage ----
export const uploadFile = (path, file) => adapter.storage.uploadFile(path, file);
export const deleteFile = (path) => adapter.storage.deleteFile(path);

// ---- Notifications (push/local) ----
export const requestNotificationPermission = () => adapter.notifications.requestPermission();
export const sendLocalNotification = (title, body) => adapter.notifications.sendLocal(title, body);

export const backendProviderName = provider;
