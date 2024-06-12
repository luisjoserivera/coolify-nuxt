import { getDatabase } from "firebase-admin/database";

export default defineEventHandler(async (event) => {
  const userID = event.context.userID;
  const roomId = getRouterParam(event, "room_id");

  if (!userID) {
    throw createError({
      statusCode: 401,
      statusMessage: "You are not authenticated",
    });
  }

  const { cardSerial } = await readBody(event);
  // return cardSerial;

  const database = getDatabase();
  const cardRef = database.ref(
    `/roomData/${roomId}/matchCurrent/matchCards/${cardSerial}`,
  );

  const cardOwner = await cardRef
    .once("value")
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .catch(() => null);

  if (!cardOwner) {
    throw createError({
      statusCode: 404,
      statusMessage: `No data available at this path.`,
    });
  }

  if (userID !== cardOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: `You are not the card owner.`,
    });
  }

  try {
    await cardRef.remove();
    return "bye bye card";
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: `Something went wrong`,
    });
  }
});
