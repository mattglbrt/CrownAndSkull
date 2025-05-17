# Crown & Skull Character Builder

A fully-featured web app for creating characters in the Crown & Skull fantasy RPG system. Build characters step-by-step, track hero points, select lineages, spells, equipment, and companions — and export it all to Markdown.

## Features

- Name, Lineage, and Hometown selection
- Core Ability and Flaws (with hero point tracking)
- Skill point-buy system (up to 10)
- Equipment builder with standard and custom gear
- Spell selection and custom spell creation
- Companion builder with upgrades and limitations
- Markdown export of completed character sheet

## Tech Stack

- Next.js
- React
- Tailwind CSS
- JSON-based data loading from `public/data/`

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open the app in your browser
http://localhost:3000

# Project Structure

/components        - All step components
/lib               - Utility functions (e.g. downloadMarkdown.js)
/public/data       - All game data (lineages, flaws, skills, gear, etc.)
/pages/index.js    - Step-based character creation flow

### Data Files

All game mechanics (flaws, gear, lineages, etc.) are stored in flat JSON files inside public/data/ to keep logic clean and editable.

# Export
Once complete, a character can be downloaded as a .md file using the "Download Markdown" button on the final step. The file is named after the character.

# TODO / Ideas
- [X] Local save/load with localStorage
- [ ] Add export to PDF
- [ ] Add printable view
- [ ] Campaign tracker or deed builder
- [X] Shareable character links
- [ ] Character Templates: Provide pre-made templates for quick character generation.
- [X] Enhancing Mobile Responsiveness: Optimize the interface for mobile devices.

# License
This app is for personal and fan use only. Crown & Skull is copyrighted by its original creators. This project is an unofficial utility and not affiliated with the original publisher. This uses only the free options available by downloading to free players guide at (Runehammer)[https://www.runehammer.online/crown-skull-rpg]

