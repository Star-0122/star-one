import { useState } from 'react';
import { useAsync } from '../hooks/useAsync.js';
import { getFaq } from '../services/index.js';
import { LoadingState, ErrorState } from '../components/common/States.jsx';
import { StarIcon, AccountIcon, ServicesIcon, HelpIcon, ChevronRightIcon } from '../components/common/Icons.jsx';

const TOPICS = [
  { icon: StarIcon, title: 'STAR ONEとは', desc: '統合プラットフォームの全体像' },
  { icon: AccountIcon, title: 'STAR IDとは', desc: '共通アカウントの仕組み' },
  { icon: ServicesIcon, title: 'サービスの使い方', desc: '各サービスへのアクセス方法' },
  { icon: HelpIcon, title: 'お問い合わせ', desc: '解決しない場合はこちら' }
];

export default function Help() {
  const { status, data, error, reload } = useAsync(() => getFaq(), []);
  const [openId, setOpenId] = useState(null);

  return (
    <div>
      <h1 className="page-title">STAR HELP</h1>
      <p className="page-sub">STAR ONE・STAR IDの使い方やよくある質問をまとめています。</p>

      <div className="help-grid">
        {TOPICS.map((t) => (
          <div className="card help-tile" key={t.title}>
            <t.icon width={20} height={20} className="help-icon" />
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="section-title">よくある質問</div>
      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}
      {status === 'success' && (
        <div className="card" style={{ padding: '4px 16px' }}>
          {data.map((f) => {
            const open = openId === f.id;
            return (
              <div className="faq-item" key={f.id}>
                <button className="faq-q" onClick={() => setOpenId(open ? null : f.id)} aria-expanded={open}>
                  {f.question}
                  <ChevronRightIcon
                    width={16}
                    height={16}
                    style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
                  />
                </button>
                {open && <div className="faq-a">{f.answer}</div>}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-24 card" style={{ padding: 18, textAlign: 'center' }}>
        <p className="text-sm-muted" style={{ marginBottom: 12 }}>
          解決しない場合は、そらのほしグループ事務局までお問い合わせください。
        </p>
        <button className="btn btn-secondary" style={{ width: 'auto', display: 'inline-flex' }}>お問い合わせフォーム</button>
      </div>
    </div>
  );
}
