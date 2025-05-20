import { useState, useEffect } from "react";

export default function Home() {
  const [enemies, setEnemies] = useState([]);
  const [encounter, setEncounter] = useState([]);
  const [difficulty, setDifficulty] = useState("any");
  const [region, setRegion] = useState("any");
  const [enemyCount, setEnemyCount] = useState(3);

  useEffect(() => {
    fetch("/data/enemies_complete.json")
      .then(res => res.json())
      .then(setEnemies)
      .catch(err => console.error("Failed to load enemies", err));
  }, []);

  const generateEncounter = () => {
    const filtered = enemies.filter(e => {
      const matchDifficulty = difficulty === "any" || e.difficulty === difficulty;
      const matchRegion = region === "any" || e.region === region;
      return matchDifficulty && matchRegion;
    });

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setEncounter(shuffled.slice(0, enemyCount));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Crown and Skull Encounter Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full border p-2 rounded">
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Region</label>
          <select value={region} onChange={e => setRegion(e.target.value)} className="w-full border p-2 rounded">
            <option value="any">Any</option>
            <option value="swamp">Swamp</option>
            <option value="mountain">Mountain</option>
            <option value="desert">Desert</option>
            <option value="undead">Undead</option>
            <option value="urban">Urban</option>
            <option value="wilds">Wilds</option>
            {/* Add more as needed */}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Enemy Count</label>
          <input
            type="number"
            min="1"
            max="10"
            value={enemyCount}
            onChange={e => setEnemyCount(parseInt(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={generateEncounter}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Generate Encounter
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {encounter.map((enemy, idx) => (
          <div key={idx} className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-bold">{enemy.name}</h2>
            <p className="text-sm text-gray-600">Type: {enemy.type}</p>
            <p>HP: {enemy.hp} | ATK: {enemy.atk} | DEF: {enemy.def}</p>
            <p>Phases: {enemy.phases?.join(", ")}</p>
            <p className="italic">Traits: {enemy.traits?.join(", ")}</p>
            <p className="text-gray-500">{enemy.notes}</p>
            {enemy.tactics && (
              <div className="mt-4">
                <h3 className="font-semibold">Tactics</h3>
                <ul className="text-sm list-disc pl-5">
                  {Object.entries(enemy.tactics).map(([die, action]) => (
                    <li key={die}><strong>{die}:</strong> {action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
