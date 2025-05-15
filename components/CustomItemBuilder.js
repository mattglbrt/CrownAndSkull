import { useEffect, useState } from 'react';

export default function CustomItemBuilder({ customItems, setCustomItems, heroPoints, setHeroPoints, onFinish }) {
  const [items, setItems] = useState([]);
  const [baseItem, setBaseItem] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [extraCost, setExtraCost] = useState(0);

  useEffect(() => {
    fetch('/data/equipment.json')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const totalCost = () => (baseItem?.cost || 0) + Number(extraCost || 0);
  const getStat = () => baseItem?.damage ? `${baseItem.damage} damage` : baseItem?.defense ? `${baseItem.defense} DEF` : '';

  const handleAdd = () => {
    const cost = totalCost();
    if (!name || !baseItem || cost > heroPoints) return;

    const item = {
      name,
      type: baseItem.damage ? 'Weapon' : 'Armor',
      base: baseItem.name,
      stat: getStat(),
      cost,
      description
    };

    setCustomItems([...customItems, item]);
    setHeroPoints(heroPoints - cost);
    resetBuilder();
  };

  const resetBuilder = () => {
    setName('');
    setBaseItem(null);
    setExtraCost(0);
    setDescription('');
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
            if (!name) setName(selected?.name + ' (Custom)');
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
        <span className="text-sm font-semibold">Customization Cost</span>
        <input
          type="number"
          min={0}
          value={extraCost}
          onChange={e => setExtraCost(e.target.value)}
          className="w-32 border p-2 rounded"
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
