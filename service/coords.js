module.exports = function getCoords (x, y, dias) {
  const baseCoords = [
    { x: x + 560, y: y + 1 },
    { x: x + 545, y: y + 1 },
    { x: x + 540, y: y + 1 },
    { x: x + 535, y: y + 1 },
    { x: x + 530, y: y + 1 },
    { x: x + 525, y: y + 1 },
    { x: x + 520, y: y + 1 },
    { x: x + 510, y: y + 1 },
    { x: x + 505, y: y + 1 },
    { x: x + 500, y: y + 1 },
    { x: x + 495, y: y + 1 },
    { x: x + 490, y: y + 1 },
    { x: x + 480, y: y + 1 },
    { x: x + 475, y: y + 1 }
  ]

  return baseCoords.slice(0, dias)
}
