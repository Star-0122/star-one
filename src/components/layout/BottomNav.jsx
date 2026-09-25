import { NavLink } from 'react-router-dom';
import { HomeIcon, ServicesIcon, BellIcon, CalendarIcon, AccountIcon } from '../common/Icons.jsx';

const items = [
  { to: '', label: 'HOME', icon: HomeIcon, end: true },
  { to: 'services', label: 'SERVICES', icon: ServicesIcon },
  { to: 'notice', label: 'NOTICE', icon: BellIcon },
  { to: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
  { to: 'account', label: 'ACCOUNT', icon: AccountIcon }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      <div className="bottom-nav-inner">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
