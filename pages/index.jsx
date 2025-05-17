export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Crown & Skull Tools</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Character Builder */}
        <a
          href="/character-builder"
          className="group block rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all p-6 text-center"
        >
          <div className="text-xl font-semibold mb-2 group-hover:text-red-700">
            Character Builder
          </div>
          <p className="text-gray-600 text-sm">
            Create and export custom characters with skills, spells, and gear.
          </p>
        </a>

        {/* Enemy Generator */}
        <a
          href="/enemy-generator"
          className="group block rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all p-6 text-center"
        >
          <div className="text-xl font-semibold mb-2 group-hover:text-red-700">
            Enemy Generator
          </div>
          <p className="text-gray-600 text-sm">
            Build foes from templates or generate enemies randomly.
          </p>
        </a>

        {/* Placeholder for future tools */}
        <div className="group block rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 text-center p-6 hover:border-red-500 transition">
          <div className="text-xl font-semibold mb-2 text-gray-500">Coming Soon</div>
          <p className="text-gray-400 text-sm">
            Worldbuilder, dungeon tools, loot generator, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
