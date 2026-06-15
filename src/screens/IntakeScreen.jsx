import { useState, useRef, useEffect } from 'react';
import { CHIPS } from '../catalog';

const P = '#111111';
const DEMO_CHIP = 'AC running but not cooling';

export default function IntakeScreen({ onBack, onDiagnose, error, demoText }) {
  const [text, setText] = useState(demoText || '');
  const [img, setImg] = useState(null);
  const [activeChip, setActiveChip] = useState(demoText ? DEMO_CHIP : null);
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const fileRef = useRef();
  const autoTimer = useRef(null);
  const countdownInterval = useRef(null);
  const isDemo = Boolean(demoText);

  useEffect(() => {
    if (!isDemo) return;
    countdownInterval.current = setInterval(() => {
      setCountdown((n) => Math.max(0, n - 1));
    }, 1000);
    autoTimer.current = setTimeout(() => {
      clearInterval(countdownInterval.current);
      setBusy(true);
      onDiagnose(text, null);
    }, 10000);
    return () => {
      clearTimeout(autoTimer.current);
      clearInterval(countdownInterval.current);
    };
  }, []); // eslint-disable-line

  const pickChip = (c) => { setText(c.text); setActiveChip(c.label); };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result.split(',')[1];
      setImg({ base64: b64, type: f.type, preview: ev.target.result });
    };
    reader.readAsDataURL(f);
  };

  const go = async () => {
    if (!text.trim() || busy) return;
    clearTimeout(autoTimer.current);
    clearInterval(countdownInterval.current);
    setBusy(true);
    await onDiagnose(text.trim(), img);
    setBusy(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-10 pb-4 border-b border-gray-200 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 text-sm mb-3">← Back</button>
        <h1 className="text-lg font-bold text-gray-900">
          {isDemo ? '✨ Live Demo' : 'Smart Diagnosis'}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isDemo ? 'Watch the AI route a real problem to the right service' : 'Describe your problem — AI will find the right service'}
        </p>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4 space-y-4">
        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2 slide-up">
            <span className="text-base">🎬</span>
            <p className="text-xs text-amber-800 font-medium">Demo scenario loaded — read through, then hit the button or wait {countdown}s</p>
          </div>
        )}

        <textarea
          className="w-full border rounded-2xl p-4 text-sm resize-none outline-none min-h-[110px] text-gray-900 placeholder-purple-300 bg-white"
          style={{ fontFamily: 'inherit', borderColor: isDemo ? '#FCD34D' : 'var(--c-border)' }}
          placeholder={'Describe your problem in your own words…\ne.g. "My AC runs but the room won\'t cool"'}
          value={text}
          onChange={(e) => { setText(e.target.value); setActiveChip(null); }}
          readOnly={isDemo}
        />

        {!isDemo && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => pickChip(c)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={
                    activeChip === c.label
                      ? { background: P, color: '#fff', borderColor: 'transparent' }
                      : { background: 'var(--c-surface)', color: '#4B5563', borderColor: 'var(--c-border)' }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isDemo && (
          <div
            className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer"
            style={{ borderColor: 'var(--c-border)' }}
            onClick={() => fileRef.current && fileRef.current.click()}
          >
            {img ? (
              <div className="relative w-full">
                <img src={img.preview} alt="upload" className="w-full h-28 object-cover rounded-xl" />
                <button
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full text-white text-xs flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); setImg(null); }}
                >✕</button>
              </div>
            ) : (
              <>
                <span className="text-2xl">📷</span>
                <p className="text-xs text-gray-500 text-center">Tap to add a photo (optional)<br />Helps the AI diagnose faster</p>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-3 slide-up">
            <p className="text-xs text-red-600">⚠️ {error}</p>
          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-3 border-t border-gray-200 flex-shrink-0 bg-white">
        <button
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm"
          style={{ background: text.trim() && !busy ? P : '#D1D5DB' }}
          onClick={go}
          disabled={!text.trim() || busy}
        >
          {busy ? 'Diagnosing…' : isDemo ? `Diagnose my problem ✨  (${countdown}s)` : 'Diagnose my problem ✨'}
        </button>
      </div>
    </div>
  );
}
