import { useEffect, useState } from 'react';

export default function StepSkills({ skills, setSkills, heroPoints, setHeroPoints, onFinish }) {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillBuffer, setSkillBuffer] = useState({});

  useEffect(() => {
    fetch('/data/skills.json')
      .then(res => res.json())
      .then(data => setAvailableSkills(data));
  }, []);

  const updateSkill = (skillName, newValue) => {
    const current = skills.find(s => s.name === skillName);
    const oldValue = current?.value || 0;
    const delta = newValue - oldValue;

    if (delta > heroPoints) return;
    if (newValue < 3) {
      if (current) {
        setSkills(skills.filter(s => s.name !== skillName));
        setHeroPoints(heroPoints + oldValue);
      }
      return;
    }

    const isNew = !current;
    const totalSkills = isNew ? skills.length + 1 : skills.length;
    if (isNew && totalSkills > 10) return;

    const updated = skills.filter(s => s.name !== skillName);
    updated.push({ name: skillName, value: newValue });
    setSkills(updated);
    setHeroPoints(heroPoints - delta);
  };

  const getValue = (skillName) => {
    return skills.find(s => s.name === skillName)?.value || '';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose Up to 10 Skills</h2>
      <p className="mb-2 text-gray-700">
        Each skill costs 1 hero point per value. Min 3, max 18. You have {heroPoints} hero points remaining.
      </p>
      <p className="mb-4 text-sm text-gray-500">You have chosen {skills.length} / 10 skills.</p>

      <div className="space-y-4">
        {availableSkills.map(skill => {
          const value = skillBuffer[skill.name] ?? getValue(skill.name);
          return (
            <div key={skill.name} className="border rounded-md p-3 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{skill.name}</strong>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={0}
                    max={18}
                    step={1}
                    value={value}
                    onChange={(e) =>
                      setSkillBuffer({ ...skillBuffer, [skill.name]: parseInt(e.target.value || '0') })
                    }
                    onBlur={() => updateSkill(skill.name, skillBuffer[skill.name] || 0)}
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <button
                    onClick={() => {
                      setSkillBuffer({ ...skillBuffer, [skill.name]: 0 });
                      updateSkill(skill.name, 0);
                    }}
                    className="text-xs text-red-500 underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onFinish}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Next: Equipment
      </button>
    </div>
  );
}
