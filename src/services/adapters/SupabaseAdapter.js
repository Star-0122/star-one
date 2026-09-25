import { createClient } from '@supabase/supabase-js';

// このファイルだけがSupabase SDKを直接扱う場所です。
// UIやページからは決して @supabase/supabase-js をimportしないでください。
// 将来Firebaseへ移行する際は、このファイルと同じ形の FirebaseAdapter.js を
// 追加し、src/services/index.js の切り替えを変更するだけで済むようにしています。

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
function getClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabaseの環境変数が設定されていません。VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を .env.local に設定してください。'
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

// Supabaseの行データ(snake_case想定)を、UIが信頼するStarUser形状へ変換する。
// これにより、テーブル設計を変えてもUI側の型は変わらない。
function toStarUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    starId: row.star_id,
    displayName: row.display_name,
    email: row.email,
    avatarUrl: row.avatar_url || '',
    phone: row.phone || '',
    affiliation: row.affiliation || '',
    roles: row.roles || [],
    serviceIds: row.service_ids || [],
    notificationSettings: row.notification_settings || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toStarService(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    url: row.url,
    category: row.category,
    status: row.status,
    requiredRoles: row.required_roles || [],
    external: !!row.external
  };
}

function toStarNotification(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    type: row.type,
    priority: row.priority,
    read: !!row.read,
    createdAt: row.created_at,
    serviceId: row.service_id || undefined
  };
}

function toStarCalendarEvent(row) {
  return {
    id: row.id,
    title: row.title,
    startAt: row.start_at,
    endAt: row.end_at || undefined,
    allDay: !!row.all_day,
    sourceServiceId: row.source_service_id,
    sourceLabel: row.source_label,
    color: row.color || 'navy'
  };
}

/** @type {import('../types.js').AuthService} */
const auth = {
  async signIn(emailOrStarId, password) {
    const sb = getClient();
    let email = emailOrStarId;

    // 「メールアドレス または STAR ID」のどちらでもログインできるようにする。
    // STAR ID（メール形式でない入力）の場合は、STAR IDだけからログイン用の
    // メールアドレスを引ける最小権限のRPC（email_for_star_id）で解決する。
    // このRPCはメールアドレス以外の情報を一切返さない。
    if (!email.includes('@')) {
      const { data: resolvedEmail, error: lookupError } = await sb.rpc('email_for_star_id', {
        p_star_id: email
      });
      if (lookupError || !resolvedEmail) {
        const err = new Error('STAR IDまたはパスワードが正しくありません。');
        err.code = 'auth/invalid-credentials';
        throw err;
      }
      email = resolvedEmail;
    }

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: profile, error: profileErr } = await sb
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileErr) throw profileErr;
    return toStarUser(profile);
  },
  async signUp(email, password, displayName) {
    const sb = getClient();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    });
    if (error) throw error;

    // メール確認が有効なプロジェクトでは、signUp直後はセッションが発行されず
    // data.session が null になる。その場合はログインさせず、確認メール送信を案内する。
    if (!data.session) {
      return { user: null, needsEmailConfirmation: true };
    }

    // public.users のプロフィール行は auth.users への INSERT トリガー
    // (handle_new_star_user) が自動生成するため、少し待ってから取得する。
    let profile = null;
    for (let i = 0; i < 5 && !profile; i++) {
      const { data: row } = await sb.from('users').select('*').eq('id', data.user.id).single();
      profile = row;
      if (!profile) await new Promise((r) => setTimeout(r, 300));
    }
    return { user: profile ? toStarUser(profile) : null, needsEmailConfirmation: false };
  },
  async signOut() {
    const sb = getClient();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },
  async getCurrentUser() {
    const sb = getClient();
    const { data } = await sb.auth.getSession();
    if (!data.session) return null;
    const { data: profile } = await sb
      .from('users')
      .select('*')
      .eq('id', data.session.user.id)
      .single();
    return toStarUser(profile);
  },
  onAuthStateChange(cb) {
    const sb = getClient();
    const { data: sub } = sb.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        cb(null);
        return;
      }
      const { data: profile } = await sb
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      cb(toStarUser(profile));
    });
    return () => sub.subscription.unsubscribe();
  },
  async sendPasswordReset(email) {
    const sb = getClient();
    const { error } = await sb.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

/** @type {import('../types.js').DatabaseService} */
const db = {
  async getServices() {
    const sb = getClient();
    const { data, error } = await sb.from('services').select('*').eq('status', 'published');
    if (error) throw error;
    return data.map(toStarService);
  },
  async getMyServices(userId) {
    const sb = getClient();
    const { data, error } = await sb
      .from('user_services')
      .select('services(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map((r) => toStarService(r.services));
  },
  async getNotifications() {
    const sb = getClient();
    const { data, error } = await sb
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(toStarNotification);
  },
  async markNotificationRead(id) {
    const sb = getClient();
    const { error } = await sb.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },
  async getCalendarEvents() {
    const sb = getClient();
    const { data, error } = await sb
      .from('calendar_events')
      .select('*')
      .order('start_at', { ascending: true });
    if (error) throw error;
    return data.map(toStarCalendarEvent);
  },
  async getFaq() {
    const sb = getClient();
    const { data, error } = await sb.from('faq').select('*');
    if (error) throw error;
    return data;
  },
  async adminListUsers() {
    const sb = getClient();
    const { data, error } = await sb.from('users').select('*');
    if (error) throw error;
    return data.map(toStarUser);
  },
  async adminUpsertService(service) {
    const sb = getClient();
    const row = {
      id: service.id,
      name: service.name,
      description: service.description,
      icon: service.icon,
      url: service.url,
      category: service.category,
      status: service.status,
      required_roles: service.requiredRoles,
      external: service.external
    };
    const { data, error } = await sb.from('services').upsert(row).select().single();
    if (error) throw error;
    return toStarService(data);
  },
  async adminDeleteService(id) {
    const sb = getClient();
    const { error } = await sb.from('services').delete().eq('id', id);
    if (error) throw error;
  }
};

/** @type {import('../types.js').StorageService} */
const storage = {
  async uploadFile(path, file) {
    const sb = getClient();
    const { data, error } = await sb.storage.from('star-one').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: pub } = sb.storage.from('star-one').getPublicUrl(data.path);
    return pub.publicUrl;
  },
  async deleteFile(path) {
    const sb = getClient();
    const { error } = await sb.storage.from('star-one').remove([path]);
    if (error) throw error;
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
export const SupabaseAdapter = {
  auth,
  db,
  storage,
  notifications: notificationService
};
