// Mapping des labels COCO-SSD (anglais) vers les mots-clés de ta base
// COCO détecte 80 objets — on mappe ceux qui correspondent à des déchets
export const COCO_TO_WASTE = {
  // Plastique
  'bottle': 'bouteille plastique',
  'cup': 'gobelet plastique',

  // Verre
  'wine glass': 'bouteille de vin',
  'vase': 'pot en verre',

  // Papier
  'book': 'livre',
  'newspaper': 'journal',

  // Électronique / Dangereux
  'cell phone': 'téléphone portable',
  'laptop': 'ordinateur portable',
  'keyboard': 'clavier électronique',
  'remote': 'télécommande pile',
  'mouse': 'souris électronique',

  // Alimentaire / Organique
  'banana': 'fruit abîmé',
  'apple': 'fruit abîmé',
  'orange': 'fruit abîmé',
  'sandwich': 'restes de repas',
  'pizza': 'restes de repas',
  'cake': 'restes de repas',
  'hot dog': 'restes de repas',

  // Autres
  'scissors': 'ciseaux métal',
  'toothbrush': 'brosse à dents',
  'clock': 'appareil électronique',
  'chair': 'meuble',
  'umbrella': 'parapluie',
}

// Retourne le label français ou null si non mappé
export function mapCocoToWaste(cocoLabel) {
  return COCO_TO_WASTE[cocoLabel.toLowerCase()] || null
}