import styles from "./GlobalLayout.module.css";
import { Outlet, useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { useEffect } from "react";
import type { UserType } from "../../global/types";
import { useAuthStore } from "../../providers/AuthStoreProvider";

const GlobalLayout = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const user = await authStore.api
        .get("/auth/me")
        .then((res) => res.data.data as UserType)
        .catch((e) => console.error(e));
      if (!user) return;
      authStore.setUser(user);
      navigate(`/dashboard`);
    };
    redirectIfLoggedIn();
  }, [authStore.loggedIn]);

  return (
    <div className={styles.main}>
      <Header />
      <Outlet />
    </div>
  );
};

export default GlobalLayout;
