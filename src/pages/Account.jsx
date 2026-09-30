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
  LogoutIcon,
  ChevronRightIcon,
  TrashIcon
} from '../components/common/Icons.jsx';

const ROLE_LABEL = {
  admin: '管理者',
  guardian: '保護者',
  student: '生徒',
  staff: 'スタッフ',
  user: '利用者',
  teacher: '先生'
};

const THEME_OPTIONS = [
  { id: 'light', label: 'ライト' },
  { id: 'dark', label: 'ダーク' },
  { id: 'system', label: '端末に合わせる' }
];

const NOTIF_TOGGLES = [
  { key: 'important', label: '重要なお知らせ' },
  { key: 'sky', label: 'sky+のお知らせ' },
  { key: 'event', label: 'イベント' },
  { key: 'system', label: 'システム通知' }
];

// モーダルの種類を1つのstateで管理する（null | 'profile' | 'notif' | 'password' | 'history' | 'withdraw'）
export default function Account() {
  const { user, logout, hasRole, updateProfile, updateNotificationSettings, changePassword, withdraw } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const initial = user.displayName?.[0] || '★';

  return (
    <div>
      <h1 className="page-title">アカウント・設定</h1>

      <div className="profile-header">
        <div className="avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '999px' }} />
          ) : (
            initial
          )}
        </div>
        <div className="profile-name">{user.displayName} さん</div>
        <div className="profile-meta">STAR ID : {user.starId}</div>
        <div className="profile-meta">{user.email}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {user.roles.map((r) => (
            <span key={r} className={`pill${r === 'admin' ? ' role-admin' : ''}`}>
              {ROLE_LABEL[r] || r}
            </span>
          ))}
        </div>
      </div>

      <div className="section-title">プロフィール</div>
      <div className="card">
        <button className="settings-row" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setModal('profile')}>
          <EditIcon /> プロフィール編集 <ChevronRightIcon className="settings-chevron" width={16} height={16} />
        </button>
        <button className="settings-row" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setModal('notif')}>
          <BellIcon /> 通知設定 <ChevronRightIcon className="settings-chevron" width={16} height={16} />
        </button>
        <button className="settings-row" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setModal('password')}>
          <ShieldIcon /> セキュリティ（パスワード変更） <ChevronRightIcon className="settings-chevron" width={16} height={16} />
        </button>
        <button className="settings-row" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setModal('history')}>
          <HistoryIcon /> ログイン履歴 <ChevronRightIcon className="settings-chevron" width={16} height={16} />
        </button>
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
        <button
          className="settings-row"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/services')}
        >
          <AppsIcon /> 利用サービス <ChevronRightIcon className="settings-chevron" width={16} height={16} />
        </button>
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
          onClick={() => setLogoutConfirmOpen(true)}
        >
          <LogoutIcon /> ログアウト
        </button>
      </div>

      <div className="section-title" style={{ color: 'var(--danger)' }}>危険な操作</div>
      <div className="card" style={{ border: '1px solid #f4c7c3' }}>
        <button
          className="settings-row danger"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => setModal('withdraw')}
        >
          <TrashIcon /> アカウントを退会する
        </button>
      </div>

      {logoutConfirmOpen && (
        <ModalBackdrop onClose={() => setLogoutConfirmOpen(false)}>
          <div className="modal-header"><h3>ログアウトしますか？</h3></div>
          <p className="text-sm-muted" style={{ marginBottom: 20 }}>
            再度ご利用になるには、STAR IDでのログインが必要です。
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setLogoutConfirmOpen(false)}>キャンセル</button>
            <button className="btn btn-danger" onClick={handleLogout}>ログアウト</button>
          </div>
        </ModalBackdrop>
      )}

      {modal === 'profile' && (
        <ProfileEditModal user={user} onClose={() => setModal(null)} onSave={updateProfile} onDone={() => showToast('プロフィールを更新しました')} />
      )}
      {modal === 'notif' && (
        <NotificationSettingsModal
          settings={user.notificationSettings || {}}
          onClose={() => setModal(null)}
          onSave={updateNotificationSettings}
          onDone={() => showToast('通知設定を更新しました')}
        />
      )}
      {modal === 'password' && (
        <PasswordChangeModal onClose={() => setModal(null)} onSubmit={changePassword} onDone={() => showToast('パスワードを変更しました')} />
      )}
      {modal === 'history' && <LoginHistoryModal user={user} onClose={() => setModal(null)} />}
      {modal === 'withdraw' && (
        <WithdrawModal
          onClose={() => setModal(null)}
          onWithdraw={async () => {
            await withdraw();
            navigate('/login', { replace: true });
          }}
        />
      )}

      {toast && <div className="toast-success" role="status">{toast}</div>}
    </div>
  );
}

function ModalBackdrop({ onClose, children }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ProfileEditModal({ user, onClose, onSave, onDone }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [affiliation, setAffiliation] = useState(user.affiliation || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('表示名を入力してください。');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ displayName: displayName.trim(), phone, affiliation });
      onDone();
      onClose();
    } catch (err) {
      setError(err.message || '更新に失敗しました。');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-header"><h3>プロフィール編集</h3></div>
        {error && <div className="login-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
        <div className="field">
          <label htmlFor="edit-display-name">表示名</label>
          <input id="edit-display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="edit-phone">電話番号（任意）</label>
          <input id="edit-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090-0000-0000" />
        </div>
        <div className="field">
          <label htmlFor="edit-affiliation">所属（任意）</label>
          <input id="edit-affiliation" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="例: そらのほしこども園 ひまわり組" />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '保存中…' : '保存'}</button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

function NotificationSettingsModal({ settings, onClose, onSave, onDone }) {
  const [values, setValues] = useState({
    important: settings.important !== false,
    sky: settings.sky !== false,
    event: settings.event !== false,
    system: settings.system !== false
  });
  const [saving, setSaving] = useState(false);

  function toggle(key) {
    setValues((v) => ({ ...v, [key]: !v[key] }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(values);
      onDone();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-header"><h3>通知設定</h3></div>
      <div style={{ marginBottom: 16 }}>
        {NOTIF_TOGGLES.map((t) => (
          <label
            key={t.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 4px',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 14 }}>{t.label}</span>
            <span className={`switch${values[t.key] ? ' on' : ''}`} onClick={() => toggle(t.key)} role="switch" aria-checked={values[t.key]}>
              <span className="switch-knob" />
            </span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
        <button type="button" className="btn btn-primary" disabled={saving} onClick={handleSave}>
          {saving ? '保存中…' : '保存'}
        </button>
      </div>
    </ModalBackdrop>
  );
}

function PasswordChangeModal({ onClose, onSubmit, onDone }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!current || !next || !confirm) {
      setError('すべての項目を入力してください。');
      return;
    }
    if (next.length < 6) {
      setError('新しいパスワードは6文字以上で入力してください。');
      return;
    }
    if (next !== confirm) {
      setError('新しいパスワード（確認用）が一致しません。');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(current, next);
      onDone();
      onClose();
    } catch (err) {
      setError(err.message || 'パスワードの変更に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-header"><h3>パスワード変更</h3></div>
        {error && <div className="login-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
        <div className="field">
          <label htmlFor="current-password">現在のパスワード</label>
          <input id="current-password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="new-password">新しいパスワード（6文字以上）</label>
          <input id="new-password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="new-password-confirm">新しいパスワード（確認）</label>
          <input id="new-password-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '変更中…' : 'パスワードを変更'}
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

function LoginHistoryModal({ user, onClose }) {
  const updated = user.updatedAt ? new Date(user.updatedAt).toLocaleString('ja-JP') : '不明';
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-header"><h3>ログイン履歴</h3></div>
      <div className="card" style={{ padding: '4px 16px', marginBottom: 16 }}>
        <div className="notif-item">
          <span className="notif-dot read" />
          <span className="notif-body">
            <span className="notif-title">現在のセッション</span>
            <span className="notif-text">このブラウザで現在ログイン中です。</span>
            <span className="notif-meta">プロフィール最終更新: {updated}</span>
          </span>
        </div>
      </div>
      <p className="text-sm-muted" style={{ marginBottom: 20 }}>
        詳細なログイン履歴（デバイス・IPアドレスなど）の記録機能は今後の開発範囲です。
      </p>
      <button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>
    </ModalBackdrop>
  );
}

function WithdrawModal({ onClose, onWithdraw }) {
  const [confirmText, setConfirmText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const canSubmit = confirmText === '退会する';

  async function handleWithdraw() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await onWithdraw();
    } catch (err) {
      setError(err.message || '退会処理に失敗しました。');
      setSubmitting(false);
    }
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-header"><h3 style={{ color: 'var(--danger)' }}>STAR ONEを退会しますか？</h3></div>
      {error && <div className="login-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      <p className="text-sm-muted" style={{ marginBottom: 10 }}>
        退会すると、STAR IDでのログインができなくなり、STAR IDを使用しているそらのほしグループの各サービスへのアクセスに影響する場合があります。
      </p>
      <p className="text-sm-muted" style={{ marginBottom: 16 }}>
        アカウントは即座に完全削除されるわけではなく、一定期間はデータが保持され、必要に応じて管理者が復旧できる状態になります。
      </p>
      <div className="field">
        <label htmlFor="withdraw-confirm">続行するには「退会する」と入力してください</label>
        <input id="withdraw-confirm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="退会する" />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
        <button type="button" className="btn btn-danger" disabled={!canSubmit || submitting} onClick={handleWithdraw}>
          {submitting ? '処理中…' : '退会する'}
        </button>
      </div>
    </ModalBackdrop>
  );
}
