import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Header from './Header.jsx';
import BottomNav from './BottomNav.jsx';
import Sidebar from './Sidebar.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getNotifications } from '../../services/index.js';

export default function Shell() {
  const { status } = useAuth();
  const location = useLocation();
  const { data } = useAsync(() => getNotifications(), []);
  const unreadCount = (data || []).filter((n) => !n.read).length;

  if (status === 'loading') {
    return <div className="splash-screen" aria-hidden="true" />;
  }
  if (status === 'signed-out') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="app-shell with-sidebar">
      <Sidebar />
      <div className="app-content-area">
        <div style={{ width: '100%' }}>
          <Header unreadCount={unreadCount} />
          <main className="app-main">
            <Outlet context={{ unreadCount }} />
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
