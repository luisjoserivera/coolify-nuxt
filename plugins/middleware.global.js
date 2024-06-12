export default defineNuxtPlugin(async () => {
  /**
   *
   */
  addRouteMiddleware("auth", () => {
    // const { $auth } = useNuxtApp();
    // console.log("addRouteMiddleware > currentUser", $auth?.currentUser);
    // if (!$auth?.currentUser?.uid) {
    //   return navigateTo("/");
    // }
    const firebaseUser = useFirebaseUser();
    console.log("addRouteMiddleware > currentUser", firebaseUser.value);
    if (!firebaseUser.value) {
      return navigateTo("/");
    }
  });
});
