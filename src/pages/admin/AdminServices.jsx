import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { getServices, adminUpsertService, adminDeleteService } from '../../services/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States.jsx';
import ServiceIcon from '../../components/common/ServiceIcon.jsx';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/common/Icons.jsx';
import { BackLink } from './AdminUsers.jsx';

const CATEGORIES = [
  { id: 'education', label: '教育・保育' },
  { id: 'learning', label: '学習' },
  { id: 'event', label: 'イベント' },
  { id: 'procedure', label: '各種手続き' },
  { id: 'group', label: 'グループサービス' },
  { id: 'other', label: 'その他' }
];
const ICONS = ['sky', 'cloud', 'book', 'calendar', 'doc', 'sparkle'];
const ROLES = ['admin', 'guardian', 'student', 'staff', 'user'];

const emptyForm = {
  id: '',
  name: '',
  description: '',
  icon: 'sparkle',
  url: '',
  category: 'group',
  status: 'published',
  requiredRoles: ['guardian'],
  external: false
};

export default function AdminServices() {
  const { status, data, error, reload } = useAsync(() => getServices(), []);
  const [editing, setEditing] = useState(null); // null | form object
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpsertService(editing);
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('このサービスを削除しますか？この操作は取り消せません。')) return;
    await adminDeleteService(id);
    reload();
  }

  function toggleRole(role) {
    setEditing((f) => ({
      ...f,
      requiredRoles: f.requiredRoles.includes(role)
        ? f.requiredRoles.filter((r) => r !== role)
        : [...f.requiredRoles, role]
    }));
  }

  return (
    <div>
      <BackLink />
      <div className="util-between" style={{ marginBottom: 4 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>サービス管理</h1>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setEditing({ ...emptyForm })}>
          <PlusIcon width={18} height={18} /> 追加
        </button>
      </div>
      <p className="page-sub">STAR ONEに表示するサービスの登録・編集・公開設定を行います。</p>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}
      {status === 'success' && data.length === 0 && <EmptyState title="サービスが登録されていません" />}
      {status === 'success' && data.length > 0 && (
        <div className="card" style={{ padding: '4px 12px' }}>
          {data.map((s) => (
            <div className="service-list-row" key={s.id}>
              <div className="service-icon"><ServiceIcon icon={s.icon} width={20} height={20} /></div>
              <div className="service-body">
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.description}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button className="icon-btn" aria-label="編集" onClick={() => setEditing({ ...emptyForm, ...s })}>
                  <EditIcon width={18} height={18} />
                </button>
                <button className="icon-btn" aria-label="削除" onClick={() => handleDelete(s.id)}>
                  <TrashIcon width={18} height={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setEditing(null)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <div className="modal-header">
              <h3>{editing.id ? 'サービスを編集' : 'サービスを追加'}</h3>
            </div>

            <div className="field">
              <label>サービス名</label>
              <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="field">
              <label>説明</label>
              <textarea required value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="field">
              <label>URL</label>
              <input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="field">
              <label>アイコン</label>
              <select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="field">
              <label>カテゴリ</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label>公開状態</label>
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                <option value="published">公開</option>
                <option value="draft">非公開（下書き）</option>
              </select>
            </div>
            <div className="field">
              <label>対象ユーザー（必要権限）</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`chip${editing.requiredRoles.includes(r) ? ' active' : ''}`}
                    onClick={() => toggleRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  style={{ width: 'auto', minHeight: 'auto' }}
                  checked={editing.external}
                  onChange={(e) => setEditing({ ...editing, external: e.target.checked })}
                />
                外部サービス（新しいタブで開く）
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>キャンセル</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '保存中…' : '保存'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
