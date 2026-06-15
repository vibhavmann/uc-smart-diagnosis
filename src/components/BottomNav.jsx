const P = '#111111';

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function IconBookings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" />
    </svg>
  );
}

function IconExplore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function IconAccount() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

const ITEMS = [
  { id: 'home',     Icon: IconHome,     label: 'Home' },
  { id: 'bookings', Icon: IconBookings, label: 'Bookings' },
  { id: 'explore',  Icon: IconExplore,  label: 'Explore' },
  { id: 'account',  Icon: IconAccount,  label: 'Account' },
];

export default function BottomNav({ active = 'home', onNavigate }) {
  return (
    <div className="flex border-t border-gray-200 bg-white flex-shrink-0">
      {ITEMS.map(({ id, Icon, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-opacity active:opacity-60"
            style={{ color: isActive ? P : '#9CA3AF' }}
            onClick={() => onNavigate && onNavigate(id)}
          >
            <Icon />
            <span className="text-[10px] font-medium">{label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: P }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
