// import {
//   // applicationDefault,
//   initializeApp,
//   getApps,
//   getApp,
//   cert,
// } from "firebase-admin/app";

import { getCookie } from "h3";

export default defineEventHandler(async (event) => {
  const cookieOptions = useRuntimeConfig().public.firebaseAuthCookie;
  const userCookie = getCookie(event, cookieOptions.name);

  // const firebaseApp = useFirebaseApp();
  // const firebaseAuth = getAuth(firebaseApp);
  const firebaseAuth = useFirebaseAuth();

  event.context.token = userCookie;
  event.context.authenticated = false;
  event.context.session = null;
  event.context.userID = null;
  event.context.user = null;

  if (userCookie) {
    try {
      // const session = await firebaseAuth.verifySessionCookie(userCookie, true);
      const session = await firebaseAuth.verifyIdToken(userCookie);
      // console.log(
      //   "SERVER > middleware > user-middleware > firebaseAuth.verifyIdToken > session",
      //   session,
      // );
      // console.log(
      //   "SERVER > middleware > user-middleware > verifyIdToken SUCCESS",
      //   session,
      // );
      event.context.authenticated = true;
      event.context.session = session;
      event.context.userID = session.user_id;
    } catch (e) {
      console.log(
        "SERVER > middleware > user-middleware > verifyIdToken ERROR",
        e,
      );
      // res.statusCode = 400;
      // res.end(
      //   "You must be signed in to view the protected content on this page.",
      // );
    }

    // const firebaseUser = useFirebaseUser();
    // req.user = firebaseUser.value;
  }

  if (event.context.userID) {
    const user = await firebaseAuth.getUser(event.context.userID);
    event.context.user = user;
    // console.log("SERVER > middleware > user-middleware > user", user);
  }

  // if (!req.user && req.url?.includes(`/firebase/`) &&)
});
