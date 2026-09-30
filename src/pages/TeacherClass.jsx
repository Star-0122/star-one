import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PermissionDeniedState } from '../components/common/States.jsx';
import { ChevronLeftIcon, BookIcon } from '../components/common/Icons.jsx';

// プロトタイプ用のダミー生徒データ（実際の学籍データベースは今回のスコープ外）。
// バックエンドが無い段階でも、先生が画面上で操作イメージを確認できるようにする。
const MOCK_STUDENTS = [
  { id: 1, name: '山田 はな', attendance: '出席' },
  { id: 2, name: '佐藤 みお', attendance: '出席' },
  { id: 3, name: '田中 そら', attendance: '欠席（連絡あり）' },
  { id: 4, name: '鈴木 ゆい', attendance: '出席' },
  { id: 5, name: '高橋 りく', attendance: '遅刻' }
];

export default function TeacherClass() {
  const { user, hasRole } = useAuth();

  // URLを直接入力しても、先生ロールを持たないユーザーには表示しない。
  if (!hasRole('teacher')) {
    return <PermissionDeniedState />;
  }

  const classes = user.homeroomClasses || [];

  return (
    <div>
      <Link to=".." relative="path" className="text-link-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 16 }}>
        <ChevronLeftIcon width={16} height={16} /> HOME
      </Link>
      <h1 className="page-title">担当クラス</h1>
      <p className="page-sub">
        {classes.length > 0 ? classes.join('、') : '担当クラスは未設定です'} の出欠・連絡状況を確認できます。
      </p>

      <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="service-icon" style={{ width: 44, height: 44 }}>
          <BookIcon width={20} height={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{classes[0] || '担当クラス'}</div>
          <div className="text-sm-muted">本日の出欠状況（プロトタイプ表示）</div>
        </div>
      </div>

      <div className="section-title">本日の出欠</div>
      <div className="card" style={{ padding: '4px 16px' }}>
        {MOCK_STUDENTS.map((s) => (
          <div key={s.id} className="service-list-row">
            <div className="service-body">
              <div className="service-name">{s.name}</div>
            </div>
            <span
              className="pill"
              style={
                s.attendance === '出席'
                  ? {}
                  : { background: '#fdeee3', color: '#b5591a' }
              }
            >
              {s.attendance}
            </span>
          </div>
        ))}
      </div>

      <p className="text-sm-muted" style={{ marginTop: 16 }}>
        ※ これはプロトタイプ表示です。実際の生徒データ連携は今後の開発範囲となります。
      </p>
    </div>
  );
}
