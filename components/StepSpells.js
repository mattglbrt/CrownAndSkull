import { useEffect, useState } from 'react';

export default function StepSpells({ spells, setSpells, heroPoints, setHeroPoints, onNext }) {
  const [availableSpells, setAvailableSpells] = useState([]);

  useEffect(() => {
    fetch('/data/spells.json')
      .then(res => res.json())
      .then(data => setAvailableSpells(data));
  }, []);

  const toggleSpell = (spell) => {
    const exists = spells.find(s => s.name === spell.name);
    if (exists) {
      setSpells(spells.filter(s => s.name !== spell.name));
      setHeroPoints(heroPoints + spell.cost);
    } else {
      if (heroPoints >= spell.cost) {
        setSpells([...spells, spell]);
        setHeroPoints(heroPoints - spell.cost);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose Spells</h2>
      <p className="mb-2 text-gray-600">
        Each spell costs hero points. You can learn as many as your points allow.
      </p>
      <p className="mb-4 text-sm text-gray-500">
        Hero Points Remaining: {heroPoints}
      </p>

      <div className="grid gap-4">
        {availableSpells.map(spell => (
          <button
            key={spell.name}
            onClick={() => toggleSpell(spell)}
            className={`text-left border px-4 py-3 rounded-md transition ${
              spells.find(s => s.name === spell.name)
                ? 'bg-purple-200 border-purple-400'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{spell.name}</strong> — {spell.effect} (Cost: {spell.cost})
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Next: Custom Spells
      </button>
    </div>
  );
}
