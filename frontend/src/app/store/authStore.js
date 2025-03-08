import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin, register as apiRegister } from "../api"; // Ensure API functions exist

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (username, password) => {
        try {
          const response = await apiLogin(username, password);
          const token = response.data.access_token;
          set({user: username, token: token});
        } catch (error) {
          throw new Error(error.response?.data?.detail || "An error occurred during login");
        }
      },

      register: async (username, password) => {
        try {
          const response = await apiRegister(username, password);
          const token = response.data.access_token;
          set({user: username, token: token});
        } catch (error) {
          throw new Error(error.response?.data?.detail || "An error occurred during register");
        }
      },

      logout: () => {
        set({user: null, token: null});
      },

      getToken: () => get().token,

      getUser: () => get().user,
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
