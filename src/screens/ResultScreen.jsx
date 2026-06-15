import { useState } from 'react';
import Badge from '../components/Badge';

const P = '#7C3AED';

function serviceIcon(name = '') {
  const s = name.toLowerCase();
  if (s.includes('ac') || s.includes('gas')) return '❄️';
  if (s.includes('plumb') || s.includes('tap') || s.includes('pipe') || s.includes('drain') || s.includes('leak')) return '🔧';
  if (s.includes('clean') || s.includes('sofa') || s.includes('carpet') || s.includes('bathroom') || s.includes('kitchen')) return '🧹';
  if (s.includes('beauty') || s.includes('facial') || s.includes('salon') || s.includes('event') || s.includes('glow') || s.includes('skin') || s.includes('hair')) return '💅';
  if (s.includes('electric') || s.includes('fault') || s.includes('install') || s.includes('fixture')) return '⚡';
  if (s.includes('pest') || s.includes('termite')) return '🪲';
  return '🔨';
}

function fmt(n) { return (n || 0).toLocaleString('en-IN'); }

const SEV_COLOR = { low: 'green', medium: 'yellow', high: 'red' };
const CONF_COLOR = { high: 'green', medium: 'yellow', low: 'gray' };

export default function ResultScreen({ result, onClarify, onBook, onBack }) {
  const [clarifyAns, setClarifyAns] = useState(null);
  const [openBA, setOpenBA] = useState(false);
  const [openImpact, setOpenImpact] = useState(false);
  const [showAddDetail, setShowAddDetail] = useState(false);
  const [detailText, setDetailText] = useState('');

  if (result.needsClarification && !clarifyAns) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#241847]">
        <div className="px-4 pt-10 pb-4 border-b border-purple-100 dark:border-purple-900/40 flex-shrink-0">
          <button onClick={onBack} className="text-purple-400 text-sm mb-3 block">← Back</button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">One quick question</h1>
          <p className="text-sm text-gray-500 dark:text-purple-300/70 mt-0.5">Helps us send the right pro</p>
        </div>
        <div className="flex-1 scroll-hide px-4 pt-6">
          <div className="rounded-2xl p-5 mb-5 slide-up border border-purple-200 dark:border-purple-700/50" style={{ background: 'var(--c-icon-bg)' }}>
            <span className="text-2xl block mb-3">🤔</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{result.clarifyingQuestion}</p>
            <p className="text-xs text-purple-500 dark:text-purple-400">Your answer ensures the right price too</p>
          </div>
          <div className="flex flex-col gap-3">
            {(result.clarifyingOptions || []).map((opt, i) => (
              <button
                key={opt}
                className="w-full text-left py-3.5 px-4 rounded-2xl border text-sm font-medium text-gray-800 dark:text-purple-100 bg-white dark:bg-[#241847] slide-up"
                style={{ borderColor: 'var(--c-border)', animationDelay: `${i * 60}ms` }}
                onClick={() => { setClarifyAns(opt); onClarify(opt); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>
      <div className="bg-white dark:bg-[#241847] px-4 pt-10 pb-4 border-b border-purple-100 dark:border-purple-900/40 flex-shrink-0">
        <button onClick={onBack} className="text-purple-400 text-sm mb-3 block">← Back</button>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Diagnosis</h1>
          <Badge variant={CONF_COLOR[result.confidence] || 'gray'}>
            {result.confidence === 'high' ? 'High' : result.confidence === 'medium' ? 'Medium' : 'Low'} confidence
          </Badge>
        </div>
      </div>

      <div className="flex-1 scroll-hide px-4 pt-3 pb-3 space-y-3">
        {/* service card */}
        <div className="bg-white dark:bg-[#241847] rounded-2xl p-4 border border-purple-100 dark:border-purple-800/40 slide-up">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'var(--c-icon-bg)' }}
            >
              {serviceIcon(result.service)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{result.service}</h2>
              {result.variant && <p className="text-xs text-gray-500 dark:text-purple-300/70 mt-0.5">{result.variant}</p>}
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-purple-100/80 leading-relaxed mb-3">{result.why}</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={SEV_COLOR[result.severity] || 'gray'}>
              {result.severity === 'high' ? '🔴' : result.severity === 'medium' ? '🟡' : '🟢'} {result.severity} severity
            </Badge>
            {(result.addons || []).slice(0, 3).map((a) => <Badge key={a} variant="gray">{a}</Badge>)}
          </div>
        </div>

        {/* price band */}
        <div className="bg-white dark:bg-[#241847] rounded-2xl p-4 border border-purple-100 dark:border-purple-800/40 slide-up" style={{ animationDelay: '60ms' }}>
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Realistic Price Estimate</p>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(result.priceLow)}</span>
            <span className="text-gray-400 dark:text-purple-400">–</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(result.priceHigh)}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-purple-300/70 mb-3 leading-relaxed">{result.priceBreakdown}</p>
          <div className="rounded-xl px-3 py-2.5 flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
            <span className="text-sm flex-shrink-0">⚠️</span>
            <p className="text-xs text-amber-700 dark:text-amber-400">Final price confirmed on-site. This band includes likely parts & add-ons.</p>
          </div>
        </div>

        {/* Add more detail */}
        <div className="bg-white dark:bg-[#241847] rounded-2xl border border-purple-100 dark:border-purple-800/40 overflow-hidden slide-up" style={{ animationDelay: '100ms' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3.5"
            onClick={() => setShowAddDetail(!showAddDetail)}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">💬</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Not quite right? Add more detail</span>
            </div>
            <span className="text-purple-400 text-sm">{showAddDetail ? '▲' : '▼'}</span>
          </button>
          {showAddDetail && (
            <div className="px-4 pb-4 fade-in space-y-3">
              <p className="text-xs text-gray-500 dark:text-purple-300/70">Add context and we'll refine the diagnosis — e.g. "it makes a clicking noise" or "happens only at night"</p>
              <textarea
                className="w-full border rounded-xl p-3 text-sm resize-none outline-none min-h-[80px] text-gray-900 dark:text-white placeholder-purple-300 dark:placeholder-purple-600 bg-white dark:bg-[#1A1033]"
                style={{ fontFamily: 'inherit', borderColor: 'var(--c-border)' }}
                placeholder="Tell us more about the problem…"
                value={detailText}
                onChange={(e) => setDetailText(e.target.value)}
              />
              <button
                className="w-full py-3 rounded-xl text-white text-sm font-semibold active:opacity-80 transition-opacity"
                style={{ background: detailText.trim() ? P : '#D1D5DB' }}
                disabled={!detailText.trim()}
                onClick={() => { if (detailText.trim()) { setShowAddDetail(false); onClarify(detailText.trim()); } }}
              >
                Re-diagnose with more detail ✨
              </button>
            </div>
          )}
        </div>

        {/* before / after */}
        <div className="bg-white dark:bg-[#241847] rounded-2xl border border-purple-100 dark:border-purple-800/40 overflow-hidden slide-up" style={{ animationDelay: '140ms' }}>
          <button className="w-full flex items-center justify-between px-4 py-3.5" onClick={() => setOpenBA(!openBA)}>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Before vs. After AI Routing</span>
            <span className="text-purple-400 text-sm">{openBA ? '▲' : '▼'}</span>
          </button>
          {openBA && (
            <div className="px-3 pb-4 fade-in">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mb-2">❌ Old Path</p>
                  {['User guesses service', 'Picks wrong category', 'Pro arrives', 'Wrong job scoped', 'Price shock on-site', 'Dispute / refund', '1-star review'].map((t) => (
                    <p key={t} className="text-[11px] text-red-700 dark:text-red-400 leading-snug mt-1">{t}</p>
                  ))}
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/40 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 mb-2">✅ New Path</p>
                  {['User describes problem', 'AI routes correctly', 'Right pro dispatched', 'Honest price upfront', 'No surprises', 'First-visit success', '5-star review'].map((t) => (
                    <p key={t} className="text-[11px] text-purple-700 dark:text-purple-400 leading-snug mt-1">{t}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* impact */}
        <div className="bg-white dark:bg-[#241847] rounded-2xl border border-purple-100 dark:border-purple-800/40 overflow-hidden slide-up" style={{ animationDelay: '180ms' }}>
          <button className="w-full flex items-center justify-between px-4 py-3.5" onClick={() => setOpenImpact(!openImpact)}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Impact Metrics</span>
              <Badge variant="purple">Illustrative</Badge>
            </div>
            <span className="text-purple-400 text-sm">{openImpact ? '▲' : '▼'}</span>
          </button>
          {openImpact && (
            <div className="px-3 pb-4 fade-in grid grid-cols-2 gap-2.5">
              {[
                { val: '↓ 34%', label: 'Mis-booking rate', bg: 'bg-emerald-50 dark:bg-emerald-950/40', color: 'text-emerald-700 dark:text-emerald-400' },
                { val: '↑ 28%', label: 'First-visit success', bg: 'bg-emerald-50 dark:bg-emerald-950/40', color: 'text-emerald-700 dark:text-emerald-400' },
                { val: '↓ 41%', label: 'Dispute rate', bg: 'bg-blue-50 dark:bg-blue-950/40', color: 'text-blue-700 dark:text-blue-400' },
                { val: '₹280', label: 'Saved / booking', bg: 'bg-purple-50 dark:bg-purple-950/40', color: 'text-purple-700 dark:text-purple-400' },
              ].map((m) => (
                <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-bold ${m.color}`}>{m.val}</p>
                  <p className={`text-[10px] mt-0.5 ${m.color} opacity-80`}>{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="h-1" />
      </div>

      <div className="px-4 pb-8 pt-3 bg-white dark:bg-[#241847] border-t border-purple-100 dark:border-purple-900/40 flex-shrink-0">
        <button className="w-full py-4 rounded-2xl text-white font-semibold text-sm" style={{ background: P }} onClick={onBook}>
          Book {result.service} →
        </button>
      </div>
    </div>
  );
}
