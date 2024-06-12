import { getDatabase } from "firebase-admin/database";
import _merge from "lodash/merge.js";
import { bingoCardUnserialize, bingoPatterns } from "~/bingoUtils";

export default defineEventHandler(async (event) => {
  const { uid: userID, displayName } = event.context.user;
  const roomId = getRouterParam(event, "room_id");

  if (!userID) {
    throw createError({
      statusCode: 401,
      statusMessage: "You are not authenticated",
    });
  }

  const { cardSerial, markedBalls } = await readBody(event);

  if (!cardSerial) {
    throw createError({
      statusCode: 400,
      statusMessage: "Card serial missing",
    });
  }

  if (!Array.isArray(markedBalls)) {
    throw createError({
      statusCode: 400,
      statusMessage: `'markedBalls' should be an array of numbers`,
    });
  }

  if (!markedBalls) {
    throw createError({
      statusCode: 400,
      statusMessage: `'markedBalls' array missing`,
    });
  }

  if (!markedBalls.length) {
    throw createError({
      statusCode: 400,
      statusMessage: `'markedBalls' array can not be empty`,
    });
  }

  const database = getDatabase();
  const roomPath = `/roomData/${roomId}`;
  const matchPath = `/roomData/${roomId}/matchCurrent`;

  /**
   * Get room data
   */
  const roomRef = database.ref(`${roomPath}/`);
  const roomData = await roomRef
    .once("value")
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .catch(() => null);

  if (!roomData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Room do not exists",
    });
  }

  // Get the match
  const theMatch = roomData.matchCurrent;

  /** Check if a match exist */
  if (!theMatch) {
    throw createError({
      statusCode: 400,
      statusMessage: "Match do not exists",
    });
  }

  const matchDrawTimeline = roomData.matchCurrent?.matchDrawTimeline
    ? _merge([], Object.values(roomData.matchCurrent.matchDrawTimeline))
    : [];

  const premadeDraws = roomData.matchCurrent?.matchDrawNumbers
    ? _merge([], roomData.matchCurrent.matchDrawNumbers)
    : [];

  const maxDrawLength = premadeDraws.length;

  const timelineLength =
    matchDrawTimeline.length > maxDrawLength
      ? maxDrawLength
      : matchDrawTimeline.length;

  const theBalls = premadeDraws.slice(0, timelineLength);

  if (!theBalls.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No balls have been drawn",
    });
  }

  /** filter markedBalls to exclude any number not in "theBalls" */
  const filteredMarkedBalls = markedBalls.filter((number) =>
    theBalls.includes(number),
  );

  /**
   * Check if the filtered balls still has some length
   */
  if (!filteredMarkedBalls.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Filtered 'markedBalls' resulted in an empty array",
      data: {
        filteredMarkedBalls,
      },
    });
  }

  // return { markedBalls, theBalls, filteredMarkedBalls };

  const theCards = roomData.matchCurrent.matchCards;
  /** Check if there are cards in the match */
  if (!theCards) {
    throw createError({
      statusCode: 400,
      statusMessage: "There are no cards in this match",
    });
  }
  // return theCards;

  /** Filter current user cards */
  const userCards = Object.keys(theCards).filter(
    (key) => theCards[key] === userID,
  );

  /** Check if user has cards */
  if (!userCards.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "User has no cards",
    });
  }

  // return userCards;

  /** Check if the card belings to this user */
  if (!userCards.includes(cardSerial)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Either cardSerial is invalid or does not belong to this user",
      data: {
        cardSerial,
      },
    });
  }

  const cardUnserialized = bingoCardUnserialize(cardSerial);
  const thePatterns = roomData.matchCurrent.matchPatterns;
  // console.log("thePatterns", thePatterns);

  // return thePatterns;

  const finalPatterns = [];
  const normalPatterns = [];

  const allValidPatterns = bingoPatterns();
  // console.log(allValidPatterns);

  const validPatternNames = Object.keys(allValidPatterns);
  // console.log(validPatternNames);

  for (const [patternName, patternConfig] of Object.entries(thePatterns)) {
    // console.log({ patternName, patternConfig });
    const patternIsFinal = patternConfig.patternIsFinal || false;

    /** Verify pattern name is valid */
    if (!patternName || !validPatternNames.includes(patternName)) {
      // console.log("invalid pattern", patternName);
      continue;
    }

    const patternSetup = _merge(
      { patternName, patternWinners: null },
      patternConfig,
      allValidPatterns[patternName],
    );

    // console.log(patternSetup);

    /** find if the pattern is final */
    if (patternIsFinal) {
      // console.log("patternIsFinal", patternIsFinal, patternSetup);
      /**
       * If a final pattern already has a winner
       * there is no need to continue
       */
      if (patternSetup.patternWinners) {
        throw createError({
          statusCode: 409,
          statusMessage: "There is already a final winner",
          data: {
            patternName,
            ...patternConfig,
          },
        });
      }

      /** otherwise */
      finalPatterns.push(patternSetup);
    } else {
      // console.log("patternIsFinal", patternIsFinal, patternSetup);
      normalPatterns.push(patternSetup);
    }
  }
  // console.log("cardUnserialized", cardUnserialized);
  // console.log(event.context.user);
  // console.log();

  const winnerInfo = { userID, displayName, cardSerial };

  /**
   * Test NON final patterns first
   */
  for (let index = 0; index < normalPatterns.length; index++) {
    const patternSetup = normalPatterns[index];
    const passedTheTest = patternSetup.patternTest(
      cardUnserialized,
      filteredMarkedBalls,
    );
    if (!passedTheTest) continue;

    /**
     * Check if this pattern has winners
     * and if more winners are allowed
     * */
    if (patternSetup.patternWinners) {
      continue;
    }

    /** Add the winner to the match patterns */
    // console.log("passedTheTest", patternSetup);
    const { patternName } = patternSetup;
    await database
      .ref(`${matchPath}/matchPatterns/${patternName}/patternWinners`)
      .push(winnerInfo);
    await database
      .ref(`${matchPath}/matchWinners/${patternName}/`)
      .push(winnerInfo);
  }

  /**
   * Test FINAL patterns
   */
  for (let index = 0; index < finalPatterns.length; index++) {
    const patternSetup = finalPatterns[index];
    const passedTheTest = patternSetup.patternTest(
      cardUnserialized,
      filteredMarkedBalls,
    );
    if (!passedTheTest) continue;

    /** Add the winner to the match patterns */
    // console.log("passedTheTest", patternSetup);
    const { patternName } = patternSetup;
    await database
      .ref(`${matchPath}/matchPatterns/${patternName}/patternWinners`)
      .push(winnerInfo);
    await database
      .ref(`${matchPath}/matchWinners/${patternName}/`)
      .push(winnerInfo);
  }

  return true;
});
