import { useState, useEffect } from 'react';

const G = '#0B6E4F';
const STEPS = ['Reading your description…', 'Matching service catalog…', 'Estimating realistic price…'];

export default function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1300);
    const t2 = setTimeout(() => setStep(2), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 items-center justify-center px-8">
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
                  ? { border: `2px solid ${G}`, borderTopColor: 'transparent' }
                  : { border: '2px solid var(--c-border)' }
              }
            >
              {i < step ? '✓' : ''}
            </div>
            <p className={`text-sm ${i <= step ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
