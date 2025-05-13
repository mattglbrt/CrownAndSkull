import { useEffect, useState } from 'react';

export default function StepCoreAbility({ coreAbility, setCoreAbility, heroPoints, setHeroPoints, onFinish }) {
  const [abilities, setAbilities] = useState([]);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    fetch('/data/coreAbilities.json')
      .then(res => res.json())
      .then(data => setAbilities(data));
  }, []);

  const handleSelect = (ability) => {
    if (coreAbility?.name === ability.name) {
      setCoreAbility(null);
      setHeroPoints(heroPoints + ability.cost);
    } else {
      if (coreAbility) {
        setHeroPoints(heroPoints + coreAbility.cost);
      }
      setCoreAbility(ability);
      setHeroPoints(heroPoints - ability.cost);
      setSkipped(false);
    }
  };

  const handleSkip = () => {
    if (coreAbility) {
      setHeroPoints(heroPoints + coreAbility.cost);
      setCoreAbility(null);
    }
    setSkipped(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose a Core Ability (Optional)</h2>
      <p className="mb-2 text-gray-700">
        You may select <strong>one</strong> core ability (-15 hero points), or skip this step to save points.
      </p>

      <div className="grid gap-4">
        {abilities.map((ability) => (
          <button
            key={ability.name}
            onClick={() => handleSelect(ability)}
            className={`text-left border px-4 py-3 rounded-md transition ${
              coreAbility?.name === ability.name ? 'bg-blue-200 border-blue-400' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{ability.name}</strong>: {ability.description}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-600 underline hover:text-gray-900"
        >
          Skip this step and keep the 15 hero points
        </button>

        <button
          onClick={onFinish}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next: Skills
        </button>
      </div>
    </div>
  );
}
