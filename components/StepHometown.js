import { useEffect, useState } from 'react';

export default function StepHometown({ hometown, setHometown, onFinish }) {
  const [hometowns, setHometowns] = useState([]);

  useEffect(() => {
    fetch('/data/hometowns.json')
      .then(res => res.json())
      .then(data => setHometowns(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose Your Hometown</h2>
      <div className="grid gap-3">
        {hometowns.map(option => (
          <button
            key={option.name}
            onClick={() => setHometown(option.name)}
            className={`text-left border px-4 py-2 rounded-md transition ${
              hometown === option.name ? 'bg-blue-200 border-blue-400' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{option.name}</strong>
            <p className="text-sm text-gray-600">{option.description}</p>
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
