import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { getMyServices, getNotifications, getCalendarEvents } from '../services/index.js';
import { LoadingState, ErrorState, OfflineState, EmptyState } from '../components/common/States.jsx';
import ServiceIcon from '../components/common/ServiceIcon.jsx';
import { AlertIcon, ChevronRightIcon } from '../components/common/Icons.jsx';

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
}
function isToday(iso) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function Home() {
  const { user } = useAuth();
  const online = useOnlineStatus();
  const services = useAsync(() => getMyServices(user.id), [user.id]);
  const notifications = useAsync(() => getNotifications(), []);
  const events = useAsync(() => getCalendarEvents(), []);

  if (!online) return <OfflineState onRetry={() => window.location.reload()} />;

  const todayEvents = (events.data || []).filter((e) => isToday(e.startAt)).slice(0, 4);
  const importantNotice = (notifications.data || []).find((n) => n.priority === 'high' && !n.read);
  const news = (notifications.data || []).filter((n) => n.type !== 'important').slice(0, 3);

  return (
    <div>
      <div className="greeting-card">
        <div className="greeting-sub">こんにちは</div>
        <div className="greeting-name">{user.displayName} さん</div>

        <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.9, marginBottom: 2 }}>今日の予定</div>
        {events.status === 'loading' && <div style={{ opacity: 0.7, fontSize: 13, padding: '8px 0' }}>読み込み中…</div>}
        {events.status === 'success' && todayEvents.length === 0 && (
          <div style={{ opacity: 0.75, fontSize: 13, padding: '8px 0' }}>本日の予定はありません。</div>
        )}
        {todayEvents.map((ev) => (
          <div className="schedule-row" key={ev.id}>
            <span className="schedule-time">{ev.allDay ? '終日' : fmtTime(ev.startAt)}</span>
            <span>{ev.title}</span>
          </div>
        ))}
        <Link
          to="calendar"
          style={{ display: 'inline-block', marginTop: 10, fontSize: 12.5, fontWeight: 700, opacity: 0.9 }}
        >
          もっと見る ›
        </Link>
      </div>

      {importantNotice && (
        <Link to="notice" className="notice-banner" style={{ color: 'inherit' }}>
          <AlertIcon className="notice-icon" width={20} height={20} />
          <div>
            <div className="notice-title">{importantNotice.title}</div>
            <div className="notice-meta">{fmtDate(importantNotice.createdAt)}</div>
          </div>
        </Link>
      )}

      <div className="section-title">
        MY SERVICES
        <Link to="services" className="link-more">すべて見る</Link>
      </div>
      {services.status === 'loading' && <LoadingState />}
      {services.status === 'error' && <ErrorState onRetry={services.reload} />}
      {services.status === 'success' && services.data.length === 0 && (
        <EmptyState title="利用できるサービスがまだありません" body="権限が付与されると、ここに表示されます。" />
      )}
      {services.status === 'success' && services.data.length > 0 && (
        <div className="service-grid">
          {services.data.map((s) => (
            <ServiceTile key={s.id} service={s} />
          ))}
        </div>
      )}

      <div className="section-title">NEWS</div>
      {notifications.status === 'loading' && <LoadingState />}
      {notifications.status === 'success' && news.length === 0 && (
        <EmptyState title="お知らせはありません" />
      )}
      {notifications.status === 'success' && news.length > 0 && (
        <div className="card" style={{ padding: '4px 16px' }}>
          {news.map((n) => (
            <Link to="notice" key={n.id} className="news-item" style={{ display: 'block', color: 'inherit' }}>
              <div className="news-date">{fmtDate(n.createdAt)}</div>
              <div className="news-title">{n.title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceTile({ service }) {
  const content = (
    <>
      <div className="service-icon">
        <ServiceIcon icon={service.icon} width={19} height={19} />
      </div>
      <div>
        <div className="service-name">{service.name}</div>
        <div className="service-desc">{service.description}</div>
      </div>
    </>
  );
  if (service.external) {
    return (
      <a className="service-tile" href={service.url} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link className="service-tile" to={`services/${service.id}`}>
      {content}
    </Link>
  );
}
