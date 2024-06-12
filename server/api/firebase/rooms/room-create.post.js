// import _pick from "lodash/pick";
import _defaultTo from "lodash/defaultTo.js";
import { getDatabase } from "firebase-admin/database";

export default defineEventHandler(async (event) => {
  const currentUser = event.context.user;
  const userID = event.context.userID;

  const database = getDatabase();
  // const roomsRef = database.ref(`/roomData`);
  const myRoomRef = database.ref(`/roomData/${userID}`);

  // const roomId = getRouterParam(event, "room_id");
  // const roomId = eve

  // console.log("API > user", event.context.user);

  const body = await readBody(event);
  const { uid: ownerId, displayName: ownerName } = currentUser;
  // const roomOwner = _pick(currentUser, ["uid", "displayName"]);

  const roomConfig = {
    maxUsers: _defaultTo(body.maxUsers, 8),
    maxCards: _defaultTo(body.maxCards, 4),
  };
  const { maxUsers: configMaxUsers, maxCards: configMaxCards } = roomConfig;

  const newRoom = {
    ownerId,
    ownerName,
    configMaxUsers,
    configMaxCards,
    // roomConfig,
  };

  try {
    // const response = await roomsRef.push(newRoom);
    const response = await myRoomRef.set(newRoom);
    console.log("API > create-room > response", response);
  } catch (error) {
    console.log("API > create-room > error", error);
  }

  // return {
  //   // roomId,
  //   body,
  //   // roomConfig,
  //   // roomOwner,
  //   user: event.context.user,
  //   newRoom,
  // };
  return newRoom;
});
