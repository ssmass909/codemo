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

    // --- Begin refresh lock implementation ---
    let isRefreshing = false;
    let refreshPromise: Promise<string | null> | null = null;
    let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void; config: any }> = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          if (token) prom.config.headers["authorization"] = `Bearer ${token}`;
          prom.resolve(this.api(prom.config));
        }
      });
      failedQueue = [];
    };

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

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: error.config });
          });
        }

        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshResponse = await this.api.post("/auth/refresh");
            const newToken = refreshResponse.data.data?.authToken;
            if (newToken) {
              authStore.setAuthToken(newToken);
              processQueue(null, newToken);
              return newToken;
            } else {
              authStore.setAuthToken(null);
              processQueue(new Error("No new token returned"), null);
              return null;
            }
          } catch (refreshError) {
            authStore.setAuthToken(null);
            processQueue(refreshError, null);
            return null;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();

        return refreshPromise.then((newToken) => {
          if (newToken && error.config) {
            error.config.headers["authorization"] = `Bearer ${newToken}`;
            return this.api(error.config);
          }
          return Promise.reject(error);
        });
      }
    );
    // --- End refresh lock implementation ---

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
