import { useEffect, useState } from 'react';

export default function StepIntro({ name, setName, lineage, setLineage, onNext }) {
  const [lineages, setLineages] = useState([]);

  useEffect(() => {
    fetch('/data/lineages.json')
      .then(res => res.json())
      .then(data => setLineages(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Character</h2>

      <label className="block mb-4">
        <span className="text-sm font-medium">Character Name</span>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter your character's name"
        />
      </label>

      <span className="block text-sm font-medium mb-2">Select Lineage</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lineages.map(l => (
          <button
            key={l.name}
            onClick={() => setLineage(l)}
            className={`text-left border rounded-md px-4 py-3 transition ${
              lineage?.name === l.name
                ? 'bg-indigo-100 border-indigo-400'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{l.name}</strong>
            <p className="text-xs text-gray-600 mt-1">{l.description}</p>
          </button>
        ))}
      </div>

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!name || !lineage}
        onClick={onNext}
      >
        Start Character Creation
      </button>
    </div>
  );
}
