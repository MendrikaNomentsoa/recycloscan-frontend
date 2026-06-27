// Couleurs des poubelles
const BIN_COLORS = {
  JAUNE:  { bg: 'bg-yellow-400', text: 'text-yellow-800', emoji: '🟡', label: 'Poubelle Jaune' },
  VERTE:  { bg: 'bg-green-500',  text: 'text-green-800',  emoji: '🟢', label: 'Poubelle Verte' },
  BLEUE:  { bg: 'bg-blue-500',   text: 'text-blue-800',   emoji: '🔵', label: 'Poubelle Bleue' },
  MARRON: { bg: 'bg-amber-700',  text: 'text-amber-900',  emoji: '🟤', label: 'Poubelle Marron' },
  GRISE:  { bg: 'bg-gray-400',   text: 'text-gray-800',   emoji: '⚫', label: 'Poubelle Grise' },
}

export default function ScanResult({ result }) {
  const bin = BIN_COLORS[result.binColor] || BIN_COLORS.GRISE

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* Couleur de la poubelle en grand */}
      <div className={`${bin.bg} p-8 text-center`}>
        <span className="text-7xl">{bin.emoji}</span>
        <h2 className="text-2xl font-bold text-white mt-3">
          {bin.label}
        </h2>
      </div>

      <div className="p-6 space-y-4">

        {/* Nom du déchet */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Déchet identifié
          </p>
          <p className="text-lg font-semibold text-gray-800">
            {result.wasteName}
          </p>
          {result.geminiLabel && result.geminiLabel !== result.wasteName && (
            <p className="text-xs text-gray-400 mt-1">
              Gemini a détecté : "{result.geminiLabel}"
            </p>
          )}
        </div>

        {/* Instruction */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Consigne de tri
          </p>
          <p className="text-sm text-gray-700">
            {result.instruction}
          </p>
        </div>

        {/* Points gagnés */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-600 font-bold text-xl">
            +{result.pointsEarned} points 🌱
          </p>
          <p className="text-green-500 text-sm mt-1">
            Total : {result.totalPoints} points
          </p>
        </div>

        {/* Catégorie */}
        <div className="text-center">
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {result.category}
          </span>
        </div>
      </div>
    </div>
  )
}