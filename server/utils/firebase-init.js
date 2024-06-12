import {
  // applicationDefault,
  initializeApp,
  getApps,
  getApp,
  cert,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

// import serviceAccount from "~/bingaso-lab-firebase-adminsdk-v4ib7-e1a5099580.json";

export const useFirebaseServer = () => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const database = getDatabase(app);
  return {
    app,
    auth,
    database,
  };
};

export const useFirebaseApp = () => {
  // console.log("SERVER > utils > firebase --> useFirebaseApp");
  let firebaseApp;

  // console.log("user-middleware > has userCookie", userCookie);
  if (getApps().length === 0) {
    if (typeof window !== "undefined") {
      throw new TypeError("NO SECRETS ON CLIENT!");
    }
    // firebaseApp = initializeApp(serviceAccount);
    const databaseURL = useRuntimeConfig().public.databaseURL;
    // const private_key = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);
    // const { privateKey } = JSON.parse(
    //   process.env.FIREBASE_PRIVATE_KEY_OBJ || "{ privateKey: null }",
    // );
    // console.log("privateKey", privateKey);

    firebaseApp = initializeApp({
      // credential: cert(serviceAccount),
      credential: cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: privateKey,
        // private_key: process.env.FIREBASE_PRIVATE_KEY,
      }),
      databaseURL,
    });
    console.log("SERVER > utils > useFirebaseApp > App initialized");
  } else {
    console.log("SERVER > utils > useFirebaseApp > App found");
    firebaseApp = getApp();
  }

  // console.log("useFirebaseApp", firebaseApp);
  return firebaseApp;
};

export const useFirebaseAuth = () => {
  // console.log("SERVER > utils > firebase --> useFirebaseAuth");
  const app = useFirebaseApp();
  return getAuth(app);
};

export const useFirebaseDB = () => {
  // console.log("SERVER > utils > firebase --> useFirebaseDB");
  const app = useFirebaseApp();
  return getDatabase(app);
};
