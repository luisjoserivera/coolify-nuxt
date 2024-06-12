export default defineEventHandler((event) => {
  const user = event.context.user;
  console.log("me user", user);
  return (
    user || {
      msg: "User is signed out",
      context: event.context,
      // database: useFirebaseDB(),
    }
  );
});
