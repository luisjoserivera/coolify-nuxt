import { setCookie } from "h3";
import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  const displayName = randomNameGenerator();
  const [newUser, error] = await sureThing(
    getAuth().createUser({ displayName }),
  );
  if (error) {
    throw createError(error);
  }
  // return newUser;
  const generatedToken = await getAuth().createCustomToken(newUser.uid);
  return generatedToken;
  // return
  //   .then(async (customToken) => {
  //     console.log("customToken", customToken);
  //     return await getAuth().verifyIdToken(customToken);
  //   });
});
