import { useEffect, useState } from 'react';

export default function StepFlaws({ selectedFlaws, setSelectedFlaws, heroPoints, setHeroPoints, onFinish }) {
  const [flaws, setFlaws] = useState([]);

  useEffect(() => {
    fetch('/data/flaws.json')
      .then(res => res.json())
      .then(data => setFlaws(data));
  }, []);

  const toggleFlaw = (flaw) => {
    const exists = selectedFlaws.find(f => f.name === flaw.name);
    let updated;
    if (exists) {
      updated = selectedFlaws.filter(f => f.name !== flaw.name);
      setHeroPoints(heroPoints - 5);
    } else if (selectedFlaws.length < 2) {
      updated = [...selectedFlaws, flaw];
      setHeroPoints(heroPoints + 5);
    } else {
      return;
    }
    setSelectedFlaws(updated);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose up to 2 Flaws</h2>
      <p className="mb-2">Each flaw gives +5 hero points. Selected: {selectedFlaws.length}</p>
      <div className="grid gap-4">
        {flaws.map((flaw) => (
          <button
            key={flaw.name}
            onClick={() => toggleFlaw(flaw)}
            className={`text-left border px-4 py-2 rounded-md transition ${
              selectedFlaws.find(f => f.name === flaw.name)
                ? 'bg-red-200 border-red-400'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{flaw.name}</strong>: {flaw.description}
          </button>
        ))}
      </div>

      <button
        onClick={onFinish}
        disabled={selectedFlaws.length === 0}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        Next: Core Ability
      </button>
    </div>
  );
}
