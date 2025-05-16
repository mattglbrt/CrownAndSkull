import { useEffect, useState } from 'react';

export default function CustomItemBuilder({ customItems, setCustomItems, heroPoints, setHeroPoints, onFinish }) {
  const [items, setItems] = useState([]);
  const [baseItem, setBaseItem] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [effects, setEffects] = useState([]);
  const [limitations, setLimitations] = useState([]);
  const [selectedEffects, setSelectedEffects] = useState([]);
  const [selectedLimitations, setSelectedLimitations] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/weapons.json').then(res => res.json()),
      fetch('/data/armor.json').then(res => res.json()),
      fetch('/data/equipmentEffects.json').then(res => res.json()),
      fetch('/data/equipmentLimitations.json').then(res => res.json())
    ])
      .then(([weapons, armor, fx, lim]) => {
        setItems([...weapons, ...armor]);
        setEffects(fx);
        setLimitations(lim);
      })
      .catch(err => console.error("Failed to load equipment data:", err));
  }, []);

  const toggleOption = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const totalCost = () => {
    const base = baseItem?.cost || 0;
    const fx = selectedEffects.reduce((sum, e) => sum + (e.cost || 3), 0);
    const lim = selectedLimitations.reduce((sum, l) => sum + (l.refund || 3), 0);
    return Math.max(0, base + fx - lim);
  };

  const getStat = () =>
    baseItem?.damage
      ? `${baseItem.damage} damage`
      : baseItem?.defense
      ? `${baseItem.defense} DEF`
      : '';

  const handleAdd = () => {
    const cost = totalCost();
    if (!name || !baseItem || cost > heroPoints) return;

    const item = {
      name,
      type: baseItem.damage ? 'Weapon' : 'Armor',
      base: baseItem.name,
      stat: getStat(),
      cost,
      description,
      effects: selectedEffects.map(e => e.name),
      limitations: selectedLimitations.map(l => l.name)
    };

    setCustomItems([...customItems, item]);
    setHeroPoints(heroPoints - cost);
    resetBuilder();
  };

  const resetBuilder = () => {
    setName('');
    setBaseItem(null);
    setDescription('');
    setSelectedEffects([]);
    setSelectedLimitations([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Custom Gear</h2>
      <p className="text-sm text-gray-600 mb-2">Remaining Hero Points: {heroPoints}</p>

      <label className="block mb-4">
        <span className="text-sm font-semibold">Base Item</span>
        <select
          className="w-full border p-2 rounded"
          value={baseItem?.name || ''}
          onChange={e => {
            const selected = items.find(i => i.name === e.target.value);
            setBaseItem(selected);
            if (!name && selected) setName(selected.name + ' (Custom)');
          }}
        >
          <option value="">Select base item...</option>
          {items.map(i => (
            <option key={i.name} value={i.name}>
              {i.name} — {i.damage || `${i.defense} DEF`} (Cost: {i.cost})
            </option>
          ))}
        </select>
      </label>

      {baseItem && (
        <div className="mb-4 text-sm text-gray-700">
          <p><strong>Stats:</strong> {getStat()}</p>
          <p><strong>Base Cost:</strong> {baseItem.cost}</p>
          {baseItem.note && <p><strong>Note:</strong> {baseItem.note}</p>}
        </div>
      )}

      <label className="block mb-4">
        <span className="text-sm font-semibold">Item Name</span>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Describe the custom features added"
        />
      </label>

      <div className="mb-4">
        <span className="text-sm font-semibold block mb-1">Add Effects (+3 pts each)</span>
        <div className="grid grid-cols-2 gap-2">
          {effects.map(opt => (
            <label key={opt.name} className="flex items-center space-x-2 group relative">
              <input
                type="checkbox"
                checked={selectedEffects.includes(opt)}
                onChange={() => toggleOption(opt, selectedEffects, setSelectedEffects)}
              />
              <span>{opt.name}</span>
              {opt.description && (
                <div className="absolute bottom-full mb-1 left-0 hidden group-hover:block w-64 bg-black text-white text-xs p-2 rounded shadow-lg z-10">
                  {opt.description}
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-sm font-semibold block mb-1">Add Limitations (-3 pts each)</span>
        <div className="grid grid-cols-2 gap-2">
          {limitations.map(opt => (
            <label key={opt.name} className="flex items-center space-x-2 group relative">
              <input
                type="checkbox"
                checked={selectedLimitations.includes(opt)}
                onChange={() => toggleOption(opt, selectedLimitations, setSelectedLimitations)}
              />
              <span>{opt.name}</span>
              {opt.description && (
                <div className="absolute bottom-full mb-1 left-0 hidden group-hover:block w-64 bg-black text-white text-xs p-2 rounded shadow-lg z-10">
                  {opt.description}
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      <p className="mb-4"><strong>Total Cost:</strong> {totalCost()}</p>

      <button
        onClick={handleAdd}
        disabled={!baseItem || !name || totalCost() > heroPoints}
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
                <strong>{item.name}</strong> ({item.type}) — {item.stat}, based on <em>{item.base}</em> (Cost: {item.cost})<br />
                <span className="text-sm text-gray-600">{item.description}</span>
                {item.effects?.length > 0 && (
                  <div className="text-xs text-gray-500">Effects: {item.effects.join(', ')}</div>
                )}
                {item.limitations?.length > 0 && (
                  <div className="text-xs text-red-500">Limitations: {item.limitations.join(', ')}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
