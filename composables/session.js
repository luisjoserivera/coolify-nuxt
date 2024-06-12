import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  updateProfile,
  linkWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
// import { useSessionStore } from "@/store/session";

import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
/**
 *
 */
export const useFirebaseUser = () => useState("firebaseUser", () => null);
/**
 *
 */
export const useFirebaseToken = () => useState("firebaseToken", () => null);
/**
 *
 */
// export const useAccount = () => useState("accountData", () => null);

/**
 * Server: Set to TRUE if no token present or after token verification.
 * Client: Set to TRUE after verifying there is actually no user logged in.
 */
export const userStatusConfirmed = () =>
  useState("userStatusConfirmed", () => false);

// export const initUser = async () => {
//   const auth = getAuth();
//   const firebaseUser = useFirebaseUser();
//   // console.log("initUser > auth.currentUser", auth.currentUser);
//   // firebaseUser.value = auth.currentUser;

//   const pinia = usePinia();
//   // console.log("pinia", pinia);

//   const sessionStore = useSessionStore(pinia);
//   console.log("sessionStore", sessionStore);

//   auth.onIdTokenChanged(async (user) => {
//     console.log("PLUGIN: onIdTokenChanged...", user);
//     if (user) {
//       // if (!user.displayName) {
//       //   console.log("onIdTokenChanged NONAME");
//       // }
//       const token = await user.getIdToken();
//       // console.log("token", token);
//       setServerSession(token);
//       // firebaseUser.value = { ...user };
//       firebaseUser.value = formatUser(user);

//       sessionStore.setUser(formatUser(user));
//     } else {
//       setServerSession("");
//       firebaseUser.value = null;

//       sessionStore.setUser(null);

//       // signInAnonymously(auth)
//       //   .then(() => {
//       //     console.log("signInAnonymously SUCCESS");
//       //   })
//       //   .catch((error) => {
//       //     console.log("signInAnonymously ERROR", error);
//       //   });
//     }
//   });
// };

/**
 *
 */
export async function useGenericName() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const displayName = await $fetch("/api/generate-displayname");
    console.log("SET GENERIC NAME", displayName, user);
    await updateProfile(user, { displayName });
    await auth.currentUser.reload();
    // User is signed in, you can access the user's properties
  }
}

/**
 *
 */
export const useAnonymousSignIn = async () => {
  console.log("useAnonymousSignIn");
  const customToken = await $fetch("/api/sign-in-anonymously", {
    method: "POST",
  });
  // const auth = await getAuth().signInWithCustomToken();
  await signInWithCustomToken(getAuth(), customToken);
  // const [data, error] = await sureThing(signInAnonymously(auth));

  // if (error) {
  //   console.log(error);
  // }

  // if (!user.displayName) {
  //   console.log("No displayName");
  //   const displayName = await $fetch("/api/generate-displayname");
  //   await updateProfile(data.user, { displayName });
  //   await auth.currentUser.reload();
  //   const firebaseUser = useFirebaseUser();
  //   firebaseUser.value = { ...auth.currentUser };
  // }

  // useGenericName();

  // console.log("signInAnonymously > DATA", data);
  // console.log("signInAnonymously > TOKEN", data.user.accessToken);
};

/**
 *
 */
export const useSignOut = async () => {
  navigateTo("/");
  const auth = getAuth();
  const result = await auth.signOut();
  return result;
};

/**
 *
 */
export const useSignInModal = async () => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log("signInSuccessWithAuthResult", authResult, redirectUrl);
        return false;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        // document.getElementById("loader").style.display = "none";
      },
    },
    // signInSuccessUrl: "/",
    signInSuccessUrl: "/",
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    // signInSuccessUrl: null,
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // firebase.auth.AnonymousAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: "/terms-of-service",
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
      window.location.assign("/privacy-policy");
    },
  };

  // Initialize the FirebaseUI Widget using Firebase.
  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(getAuth());
  // The start method will wait until the DOM is loaded.
  ui.start("#firebaseui-auth-container", uiConfig);
};

/**
 *
 */

export const useSignInPopup = async () => {
  try {
    // Step 1: User tries to sign in using Google.
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());
    console.log(result);
  } catch (error) {
    // Step 2: User's email already exists.
    if (error.code === "auth/account-exists-with-different-credential") {
      // The pending Google credential.
      const pendingCred = error.credential;
      console.log("pendingCred", pendingCred);

      // Step 3: Save the pending credential in temporary storage,

      // Step 4: Let the user know that they already have an account
      // but with a different provider, and let them choose another
      // sign-in method.
    }
  }

  // ...

  // try {
  //   // Step 5: Sign the user in using their chosen method.
  //   const result = await signInWithPopup(getAuth(), userSelectedProvider);

  //   // Step 6: Link to the Google credential.
  //   // TODO: implement `retrievePendingCred` for your app.
  //   const pendingCred = retrievePendingCred();

  //   if (pendingCred !== null) {
  //     // As you have access to the pending credential, you can directly call the
  //     // link method.
  //     const user = await linkWithCredential(result.user, pendingCred);
  //   }

  //   // Step 7: Continue to app.
  // } catch (error) {
  //   // ...
  // }
};
