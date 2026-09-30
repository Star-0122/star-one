import { useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync.js';
import { getCalendarEvents } from '../services/index.js';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/common/Icons.jsx';

const DOW = ['日', '月', '火', '水', '木', '金', '土'];
const COLOR_MAP = { navy: 'var(--sora-navy)', blue: 'var(--star-blue)', coral: 'var(--accent-coral)', gold: 'var(--accent-gold)', mint: 'var(--accent-mint)' };

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, inMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const next = cells.length - (startOffset + daysInMonth) + 1;
    cells.push({ day: next, inMonth: false, date: new Date(year, month + 1, next) });
  }
  return cells;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPage() {
  const { status, data, error, reload } = useAsync(() => getCalendarEvents(), []);
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const events = data || [];

  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const key = new Date(e.startAt).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return map;
  }, [events]);

  const monthEvents = events
    .filter((e) => new Date(e.startAt).getMonth() === cursor.getMonth() && new Date(e.startAt).getFullYear() === cursor.getFullYear())
    .sort((a, b) => (a.startAt > b.startAt ? 1 : -1));

  return (
    <div>
      <h1 className="page-title">STAR CALENDAR</h1>
      <p className="page-sub">グループ全体の予定を、ひとつのカレンダーで確認できます。</p>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={reload} message={error?.message} />}

      {status === 'success' && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            <div className="cal-header">
              <button
                className="icon-btn"
                aria-label="前の月"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              >
                <ChevronLeftIcon />
              </button>
              <span className="cal-month">
                {cursor.getFullYear()}年 {cursor.getMonth() + 1}月
              </span>
              <button
                className="icon-btn"
                aria-label="次の月"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              >
                <ChevronRightIcon />
              </button>
            </div>
            <div className="cal-grid">
              {DOW.map((d) => (
                <div className="cal-dow" key={d}>{d}</div>
              ))}
              {cells.map((c, i) => {
                const dayEvents = eventsByDay.get(c.date.toDateString()) || [];
                return (
                  <div
                    key={i}
                    className={`cal-cell${!c.inMonth ? ' other-month' : ''}${sameDay(c.date, today) ? ' today' : ''}`}
                  >
                    <span>{c.day}</span>
                    {dayEvents.length > 0 && (
                      <span className="cal-dot-row">
                        {dayEvents.slice(0, 3).map((e, j) => (
                          <span key={j} className="cal-dot" style={{ background: sameDay(c.date, today) ? '#fff' : COLOR_MAP[e.color] || 'var(--star-blue)' }} />
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section-title">今月の予定</div>
          {monthEvents.length === 0 ? (
            <EmptyState title="今月の予定はありません" />
          ) : (
            <div className="card" style={{ padding: '4px 16px' }}>
              {monthEvents.map((e) => (
                <div className="agenda-item" key={e.id}>
                  <span className="agenda-color" style={{ background: COLOR_MAP[e.color] || 'var(--star-blue)' }} />
                  <span className="agenda-time">
                    {e.allDay
                      ? '終日'
                      : new Date(e.startAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>
                    <span className="agenda-title">{e.title}</span>
                    <div className="agenda-source">{e.sourceLabel} ・ {new Date(e.startAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}</div>
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
