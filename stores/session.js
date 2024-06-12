import { defineStore } from "pinia";

export const useSessionStore = defineStore({
  id: "session-store",
  state: () => {
    return {
      user: null,
    };
  },
  actions: {
    setUser(user = null) {
      this.user = user;
    },
  },
});
