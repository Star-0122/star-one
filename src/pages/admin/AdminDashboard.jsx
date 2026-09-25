import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { adminListUsers, getServices, getNotifications } from '../../services/index.js';
import { PermissionDeniedState, LoadingState } from '../../components/common/States.jsx';
import { AccountIcon, ServicesIcon, BellIcon, ChevronRightIcon } from '../../components/common/Icons.jsx';

const SECTIONS = [
  { to: 'users', label: 'ユーザー管理', desc: 'STAR ID・権限の管理', icon: AccountIcon },
  { to: 'services', label: 'サービス管理', desc: 'サービスの追加・公開設定', icon: ServicesIcon },
  { to: 'notices', label: 'お知らせ管理', desc: '通知・お知らせの配信', icon: BellIcon }
];

export default function AdminDashboard() {
  const { hasRole, user } = useAuth();
  const location = useLocation();
  const isRoot = location.pathname.replace(/\/$/, '').endsWith('/admin');

  if (!hasRole('admin')) {
    return <PermissionDeniedState />;
  }

  if (!isRoot) return <Outlet />;

  return <AdminHome />;
}

function AdminHome() {
  const users = useAsync(() => adminListUsers(), []);
  const services = useAsync(() => getServices(), []);
  const notices = useAsync(() => getNotifications(), []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <img
          src={`${import.meta.env.BASE_URL}logo-sora-no-hoshi.png`}
          alt="そらのほしグループ"
          style={{ height: 32, width: 'auto' }}
        />
        <span
          style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}
        >
          STAR ONE 管理者画面
        </span>
      </div>
      <h1 className="page-title">管理者画面</h1>
      <p className="page-sub">ユーザー・サービス・お知らせなど、STAR ONE全体を管理できます。</p>

      <div className="admin-grid" style={{ marginBottom: 24 }}>
        <div className="card admin-stat">
          <div className="stat-value">{users.status === 'success' ? users.data.length : '—'}</div>
          <div className="stat-label">登録ユーザー数</div>
        </div>
        <div className="card admin-stat">
          <div className="stat-value">{services.status === 'success' ? services.data.length : '—'}</div>
          <div className="stat-label">公開中サービス</div>
        </div>
        <div className="card admin-stat">
          <div className="stat-value">{notices.status === 'success' ? notices.data.filter((n) => !n.read).length : '—'}</div>
          <div className="stat-label">未読お知らせ</div>
        </div>
      </div>

      <div className="section-title">管理メニュー</div>
      <div className="card" style={{ padding: '4px 16px' }}>
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="settings-row" style={{ color: 'inherit' }}>
            <s.icon />
            <span>
              <div>{s.label}</div>
              <div className="text-sm-muted" style={{ fontWeight: 400 }}>{s.desc}</div>
            </span>
            <ChevronRightIcon className="settings-chevron" width={16} height={16} />
          </Link>
        ))}
      </div>
    </div>
  );
}
