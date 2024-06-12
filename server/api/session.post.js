import { setCookie } from "h3";
import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const cookieOptions = useRuntimeConfig().public.firebaseAuthCookie;

  // console.log(cookieOptions);
  if (body.token) {
    // First verify the token
    const [decodedToken, verificationError] = await sureThing(
      // getAuth().verifyIdToken("basura"),
      getAuth().verifyIdToken(body.token),
    );

    if (verificationError) {
      return verificationError;
    }

    // console.log("decodedToken", decodedToken);

    // Set custom claims
    await getAuth()
      .setCustomUserClaims(decodedToken.uid, {
        premiumAccount: true,
      })
      .then((something) => {
        console.log("something", something);
      });

    setCookie(event, cookieOptions.name, body.token, {
      // domain: cookieOptions.domain,
      // path: cookieOptions.path,
      maxAge: cookieOptions.lifetime ?? 0,
      sameSite: cookieOptions.sameSite,
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return "auth cookie set";

    // // Only process if the user just signed in in the last 5 minutes.
    // if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
    //   // const expiresIn = cookieOptions.lifetime
    //   //   ? cookieOptions.lifetime * 1000
    //   //   : 0;
    //   // Create session cookie and set it.
    //   // await getAuth()
    //   //   .createSessionCookie(body.token, { expiresIn })
    //   //   .then((sessionCookie) => {
    //   //     setCookie(event, cookieOptions.name, sessionCookie, {
    //   //       // domain: cookieOptions.domain,
    //   //       // path: cookieOptions.path,
    //   //       maxAge: cookieOptions.lifetime ?? 0,
    //   //       sameSite: cookieOptions.sameSite,
    //   //       // httpOnly: true,
    //   //       secure: process.env.NODE_ENV === "production",
    //   //     });
    //   //   });

    //   setCookie(event, cookieOptions.name, body.token, {
    //     // domain: cookieOptions.domain,
    //     // path: cookieOptions.path,
    //     maxAge: cookieOptions.lifetime ?? 0,
    //     sameSite: cookieOptions.sameSite,
    //     // httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //   });
    //   return "auth cookie set";
    // }

    // throw createError({
    //   statusCode: 401,
    //   statusMessage: "Recent sign in required!",
    // });

    // setCookie(event, cookieOptions.name, body.token, {
    //   domain: cookieOptions.domain,
    //   maxAge: cookieOptions.lifetime ?? 0,
    //   path: cookieOptions.path,
    //   sameSite: cookieOptions.sameSite,
    // });

    // return "auth cookie set";
  }

  // If no token is present clear cookie

  setCookie(event, cookieOptions.name, "", {
    maxAge: -1,
    path: cookieOptions.path,
  });
  return "auth cookie cleared";
});
