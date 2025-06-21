import { createContext, useContext, type ReactNode } from "react";
import AuthStore from "../stores/AuthStore";

const AuthStoreContext = createContext<null | AuthStore>(null);

interface AuthStoreProviderProps {
  children: ReactNode;
}
export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
  const authStore = new AuthStore();
  return <AuthStoreContext.Provider value={authStore}>{children}</AuthStoreContext.Provider>;
};

export const useAuthStore = () => {
  const authStore = useContext(AuthStoreContext);
  if (!authStore) throw new Error("use this hook under its provider");

  return authStore;
};
