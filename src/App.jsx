import { useState } from 'react';
import { callDiagnosis } from './api';
// ApiKeyScreen removed — key is set via VITE_ANTHROPIC_KEY env var
import HomeScreen from './screens/HomeScreen';
import IntakeScreen from './screens/IntakeScreen';
import LoadingScreen from './screens/LoadingScreen';
import ResultScreen from './screens/ResultScreen';
import BookingScreen from './screens/BookingScreen';
import SuccessScreen from './screens/SuccessScreen';

function StatusBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-7 pt-3 pointer-events-none">
      <span className="text-xs font-semibold text-gray-800">9:41</span>
      <div className="flex items-center gap-1.5 text-gray-700">
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
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [apiKey] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [bookedSlot, setBookedSlot] = useState(null);

  const diagnose = async (text, image, clarification) => {
    setDesc(text);
    setImg(image);
    setError(null);
    setScreen('loading');
    try {
      const r = await callDiagnosis(
        text,
        image ? image.base64 : null,
        image ? image.type : null,
        apiKey,
        clarification || null
      );
      setResult(r);
      setScreen('result');
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      setScreen('intake');
    }
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden phone"
      style={{ width: 390, height: 844, borderRadius: 44, background: '#fff', flexShrink: 0 }}
    >
      <StatusBar />
      <div className="absolute inset-0 flex flex-col pt-10">
        {screen === 'home' && (
          <HomeScreen onIntake={() => setScreen('intake')} />
        )}
        {screen === 'intake' && (
          <IntakeScreen onBack={() => setScreen('home')} onDiagnose={diagnose} error={error} />
        )}
        {screen === 'loading' && <LoadingScreen />}
        {screen === 'result' && result && (
          <ResultScreen
            result={result}
            onClarify={(ans) => diagnose(desc, img, ans)}
            onBook={() => setScreen('booking')}
            onBack={() => { setResult(null); setScreen('intake'); }}
          />
        )}
        {screen === 'booking' && result && (
          <BookingScreen
            result={result}
            onBack={() => setScreen('result')}
            onConfirm={(s) => { setBookedSlot(s); setScreen('success'); }}
          />
        )}
        {screen === 'success' && result && (
          <SuccessScreen
            result={result}
            slot={bookedSlot}
            onHome={() => { setResult(null); setBookedSlot(null); setError(null); setScreen('home'); }}
          />
        )}
      </div>
    </div>
  );
}
