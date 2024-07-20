import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  expiresIn: number | null;
  setAuthUser: (session: Session) => void;
  clearAuthUser: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      expiresAt: null,
      expiresIn: null,
      setAuthUser: (session) =>
        set({
          token: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
          expiresIn: session.expires_in,
        }),
      clearAuthUser: () =>
        set({
          token: null,
          refreshToken: null,
          expiresAt: null,
          expiresIn: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
