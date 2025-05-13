import { useState } from 'react';
import StepIntro from '../components/StepIntro';
import StepHometown from '../components/StepHometown';
import StepFlaws from '../components/StepFlaws';
import StepCoreAbility from '../components/StepCoreAbility';
import StepSkills from '../components/StepSkills';
import StepEquipment from '../components/StepEquipment';
import StepSpells from '../components/StepSpells';
import CustomSpellBuilder from '../components/CustomSpellBuilder';
import StepCompanions from '../components/StepCompanions';
import { downloadMarkdown } from '../lib/downloadMarkdown';

export default function Home() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [lineage, setLineage] = useState(null);
  const [hometown, setHometown] = useState('');
  const [selectedFlaws, setSelectedFlaws] = useState([]);
  const [coreAbility, setCoreAbility] = useState(null);
  const [skills, setSkills] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [spells, setSpells] = useState([]);
  const [customSpells, setCustomSpells] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [heroPoints, setHeroPoints] = useState(50);

  const next = () => setStep(step + 1);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && (
        <StepIntro
          name={name}
          setName={setName}
          lineage={lineage}
          setLineage={setLineage}
          onNext={next}
        />
      )}
      {step === 2 && (
        <StepHometown
          hometown={hometown}
          setHometown={setHometown}
          onFinish={next}
        />
      )}
      {step === 3 && (
        <StepFlaws
          selectedFlaws={selectedFlaws}
          setSelectedFlaws={setSelectedFlaws}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 4 && (
        <StepCoreAbility
          coreAbility={coreAbility}
          setCoreAbility={setCoreAbility}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 5 && (
        <StepSkills
          skills={skills}
          setSkills={setSkills}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 6 && (
        <StepEquipment
          equipment={equipment}
          setEquipment={setEquipment}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 7 && (
        <StepSpells
          spells={spells}
          setSpells={setSpells}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 8 && (
        <CustomSpellBuilder
          customSpells={customSpells}
          setCustomSpells={setCustomSpells}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 9 && (
        <StepCompanions
          companions={companions}
          setCompanions={setCompanions}
          heroPoints={heroPoints}
          setHeroPoints={setHeroPoints}
          onFinish={next}
        />
      )}
      {step === 10 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Final Summary</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Name:</strong> {name}</li>
            <li><strong>Lineage:</strong> {lineage?.name}</li>
            <li><strong>Hometown:</strong> {hometown}</li>
            <li><strong>Flaws:</strong> {selectedFlaws.map(f => f.name).join(', ') || 'None'}</li>
            <li><strong>Core Ability:</strong> {coreAbility?.name || 'None selected'}</li>
            <li>
              <strong>Skills:</strong>
              <ul className="ml-4">
                {skills.map(s => (
                  <li key={s.name}>{s.name} ({s.value})</li>
                ))}
              </ul>
            </li>
            <li>
              <strong>Equipment:</strong>
              <ul className="ml-4">
                {equipment.map(e => (
                  <li key={e.name}>
                    {e.name} (Cost: {e.cost}){e.note ? ` — ${e.note}` : ''}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <strong>Spells:</strong>
              <ul className="ml-4">
                {spells.map(s => (
                  <li key={s.name}>{s.name} (Cost: {s.cost}) — {s.effect}</li>
                ))}
                {customSpells.map((s, i) => (
                  <li key={i}><strong>{s.name}</strong>: {s.effect}, {s.range}, {s.duration} (Cost: {s.cost})</li>
                ))}
              </ul>
            </li>
            <li>
              <strong>Companions:</strong>
              <ul className="ml-4">
                {companions.map((c, i) => (
                  <li key={i}>
                    <strong>{c.name}</strong> — {c.damage} / DEF {c.defense} / Skills: {c.skills.join(', ')} / Cost: {c.totalCost}
                  </li>
                ))}
              </ul>
            </li>
            <li><strong>Remaining Hero Points:</strong> {heroPoints}</li>
          </ul>

          <button
            onClick={() =>
              downloadMarkdown({
                name,
                lineage,
                hometown,
                selectedFlaws,
                coreAbility,
                skills,
                equipment,
                spells,
                customSpells,
                companions,
                heroPoints
              })
            }
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Markdown
          </button>
        </div>
      )}
    </div>
  );
}
