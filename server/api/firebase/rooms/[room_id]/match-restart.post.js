import { getDatabase } from "firebase-admin/database";

export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, "room_id");

  if (roomId !== event.context.userID) {
    throw createError({
      statusCode: 403,
      statusMessage: "You are not the room owner",
    });
  }
  // console.log(`SERVER > /api/firebase/rooms/${roomId}/match-restart/`);

  const database = getDatabase();
  // console.log("Do we have a database", database);
  const matchRef = database.ref(`/roomData/${roomId}/matchCurrent/`);

  const [matchData, matchError] = await matchRef
    .once("value")
    .then((snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : null;
      return [data, null];
    })
    .catch((error) => [null, error]);

  if (matchError) {
    throw matchError;
  }

  const updates = {};
  // updates.matchBalls = null;
  updates.matchDrawTimeline = null;
  updates.matchWinners = null;

  for (const patternName of Object.keys(matchData.matchPatterns)) {
    // console.log("patternName", patternName);
    updates[`matchPatterns/${patternName}/patternWinners`] = null;
  }

  try {
    await matchRef.update(updates);
  } catch (error) {
    console.log("error", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to reset balls",
    });
  }

  return updates;
});
