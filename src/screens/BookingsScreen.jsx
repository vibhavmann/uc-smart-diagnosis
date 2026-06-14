import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';

const G = '#0B6E4F';
const BG = '#F6F6F6';

function fmt(n) { return (n || 0).toLocaleString('en-IN'); }

function serviceIcon(name = '') {
  const s = name.toLowerCase();
  if (s.includes('ac') || s.includes('gas')) return '❄️';
  if (s.includes('tap') || s.includes('pipe') || s.includes('drain') || s.includes('leak')) return '🔧';
  if (s.includes('clean') || s.includes('sofa') || s.includes('carpet')) return '🧹';
  if (s.includes('facial') || s.includes('salon') || s.includes('event') || s.includes('glow') || s.includes('hair')) return '💅';
  if (s.includes('electric') || s.includes('fault') || s.includes('fixture')) return '⚡';
  if (s.includes('pest') || s.includes('termite')) return '🪲';
  return '🔨';
}

export default function BookingsScreen({ bookings, onNavigate }) {
  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      {/* header */}
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Current session only</p>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center pb-16">
            <span className="text-5xl mb-4">📋</span>
            <p className="text-sm font-semibold text-gray-700 mb-1">No bookings yet</p>
            <p className="text-xs text-gray-400 mb-5">Use Smart Diagnosis to book your first service</p>
            <button
              className="px-5 py-2.5 rounded-2xl text-white text-sm font-semibold"
              style={{ background: G }}
              onClick={() => onNavigate('explore')}
            >
              Diagnose a problem →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {[...bookings].reverse().map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-4 border border-gray-100 slide-up">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: '#E8F5F0' }}
                  >
                    {serviceIcon(b.service)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{b.service}</p>
                      <Badge variant="green">Confirmed</Badge>
                    </div>
                    {b.variant && <p className="text-xs text-gray-500 mt-0.5">{b.variant}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-gray-400 mb-0.5">Slot</p>
                    <p className="font-semibold text-gray-800">
                      {b.slot ? `${b.slot.day}, ${b.slot.time}` : '—'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-gray-400 mb-0.5">Estimate</p>
                    <p className="font-semibold" style={{ color: G }}>
                      ₹{fmt(b.priceLow)}–{fmt(b.priceHigh)}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400">Booking ID: <span className="font-semibold text-gray-600">{b.id}</span></p>
                  <Badge variant="blue">Upcoming</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="bookings" onNavigate={onNavigate} />
    </div>
  );
}
