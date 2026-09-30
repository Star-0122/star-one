import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { StarIcon } from '../components/common/Icons.jsx';

const stars = [
  { top: '14%', left: '18%', size: 10, delay: '0s' },
  { top: '22%', left: '78%', size: 8, delay: '0.6s' },
  { top: '68%', left: '12%', size: 7, delay: '1.1s' },
  { top: '76%', left: '82%', size: 9, delay: '0.3s' },
  { top: '40%', left: '90%', size: 6, delay: '0.9s' }
];

// onFinish(status) は起動アニメーション終了後に呼ばれる。
// 実際の遷移先の決定（HOME か STAR IDログインか）は呼び出し側（App.jsx）が行う。
export default function Splash({ onFinish }) {
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'loading') return;
    const t = setTimeout(() => onFinish?.(status), 1900);
    return () => clearTimeout(t);
  }, [status, onFinish]);

  return (
    <div className="splash-screen">
      {stars.map((s, i) => (
        <StarIcon
          key={i}
          className="splash-star"
          width={s.size}
          height={s.size}
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}
      <img
        src={`${import.meta.env.BASE_URL}logo-sora-no-hoshi.png`}
        alt="そらのほしグループ"
        className="splash-logo"
      />
      <div className="splash-brand">STAR ONE</div>
      <div className="splash-sub">SORA NO HOSHI GROUP</div>
      <div className="splash-tagline">すべてを、ひとつに。</div>
      <div className="splash-loader" aria-hidden="true" />
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }} role="status">
        STAR ONEを起動しています
      </span>
    </div>
  );
}
