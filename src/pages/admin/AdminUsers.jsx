import { Link } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync.js';
import { adminListUsers } from '../../services/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States.jsx';
import { ChevronLeftIcon } from '../../components/common/Icons.jsx';

const ROLE_LABEL = { admin: '管理者', guardian: '保護者', student: '生徒', staff: 'スタッフ', user: '利用者' };

export default function AdminUsers() {
  const { status, data, error, reload } = useAsync(() => adminListUsers(), []);

  return (
    <div>
      <BackLink />
      <h1 className="page-title">ユーザー管理</h1>
      <p className="page-sub">STAR IDに登録されているユーザーと権限を確認できます。</p>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}
      {status === 'success' && data.length === 0 && <EmptyState title="ユーザーがいません" />}
      {status === 'success' && data.length > 0 && (
        <div className="card table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>表示名</th>
                <th>STAR ID</th>
                <th>メールアドレス</th>
                <th>所属</th>
                <th>権限</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id}>
                  <td>{u.displayName}</td>
                  <td>{u.starId}</td>
                  <td>{u.email}</td>
                  <td>{u.affiliation || '—'}</td>
                  <td>
                    {u.roles.map((r) => (
                      <span key={r} className={`pill${r === 'admin' ? ' role-admin' : ''}`} style={{ marginRight: 4 }}>
                        {ROLE_LABEL[r] || r}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function BackLink() {
  return (
    <Link to=".." relative="path" className="text-link-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 16 }}>
      <ChevronLeftIcon width={16} height={16} /> 管理者画面
    </Link>
  );
}
