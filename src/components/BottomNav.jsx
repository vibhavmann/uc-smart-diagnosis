const G = '#0B6E4F';
const ITEMS = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'bookings', icon: '📋', label: 'Bookings' },
  { id: 'explore',  icon: '🔍', label: 'Explore' },
  { id: 'account',  icon: '👤', label: 'Account' },
];

export default function BottomNav({ active = 'home', onNavigate }) {
  return (
    <div className="flex border-t border-gray-100 bg-white flex-shrink-0">
      {ITEMS.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-opacity active:opacity-60"
            style={{ color: isActive ? G : '#9CA3AF' }}
            onClick={() => onNavigate && onNavigate(it.id)}
          >
            <span className="text-lg leading-none">{it.icon}</span>
            <span className="text-[10px] font-medium">{it.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: G }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
