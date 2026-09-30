import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, SearchIcon } from '../common/Icons.jsx';

export default function Header({ unreadCount = 0 }) {
  const navigate = useNavigate();
  return (
    <header className="top-header">
      <div className="top-header-inner">
        <img src={`${import.meta.env.BASE_URL}logo-sora-no-hoshi.png`} alt="そらのほしグループ" className="top-header-logo" />
        <span className="top-header-title">STAR ONE</span>
        <div className="top-header-spacer" />
        <button className="icon-btn" aria-label="サービスを検索" onClick={() => navigate('services')}>
          <SearchIcon />
        </button>
        <Link to="notice" className="icon-btn" aria-label={`通知${unreadCount > 0 ? `、未読${unreadCount}件` : ''}`}>
          <BellIcon />
          {unreadCount > 0 && <span className="badge-dot" />}
        </Link>
      </div>
    </header>
  );
}
