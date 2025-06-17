import styles from "./GlobalLayout.module.css";
import { Outlet } from "react-router";
import Header from "../../components/Header/Header";

const GlobalLayout = () => {
  return (
    <div className={styles.main}>
      <Header />
      <Outlet />
    </div>
  );
};

export default GlobalLayout;
