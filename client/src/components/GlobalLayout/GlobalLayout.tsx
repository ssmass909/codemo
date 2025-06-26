import styles from "./GlobalLayout.module.css";
import { Outlet, useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { useEffect } from "react";
import { useAuthStore } from "../../providers/AuthStoreProvider";

const GlobalLayout = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();

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
