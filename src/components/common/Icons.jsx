// 依存ライブラリを増やさないための、最小限のインラインSVGアイコン集。
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" /></svg>
);
export const ServicesIcon = (p) => (
  <svg {...base} {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></svg>
);
export const BellIcon = (p) => (
  <svg {...base} {...p}><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" /><path d="M10 18.5a2 2 0 0 0 4 0" /></svg>
);
export const CalendarIcon = (p) => (
  <svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
);
export const AccountIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8.2" r="3.4" /><path d="M4.5 20c1.2-3.7 4.2-5.6 7.5-5.6s6.3 1.9 7.5 5.6" /></svg>
);
export const HelpIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.9.5-1.2 1-1.2 2" /><circle cx="12" cy="16.6" r="0.2" fill="currentColor" /></svg>
);
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="10.8" cy="10.8" r="6.3" /><path d="m20 20-4.4-4.4" /></svg>
);
export const StarIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}><path d="M12 2.5 14.6 9l6.9.6-5.2 4.6 1.6 6.8L12 17.7 6.1 21l1.6-6.8-5.2-4.6L9.4 9Z" /></svg>
);
export const ChevronRightIcon = (p) => (
  <svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const AlertIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3.5 21.5 20h-19Z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.2" fill="currentColor" /></svg>
);
export const CheckIcon = (p) => (
  <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
);
export const LogoutIcon = (p) => (
  <svg {...base} {...p}><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="M14 8.5 18 12l-4 3.5M18 12H9" /></svg>
);
export const EditIcon = (p) => (
  <svg {...base} {...p}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17Z" /></svg>
);
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6Z" /></svg>
);
export const HistoryIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
export const AppsIcon = (p) => (
  <svg {...base} {...p}><circle cx="6" cy="6" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="12" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
);
export const SettingsIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" /></svg>
);
export const ChevronLeftIcon = (p) => (
  <svg {...base} {...p}><path d="m15 6-6 6 6 6" /></svg>
);
export const CloudIcon = (p) => (
  <svg {...base} {...p}><path d="M7.5 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6-1.8A4.2 4.2 0 0 1 17.5 18Z" /></svg>
);
export const BookIcon = (p) => (
  <svg {...base} {...p}><path d="M4 5.5A2 2 0 0 1 6 4h5v16H6a2 2 0 0 1-2-2Z" /><path d="M20 5.5A2 2 0 0 0 18 4h-5v16h5a2 2 0 0 0 2-2Z" /></svg>
);
export const DocIcon = (p) => (
  <svg {...base} {...p}><path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" /><path d="M14 3.5V8h4" /></svg>
);
export const SparkleIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>
);
export const CameraIcon = (p) => (
  <svg {...base} {...p}><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z" /><circle cx="12" cy="12.5" r="3.4" /></svg>
);
export const TrashIcon = (p) => (
  <svg {...base} {...p}><path d="M5 7h14M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M7 7l1 12.5A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.5L17 7" /></svg>
);
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const WifiOffIcon = (p) => (
  <svg {...base} {...p}><path d="M2 8.5a16.9 16.9 0 0 1 5-3.2M22 8.5a16.9 16.9 0 0 0-8.8-4.4M6.5 12a10.7 10.7 0 0 1 3.2-1.9M17.5 12a10.6 10.6 0 0 0-1.7-1.2M9 15.5a5.9 5.9 0 0 1 3-1M2 2l20 20" /><circle cx="12" cy="19" r="0.2" fill="currentColor" /></svg>
);
export const LockIcon = (p) => (
  <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
);
