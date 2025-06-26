import axios, { AxiosError, type AxiosInstance } from "axios";
import { makeObservable, action, observable, computed, flowResult } from "mobx";
import type { UserType } from "../global/types";

class AuthStore {
  authToken: string | null = null;
  user: UserType | null = null;
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_SERVER_URL,
      withCredentials: true,
    });

    this.api.interceptors.response.use(
      async (response) => {
        const authToken = response.data.data?.authToken;
        if (authToken) this.setAuthToken(authToken);
        return response;
      },
      async (error) => {
        if (!(error instanceof AxiosError) || !error.config || !error.response || error.response.status !== 401) {
          return Promise.reject(error);
        }

        try {
          const refreshResponse = await this.api.post("/auth/refresh");
          const newToken = refreshResponse.data.data?.authToken;

          if (newToken) {
            this.setAuthToken(newToken);
            error.config.headers["authorization"] = `Bearer ${newToken}`;
            return this.api(error.config);
          } else {
            this.setAuthToken(null);
          }
        } catch (refreshError) {
          this.setAuthToken(null);
        }
        return Promise.reject(error);
      }
    );

    this.api.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    makeObservable(this, {
      authToken: observable,
      user: observable,
      setAuthToken: action,
      setUser: action,
      loggedIn: computed,
    });
  }

  setAuthToken(newValue: string | null) {
    this.authToken = newValue;
  }

  setUser(newValue: UserType | null) {
    this.user = newValue;
  }

  *fetchUser(): Generator<Promise<UserType | null>, Promise<UserType | null>, UserType | null> {
    const result = yield this.api
      .get("/auth/me")
      .then((res) => {
        const user = res.data.data as UserType;
        this.setUser(user);
        return user;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
    return Promise.resolve(result);
  }

  async fetchUserFlow(): Promise<UserType | null> {
    const result = flowResult<UserType | null>(await this.fetchUser().next().value);
    return result;
  }

  get loggedIn() {
    return this.user !== null;
  }
}

export default AuthStore;
