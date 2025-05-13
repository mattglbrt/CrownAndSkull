import { useEffect, useState } from 'react';

export default function StepCompanions({ companions, setCompanions, heroPoints, setHeroPoints, onFinish }) {
  const [name, setName] = useState('');
  const [baseCost, setBaseCost] = useState(3);
  const [damage, setDamage] = useState('D4');
  const [defense, setDefense] = useState(6);
  const [maxSkills, setMaxSkills] = useState(1);
  const [skills, setSkills] = useState([]);
  const [upgrades, setUpgrades] = useState([]);
  const [limitations, setLimitations] = useState([]);

  const [skillList, setSkillList] = useState([]);
  const [upgradeList, setUpgradeList] = useState([]);
  const [limitationList, setLimitationList] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/companionSkills.json').then(r => r.json()),
      fetch('/data/companionUpgrades.json').then(r => r.json()),
      fetch('/data/companionLimitations.json').then(r => r.json())
    ]).then(([s, u, l]) => {
      setSkillList(s);
      setUpgradeList(u);
      setLimitationList(l);
    });
  }, []);

  const handleBaseChange = (value) => {
    setBaseCost(value);
    if (value === 3) {
      setDamage('D4');
      setDefense(6);
      setMaxSkills(1);
    } else if (value === 5) {
      setDamage('D6');
      setDefense(9);
      setMaxSkills(2);
    } else if (value === 12) {
      setDamage('D8');
      setDefense(9);
      setMaxSkills(3);
    }
    setSkills([]);
  };

  const toggle = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const totalCost = () => {
    const upgradeCost = upgrades.reduce((sum, u) => sum + u.cost, 0);
    const limitationRefund = limitations.reduce((sum, l) => sum + l.refund, 0);
    return Math.max(1, baseCost + upgradeCost - limitationRefund);
  };

  const canAdd = () => name && skills.length === maxSkills && totalCost() <= heroPoints;

  const handleAdd = () => {
    if (!canAdd()) return;

    const companion = {
      name,
      baseCost,
      damage,
      defense,
      skills: skills.map(s => s.name),
      upgrades: upgrades.map(u => u.name),
      limitations: limitations.map(l => l.name),
      totalCost: totalCost()
    };

    setCompanions([...companions, companion]);
    setHeroPoints(heroPoints - totalCost());
    reset();
  };

  const reset = () => {
    setName('');
    setBaseCost(3);
    setDamage('D4');
    setDefense(6);
    setMaxSkills(1);
    setSkills([]);
    setUpgrades([]);
    setLimitations([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create a Companion</h2>
      <p className="text-sm text-gray-600 mb-2">Hero Points Remaining: {heroPoints}</p>

      <label className="block mb-4">
        <span className="text-sm font-medium">Companion Name</span>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="e.g. Shadow the Falcon"
        />
      </label>

      <div className="mb-4">
        <span className="text-sm font-medium block mb-1">Select Type</span>
        <div className="flex gap-4">
          {[3, 5, 12].map(cost => (
            <button
              key={cost}
              onClick={() => handleBaseChange(cost)}
              className={`border px-3 py-2 rounded ${
                baseCost === cost ? 'bg-green-100 border-green-400' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {cost === 3 && 'Small (D4, 1 skill, 6 DEF)'}
              {cost === 5 && 'Medium (D6, 2 skills, 9 DEF)'}
              {cost === 12 && 'Large (D8, 3 skills, 9 DEF)'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium block mb-1">Skills ({skills.length}/{maxSkills})</span>
        <div className="grid grid-cols-2 gap-2">
          {skillList.map(skill => (
            <label key={skill.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => {
                  if (skills.includes(skill)) {
                    setSkills(skills.filter(s => s !== skill));
                  } else if (skills.length < maxSkills) {
                    setSkills([...skills, skill]);
                  }
                }}
              />
              <span>{skill.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium block mb-1">Upgrades (+3 pts each)</span>
        <div className="grid grid-cols-2 gap-2">
          {upgradeList.map(u => (
            <label key={u.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={upgrades.includes(u)}
                onChange={() => toggle(u, upgrades, setUpgrades)}
              />
              <span>{u.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium block mb-1">Limitations (-3 pts each)</span>
        <div className="grid grid-cols-2 gap-2">
          {limitationList.map(l => (
            <label key={l.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={limitations.includes(l)}
                onChange={() => toggle(l, limitations, setLimitations)}
              />
              <span>{l.name}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-sm mt-2">Total Cost: {totalCost()}</p>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleAdd}
          disabled={!canAdd()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Add Companion
        </button>

        <button
          onClick={onFinish}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Finish Character
        </button>
      </div>

      {companions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Companions</h3>
          <ul className="list-disc ml-6">
            {companions.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong> — {c.damage} / DEF {c.defense} / Skills: {c.skills.join(', ')} / Cost: {c.totalCost}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
