import { type RouteObject } from "react-router";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return <div className={styles.main}>ayo wassup</div>;
};

export default LandingPage;
export const LandingPageRouteObject: RouteObject = { Component: LandingPage, path: "/" };
