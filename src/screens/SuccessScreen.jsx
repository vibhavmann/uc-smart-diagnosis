import { useState } from 'react';

const P = '#111111';
function fmt(n) { return (n || 0).toLocaleString('en-IN'); }

export default function SuccessScreen({ result, slot, onHome }) {
  const [bid] = useState(() => 'UC' + Math.floor(Math.random() * 90000 + 10000));

  return (
    <div className="flex flex-col h-full bg-white items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-4xl mb-5 slide-up">
        ✅
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2 slide-up">Booking Confirmed!</h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed slide-up">
        Your <strong className="text-gray-900">{result.service}</strong> is booked.
        {slot && <><br />A pro will arrive {slot.day}, {slot.time}.</>}
      </p>
      <div
        className="rounded-2xl p-4 w-full mb-6 text-left space-y-3 slide-up"
        style={{ background: 'var(--c-bg)' }}
      >
        {[
          { l: 'Service', v: result.service },
          { l: 'Price estimate', v: `₹${fmt(result.priceLow)} – ₹${fmt(result.priceHigh)}`, green: true },
          { l: 'Booking ID', v: bid },
          slot ? { l: 'Slot', v: `${slot.day}, ${slot.time}` } : null,
        ].filter(Boolean).map((row) => (
          <div key={row.l} className="flex justify-between text-sm gap-2">
            <span className="text-gray-500 flex-shrink-0">{row.l}</span>
            <span
              className="font-semibold text-right"
              style={{ color: row.green ? P : undefined }}
            >
              <span className={!row.green ? 'text-gray-900' : ''}>{row.v}</span>
            </span>
          </div>
        ))}
      </div>
      <button
        className="w-full py-4 rounded-2xl text-white font-semibold text-sm slide-up"
        style={{ background: P }}
        onClick={onHome}
      >
        Back to Home
      </button>
    </div>
  );
}
