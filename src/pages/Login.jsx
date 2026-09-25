import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { backendProviderName } from '../services/index.js';

export default function Login() {
  const { status, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'signed-in') {
    const redirectTo = location.state?.from || '/';
    return <Navigate to={redirectTo} replace />;
  }

  function switchMode(next) {
    setMode(next);
    setError('');
    setNotice('');
    setPassword('');
    setPasswordConfirm('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('メールアドレス（またはSTAR ID）とパスワードを入力してください。');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message || 'ログインに失敗しました。');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!displayName || !email || !password) {
      setError('表示名・メールアドレス・パスワードを入力してください。');
      return;
    }
    if (!email.includes('@')) {
      setError('新規登録にはメールアドレスの入力が必要です。');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return;
    }
    if (password !== passwordConfirm) {
      setError('パスワード（確認用）が一致しません。');
      return;
    }

    setSubmitting(true);
    try {
      const result = await register(email, password, displayName);
      if (result.needsEmailConfirmation) {
        setNotice('確認メールを送信しました。メール内のリンクを開いて認証を完了してから、ログインしてください。');
        switchMode('login');
        setEmail(email);
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || '新規登録に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-wrap">
      <img
        src={`${import.meta.env.BASE_URL}logo-sora-no-hoshi.png`}
        alt="そらのほしグループ"
        className="login-logo"
      />

      {mode === 'login' ? (
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="login-title" style={{ textAlign: 'center' }}>STAR ID</div>
          <p className="login-desc" style={{ textAlign: 'center', marginBottom: 20 }}>
            そらのほしグループの共通アカウントです。
          </p>

          {notice && (
            <div
              className="login-error"
              role="status"
              style={{ background: 'var(--star-blue-soft)', borderColor: 'var(--star-blue)', color: 'var(--sora-navy)' }}
            >
              {notice}
            </div>
          )}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">メールアドレス または STAR ID</label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'ログイン中…' : 'ログイン'}
          </button>

          <div className="login-links">
            <button type="button" className="text-link-btn">パスワードをお忘れですか？</button>
            <button type="button" className="text-link-btn" onClick={() => switchMode('signup')}>
              新規登録
            </button>
            <button type="button" className="text-link-btn">ヘルプ</button>
          </div>

          {backendProviderName === 'mock' && (
            <div className="demo-hint">
              デモ用ログイン: <strong>toma@example.com</strong>（保護者） または{' '}
              <strong>admin@example.com</strong>（管理者） / パスワードはそれぞれ
              <strong> password</strong> ・ <strong>admin</strong>
            </div>
          )}
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSignUp} noValidate>
          <div className="login-title" style={{ textAlign: 'center' }}>新規登録</div>
          <p className="login-desc" style={{ textAlign: 'center', marginBottom: 20 }}>
            新しいSTAR IDを作成します。権限は登録後、管理者が必要に応じて設定します。
          </p>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="displayName">表示名</label>
            <input
              id="displayName"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例: そらの たろう"
            />
          </div>
          <div className="field">
            <label htmlFor="signupEmail">メールアドレス</label>
            <input
              id="signupEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="signupPassword">パスワード（6文字以上）</label>
            <input
              id="signupPassword"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="signupPasswordConfirm">パスワード（確認用）</label>
            <input
              id="signupPasswordConfirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '登録中…' : 'STAR IDを作成する'}
          </button>

          <div className="login-links">
            <button type="button" className="text-link-btn" onClick={() => switchMode('login')}>
              ログイン画面に戻る
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
