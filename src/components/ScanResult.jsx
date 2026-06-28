// Couleurs et infos des poubelles
const BIN_COLORS = {
  JAUNE:  { bg: 'bg-yellow-400', border: 'border-yellow-300', emoji: '🟡', label: 'Poubelle Jaune' },
  VERTE:  { bg: 'bg-green-500',  border: 'border-green-300',  emoji: '🟢', label: 'Poubelle Verte' },
  BLEUE:  { bg: 'bg-blue-500',   border: 'border-blue-300',   emoji: '🔵', label: 'Poubelle Bleue' },
  MARRON: { bg: 'bg-amber-700',  border: 'border-amber-300',  emoji: '🟤', label: 'Poubelle Marron' },
  GRISE:  { bg: 'bg-gray-400',   border: 'border-gray-300',   emoji: '⚫', label: 'Poubelle Grise' },
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

        {/* Nom du déchet identifié */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Déchet identifié
          </p>
          <p className="text-lg font-semibold text-gray-800">
            {result.wasteName}
          </p>
          {result.geminiLabel &&
           result.geminiLabel !== result.wasteName && (
            <p className="text-xs text-gray-400 mt-1">
              IA a détecté : "{result.geminiLabel}"
            </p>
          )}
        </div>

        {/* ======================== */}
        {/* Bloc éducatif — affiché seulement si Gemini a retourné des infos */}
        {/* ======================== */}
        {result.materiau && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">

            <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">
              🎓 Pourquoi cette poubelle ?
            </p>

            {/* Matériau */}
            <div className="flex items-start gap-3">
              <span className="text-lg">🔬</span>
              <div>
                <p className="text-xs text-blue-400 font-medium uppercase">
                  Matériau
                </p>
                <p className="text-sm text-blue-800 font-semibold">
                  {result.materiau}
                </p>
              </div>
            </div>

            {/* Recyclable ou non */}
            <div className="flex items-start gap-3">
              <span className="text-lg">
                {result.recyclable ? '✅' : '❌'}
              </span>
              <div>
                <p className="text-xs text-blue-400 font-medium uppercase">
                  {result.recyclable ? 'Recyclable' : 'Non recyclable'}
                </p>
                {result.explication && (
                  <p className="text-sm text-blue-800">
                    {result.explication}
                  </p>
                )}
              </div>
            </div>

            {/* Astuce */}
            {result.astuce && (
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-xs text-blue-400 font-medium uppercase">
                    Astuce
                  </p>
                  <p className="text-sm text-blue-800">
                    {result.astuce}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Consigne de tri */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            📋 Consigne de tri
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
          <p className="text-green-400 text-xs mt-1 italic">
            {result.message}
          </p>
        </div>

        {/* Catégorie */}
        <div className="text-center">
          <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
            {result.category}
          </span>
        </div>

      </div>
    </div>
  )
}