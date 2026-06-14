import Badge from '../components/Badge';
import BottomNav from '../components/BottomNav';
import { CATALOG } from '../catalog';
import { useAuth } from '../contexts/AuthContext';

const G = '#0B6E4F';

export default function HomeScreen({ onIntake, onDemo, onNavigate, dark, onToggleDark }) {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>
      {/* top bar */}
      <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 uppercase tracking-wide">Delivering to</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Koramangala, Bangalore</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">▾</span>
            </div>
          </div>
          {/* dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
            style={{ background: 'var(--c-bg)' }}
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {/* avatar / login */}
          <button
            onClick={() => onNavigate('account')}
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'var(--c-bg)' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span>👤</span>
            )}
          </button>
        </div>
        {/* search bar */}
        <div
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 cursor-pointer active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
          onClick={onIntake}
        >
          <span className="text-gray-400 dark:text-gray-500 text-sm">🔍</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">Search for a service…</span>
        </div>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4">
        {/* guided demo banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-300">See it in action</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Watch the AI diagnose a real UC problem live</p>
          </div>
          <button
            className="flex-shrink-0 px-3 py-2 rounded-xl text-white text-xs font-bold active:opacity-80"
            style={{ background: '#D97706' }}
            onClick={onDemo}
          >
            Live Demo →
          </button>
        </div>

        {/* AI hero card */}
        <div
          className="rounded-3xl p-5 mb-5 cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(135deg, ${G} 0%, #0F9B6E 100%)` }}
          onClick={onIntake}
        >
          <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 tracking-wider">
            ✨ NEW · AI POWERED
          </span>
          <h2 className="text-white font-bold text-base leading-snug mb-1.5">
            Not sure what you need?<br />Describe it — we'll diagnose.
          </h2>
          <p className="text-white/75 text-xs leading-relaxed mb-4">
            Get the right service + an honest price before you book. No surprises on-site.
          </p>
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-3.5 py-2">
            <span className="text-sm" style={{ color: G }}>🤖</span>
            <span className="text-xs font-semibold" style={{ color: G }}>Diagnose my problem</span>
            <span className="text-xs" style={{ color: G }}>→</span>
          </div>
        </div>

        {/* category grid */}
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Services</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {CATALOG.map((cat) => (
            <div
              key={cat.category}
              className="rounded-2xl p-3 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform border border-white/50 dark:border-transparent"
              style={{ background: cat.color }}
              onClick={onIntake}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">{cat.category}</span>
            </div>
          ))}
        </div>

        {/* featured */}
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Featured Today</p>
        <div className="space-y-2.5">
          {[
            { name: 'AC Service Summer Special', badge: 'Starting ₹599', sub: 'Split & window AC. Beats the heat.', icon: '❄️', bg: '#E0F2FE' },
            { name: 'Home Deep Clean', badge: 'Starting ₹1,999', sub: '100% satisfaction guaranteed.', icon: '🧹', bg: '#F0FDF4' },
            { name: 'Pre-Event Beauty', badge: 'Starting ₹1,999', sub: 'Glow up for your next big event.', icon: '💅', bg: '#FDF4FF' },
          ].map((f) => (
            <div key={f.name} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: f.bg }}>
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{f.name}</p>
                  <Badge variant="green">{f.badge}</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
