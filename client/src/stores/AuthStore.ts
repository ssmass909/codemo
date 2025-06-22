import axios, { type AxiosInstance } from "axios";
import { makeObservable, action, observable } from "mobx";
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
        if (error.response && error.response.status === 401) {
          try {
            const refreshResponse = await this.api.post("/auth/refresh");
            const newToken = refreshResponse.data.data?.authToken;
            if (newToken) {
              this.setAuthToken(newToken);
              error.config.headers["authorization"] = `Bearer ${newToken}`;
              console.log(error.config);
              return this.api(error.config);
            } else {
              this.setAuthToken(null);
            }
          } catch (refreshError) {
            this.setAuthToken(null);
            // Optionally, redirect to login or show a message
          }
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
    });
  }

  setAuthToken(newValue: string | null) {
    this.authToken = newValue;
  }

  setUser(newValue: UserType | null) {
    this.user = newValue;
  }
}

export default AuthStore;
