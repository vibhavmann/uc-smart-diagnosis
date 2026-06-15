import { useState } from 'react';

const G = '#0B6E4F';

export default function ApiKeyScreen({ onSet }) {
  const [k, setK] = useState('');
  const valid = k.startsWith('sk-ant-') && k.length > 20;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-3xl mb-5 flex items-center justify-center text-3xl" style={{ background: G }}>
          🤖
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Smart Diagnosis</h1>
        <p className="text-sm text-gray-500 text-center mb-1">Urban Company · AI Demo</p>
        <p className="text-xs text-gray-400 text-center mb-7">
          This demo calls the real Claude API.<br />Enter your Anthropic API key to begin.
        </p>
        <div className="w-full mb-3">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Anthropic API Key</label>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
            style={{ fontFamily: 'monospace' }}
            placeholder="sk-ant-api03-..."
            value={k}
            onChange={(e) => setK(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && valid && onSet(k)}
          />
          {k && !valid && <p className="text-xs text-red-500 mt-1.5 ml-1">Must start with sk-ant-</p>}
        </div>
        <button
          className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm"
          style={{ background: valid ? G : '#D1D5DB' }}
          onClick={() => valid && onSet(k)}
        >
          Start Demo →
        </button>
        <p className="text-xs text-gray-400 mt-4 text-center">Key stays in your browser only.</p>
      </div>
    </div>
  );
}
