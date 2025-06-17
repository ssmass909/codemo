import styles from "./GuideDetailsPage.module.css";
import type { RouteObject } from "react-router";

const GuideDetailsPage = () => {
  return <div className={styles.main}>GuideDetailsPage</div>;
};

export default GuideDetailsPage;
export const GuideDetailsPageRouteObject: RouteObject = { path: "guide/:id", Component: GuideDetailsPage };
