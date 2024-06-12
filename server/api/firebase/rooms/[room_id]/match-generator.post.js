import { getDatabase } from "firebase-admin/database";

export default defineEventHandler(async (event) => {
  const userID = event.context.userID;

  /** Verify user is authenticated */
  if (!userID) {
    throw createError({
      statusCode: 401,
      statusMessage: "You are not authenticated",
    });
  }

  /** Get patterns configuration */
  const { matchPatterns } = await readBody(event);

  /**
   * PENDING
   * Verify `matchPatterns` are valid
   */

  const roomId = getRouterParam(event, "room_id");
  const database = getDatabase();
  const refRoomData = database.ref(`/roomData/${roomId}/`);

  const roomData = await refRoomData
    .once("value")
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .catch(() => null);

  /** Verify room exist */
  if (!roomData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Room do not exists",
    });
  }

  // Generate an array of numbers from 1 to 75
  const bingoNumbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Randomize their order
  const matchDrawNumbers = bingoNumbers.sort(() => Math.random() - 0.5);

  const newMatch = {
    matchPatterns,
    matchDrawNumbers,
    matchDrawTimeline: null,
    // matchBalls: [],
    matchCards: [],
    matchBallMax: 2,
  };

  // return newMatch;

  const refMatchCurrent = database.ref(`/roomData/${roomId}/matchCurrent`);

  try {
    await refMatchCurrent.set(newMatch);
    return newMatch;
  } catch (error) {
    throw createError(error);
  }

  // try {
  //   await refRoomCards.transaction(
  //     (currentCards) => {
  //       // the stuff you need to do to modify currentCards,
  //       // then return currentCards modified
  //       // console.log("transaction currentCards:", currentCards);
  //       currentCards = currentCards || {};
  //       for (let index = 0; index < desiredCards; index++) {
  //         const cardSerial = recursiveGenerateCard(currentCards);
  //         newCards[cardSerial] = userID;
  //         currentCards[cardSerial] = userID;
  //       }
  //       return currentCards;
  //     },
  //     // (error, committed, snapshot) => {
  //     //   if (error) {
  //     //     console.log("Transaction failed abnormally!", error);
  //     //   } else if (!committed) {
  //     //     console.log(
  //     //       "We aborted the transaction (because newCard already exists).",
  //     //     );
  //     //   } else {
  //     //     console.log("User card added!");
  //     //   }
  //     // },
  //   );
  //   // console.log("transaction result:", transactionResult);
  // } catch (error) {
  //   // console.log("transaction failed:", error);
  //   throw createError(error);
  // }

  // return {
  //   userID,
  //   // roomData,
  //   newCards,
  //   // matchCards,
  //   // cardKeys,
  //   // cardSerial,
  // };
});
