import { useState, useEffect } from "react";

export default function EnemyGenerator() {
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    fetch("/data/enemies.json")
      .then(res => res.json())
      .then(setEnemies)
      .catch(err => console.error("Error loading enemies:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Enemy Generator</h1>

      <div className="grid gap-4">
        {enemies.map((enemy, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-xl font-semibold">{enemy.name}</h2>
            <p className="text-sm text-gray-600">Type: {enemy.type}</p>
            <p>ATK: {enemy.atk} | DEF: {enemy.def}</p>
            <p>Acts on Phases: {enemy.phases.join(", ")}</p>
            <p className="italic text-gray-700">Traits: {enemy.traits.join(", ")}</p>
            <p className="text-gray-500 mt-2">{enemy.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
