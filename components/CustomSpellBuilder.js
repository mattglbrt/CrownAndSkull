import { useEffect, useState } from 'react';

export default function CustomSpellBuilder({ customSpells, setCustomSpells, heroPoints, setHeroPoints, onFinish }) {
  const [name, setName] = useState('');
  const [spellSummary, setSpellSummary] = useState('');
  const [effects, setEffects] = useState([]);
  const [castTime, setCastTime] = useState(null);
  const [range, setRange] = useState(null);
  const [duration, setDuration] = useState(null);
  const [modifiers, setModifiers] = useState([]);
  const [limitations, setLimitations] = useState([]);

  const [effectList, setEffectList] = useState([]);
  const [castTimes, setCastTimes] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [durations, setDurations] = useState([]);
  const [mods, setMods] = useState([]);
  const [limits, setLimits] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/spellEffects.json').then(r => r.json()),
      fetch('/data/spellCastTimes.json').then(r => r.json()),
      fetch('/data/spellRanges.json').then(r => r.json()),
      fetch('/data/spellDurations.json').then(r => r.json()),
      fetch('/data/spellModifiers.json').then(r => r.json()).catch(() => []),
      fetch('/data/spellLimitations.json').then(r => r.json())
    ]).then(([e, c, r, d, m, l]) => {
      setEffectList(e);
      setCastTimes(c);
      setRanges(r);
      setDurations(d);
      setMods(m);
      setLimits(l);
    });
  }, []);

  const toggleEffect = (opt) => {
    if (effects.includes(opt)) {
      setEffects(effects.filter(e => e !== opt));
    } else {
      setEffects([...effects, opt]);
    }
  };

  const toggleModifier = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const totalCost = () => {
    const base =
      effects.reduce((sum, e) => sum + (e.cost || 3), 0) +
      (castTime?.cost || 0) +
      (range?.cost || 0) +
      (duration?.cost || 0) +
      modifiers.reduce((sum, m) => sum + (m.cost || 3), 0) -
      limitations.reduce((sum, l) => sum + (l.refund || 3), 0);

    return Math.max(1, base);
  };

  const canCreate = () =>
    name && effects.length && castTime && range && duration && totalCost() <= heroPoints;

  const handleCreate = () => {
    if (!canCreate()) return;

    const newSpell = {
      name,
      summary: spellSummary,
      effects: effects.map(e => e.name),
      castTime: castTime.name,
      range: range.name,
      duration: duration.name,
      modifiers: modifiers.map(m => m.name),
      limitations: limitations.map(l => l.name),
      cost: totalCost()
    };

    setCustomSpells([...customSpells, newSpell]);
    setHeroPoints(heroPoints - totalCost());
    resetBuilder();
  };

  const resetBuilder = () => {
    setName('');
    setSpellSummary('');
    setEffects([]);
    setCastTime(null);
    setRange(null);
    setDuration(null);
    setModifiers([]);
    setLimitations([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Custom Spell Builder</h2>
      <p className="mb-2 text-gray-600">Build a custom spell using canonical options. Remaining Hero Points: {heroPoints}</p>

      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm">Spell Name</span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Name your spell"
          />
        </label>

        <label className="block">
          <span className="text-sm">Spell Description</span>
          <textarea
            value={spellSummary}
            onChange={e => setSpellSummary(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Write what this spell does in your own words"
          />
        </label>

        <MultiToggle label="Effects" options={effectList} selectedList={effects} toggle={toggleEffect} />
        <Selector label="Cast Time" options={castTimes} selected={castTime} setSelected={setCastTime} />
        <Selector label="Range" options={ranges} selected={range} setSelected={setRange} />
        <Selector label="Duration" options={durations} selected={duration} setSelected={setDuration} />

        <MultiToggle label="Modifiers" options={mods} selectedList={modifiers} toggle={i => toggleModifier(i, modifiers, setModifiers)} />
        <MultiToggle label="Limitations" options={limits} selectedList={limitations} toggle={i => toggleModifier(i, limitations, setLimitations)} />
      </div>

      <p className="mt-4 text-sm text-gray-700">
        Total Spell Cost: {totalCost()} (Includes 3 pts base per effect)
      </p>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleCreate}
          disabled={!canCreate()}
          className={`px-4 py-2 rounded text-white ${canCreate() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Create Spell
        </button>
        <button
          onClick={onFinish}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Finish Character
        </button>
      </div>

      {customSpells.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Custom Spells:</h3>
          <ul className="list-disc ml-6 space-y-1">
            {customSpells.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong> — {s.effects?.join(', ')}, {s.castTime}, {s.range}, {s.duration} ({s.cost} pts)
                {s.summary && (
                  <p className="text-sm text-gray-600 mt-1">{s.summary}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Selector({ label, options, selected, setSelected }) {
  return (
    <div>
      <span className="block text-sm font-semibold mb-1">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.name}
            onClick={() => setSelected(opt)}
            title={opt.description || ''}
            className={`px-3 py-1 rounded border ${
              selected?.name === opt.name
                ? 'bg-purple-200 border-purple-400'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiToggle({ label, options, selectedList, toggle }) {
  return (
    <div>
      <span className="block text-sm font-semibold mb-1">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <div key={opt.name} className="relative group flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedList.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span>{opt.name}</span>
            {opt.description && (
              <div className="absolute bottom-full mb-1 left-0 hidden group-hover:block w-64 bg-black text-white text-xs p-2 rounded shadow-lg z-10">
                {opt.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
