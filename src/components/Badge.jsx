const VARIANTS = {
  gray:   'bg-gray-100 text-gray-600',
  green:  'bg-emerald-50 text-emerald-700',
  yellow: 'bg-amber-50 text-amber-700',
  red:    'bg-red-50 text-red-600',
  blue:   'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
};

export default function Badge({ children, variant = 'gray' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant] || VARIANTS.gray}`}>
      {children}
    </span>
  );
}
