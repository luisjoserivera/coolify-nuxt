import { getCookie } from "h3";

export default defineEventHandler(async (event) => {
  const cookieOptions = useRuntimeConfig().public.firebaseAuthCookie;
  const userCookie = getCookie(event, cookieOptions.name);
  return userCookie || "No session";
});
