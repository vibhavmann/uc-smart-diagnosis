import Badge from '../components/Badge';
import BottomNav from '../components/BottomNav';
import { CATALOG } from '../catalog';
import { useAuth } from '../contexts/AuthContext';

const P = '#111111';

export default function HomeScreen({ onIntake, onDemo, onNavigate }) {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>
      {/* top bar */}
      <div className="bg-white px-4 pt-10 pb-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Delivering to</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900">Koramangala, Bangalore</span>
              <span className="text-gray-500 text-xs">▾</span>
            </div>
          </div>
          {/* avatar / login */}
          <button
            onClick={() => onNavigate('account')}
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-gray-200"
            style={{ background: 'var(--c-icon-bg)' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-base">👤</span>
            )}
          </button>
        </div>
        {/* search bar */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 cursor-pointer transition-colors border border-gray-200"
          style={{ background: 'var(--c-icon-bg)' }}
          onClick={onIntake}
        >
          <span className="text-gray-500 text-sm">🔍</span>
          <span className="text-sm text-gray-500">Search for a service…</span>
        </div>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4">
        {/* AI hero card */}
        <div
          className="rounded-2xl p-5 mb-4 cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(135deg, ${P} 0%, #333333 100%)` }}
          onClick={onIntake}
        >
          <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 tracking-wider">
            ✨ AI POWERED
          </span>
          <h2 className="text-white font-bold text-base leading-snug mb-1.5">
            Not sure what you need?<br />Describe it — we'll diagnose.
          </h2>
          <p className="text-white/75 text-xs leading-relaxed mb-4">
            Get the right service + honest price before you book. No surprises on-site.
          </p>
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-3.5 py-2">
            <span className="text-sm" style={{ color: P }}>🤖</span>
            <span className="text-xs font-semibold" style={{ color: P }}>Diagnose my problem</span>
            <span className="text-xs" style={{ color: P }}>→</span>
          </div>
        </div>

        {/* guided demo banner */}
        <div
          className="rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-3 border border-gray-200"
          style={{ background: 'var(--c-icon-bg)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">See it in action</p>
            <p className="text-xs text-gray-600 mt-0.5">Watch AI diagnose a real UC problem live</p>
          </div>
          <button
            className="flex-shrink-0 px-3 py-2 rounded-xl text-white text-xs font-bold active:opacity-80"
            style={{ background: P }}
            onClick={onDemo}
          >
            Live Demo →
          </button>
        </div>

        {/* category grid */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Our Services</p>
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {CATALOG.map((cat) => (
            <div
              key={cat.category}
              className="bg-white rounded-2xl py-3 px-1 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform border border-gray-200"
              onClick={onIntake}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'var(--c-icon-bg)' }}
              >
                {cat.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight px-0.5">{cat.category}</span>
            </div>
          ))}
        </div>

        {/* featured */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Featured Today</p>
        <div className="space-y-2.5">
          {[
            { name: 'AC Service Summer Special', badge: 'From ₹599', sub: 'Split & window AC. Beats the heat.', icon: '❄️' },
            { name: 'Home Deep Clean', badge: 'From ₹1,999', sub: '100% satisfaction guaranteed.', icon: '🧹' },
            { name: 'Pre-Event Beauty', badge: 'From ₹1,999', sub: 'Glow up for your next big event.', icon: '💅' },
          ].map((f) => (
            <div key={f.name} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-200 cursor-pointer active:scale-[0.98] transition-transform" onClick={onIntake}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--c-icon-bg)' }}>
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{f.name}</p>
                  <Badge variant="gray">{f.badge}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
