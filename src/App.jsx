import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useDarkMode } from './hooks/useDarkMode';
import { supabase } from './lib/supabase';
import { callDiagnosis } from './api';
import HomeScreen from './screens/HomeScreen';
import IntakeScreen from './screens/IntakeScreen';
import LoadingScreen from './screens/LoadingScreen';
import ResultScreen from './screens/ResultScreen';
import BookingScreen from './screens/BookingScreen';
import BookingsScreen from './screens/BookingsScreen';
import SuccessScreen from './screens/SuccessScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';

const DEMO_TEXT = 'My AC runs all day but the room will not get cold at all, it is blowing warm air';

function StatusBar({ dark, onToggleDark }) {
  return (
    <div className="hidden sm:flex absolute top-0 left-0 right-0 z-50 items-center justify-between px-7 pt-3 pointer-events-none">
      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">9:41</span>
      <div className="flex items-center gap-2">
        <button
          className="pointer-events-auto w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: 'var(--c-bg)' }}
          onClick={onToggleDark}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <rect x="0" y="3" width="3" height="7" rx="1" fill="currentColor" opacity="0.4"/>
            <rect x="4" y="2" width="3" height="8" rx="1" fill="currentColor" opacity="0.6"/>
            <rect x="8" y="0" width="3" height="10" rx="1" fill="currentColor"/>
          </svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M7 2C9.2 2 11.2 2.9 12.6 4.4L14 3C12.2 1.1 9.7 0 7 0C4.3 0 1.8 1.1 0 3L1.4 4.4C2.8 2.9 4.8 2 7 2Z" fill="currentColor"/>
            <path d="M7 5C8.4 5 9.7 5.6 10.6 6.5L12 5.1C10.7 3.8 9 3 7 3C5 3 3.3 3.8 2 5.1L3.4 6.5C4.3 5.6 5.6 5 7 5Z" fill="currentColor"/>
            <circle cx="7" cy="9" r="1.5" fill="currentColor"/>
          </svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
            <rect x="0.5" y="0.5" width="18" height="9" rx="2.5" stroke="currentColor" strokeOpacity="0.35"/>
            <rect x="1.5" y="1.5" width="14" height="7" rx="1.5" fill="currentColor"/>
            <path d="M20 3.5V6.5C20.8 6.2 21.5 5.5 21.5 5C21.5 4.5 20.8 3.8 20 3.5Z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

async function saveBookingToDB(booking, user) {
  if (!supabase || !user) return;
  try {
    await supabase.from('bookings').insert({
      id: booking.id,
      user_id: user.id,
      service: booking.service,
      variant: booking.variant || null,
      price_low: booking.priceLow,
      price_high: booking.priceHigh,
      price_breakdown: booking.priceBreakdown || null,
      slot_day: booking.slot?.day || null,
      slot_time: booking.slot?.time || null,
      severity: booking.severity || null,
      addons: booking.addons || [],
      status: 'confirmed',
    });
  } catch (err) {
    console.warn('Failed to persist booking:', err.message);
  }
}

function AppInner() {
  const [dark, toggleDark] = useDarkMode();
  const { user } = useAuth();

  const [screen, setScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home');
  const [demoText, setDemoText] = useState(null);
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [bookedSlot, setBookedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);

  const go = (s) => { setPrevScreen(screen); setScreen(s); };

  const diagnose = async (text, image, clarification) => {
    setDesc(text);
    setImg(image);
    setError(null);
    go('loading');
    try {
      const r = await callDiagnosis(
        text,
        image ? image.base64 : null,
        image ? image.type : null,
        null,
        clarification || null
      );
      setResult(r);
      go('result');
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      go('intake');
    }
  };

  const startDemo = () => { setDemoText(DEMO_TEXT); go('intake'); };
  const goToIntake = () => { setDemoText(null); go('intake'); };

  const navigate = (id) => {
    if (id === 'home')     go('home');
    if (id === 'bookings') go('bookings');
    if (id === 'explore')  goToIntake();
    if (id === 'account')  go('account');
  };

  const confirmBooking = async (slot) => {
    const booking = {
      id: 'UC' + Math.floor(Math.random() * 90000 + 10000),
      service: result.service,
      variant: result.variant,
      priceLow: result.priceLow,
      priceHigh: result.priceHigh,
      priceBreakdown: result.priceBreakdown,
      severity: result.severity,
      addons: result.addons,
      slot,
    };
    setBookedSlot(slot);
    setBookings((prev) => [...prev, booking]);
    await saveBookingToDB(booking, user);
    go('success');
  };

  return (
    <div className="w-full min-h-screen bg-white sm:bg-[#94A3B8] dark:bg-slate-900 sm:dark:bg-slate-950 sm:flex sm:items-center sm:justify-center sm:py-8 sm:px-4">
      <div
        className="relative flex flex-col overflow-hidden w-full h-screen sm:w-[390px] sm:h-[844px] sm:rounded-[44px] sm:flex-shrink-0 sm:phone"
        style={{ background: 'var(--c-surface)' }}
      >
        <StatusBar dark={dark} onToggleDark={toggleDark} />

        {/* Mobile dark toggle — floats top-right, below status icons */}
        <button
          className="sm:hidden absolute top-3 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow"
          style={{ background: 'var(--c-bg)' }}
          onClick={toggleDark}
        >
          {dark ? '☀️' : '🌙'}
        </button>

        <div className="absolute inset-0 flex flex-col pt-0 sm:pt-10">
          {screen === 'home' && (
            <HomeScreen
              onIntake={goToIntake}
              onDemo={startDemo}
              onNavigate={navigate}
              dark={dark}
              onToggleDark={toggleDark}
            />
          )}
          {screen === 'intake' && (
            <IntakeScreen
              onBack={() => go('home')}
              onDiagnose={diagnose}
              error={error}
              demoText={demoText}
            />
          )}
          {screen === 'loading' && <LoadingScreen />}
          {screen === 'result' && result && (
            <ResultScreen
              result={result}
              onClarify={(ans) => diagnose(desc, img, ans)}
              onBook={() => go('booking')}
              onBack={() => { setResult(null); setDemoText(null); go('intake'); }}
            />
          )}
          {screen === 'booking' && result && (
            <BookingScreen
              result={result}
              user={user}
              onBack={() => go('result')}
              onConfirm={confirmBooking}
            />
          )}
          {screen === 'bookings' && (
            <BookingsScreen bookings={bookings} onNavigate={navigate} user={user} />
          )}
          {screen === 'success' && result && (
            <SuccessScreen
              result={result}
              slot={bookedSlot}
              onHome={() => {
                setResult(null); setBookedSlot(null);
                setDemoText(null); setError(null);
                go('home');
              }}
            />
          )}
          {screen === 'login' && (
            <LoginScreen onSkip={() => go(prevScreen === 'login' ? 'home' : prevScreen)} />
          )}
          {screen === 'account' && (
            <AccountScreen onNavigate={navigate} onLogin={() => go('login')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
