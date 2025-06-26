import { createContext, useContext, type ReactNode } from "react";
import HeaderStore from "../stores/HeaderStore";

const HeaderStoreContext = createContext<null | HeaderStore>(null);

interface HeaderStoreProviderProps {
  children: ReactNode;
}
export const HeaderStoreProvider = ({ children }: HeaderStoreProviderProps) => {
  const headerStore = new HeaderStore();
  return <HeaderStoreContext.Provider value={headerStore}>{children}</HeaderStoreContext.Provider>;
};

export const useHeaderStore = () => {
  const headerStore = useContext(HeaderStoreContext);
  if (!headerStore) throw new Error("use this hook under its provider");

  return headerStore;
};
