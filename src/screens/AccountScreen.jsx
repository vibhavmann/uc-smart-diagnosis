import { useAuth } from '../contexts/AuthContext';
import BottomNav from '../components/BottomNav';

const P = '#111111';

export default function AccountScreen({ onNavigate, onLogin }) {
  const { user, signOut, hasSupabase } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>
        <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">Account</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {hasSupabase ? 'Sign in to access your profile' : 'Auth not yet configured'}
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-16">
          <span className="text-5xl mb-4">👤</span>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {hasSupabase ? "You're not signed in" : 'Set up Supabase to enable login'}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            {hasSupabase
              ? 'Sign in to save your bookings and history across sessions'
              : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env vars'}
          </p>
          {hasSupabase && (
            <button
              className="px-5 py-2.5 rounded-2xl text-white text-sm font-semibold"
              style={{ background: P}}
              onClick={onLogin}
            >
              Sign in →
            </button>
          )}
        </div>
        <BottomNav active="account" onNavigate={onNavigate} />
      </div>
    );
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User';
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900">Account</h1>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4 space-y-3">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-4 slide-up">
          {avatar ? (
            <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'var(--c-icon-bg)' }}
            >
              👤
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
            <span
              className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: P}}
            >
              Verified
            </span>
          </div>
        </div>

        {/* App info */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden slide-up">
          {[
            { label: 'App', value: 'UC Smart Diagnosis' },
            { label: 'AI Model', value: 'Claude Sonnet 4.6' },
            { label: 'Version', value: '2.0.0' },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-4 py-3.5 text-sm ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-gray-500">{row.label}</span>
              <span className="font-semibold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="w-full py-3.5 rounded-2xl border border-red-100 bg-red-50 text-red-600 text-sm font-semibold active:opacity-70 transition-opacity slide-up"
        >
          Sign Out
        </button>
      </div>

      <BottomNav active="account" onNavigate={onNavigate} />
    </div>
  );
}
