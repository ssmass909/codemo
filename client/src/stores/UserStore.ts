import { action, flow, flowResult, makeObservable, observable } from "mobx";
import type { UserType } from "../global/types";
import type AuthStore from "./AuthStore";

class UserPageStore {
  currentUser: UserType | null = null;
  id: string;
  authStore: AuthStore;
  canEdit = false;

  constructor(id: string, authStore: AuthStore) {
    this.id = id;
    this.authStore = authStore;
    makeObservable(this, {
      currentUser: observable,
      canEdit: observable,
      setCurrentUser: action,
      setCanEdit: action,
      getCurrentUserFromApi: flow,
    });
  }

  setCurrentUser = (newValue: UserType | null) => {
    this.currentUser = newValue;
  };

  setCanEdit(newValue: boolean) {
    this.canEdit = newValue;
  }

  *getCurrentUserFromApi() {
    if (!this.authStore.api) return;
    let loading = true;
    let error = null;

    try {
      const result: UserType = yield this.authStore.api.get(`/users/${this.id}`);
      this.currentUser = result;
    } catch (e) {
      error = e;
    } finally {
      loading = false;
    }
  }

  getCurrentUserFromApiFlow() {
    return flowResult(this.getCurrentUserFromApi());
  }
}

export default UserPageStore;
