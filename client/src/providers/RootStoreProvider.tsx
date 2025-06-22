import { createContext, useContext, type ReactNode } from "react";
import RootStore from "../stores/RootStore";

const RootStoreContext = createContext<null | RootStore>(null);

interface RootStoreProviderProps {
  children: ReactNode;
}
export const RootStoreProvider = ({ children }: RootStoreProviderProps) => {
  const rootStore = new RootStore();
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
};

export const useRootStore = () => {
  const rootStore = useContext(RootStoreContext);
  if (!rootStore) throw new Error("use this hook under its provider");

  return rootStore;
};
