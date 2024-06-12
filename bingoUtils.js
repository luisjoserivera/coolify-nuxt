export function bingoCardUnserialize(cardSerial) {
  if (!cardSerial) return null;
  const columnsKeys = ["B", "I", "N", "G", "O"];
  const columnsNumbers = cardSerial.split(";");
  const cardData = {};
  for (let index = 0; index < columnsKeys.length; index++) {
    const letter = columnsKeys[index];
    cardData[letter] = columnsNumbers[index].split(",").map((n) => Number(n));
  }
  return cardData;
}

export function bingoPatterns() {
  const topLeftToBottomRight = {
    patternTitle: "SOME TITLE",
    patternDescription: null,
    patternSample: ["r0,c0", "r1,c1", "r2,c2", "r3,c3", "r4,c4"],
    patternTest(bingoCard, foundNumbers) {
      return ["B", "I", "N", "G", "O"].every((column, index) => {
        // If the center space is reached, treat as marked
        if (column === "N" && index === 2) return true;
        return foundNumbers.includes(bingoCard[column][index]);
      });
    },
  };

  const topRightToBottomLeft = {
    patternTitle: "SOME TITLE",
    patternDescription: null,
    patternSample: ["r0,c0", "r1,c1", "r2,c2", "r3,c3", "r4,c4"],
    patternTest(bingoCard, foundNumbers) {
      return ["O", "G", "N", "I", "B"].every((column, index) => {
        // If the center space is reached, treat as marked
        if (column === "N" && index === 2) return true;
        return foundNumbers.includes(bingoCard[column][index]);
      });
    },
  };

  const fiveSquaresDiagonal = {
    patternTitle: "Linea Diagonal",
    patternDescription: null,
    patternSample: null,
    patternTest(bingoCard, foundNumbers) {
      return (
        topLeftToBottomRight.patternTest(bingoCard, foundNumbers) ||
        topRightToBottomLeft.patternTest(bingoCard, foundNumbers)
      );
    },
  };

  const fiveSquaresVertical = {
    patternTitle: "Linea Vertical",
    patternDescription: null,
    patternSample: ["r0,c2", "r1,c2", "r2,c2", "r3,c2", "r4,c2"],
    patternTest(bingoCard, foundNumbers) {
      // Check for vertical win
      for (const column of ["B", "I", "N", "G", "O"]) {
        if (
          bingoCard[column].every((number, index) => {
            // If the center space is reached, treat as marked
            if (column === "N" && index === 2) return true;
            return foundNumbers.includes(number);
          })
        ) {
          return true; // This column has all its numbers marked
        }
      }
      return false;
    },
  };

  const fiveSquaresHorizontal = {
    patternTitle: "Linea Horizontal",
    patternDescription: null,
    patternSample: null,
    patternTest(bingoCard, foundNumbers) {
      for (let row = 0; row < 5; row++) {
        let isRowComplete = true;
        for (const col of ["B", "I", "N", "G", "O"]) {
          if (col === "N" && row === 2) continue;
          if (!foundNumbers.includes(bingoCard[col][row])) {
            isRowComplete = false;
            break;
          }
        }
        if (isRowComplete) return true;
      }
      return false;
    },
  };

  const fiveSquareLine = {
    patternTitle: "Linea Libre",
    patternDescription: null,
    patternSample: null,
    patternTest(bingoCard, foundNumbers) {
      return (
        topLeftToBottomRight.patternTest(bingoCard, foundNumbers) ||
        topRightToBottomLeft.patternTest(bingoCard, foundNumbers) ||
        fiveSquaresVertical.patternTest(bingoCard, foundNumbers) ||
        fiveSquaresHorizontal.patternTest(bingoCard, foundNumbers)
      );
    },
  };

  const fourCorners = {
    patternTitle: "Cuatro Esquinas",
    patternDescription: null,
    patternSample: null,
    patternTest(bingoCard, foundNumbers) {
      // Define the corners
      const corners = [
        bingoCard.B[0], // Top-left
        bingoCard.O[0], // Top-right
        bingoCard.B[4], // Bottom-left
        bingoCard.O[4], // Bottom-right
      ];

      // Check if all corners are marked
      return corners.every((corner) => foundNumbers.includes(corner));
    },
  };

  return {
    // topLeftToBottomRight,
    // topRightToBottomLeft,
    fiveSquaresDiagonal,
    fiveSquaresVertical,
    fiveSquaresHorizontal,
    fiveSquareLine,
    fourCorners,
  };
}
