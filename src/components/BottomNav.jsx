const G = '#0B6E4F';
const ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'bookings', icon: '📋', label: 'Bookings' },
  { id: 'explore', icon: '🔍', label: 'Explore' },
  { id: 'account', icon: '👤', label: 'Account' },
];

export default function BottomNav({ active = 'home' }) {
  return (
    <div className="flex border-t border-gray-100 bg-white flex-shrink-0">
      {ITEMS.map((it) => (
        <button
          key={it.id}
          className="flex-1 flex flex-col items-center py-2.5 gap-0.5"
          style={it.id === active ? { color: G } : { color: '#9CA3AF' }}
        >
          <span className="text-lg leading-none">{it.icon}</span>
          <span className="text-[10px] font-medium">{it.label}</span>
        </button>
      ))}
    </div>
  );
}
