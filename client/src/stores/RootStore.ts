import { makeObservable, observable } from "mobx";
import type AuthStore from "./AuthStore";
import type HeaderStore from "./HeaderStore";
import type { AxiosInstance } from "axios";
import axios, { AxiosError } from "axios";

class RootStore {
  authStore: AuthStore | null = null;
  headerStore: HeaderStore | null = null;
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_SERVER_URL,
      withCredentials: true,
    });
    makeObservable(this);
  }

  setAuthStore(authStore: AuthStore) {
    this.authStore = authStore;
    authStore.setApi(this.api);
    this.api.interceptors.response.use(
      async (response) => {
        const authToken = response.data.data?.authToken;
        if (authToken) authStore.setAuthToken(authToken);
        return response;
      },
      async (error) => {
        if (
          !(error instanceof AxiosError) ||
          !error.config ||
          (error.response && (!error.response || error.response.status !== 401))
        ) {
          return Promise.reject(error);
        }

        try {
          const refreshResponse = await this.api.post("/auth/refresh");
          const newToken = refreshResponse.data.data?.authToken;

          if (newToken) {
            authStore.setAuthToken(newToken);
            error.config.headers["authorization"] = `Bearer ${newToken}`;
            return this.api(error.config);
          } else {
            authStore.setAuthToken(null);
          }
        } catch (refreshError) {
          authStore.setAuthToken(null);
        }
        return Promise.reject(error);
      }
    );

    this.api.interceptors.request.use(
      (config) => {
        if (authStore.authToken) {
          config.headers.authorization = `Bearer ${authStore.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  setHeaderStore(newValue: HeaderStore) {
    this.headerStore = newValue;
  }
}

export default RootStore;
