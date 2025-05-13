import { useEffect, useState } from 'react';

export default function StepEquipment({ equipment, setEquipment, heroPoints, setHeroPoints, onNext }) {
  const [weapons, setWeapons] = useState([]);
  const [armor, setArmor] = useState([]);
  const [gear, setGear] = useState([]);
  const [effects, setEffects] = useState([]);
  const [limits, setLimits] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customBaseCost, setCustomBaseCost] = useState(1);
  const [customEffects, setCustomEffects] = useState([]);
  const [customLimits, setCustomLimits] = useState([]);

  const maxItems = 10;

  const fetchData = async () => {
    const files = ['weapons', 'armor', 'gear', 'equipmentEffects', 'equipmentLimitations'];
    const [w, a, g, e, l] = await Promise.all(
      files.map(file => fetch(`/data/${file}.json`).then(res => res.json()))
    );
    setWeapons(w); setArmor(a); setGear(g); setEffects(e); setLimits(l);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentDefense = () => {
    const armorItems = equipment.filter(item => item.defense);
    return 6 + armorItems.reduce((acc, item) => acc + (item.defense || 0), 0);
  };

  const toggleItem = (item) => {
    const exists = equipment.find(e => e.name === item.name);
    if (exists) {
      setEquipment(equipment.filter(e => e.name !== item.name));
      setHeroPoints(heroPoints + item.cost);
    } else if (equipment.length < maxItems && heroPoints >= item.cost) {
      setEquipment([...equipment, item]);
      setHeroPoints(heroPoints - item.cost);
    }
  };

  const handleCustomSubmit = () => {
    const totalEffects = customEffects.reduce((sum, e) => sum + e.cost, 0);
    const totalLimits = customLimits.reduce((sum, l) => sum + l.refund, 0);
    const netCost = Math.max(1, customBaseCost + totalEffects - totalLimits);
    if (equipment.length >= maxItems || heroPoints < netCost) return;

    const newItem = {
      name: customName || 'Custom Item',
      cost: netCost,
      note: [...customEffects.map(e => e.name), ...customLimits.map(l => l.name)].join(', ')
    };

    setEquipment([...equipment, newItem]);
    setHeroPoints(heroPoints - netCost);
    setCustomName('');
    setCustomBaseCost(1);
    setCustomEffects([]);
    setCustomLimits([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose Equipment (Max {maxItems} items)</h2>
      <p className="text-sm mb-2 text-gray-600">Remaining Hero Points: {heroPoints}</p>
      <p className="text-sm mb-4 text-gray-600">Defense: {currentDefense()}</p>

      <Tabs title="Weapons" items={weapons} equipment={equipment} toggleItem={toggleItem} />
      <Tabs title="Armor" items={armor} equipment={equipment} toggleItem={toggleItem} />
      <Tabs title="Gear" items={gear} equipment={equipment} toggleItem={toggleItem} />

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Custom Item Builder</h3>

        <div className="mb-2">
          <label className="block text-sm mb-1">Item Name</label>
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="My Magical Shield"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm mb-1">Base Cost (1–5)</label>
          <input
            type="number"
            value={customBaseCost}
            min={1}
            max={5}
            onChange={e => setCustomBaseCost(parseInt(e.target.value) || 1)}
            className="w-24 p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-semibold">Effects</label>
          <div className="grid grid-cols-2 gap-2">
            {effects.map(effect => (
              <label key={effect.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customEffects.includes(effect)}
                  onChange={() => {
                    setCustomEffects(prev =>
                      prev.includes(effect)
                        ? prev.filter(e => e !== effect)
                        : [...prev, effect]
                    );
                  }}
                />
                <span>{effect.name} (+{effect.cost})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-semibold">Limitations</label>
          <div className="grid grid-cols-2 gap-2">
            {limits.map(limit => (
              <label key={limit.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customLimits.includes(limit)}
                  onChange={() => {
                    setCustomLimits(prev =>
                      prev.includes(limit)
                        ? prev.filter(l => l !== limit)
                        : [...prev, limit]
                    );
                  }}
                />
                <span>{limit.name} (-{limit.refund})</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleCustomSubmit}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Custom Item
        </button>
      </div>

      <button
        onClick={onNext}
        className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Finish Character
      </button>
    </div>
  );
}

function Tabs({ title, items, equipment, toggleItem }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(item => (
          <button
            key={item.name}
            onClick={() => toggleItem(item)}
            className={`text-left border px-4 py-3 rounded-md transition ${
              equipment.find(e => e.name === item.name)
                ? 'bg-blue-200 border-blue-400'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <strong>{item.name}</strong> — {item.note || item.damage || ''} (Cost: {item.cost})
          </button>
        ))}
      </div>
    </div>
  );
}
