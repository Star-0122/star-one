import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import {
  EditIcon,
  BellIcon,
  ShieldIcon,
  HistoryIcon,
  AppsIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronRightIcon
} from '../components/common/Icons.jsx';

const ROLE_LABEL = {
  admin: '管理者',
  guardian: '保護者',
  student: '生徒',
  staff: 'スタッフ',
  user: '利用者'
};

const THEME_OPTIONS = [
  { id: 'light', label: 'ライト' },
  { id: 'dark', label: 'ダーク' },
  { id: 'system', label: '端末に合わせる' }
];

export default function Account() {
  const { user, logout, hasRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const initial = user.displayName?.[0] || '★';

  return (
    <div>
      <h1 className="page-title">アカウント・設定</h1>

      <div className="profile-header">
        <div className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '999px' }} /> : initial}</div>
        <div className="profile-name">{user.displayName} さん</div>
        <div className="profile-meta">STAR ID : {user.starId}</div>
        <div className="profile-meta">{user.email}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {user.roles.map((r) => (
            <span key={r} className={`pill${r === 'admin' ? ' role-admin' : ''}`}>{ROLE_LABEL[r] || r}</span>
          ))}
        </div>
      </div>

      <div className="section-title">プロフィール</div>
      <div className="card">
        <div className="settings-row"><EditIcon /> プロフィール編集 <ChevronRightIcon className="settings-chevron" width={16} height={16} /></div>
        <div className="settings-row"><BellIcon /> 通知設定 <ChevronRightIcon className="settings-chevron" width={16} height={16} /></div>
        <div className="settings-row"><ShieldIcon /> セキュリティ <ChevronRightIcon className="settings-chevron" width={16} height={16} /></div>
        <div className="settings-row"><HistoryIcon /> ログイン履歴 <ChevronRightIcon className="settings-chevron" width={16} height={16} /></div>
      </div>

      <div className="section-title">表示</div>
      <div className="card" style={{ padding: '14px 12px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>テーマ</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} role="radiogroup" aria-label="テーマ">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={theme === opt.id}
              className={`chip${theme === opt.id ? ' active' : ''}`}
              onClick={() => setTheme(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-sm-muted" style={{ marginTop: 10, marginBottom: 0 }}>
          「端末に合わせる」を選ぶと、お使いの端末の設定に自動で追従します。
        </p>
      </div>

      <div className="section-title">利用状況</div>
      <div className="card">
        <div className="settings-row"><AppsIcon /> 利用サービス <ChevronRightIcon className="settings-chevron" width={16} height={16} /></div>
        <div className="settings-row"><SettingsIcon /> アカウント設定 <ChevronRightIcon className="settings-chevron" width={16} height={16} /></div>
        {hasRole('admin') && (
          <button
            className="settings-row"
            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/admin')}
          >
            <ShieldIcon /> 管理者画面 <ChevronRightIcon className="settings-chevron" width={16} height={16} />
          </button>
        )}
      </div>

      <div className="section-title">その他</div>
      <div className="card">
        <button
          className="settings-row danger"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => setConfirmOpen(true)}
        >
          <LogoutIcon /> ログアウト
        </button>
      </div>

      {confirmOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setConfirmOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>ログアウトしますか？</h3></div>
            <p className="text-sm-muted" style={{ marginBottom: 20 }}>
              再度ご利用になるには、STAR IDでのログインが必要です。
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>キャンセル</button>
              <button className="btn btn-danger" onClick={handleLogout}>ログアウト</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
