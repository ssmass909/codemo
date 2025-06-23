import type { RouteObject } from "react-router";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  return <div className={styles.main}>hello</div>;
};

export const DashboardPageRouteObject: RouteObject = { Component: DashboardPage, path: "/dashboard" };

export default DashboardPage;
