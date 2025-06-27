import { type AxiosInstance } from "axios";
import { makeObservable, action, observable, computed, flowResult, flow } from "mobx";
import type { UserType } from "../global/types";

class AuthStore {
  authToken: string | null = null;
  user: UserType | null = null;
  api: AxiosInstance | null = null;

  constructor() {
    makeObservable(this, {
      authToken: observable,
      user: observable,
      setAuthToken: action,
      setUser: action,
      loggedIn: computed,
      canFetch: computed,
      fetchUser: flow,
    });
  }

  setAuthToken(newValue: string | null) {
    this.authToken = newValue;
  }

  setUser(newValue: UserType | null) {
    this.user = newValue;
  }

  *fetchUser(): Generator<Promise<UserType | null>, UserType | null, UserType | null> {
    if (!this.canFetch) return null;
    const result = yield this.api!.get("/auth/me")
      .then((res) => {
        const user = res.data.data as UserType;
        this.setUser(user);
        return user;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
    return result;
  }

  async fetchUserFlow(): Promise<UserType | null> {
    const result = await flowResult(this.fetchUser());
    return result;
  }

  setApi(newValue: AxiosInstance) {
    this.api = newValue;
  }

  get canFetch() {
    return this.api !== null;
  }

  get loggedIn() {
    return this.user !== null;
  }
}

export default AuthStore;
