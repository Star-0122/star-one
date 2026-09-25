/**
 * STAR ONE Backend Adapter — 型定義
 *
 * このファイルはSupabase/Firebaseどちらにも依存しない「契約」です。
 * UIやページは、ここに定義された形のオブジェクト・関数シグネチャだけを
 * 信頼して実装してください。Supabase固有・Firestore固有の型やレスポンス
 * 構造をUIへ漏らさないことが、将来の移行を容易にする最重要ポイントです。
 *
 * @typedef {Object} StarUser
 * @property {string} id - STAR ID内部UUID（Supabase/Firestoreどちらでも扱えるUUID文字列）
 * @property {string} starId - 表示用STAR ID（例: "sora123456"）
 * @property {string} displayName
 * @property {string} email
 * @property {string} [avatarUrl]
 * @property {string} [phone]
 * @property {string} [affiliation] - 所属（園・学年・部署など）
 * @property {string[]} roles - 例: ["guardian"], ["admin"] （複数可、拡張可能）
 * @property {string[]} serviceIds - 利用可能なサービスIDの一覧
 * @property {Object} notificationSettings
 * @property {string} createdAt - ISO8601
 * @property {string} updatedAt - ISO8601
 *
 * @typedef {Object} StarService
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon - 絵文字 or アイコンキー
 * @property {string} url - 遷移先URL（外部サービスの場合は絶対URL）
 * @property {'education'|'learning'|'event'|'procedure'|'group'|'other'} category
 * @property {'published'|'draft'} status
 * @property {string[]} requiredRoles - このサービスを利用できるロール
 * @property {boolean} external - trueなら新しいタブ/外部遷移

 *
 * @typedef {Object} StarNotification
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {'important'|'sky'|'event'|'system'|'application'|'reservation'|'admin'} type
 * @property {'high'|'normal'} priority
 * @property {boolean} read
 * @property {string} createdAt - ISO8601
 * @property {string} [serviceId]
 *
 * @typedef {Object} StarCalendarEvent
 * @property {string} id
 * @property {string} title
 * @property {string} startAt - ISO8601
 * @property {string} [endAt] - ISO8601
 * @property {boolean} allDay
 * @property {string} sourceServiceId - どのサービス由来の予定か
 * @property {string} sourceLabel - 表示用ラベル（例: "sky+"）
 * @property {string} color - 表示色（トークン名 or hex）
 *
 * @typedef {Object} FaqItem
 * @property {string} id
 * @property {string} category
 * @property {string} question
 * @property {string} answer
 *
 * @typedef {Object} AuthService
 * @property {(email: string, password: string) => Promise<StarUser>} signIn
 * @property {(email: string, password: string, displayName: string) => Promise<{user: StarUser|null, needsEmailConfirmation: boolean}>} signUp
 * @property {() => Promise<void>} signOut
 * @property {() => Promise<StarUser|null>} getCurrentUser
 * @property {(cb: (user: StarUser|null) => void) => (() => void)} onAuthStateChange - 戻り値はunsubscribe関数
 * @property {() => Promise<void>} sendPasswordReset
 *
 * @typedef {Object} DatabaseService
 * @property {() => Promise<StarService[]>} getServices
 * @property {(userId: string) => Promise<StarService[]>} getMyServices
 * @property {() => Promise<StarNotification[]>} getNotifications
 * @property {(id: string) => Promise<void>} markNotificationRead
 * @property {() => Promise<StarCalendarEvent[]>} getCalendarEvents
 * @property {() => Promise<FaqItem[]>} getFaq
 * @property {() => Promise<StarUser[]>} adminListUsers
 * @property {(service: Partial<StarService>) => Promise<StarService>} adminUpsertService
 * @property {(id: string) => Promise<void>} adminDeleteService
 *
 * @typedef {Object} StorageService
 * @property {(path: string, file: File) => Promise<string>} uploadFile - URLを返す
 * @property {(path: string) => Promise<void>} deleteFile
 *
 * @typedef {Object} NotificationService
 * @property {() => Promise<boolean>} requestPermission
 * @property {(title: string, body: string) => Promise<void>} sendLocal
 *
 * @typedef {Object} BackendAdapter
 * @property {AuthService} auth
 * @property {DatabaseService} db
 * @property {StorageService} storage
 * @property {NotificationService} notifications
 */

export {};
