import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  HomeIcon,
  ServicesIcon,
  BellIcon,
  CalendarIcon,
  AccountIcon,
  HelpIcon,
  ShieldIcon,
  LogoutIcon
} from '../common/Icons.jsx';

const items = [
  { to: '', label: 'HOME', icon: HomeIcon, end: true },
  { to: 'services', label: 'SERVICES', icon: ServicesIcon },
  { to: 'notice', label: 'NOTICE', icon: BellIcon },
  { to: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
  { to: 'account', label: 'ACCOUNT', icon: AccountIcon },
  { to: 'help', label: 'HELP', icon: HelpIcon }
];

export default function Sidebar() {
  const { user, hasRole, logout } = useAuth();

  return (
    <aside className="sidebar">
      <img
        src={`${import.meta.env.BASE_URL}logo-sora-no-hoshi.png`}
        alt=""
        className="sidebar-logo"
      />
      <div className="sidebar-brand">STAR ONE</div>
      <div className="sidebar-tagline">すべてを、ひとつに。</div>
      <nav className="sidebar-nav">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
        {hasRole('admin') && (
          <NavLink to="admin" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <ShieldIcon />
            管理者画面
          </NavLink>
        )}
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: 12.5, opacity: 0.85, marginBottom: 10 }}>
          {user?.displayName} さん
        </div>
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ width: '100%', border: 'none', background: 'rgba(255,255,255,0.08)', cursor: 'pointer' }}
        >
          <LogoutIcon />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
