import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StepIntro from '../../components/StepIntro';
import StepHometown from '../../components/StepHometown';
import StepFlaws from '../../components/StepFlaws';
import StepCoreAbility from '../../components/StepCoreAbility';
import StepSkills from '../../components/StepSkills';
import StepEquipment from '../../components/StepEquipment';
import CustomItemBuilder from '../../components/CustomItemBuilder';
import StepSpells from '../../components/StepSpells';
import CustomSpellBuilder from '../../components/CustomSpellBuilder';
import StepCompanions from '../../components/StepCompanions';
import { downloadMarkdown } from '../../lib/downloadMarkdown';

const STORAGE_KEY = 'crown-skull-saves';

export default function Home() {
  const [step, setStep] = useState(0);
  const [activeSave, setActiveSave] = useState(null);
  const [allSaves, setAllSaves] = useState([]);

  const [name, setName] = useState('');
  const [lineage, setLineage] = useState(null);
  const [hometown, setHometown] = useState('');
  const [selectedFlaws, setSelectedFlaws] = useState([]);
  const [coreAbility, setCoreAbility] = useState(null);
  const [skills, setSkills] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [spells, setSpells] = useState([]);
  const [customSpells, setCustomSpells] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [heroPoints, setHeroPoints] = useState(50);
  const [shareLink, setShareLink] = useState('');

  const characterState = {
    name, lineage, hometown, selectedFlaws, coreAbility,
    skills, equipment, customItems, spells, customSpells,
    companions, heroPoints
  };

  useEffect(() => {
    const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setAllSaves(saves);

    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get('c');
    if (encoded) {
      try {
        const parsed = JSON.parse(atob(encoded));
        loadCharacter(parsed);
      } catch (err) {
        console.warn('Failed to load character from URL:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (activeSave !== null) {
      const newSave = { ...characterState, id: activeSave };
      const updatedSaves = allSaves.map(s => s.id === activeSave ? newSave : s);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSaves));
      setAllSaves(updatedSaves);
    }
  }, [name, lineage, hometown, selectedFlaws, coreAbility, skills, equipment, customItems, spells, customSpells, companions, heroPoints]);

  const startNewCharacter = () => {
    const id = Date.now();
    const newChar = { id, ...characterState };
    const newSaves = [...allSaves, newChar];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaves));
    setAllSaves(newSaves);
    setActiveSave(id);
    setName('');
    setLineage(null);
    setHometown('');
    setSelectedFlaws([]);
    setCoreAbility(null);
    setSkills([]);
    setEquipment([]);
    setCustomItems([]);
    setSpells([]);
    setCustomSpells([]);
    setCompanions([]);
    setHeroPoints(50);
    setStep(1);
  };

  const loadCharacter = (char) => {
    setActiveSave(char.id);
    setName(char.name || '');
    setLineage(char.lineage || null);
    setHometown(char.hometown || '');
    setSelectedFlaws(char.selectedFlaws || []);
    setCoreAbility(char.coreAbility || null);
    setSkills(char.skills || []);
    setEquipment(char.equipment || []);
    setCustomItems(char.customItems || []);
    setSpells(char.spells || []);
    setCustomSpells(char.customSpells || []);
    setCompanions(char.companions || []);
    setHeroPoints(char.heroPoints ?? 50);
    setStep(1);
  };

  const next = () => setStep(step + 1);

  const generateShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const payload = btoa(JSON.stringify(characterState));
    return `${baseUrl}?c=${payload}`;
  };

  if (step === 0) {
    return (
      <div>
        <Navbar step={step} goToStep={setStep} />
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Crown & Skull Character Builder</h1>
          <button
            onClick={startNewCharacter}
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Character
          </button>

          {allSaves.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Saved Characters</h2>
              <ul className="space-y-2">
                {allSaves.map((char) => (
                  <li key={char.id}>
                    <button
                      onClick={() => loadCharacter(char)}
                      className="w-full text-left border px-4 py-2 rounded hover:bg-gray-100"
                    >
                      {char.name || 'Unnamed'} — {char.lineage?.name || 'No lineage'} — {char.heroPoints} HP
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar step={step} goToStep={setStep} />
      <div className="max-w-3xl mx-auto p-6">
        {step === 1 && <StepIntro name={name} setName={setName} lineage={lineage} setLineage={setLineage} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onNext={next} />}
        {step === 2 && <StepHometown hometown={hometown} setHometown={setHometown} onFinish={next} />}
        {step === 3 && <StepFlaws selectedFlaws={selectedFlaws} setSelectedFlaws={setSelectedFlaws} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 4 && <StepCoreAbility coreAbility={coreAbility} setCoreAbility={setCoreAbility} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 5 && <StepSkills skills={skills} setSkills={setSkills} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 6 && <StepEquipment equipment={equipment} setEquipment={setEquipment} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 7 && <CustomItemBuilder customItems={customItems} setCustomItems={setCustomItems} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 8 && <StepSpells spells={spells} setSpells={setSpells} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 9 && <CustomSpellBuilder customSpells={customSpells} setCustomSpells={setCustomSpells} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 10 && <StepCompanions companions={companions} setCompanions={setCompanions} heroPoints={heroPoints} setHeroPoints={setHeroPoints} onFinish={next} />}
        {step === 11 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Final Summary</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Name:</strong> {name}</li>
              <li><strong>Lineage:</strong> {lineage?.name}</li>
              <li><strong>Hometown:</strong> {hometown}</li>
              <li><strong>Flaws:</strong> {selectedFlaws.map(f => f.name).join(', ') || 'None'}</li>
              <li><strong>Core Ability:</strong> {coreAbility?.name || 'None selected'}</li>
              <li><strong>Skills:</strong>
                <ul className="ml-4">{skills.map(s => <li key={s.name}>{s.name} ({s.value})</li>)}</ul>
              </li>
              <li><strong>Equipment:</strong>
                <ul className="ml-4">{equipment.map(e => (
                  <li key={e.name}>{e.name} (Cost: {e.cost}){e.note ? ` — ${e.note}` : ''}</li>
                ))}</ul>
              </li>
              <li><strong>Custom Items:</strong>
                <ul className="ml-4">
                  {customItems.map((i, idx) => (
                    <li key={idx}><strong>{i.name}</strong> ({i.type}) — {i.stat} (Cost: {i.cost})</li>
                  ))}
                </ul>
              </li>
              <li><strong>Spells:</strong>
                <ul className="ml-4">
                  {spells.map(s => <li key={s.name}>{s.name} (Cost: {s.cost}) — {s.effect}</li>)}
                  {customSpells.map((s, i) => (
                    <li key={i}><strong>{s.name}</strong>: {s.effect}, {s.range}, {s.duration} (Cost: {s.cost})</li>
                  ))}
                </ul>
              </li>
              <li><strong>Companions:</strong>
                <ul className="ml-4">
                  {companions.map((c, i) => (
                    <li key={i}><strong>{c.name}</strong> — {c.damage} / DEF {c.defense} / Skills: {c.skills.join(', ')} / Cost: {c.totalCost}</li>
                  ))}
                </ul>
              </li>
              <li><strong>Remaining Hero Points:</strong> {heroPoints}</li>
            </ul>

            <button
              onClick={() => {
                const link = generateShareableLink();
                navigator.clipboard.writeText(link);
                setShareLink(link);
              }}
              className="mt-4 mr-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Copy Shareable Link
            </button>
            {shareLink && <p className="text-xs mt-2 text-gray-600">Link copied to clipboard</p>}

            <button
              onClick={() => downloadMarkdown(characterState)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download Markdown
            </button>
          </div>
        )}
      </div>
    </>
  );
}
