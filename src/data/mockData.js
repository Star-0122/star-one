// STAR ONE — 開発・デモ用のダミーデータ。
// VITE_BACKEND_PROVIDER=mock のときに使用されます。
// 実データ構造は src/services/types.js のBackendAdapter契約に準拠しています。

export const mockUsers = [
  {
    id: 'usr_0001',
    starId: 'sora123456',
    displayName: 'とうま',
    email: 'toma@example.com',
    avatarUrl: '',
    phone: '',
    affiliation: 'そらのほしこども園 ひまわり組',
    roles: ['guardian'],
    serviceIds: ['sky-plus', 'kodomoen', 'gakushu', 'event'],
    notificationSettings: { important: true, sky: true, event: true, system: true },
    password: 'password', // デモ用の平文パスワード。実運用ではAuthServiceが安全に処理する想定。
    createdAt: '2025-04-01T00:00:00+09:00',
    updatedAt: '2026-09-01T00:00:00+09:00'
  },
  {
    id: 'usr_0002',
    starId: 'sora000001',
    displayName: '管理者 星野',
    email: 'admin@example.com',
    avatarUrl: '',
    phone: '',
    affiliation: 'そらのほしグループ 事務局',
    roles: ['admin'],
    serviceIds: ['sky-plus', 'kodomoen', 'gakushu', 'event', 'procedure'],
    notificationSettings: { important: true, sky: true, event: true, system: true },
    password: 'admin',
    createdAt: '2025-01-10T00:00:00+09:00',
    updatedAt: '2026-09-01T00:00:00+09:00'
  }
];

export const mockServices = [
  {
    id: 'sky-plus',
    name: 'sky+',
    description: '出欠・予約・お知らせなど、日々の連絡をまとめるそらのほしグループの主要デジタルサービスです。',
    icon: 'sky',
    url: 'https://example.com/sky-plus',
    category: 'education',
    status: 'published',
    requiredRoles: ['guardian', 'staff', 'admin'],
    external: true
  },
  {
    id: 'kodomoen',
    name: 'そらのほしこども園',
    description: '園からのお知らせ・連絡帳・行事案内を確認できます。',
    icon: 'cloud',
    url: '#',
    category: 'education',
    status: 'published',
    requiredRoles: ['guardian', 'staff', 'admin'],
    external: false
  },
  {
    id: 'gakushu',
    name: '学習サービス',
    description: '学習の進捗・成績・お知らせを確認できます。',
    icon: 'book',
    url: '#',
    category: 'learning',
    status: 'published',
    requiredRoles: ['student', 'guardian', 'admin'],
    external: false
  },
  {
    id: 'event',
    name: 'イベント',
    description: '行事・申し込みが必要なイベントの一覧です。',
    icon: 'calendar',
    url: '#',
    category: 'event',
    status: 'published',
    requiredRoles: ['guardian', 'student', 'staff', 'admin'],
    external: false
  },
  {
    id: 'procedure',
    name: '各種申請',
    description: '欠席連絡・各種手続きをオンラインで行えます。',
    icon: 'doc',
    url: '#',
    category: 'procedure',
    status: 'published',
    requiredRoles: ['guardian', 'staff', 'admin'],
    external: false
  },
  {
    id: 'other',
    name: 'その他サービス',
    description: '今後追加されるそらのほしグループのサービスがここに表示されます。',
    icon: 'sparkle',
    url: '#',
    category: 'other',
    status: 'published',
    requiredRoles: ['guardian', 'student', 'staff', 'admin'],
    external: false
  }
];

export const mockNotifications = [
  {
    id: 'ntc_0001',
    title: '台風に伴う臨時休園について',
    body: '明日9月15日は台風接近のため、安全確保を優先し臨時休園といたします。詳細はこども園ページをご確認ください。',
    type: 'important',
    priority: 'high',
    read: false,
    createdAt: '2026-09-15T07:30:00+09:00',
    serviceId: 'kodomoen'
  },
  {
    id: 'ntc_0002',
    title: 'sky+ 出欠の確認をお願いします',
    body: '明日の出欠登録がまだ完了していません。sky+アプリから登録をお願いします。',
    type: 'sky',
    priority: 'normal',
    read: false,
    createdAt: '2026-09-14T18:30:00+09:00',
    serviceId: 'sky-plus'
  },
  {
    id: 'ntc_0003',
    title: '秋の遠足のお知らせ',
    body: '10月に予定している秋の遠足の案内を掲載しました。持ち物・集合時間をご確認ください。',
    type: 'event',
    priority: 'normal',
    read: true,
    createdAt: '2026-09-14T12:10:00+09:00',
    serviceId: 'event'
  },
  {
    id: 'ntc_0004',
    title: 'システムメンテナンスのお知らせ',
    body: '9月20日 深夜0時〜3時の間、STAR ONEはメンテナンスのためご利用いただけません。',
    type: 'system',
    priority: 'normal',
    read: true,
    createdAt: '2026-09-13T09:00:00+09:00'
  },
  {
    id: 'ntc_0005',
    title: '申請「欠席連絡」の処理が完了しました',
    body: '提出いただいた欠席連絡を確認しました。ご協力ありがとうございます。',
    type: 'application',
    priority: 'normal',
    read: true,
    createdAt: '2026-09-12T16:45:00+09:00',
    serviceId: 'procedure'
  }
];

export const mockCalendarEvents = [
  {
    id: 'evt_0001',
    title: 'そらのほしこども園 登園',
    startAt: '2026-09-15T10:00:00+09:00',
    allDay: false,
    sourceServiceId: 'kodomoen',
    sourceLabel: 'そらのほしこども園',
    color: 'navy'
  },
  {
    id: 'evt_0002',
    title: 'sky+ 投函',
    startAt: '2026-09-15T15:30:00+09:00',
    allDay: false,
    sourceServiceId: 'sky-plus',
    sourceLabel: 'sky+',
    color: 'blue'
  },
  {
    id: 'evt_0003',
    title: '秋の遠足 打ち合わせ',
    startAt: '2026-09-15T17:00:00+09:00',
    allDay: false,
    sourceServiceId: 'event',
    sourceLabel: 'イベント',
    color: 'coral'
  },
  {
    id: 'evt_0004',
    title: '運動会 リハーサル',
    startAt: '2026-09-22T10:00:00+09:00',
    endAt: '2026-09-22T12:00:00+09:00',
    allDay: false,
    sourceServiceId: 'kodomoen',
    sourceLabel: 'そらのほしこども園',
    color: 'navy'
  },
  {
    id: 'evt_0005',
    title: '個人懇談 開始日',
    startAt: '2026-09-23T00:00:00+09:00',
    allDay: true,
    sourceServiceId: 'gakushu',
    sourceLabel: '学習サービス',
    color: 'gold'
  }
];

export const mockFaq = [
  {
    id: 'faq_0001',
    category: 'STAR ONEについて',
    question: 'STAR ONEとは何ですか？',
    answer: 'そらのほしグループの各サービスをひとつにつなぐ統合デジタルプラットフォームです。STAR IDでログインすると、必要なサービス・情報だけがまとめて表示されます。'
  },
  {
    id: 'faq_0002',
    category: 'STAR IDについて',
    question: 'STAR IDとは何ですか？',
    answer: 'そらのほしグループ共通のアカウントです。1つのSTAR IDでSTAR ONE、および将来的にはグループ内の複数サービスをご利用いただけます。'
  },
  {
    id: 'faq_0003',
    category: 'ログインについて',
    question: 'パスワードを忘れてしまいました',
    answer: 'ログイン画面の「パスワードをお忘れですか？」からリセットの手続きができます。'
  },
  {
    id: 'faq_0004',
    category: 'サービスの使い方',
    question: '利用できるサービスが表示されません',
    answer: '表示されるサービスはSTAR IDに設定された権限によって自動的に決まります。ご不明な場合は管理者・園までお問い合わせください。'
  }
];
