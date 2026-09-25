import { useAsync } from '../../hooks/useAsync.js';
import { getNotifications } from '../../services/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States.jsx';
import { BackLink } from './AdminUsers.jsx';

export default function AdminNotices() {
  const { status, data, error, reload } = useAsync(() => getNotifications(), []);

  return (
    <div>
      <BackLink />
      <h1 className="page-title">お知らせ管理</h1>
      <p className="page-sub">
        配信済みのお知らせを確認できます。新規作成・編集は
        <code style={{ margin: '0 4px' }}>adminUpsertNotification</code>
        をDatabaseServiceへ追加して拡張してください。
      </p>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}
      {status === 'success' && data.length === 0 && <EmptyState title="お知らせがありません" />}
      {status === 'success' && data.length > 0 && (
        <div className="card table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>種別</th>
                <th>優先度</th>
                <th>状態</th>
                <th>配信日</th>
              </tr>
            </thead>
            <tbody>
              {data.map((n) => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td>{n.type}</td>
                  <td>{n.priority === 'high' ? '重要' : '通常'}</td>
                  <td>{n.read ? '既読' : '未読'}</td>
                  <td>{new Date(n.createdAt).toLocaleDateString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
