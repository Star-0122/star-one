import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import Shell from './components/layout/Shell.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Notifications from './pages/Notifications.jsx';
import CalendarPage from './pages/Calendar.jsx';
import Account from './pages/Account.jsx';
import Help from './pages/Help.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminServices from './pages/admin/AdminServices.jsx';
import AdminNotices from './pages/admin/AdminNotices.jsx';
import { NotFoundState } from './components/common/States.jsx';

const SPLASH_KEY = 'star-one-splash-shown';

export default function App() {
  // 起動画面はセッション中1回だけ表示する。
  // ログイン済みならHOMEへ、未ログインならSTAR IDログインへ、それぞれ
  // Shell / Loginコンポーネント自身の認証状態チェックが自然に振り分ける。
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem(SPLASH_KEY));

  if (showSplash) {
    return (
      <Splash
        onFinish={() => {
          sessionStorage.setItem(SPLASH_KEY, '1');
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:serviceId" element={<Services />} />
        <Route path="notice" element={<Notifications />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="account" element={<Account />} />
        <Route path="help" element={<Help />} />

        <Route path="admin" element={<AdminDashboard />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="notices" element={<AdminNotices />} />
        </Route>

        <Route path="*" element={<NotFoundState />} />
      </Route>
    </Routes>
  );
}
