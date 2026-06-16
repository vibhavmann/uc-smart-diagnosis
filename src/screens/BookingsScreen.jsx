import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import { supabase } from '../lib/supabase';

const P = '#111111';

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

function BookingCard({ b, onEdit, onCancel }) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 slide-up">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'var(--c-icon-bg)' }}
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
        <div className="rounded-xl p-2.5" style={{ background: 'var(--c-bg)' }}>
          <p className="text-gray-400 mb-0.5">Slot</p>
          <p className="font-semibold text-gray-800">
            {b.slot ? `${b.slot.day}, ${b.slot.time}` : b.slot_day ? `${b.slot_day}, ${b.slot_time}` : '—'}
          </p>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: 'var(--c-bg)' }}>
          <p className="text-gray-400 mb-0.5">Estimate</p>
          <p className="font-semibold" style={{ color: P }}>
            ₹{fmt(b.priceLow ?? b.price_low)}–{fmt(b.priceHigh ?? b.price_high)}
          </p>
        </div>
      </div>

      <div className="mt-2.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-400">
            Booking ID: <span className="font-semibold text-gray-600">{b.id}</span>
          </p>
          <Badge variant="blue">Upcoming</Badge>
        </div>

        {confirmCancel ? (
          <div className="flex items-center gap-2 pt-1">
            <p className="text-xs text-gray-500 flex-1">Cancel this booking?</p>
            <button
              className="text-[11px] font-semibold text-white bg-red-500 rounded-xl px-3 py-1 active:opacity-70 transition-opacity"
              onClick={() => onCancel(b)}
            >
              Yes, cancel
            </button>
            <button
              className="text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-xl px-3 py-1 active:opacity-70 transition-opacity"
              onClick={() => setConfirmCancel(false)}
            >
              Keep
            </button>
          </div>
        ) : (
          <div className="flex gap-2 pt-1">
            <button
              className="flex-1 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-xl px-2.5 py-1.5 active:opacity-60 transition-opacity"
              onClick={() => onEdit(b)}
            >
              Reschedule
            </button>
            <button
              className="flex-1 text-[11px] font-semibold text-red-500 border border-red-200 rounded-xl px-2.5 py-1.5 active:opacity-60 transition-opacity"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingsScreen({ bookings: localBookings, onNavigate, onEdit, onCancel, user }) {
  const [dbBookings, setDbBookings] = useState(null);
  const [loadingDb, setLoadingDb] = useState(false);

  useEffect(() => {
    if (!supabase || !user) return;
    setLoadingDb(true);
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setDbBookings(data);
        setLoadingDb(false);
      });
  }, [user]);

  const displayBookings = dbBookings !== null ? dbBookings : [...localBookings].reverse();
  const isEmpty = displayBookings.length === 0 && !loadingDb;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>
      <div className="bg-white px-4 pt-safe pb-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {user && supabase ? 'Synced to your account' : 'Current session only'}
        </p>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4">
        {loadingDb ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 rounded-full spinner" style={{ border: `2px solid ${P}`, borderTopColor: 'transparent' }} />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center pb-16">
            <span className="text-5xl mb-4">📋</span>
            <p className="text-sm font-semibold text-gray-700 mb-1">No bookings yet</p>
            <p className="text-xs text-gray-400 mb-5">
              Use Smart Diagnosis to book your first service
            </p>
            <button
              className="px-5 py-2.5 rounded-2xl text-white text-sm font-semibold"
              style={{ background: P }}
              onClick={() => onNavigate('explore')}
            >
              Diagnose a problem →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayBookings.map((b) => <BookingCard key={b.id} b={b} onEdit={onEdit} onCancel={onCancel} />)}
          </div>
        )}
      </div>

      <BottomNav active="bookings" onNavigate={onNavigate} />
    </div>
  );
}
