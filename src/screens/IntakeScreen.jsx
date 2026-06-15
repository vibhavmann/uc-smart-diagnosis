import { useState, useRef, useEffect } from 'react';
import { CHIPS } from '../catalog';

const P = '#7C3AED';
const DEMO_CHIP = 'AC running but not cooling';

export default function IntakeScreen({ onBack, onDiagnose, error, demoText }) {
  const [text, setText] = useState(demoText || '');
  const [img, setImg] = useState(null);
  const [activeChip, setActiveChip] = useState(demoText ? DEMO_CHIP : null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();
  const isDemo = Boolean(demoText);

  useEffect(() => {
    if (!isDemo) return;
    const t = setTimeout(() => {
      setBusy(true);
      onDiagnose(text, null);
    }, 900);
    return () => clearTimeout(t);
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
    setBusy(true);
    await onDiagnose(text.trim(), img);
    setBusy(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#241847]">
      <div className="px-4 pt-10 pb-4 border-b border-purple-100 dark:border-purple-900/40 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-purple-400 dark:text-purple-400 text-sm mb-3">← Back</button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {isDemo ? '✨ Live Demo' : 'Smart Diagnosis'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {isDemo ? 'Watch the AI route a real problem to the right service' : 'Describe your problem — AI will find the right service'}
        </p>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-4 pb-4 space-y-4">
        {isDemo && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl px-4 py-3 flex items-center gap-2 slide-up">
            <span className="text-base">🎬</span>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">Demo scenario loaded — diagnosing automatically…</p>
          </div>
        )}

        <textarea
          className="w-full border rounded-2xl p-4 text-sm resize-none outline-none min-h-[110px] text-gray-900 dark:text-white placeholder-purple-300 dark:placeholder-purple-600 bg-white dark:bg-[#1A1033]"
          style={{ fontFamily: 'inherit', borderColor: isDemo ? '#FCD34D' : 'var(--c-border)' }}
          placeholder={'Describe your problem in your own words…\ne.g. "My AC runs but the room won\'t cool"'}
          value={text}
          onChange={(e) => { setText(e.target.value); setActiveChip(null); }}
          readOnly={isDemo}
        />

        {!isDemo && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Try an example</p>
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
                <p className="text-xs text-purple-400 dark:text-purple-400 text-center">Tap to add a photo (optional)<br />Helps the AI diagnose faster</p>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-800/60 rounded-2xl p-3 slide-up">
            <p className="text-xs text-red-600 dark:text-red-400">⚠️ {error}</p>
          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-3 border-t border-purple-100 dark:border-purple-900/40 flex-shrink-0 bg-white dark:bg-[#241847]">
        <button
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm"
          style={{ background: text.trim() && !busy ? P : '#D1D5DB' }}
          onClick={go}
          disabled={!text.trim() || busy}
        >
          {busy ? 'Diagnosing…' : 'Diagnose my problem ✨'}
        </button>
      </div>
    </div>
  );
}
