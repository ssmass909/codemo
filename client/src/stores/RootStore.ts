import { makeObservable } from "mobx";
import type AuthStore from "./AuthStore";
import type HeaderStore from "./HeaderStore";

class RootStore {
  authStore: AuthStore | null = null;
  headerStore: HeaderStore | null = null;

  constructor() {
    makeObservable(this, {});
  }
}

export default RootStore;
