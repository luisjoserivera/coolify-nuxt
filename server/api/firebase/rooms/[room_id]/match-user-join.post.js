import { getDatabase } from "firebase-admin/database";
import { useCard } from "../../../../../composables/useCard";

export default defineEventHandler(async (event) => {
  const userID = event.context.userID;
  const roomId = getRouterParam(event, "room_id");
  const { desiredCards } = await readBody(event);

  if (!userID) {
    throw createError({
      statusCode: 401,
      statusMessage: "You are not authenticated",
    });
  }

  const database = getDatabase();
  const refRoomData = database.ref(`/roomData/${roomId}/`);
  const refRoomCards = database.ref(
    `/roomData/${roomId}/matchCurrent/matchCards`,
  );

  const roomData = await refRoomData
    .once("value")
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .catch(() => null);

  if (!roomData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Room do not exists",
    });
  }

  const matchCards = roomData?.matchCurrent?.matchCards || {};
  // const cardKeys = Object.keys(matchCards);

  const { generateBingoCard } = useCard();

  function recursiveGenerateCard(currentCards) {
    const newCard = generateBingoCard();
    const serial = newCard.serial;
    return currentCards[serial] ? recursiveGenerateCard(currentCards) : serial;
  }

  const newCards = {};

  // refRoomCards.transaction(
  //   (currentCards) => {
  //     // the stuff you need to do to modify currentCards,
  //     // then return currentCards modified
  //     console.log("transaction currentCards:", currentCards);
  //     currentCards = currentCards || {};
  //     for (let index = 0; index < desiredCards; index++) {
  //       const cardSerial = recursiveGenerateCard(currentCards);
  //       newCards[cardSerial] = userID;
  //       currentCards[cardSerial] = userID;
  //     }
  //     return currentCards;
  //   },
  //   (error, committed, snapshot) => {
  //     if (error) {
  //       console.log("Transaction failed abnormally!", error);
  //     } else if (!committed) {
  //       console.log(
  //         "We aborted the transaction (because newCard already exists).",
  //       );
  //     } else {
  //       console.log("User card added!");
  //     }
  //   },
  // );

  try {
    await refRoomCards.transaction(
      (currentCards) => {
        // the stuff you need to do to modify currentCards,
        // then return currentCards modified
        // console.log("transaction currentCards:", currentCards);
        currentCards = currentCards || {};
        for (let index = 0; index < desiredCards; index++) {
          const cardSerial = recursiveGenerateCard(currentCards);
          newCards[cardSerial] = userID;
          currentCards[cardSerial] = userID;
        }
        return currentCards;
      },
      // (error, committed, snapshot) => {
      //   if (error) {
      //     console.log("Transaction failed abnormally!", error);
      //   } else if (!committed) {
      //     console.log(
      //       "We aborted the transaction (because newCard already exists).",
      //     );
      //   } else {
      //     console.log("User card added!");
      //   }
      // },
    );
    // console.log("transaction result:", transactionResult);
  } catch (error) {
    // console.log("transaction failed:", error);
    throw createError(error);
  }

  return {
    userID,
    // roomData,
    newCards,
    // matchCards,
    // cardKeys,
    // cardSerial,
  };
  // const { generateBingoCard }
});
