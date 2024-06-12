// import { getApp } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import { setTimeout } from "node:timers/promises";
import { getDatabase } from "firebase-admin/database";
import _difference from "lodash/difference.js";
import _random from "lodash/random.js";
import _uniq from "lodash/uniq.js";

export default defineEventHandler(async (event) => {
  // return "hello";
  // const firebaseUser = useFirebaseUser();
  // if (firebaseUser.value) return firebaseUser.value;
  // return firebaseUser.value || "User is signed out";

  // const app = getDatabase();
  // console.log("Do we have an app", app);
  const roomId = getRouterParam(event, "room_id");

  if (roomId !== event.context.userID) {
    throw createError({
      statusCode: 403,
      statusMessage: "You are not the room owner",
    });
  }
  // await setTimeout(1000 * 10);

  const database = getDatabase();
  // console.log("Do we have a database", database);
  const matchBallsListRef = database.ref(
    `/roomData/${roomId}/matchCurrent/matchBalls`,
  );

  let matchBalls = null;
  await matchBallsListRef.once("value").then((snapshot) => {
    // snapshot.forEach((childSnapshot) => {
    //   // Here, the key would be the userId of each connected user
    //   ballsArray.push(childSnapshot.val());
    //   // ballsArray.push(childSnapshot.val());
    // });
    if (snapshot.exists()) {
      const result = snapshot.val();
      if (result) matchBalls = _uniq(Object.values(result));
    }
  });

  // console.log("SERVER: matchBalls", matchBalls);

  const posibilities = Array.from({ length: 75 }, (_, i) => i + 1);
  const available = _difference(posibilities, matchBalls);
  const index = _random(0, available.length - 1);
  const ball = available[index];
  await matchBallsListRef.push(ball);

  return {
    ball,
    // matchBalls,
    // roomId,
  };
  // return "you made it here";

  // // @ts-ignore
  // const user = event.req.user;
  // // console.log("me user", user);
  // return user || "User is signed out";

  // // @ts-ignore
  // const token = event.req.token;
  // // console.log("me token", token);
  // return token || "User is signed out";
  // // return currentUser;
});
