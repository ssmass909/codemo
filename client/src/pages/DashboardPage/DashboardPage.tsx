import type { RouteObject } from "react-router";
import styles from "./DashboardPage.module.css";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";

const DashboardPage = () => {
  return <div className={styles.main}>hello</div>;
};

export const DashboardPageRouteObject: RouteObject = {
  element: (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
  path: "/dashboard",
};

export default DashboardPage;
