import { useState, useEffect } from 'react';

const P = '#111111';
const STEPS_INITIAL = ['Reading your description…', 'Matching service catalog…'];
const STEPS_CLARIFY = ['Reading your description…', 'Matching service catalog…', 'Estimating realistic price…'];

export default function LoadingScreen({ isClarification = false }) {
  const STEPS = isClarification ? STEPS_CLARIFY : STEPS_INITIAL;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1300);
    const t2 = isClarification ? setTimeout(() => setStep(2), 2700) : null;
    return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [isClarification]);

  return (
    <div className="flex flex-col h-full bg-white items-center justify-center px-8">
      <div
        className="w-16 h-16 rounded-3xl mb-8 flex items-center justify-center text-3xl pulse"
        style={{ background: 'var(--c-icon-bg)' }}
      >
        🤖
      </div>
      <div className="w-full max-w-xs space-y-4">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 transition-all duration-500 ${i <= step ? 'opacity-100' : 'opacity-25'}`}>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold${i === step ? ' spinner' : ''}`}
              style={
                i < step
                  ? { background: '#16A34A', color: '#fff' }
                  : i === step
                  ? { border: `2px solid ${P}`, borderTopColor: 'transparent' }
                  : { border: '2px solid var(--c-border)' }
              }
            >
              {i < step ? '✓' : ''}
            </div>
            <p className={`text-sm ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
