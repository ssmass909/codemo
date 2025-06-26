import styles from "./GlobalLayout.module.css";
import { Outlet, useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { useEffect } from "react";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { useHeaderStore } from "../../providers/HeaderStoreProvider";
import { useRootStore } from "../../providers/RootStoreProvider";

const GlobalLayout = () => {
  const navigate = useNavigate();
  const rootStore = useRootStore();
  const authStore = useAuthStore();
  const headerStore = useHeaderStore();

  useEffect(() => {
    rootStore.setHeaderStore(headerStore);
    rootStore.setAuthStore(authStore);
  }, []);

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const user = await authStore.fetchUserFlow();
      if (!user) return;
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
