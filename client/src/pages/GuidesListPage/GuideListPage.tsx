import styles from "./GuideListPage.module.css";
import type { RouteObject } from "react-router";

const GuideListPage = () => {
  return <div className={styles.main}>GuideListPage</div>;
};

export default GuideListPage;
export const GuideListPageRouteObject: RouteObject = { path: "guides", Component: GuideListPage };
