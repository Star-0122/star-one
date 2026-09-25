import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getServices } from '../services/index.js';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States.jsx';
import ServiceIcon from '../components/common/ServiceIcon.jsx';
import { SearchIcon, ChevronRightIcon, ChevronLeftIcon } from '../components/common/Icons.jsx';

const CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'education', label: '教育・保育' },
  { id: 'learning', label: '学習' },
  { id: 'event', label: 'イベント' },
  { id: 'procedure', label: '各種手続き' },
  { id: 'group', label: 'グループサービス' },
  { id: 'other', label: 'その他' }
];

export default function Services() {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const { status, data, error, reload } = useAsync(() => getServices(), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  if (serviceId) return <ServiceDetail id={serviceId} services={data} status={status} />;

  const visible = useMemo(() => {
    if (!data) return [];
    return data
      .filter((s) => s.requiredRoles.some((r) => user.roles.includes(r)))
      .filter((s) => category === 'all' || s.category === category)
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [data, category, query, user.roles]);

  return (
    <div>
      <h1 className="page-title">すべてのサービス</h1>
      <p className="page-sub">あなたが利用できるサービスだけを表示しています。</p>

      <div className="search-box">
        <SearchIcon width={18} height={18} />
        <input
          type="search"
          placeholder="サービスを検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="サービスを検索"
        />
      </div>

      <div className="chip-row" role="tablist" aria-label="カテゴリ">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={category === c.id}
            className={`chip${category === c.id ? ' active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}
      {status === 'success' && visible.length === 0 && (
        <EmptyState title="該当するサービスがありません" body="検索条件を変更してお試しください。" />
      )}
      {status === 'success' && visible.length > 0 && (
        <div className="card" style={{ padding: '4px 12px' }}>
          {visible.map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceRow({ service }) {
  const inner = (
    <>
      <div className="service-icon">
        <ServiceIcon icon={service.icon} width={20} height={20} />
      </div>
      <div className="service-body">
        <div className="service-name">{service.name}</div>
        <div className="service-desc">{service.description}</div>
      </div>
      <ChevronRightIcon width={18} height={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
    </>
  );
  if (service.external) {
    return (
      <a className="service-list-row" href={service.url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
        {inner}
      </a>
    );
  }
  return (
    <Link className="service-list-row" to={service.id} style={{ color: 'inherit' }}>
      {inner}
    </Link>
  );
}

function ServiceDetail({ id, services, status }) {
  if (status === 'loading') return <LoadingState />;
  const service = (services || []).find((s) => s.id === id);
  if (!service) return <EmptyState title="サービスが見つかりません" />;

  return (
    <div>
      <Link to=".." relative="path" className="text-link-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 16 }}>
        <ChevronLeftIcon width={16} height={16} /> サービス一覧
      </Link>
      <div className="card" style={{ padding: 22, textAlign: 'center' }}>
        <div className="service-icon" style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16 }}>
          <ServiceIcon icon={service.icon} width={26} height={26} />
        </div>
        <h1 className="page-title" style={{ marginBottom: 6 }}>{service.name}</h1>
        <p className="text-sm-muted" style={{ marginBottom: 20 }}>{service.description}</p>
        {service.external ? (
          <a href={service.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
            {service.name} を開く
          </a>
        ) : (
          <div className="btn btn-secondary" style={{ width: 'auto', display: 'inline-flex', cursor: 'default' }}>
            準備中です
          </div>
        )}
      </div>
    </div>
  );
}
