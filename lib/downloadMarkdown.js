export function downloadMarkdown(character) {
  const {
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
    customItems,
    heroPoints
  } = character;

  const content = `# ${name}

**Lineage:** ${lineage?.name || '—'}  
**Hometown:** ${hometown || '—'}  
**Hero Points Remaining:** ${heroPoints}

---

## Flaws
${selectedFlaws.map(f => `- ${f.name}`).join('\n') || '_None_'}

## Core Ability
${coreAbility?.name ? `**${coreAbility.name}**` : '_None selected_'}

## Skills
${skills.map(s => `- ${s.name} (${s.value})`).join('\n')}

## Equipment
${equipment.map(e => `- ${e.name} (Cost: ${e.cost})${e.note ? ` — ${e.note}` : ''}`).join('\n')}

## Spells
${spells.map(s => `- ${s.name} (Cost: ${s.cost}) — ${s.effect}`).join('\n')}

${customSpells.map(s => 
  `- ${s.name}: ${s.effects?.join(', ')}, ${s.range}, ${s.duration} (Cost: ${s.cost})` + 
  (s.summary ? `\n  ${s.summary}` : '')
).join('\n')}

## Companions
${companions.map(c => `- ${c.name} — ${c.damage} / DEF ${c.defense} / Skills: ${c.skills.join(', ')} / Cost: ${c.totalCost}`).join('\n')}

## Custom Items
${customItems?.map(item => 
  `- ${item.name} (${item.type}) — ${item.stat}, based on ${item.base} (Cost: ${item.cost})` +
  (item.description ? `\n  ${item.description}` : '') +
  (item.effects?.length ? `\n  Effects: ${item.effects.join(', ')}` : '') +
  (item.limitations?.length ? `\n  Limitations: ${item.limitations.join(', ')}` : '')
).join('\n')}

`;

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name || 'character'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
