import { useState } from 'react';

export default function CustomItemBuilder({ customItems, setCustomItems, heroPoints, setHeroPoints, onFinish }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Weapon'); // or 'Armor'
  const [cost, setCost] = useState(1);

  const getStat = () => {
    if (type === 'Weapon') {
      if (cost <= 1) return 'D6 damage';
      if (cost === 2) return 'D8 damage';
      if (cost === 3) return 'D10 damage';
      if (cost === 4) return 'D10 damage';
      return 'D12 damage';
    } else if (type === 'Armor') {
      return cost <= 4 ? `${cost} DEF` : '4 DEF max';
    }
    return '';
  };

  const handleAdd = () => {
    if (!name || cost > heroPoints || cost < 1) return;

    const item = {
      name,
      type,
      cost,
      stat: getStat()
    };

    setCustomItems([...customItems, item]);
    setHeroPoints(heroPoints - cost);
    setName('');
    setType('Weapon');
    setCost(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Custom Item</h2>
      <p className="mb-2">Each item costs hero points and grants stats based on cost and type.</p>

      <label className="block mb-4">
        <span className="text-sm">Item Name</span>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="e.g. Dragonbone Spear"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Type</span>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Weapon">Weapon</option>
          <option value="Armor">Armor</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="text-sm">Point Cost (1–5)</span>
        <input
          type="number"
          min={1}
          max={10}
          value={cost}
          onChange={e => setCost(parseInt(e.target.value || '1'))}
          className="w-32 border p-2 rounded"
        />
      </label>

      <p className="mb-4"><strong>Result:</strong> {getStat()}</p>

      <button
        onClick={handleAdd}
        disabled={!name || cost > heroPoints}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        Add Item
      </button>

      <button
        onClick={onFinish}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Finish Character
      </button>

      {customItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Custom Items</h3>
          <ul className="list-disc ml-6">
            {customItems.map((item, i) => (
              <li key={i}>
                <strong>{item.name}</strong> ({item.type}) — {item.stat} (Cost: {item.cost})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}