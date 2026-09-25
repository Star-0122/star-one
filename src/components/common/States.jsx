import { AlertIcon, WifiOffIcon, LockIcon, SearchIcon } from './Icons.jsx';

export function LoadingState({ label = '読み込み中です…' }) {
  return (
    <div role="status" aria-live="polite">
      <div className="skeleton" style={{ height: 96, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 56, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 56, marginBottom: 10 }} />
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>{label}</span>
    </div>
  );
}

export function ErrorState({ message = '情報の取得に失敗しました。', onRetry }) {
  return (
    <div className="state-block" role="alert">
      <AlertIcon width={34} height={34} className="state-icon" />
      <h3>うまく読み込めませんでした</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" style={{ width: 'auto', marginTop: 8 }} onClick={onRetry}>
          もう一度試す
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon = SearchIcon, title = '該当する情報がありません', body }) {
  return (
    <div className="state-block">
      <Icon width={34} height={34} className="state-icon" />
      <h3>{title}</h3>
      {body && <p>{body}</p>}
    </div>
  );
}

export function OfflineState({ onRetry }) {
  return (
    <div className="state-block">
      <WifiOffIcon width={34} height={34} className="state-icon" />
      <h3>オフラインです</h3>
      <p>インターネット接続をご確認のうえ、もう一度お試しください。</p>
      {onRetry && (
        <button className="btn btn-secondary" style={{ width: 'auto', marginTop: 8 }} onClick={onRetry}>
          再読み込み
        </button>
      )}
    </div>
  );
}

export function PermissionDeniedState() {
  return (
    <div className="state-block">
      <LockIcon width={34} height={34} className="state-icon" />
      <h3>閲覧権限がありません</h3>
      <p>この画面を利用する権限がSTAR IDに設定されていません。管理者にお問い合わせください。</p>
    </div>
  );
}

export function NotFoundState() {
  return (
    <div className="state-block">
      <AlertIcon width={34} height={34} className="state-icon" />
      <h3>ページが見つかりません</h3>
      <p>URLをご確認いただくか、HOMEからやり直してください。</p>
    </div>
  );
}
