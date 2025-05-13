export default function StepHometown({ hometown, setHometown, onFinish }) {
  const options = ["Gardenburrow", "Rivergate", "Slimshire", "Eastridge", "Stonehaven"];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose Your Hometown</h2>
      <div className="space-y-3">
        {options.map(option => (
          <button
            key={option}
            onClick={() => setHometown(option)}
            className={`block w-full text-left border px-4 py-2 rounded-md transition ${
              hometown === option ? 'bg-blue-200 border-blue-400' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{option}</strong>
          </button>
        ))}
      </div>

      <button
        onClick={onFinish}
        disabled={!hometown}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        Next: Flaws
      </button>
    </div>
  );
}
