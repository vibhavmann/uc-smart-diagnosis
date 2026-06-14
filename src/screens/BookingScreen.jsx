import { useState } from 'react';

const G = '#0B6E4F';
const SLOTS = [
  { day: 'Today', time: '2:00 – 4:00 PM', ok: true },
  { day: 'Today', time: '5:00 – 7:00 PM', ok: false },
  { day: 'Tomorrow', time: '9:00 – 11:00 AM', ok: true },
  { day: 'Tomorrow', time: '11:00 AM – 1:00 PM', ok: true },
  { day: 'Sat 15 Jun', time: '10:00 AM – 12:00 PM', ok: true },
];

function fmt(n) { return (n || 0).toLocaleString('en-IN'); }

export default function BookingScreen({ result, onBack, onConfirm }) {
  const [slot, setSlot] = useState(null);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-10 pb-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 text-sm mb-3 block">← Back</button>
        <h1 className="text-lg font-bold text-gray-900">Confirm Booking</h1>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4 space-y-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service</p>
          <p className="text-sm font-bold text-gray-900">
            {result.service}{result.variant ? ` · ${result.variant}` : ''}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-bold text-base" style={{ color: G }}>₹{fmt(result.priceLow)}</span>
            <span className="text-xs text-gray-400">– ₹{fmt(result.priceHigh)} est.</span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Saved Address</p>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Home</p>
              <p className="text-xs text-gray-500 mt-0.5">42, 3rd Floor, 7th Cross, Koramangala 4th Block, Bangalore – 560034</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Choose a Slot</p>
          <div className="space-y-2">
            {SLOTS.map((s, i) => (
              <button
                key={i}
                disabled={!s.ok}
                onClick={() => s.ok && setSlot(i)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-sm transition-all"
                style={
                  !s.ok
                    ? { opacity: 0.4, cursor: 'not-allowed', background: '#F9FAFB', borderColor: '#F3F4F6' }
                    : slot === i
                    ? { background: G, borderColor: 'transparent' }
                    : { background: '#fff', borderColor: '#F3F4F6' }
                }
              >
                <span className="font-semibold" style={{ color: slot === i && s.ok ? '#fff' : '#1C1C1C' }}>{s.day}</span>
                <span style={{ color: slot === i && s.ok ? 'rgba(255,255,255,0.85)' : '#6B7280' }}>
                  {s.time}{!s.ok ? ' · Full' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 pt-3 bg-white border-t border-gray-100 flex-shrink-0">
        <button
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm"
          style={{ background: slot !== null ? G : '#D1D5DB' }}
          onClick={() => slot !== null && onConfirm(SLOTS[slot])}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
