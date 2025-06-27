import { Link } from "react-router";
import styles from "./DashboardPage.module.css";
import GuideCard from "../../components/GuideCard/GuideCard";
import DashboardPageStore from "../../stores/DashboardPageStore";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { useRootStore } from "../../providers/RootStoreProvider";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";

const DashboardPage = () => {
  const [store] = useState(new DashboardPageStore());
  const authStore = useAuthStore();
  const rootStore = useRootStore();

  useEffect(() => {
    if (!store.api) store.setApi(rootStore.api);
    if (authStore.loggedIn) store.fetchGuidesFlow(authStore.user?._id!);
  }, [authStore.user?._id, store.api]);

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
export default observer(DashboardPage);
