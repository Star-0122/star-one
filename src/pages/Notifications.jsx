import { useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync.js';
import { getNotifications, markNotificationRead } from '../services/index.js';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States.jsx';

const FILTERS = [
  { id: 'all', label: 'すべて' },
  { id: 'unread', label: '未読' },
  { id: 'important', label: '重要' }
];

const TYPE_LABEL = {
  important: '重要なお知らせ',
  sky: 'sky+',
  event: 'イベント',
  system: 'システム通知',
  application: '申請結果',
  reservation: '予約',
  admin: '管理者'
};

function fmt(iso) {
  return new Date(iso).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Notifications() {
  const { status, data, error, reload } = useAsync(() => getNotifications(), []);
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(null);

  const list = items || data || [];
  const visible = useMemo(() => {
    if (filter === 'unread') return list.filter((n) => !n.read);
    if (filter === 'important') return list.filter((n) => n.priority === 'high');
    return list;
  }, [list, filter]);

  async function handleOpen(n) {
    if (n.read) return;
    await markNotificationRead(n.id);
    setItems((list || (data || [])).map((x) => (x.id === n.id ? { ...x, read: true } : x)));
  }

  return (
    <div>
      <h1 className="page-title">通知センター</h1>
      <p className="page-sub">大切なお知らせを見逃さないよう、まとめて確認できます。</p>

      <div className="chip-row" role="tablist" aria-label="通知フィルター">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={`chip${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}
      {status === 'success' && visible.length === 0 && <EmptyState title="通知はありません" />}
      {status === 'success' && visible.length > 0 && (
        <div className="card" style={{ padding: '4px 16px' }}>
          {visible.map((n) => (
            <button
              key={n.id}
              onClick={() => handleOpen(n)}
              className={`notif-item${!n.read ? ' unread' : ''}`}
              style={{ width: '100%', textAlign: 'left', background: n.read ? 'none' : undefined, border: 'none', cursor: 'pointer' }}
            >
              <span className={`notif-dot${n.priority === 'high' ? ' important' : ''}${n.read ? ' read' : ''}`} />
              <span className="notif-body">
                <span className="notif-title">{n.title}</span>
                <span className="notif-text">{n.body}</span>
                <span className="notif-meta">
                  {TYPE_LABEL[n.type] || 'お知らせ'} ・ {fmt(n.createdAt)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
