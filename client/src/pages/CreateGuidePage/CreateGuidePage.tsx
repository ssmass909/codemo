import type { RouteObject } from "react-router";
import styles from "./CreateGuidePage.module.css";

const CreateGuidePage = () => {
  return <div className={styles.main}>hi</div>;
};

export const CreateGuidePageRouteObject: RouteObject = { path: "/new-guide", Component: CreateGuidePage };

export default CreateGuidePage;
