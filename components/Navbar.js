const steps = [
  { label: 'Saved', icon: '💾' },     // 0
  { label: 'Intro', icon: '👤' },     // 1
  { label: 'Hometown', icon: '🏘️' }, // 2
  { label: 'Flaws', icon: '⚠️' },     // 3
  { label: 'Core', icon: '✨' },      // 4
  { label: 'Skills', icon: '📚' },    // 5
  { label: 'Gear', icon: '🛡️' },     // 6
  { label: 'Item', icon: '⚒️' },     // 7
  { label: 'Spells', icon: '🔮' },    // 8
  { label: 'Custom', icon: '🧪' },    // 9
  { label: 'Allies', icon: '🐾' },    // 10
  { label: 'Summary', icon: '📄' }    // 11
];

export default function Navbar({ step, goToStep }) {
  return (
    <div className="sticky top-0 z-10 bg-white shadow border-b border-gray-200">
      <nav className="flex flex-nowrap overflow-x-auto px-2 sm:px-4 py-2 text-xs sm:text-sm space-x-1">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition flex-shrink-0 ${
              step === i ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
