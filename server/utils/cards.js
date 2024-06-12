function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBingoColumn(letter) {
  const minMaxMap = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };
  const numbers = [];
  while (numbers.length < 5) {
    const num = generateRandomNumber(...minMaxMap[letter]);
    if (!numbers.includes(num)) numbers.push(num);
  }
  // Replace the center with the free space
  if (letter === "N") {
    numbers[2] = null;
  }
  return numbers;
}

function serializeCard(card) {
  return Object.values(card)
    .map((numbers) => numbers.join(","))
    .join(";");
}

export function generateBingoCard() {
  const columns = {
    B: generateBingoColumn("B"),
    I: generateBingoColumn("I"),
    N: generateBingoColumn("N"),
    G: generateBingoColumn("G"),
    O: generateBingoColumn("O"),
  };
  const serial = serializeCard(columns);
  return { columns, serial };
}
