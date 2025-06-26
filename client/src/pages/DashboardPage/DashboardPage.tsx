import { Link, type RouteObject } from "react-router";
import styles from "./DashboardPage.module.css";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import GuideCard from "../../components/GuideCard/GuideCard";
import DashboardPageStore from "../../stores/DashboardPageStore";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { useRootStore } from "../../providers/RootStoreProvider";
import { useEffect } from "react";

const DashboardPage = () => {
  const store = new DashboardPageStore();
  const authStore = useAuthStore();
  const rootStore = useRootStore();

  useEffect(() => {
    store.setApi(rootStore.api);
    if (authStore.user?._id) store.fetchGuides(authStore.user?._id);
  }, [authStore.user?._id]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Guides</h1>
          <Link to={"/create-guide"} className={styles.createGuideLink}>
            Create New Guide
          </Link>
        </div>

        <div className={styles.guidesGrid}>
          {store.guides.map((guide) => (
            <GuideCard key={guide._id} guide={guide} />
          ))}
        </div>
      </div>
    </main>
  );
};
export default DashboardPage;
