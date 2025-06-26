import { useNavigate, useParams, type RouteObject } from "react-router";
import styles from "./UserPage.module.css";
import UserPageStore from "../../stores/UserStore";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { useEffect } from "react";
import { observer } from "mobx-react";

const UserPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const authStore = useAuthStore();
  if (!id) navigate("/");
  const userStore = new UserPageStore(id!, authStore);

  useEffect(() => {
    userStore.getCurrentUserFromApiFlow().then(() => {
      if (authStore.user?._id === userStore.currentUser?._id) {
        userStore.setCanEdit(true);
      }
    });
  }, []);

  return <div className={styles.main}> hello</div>;
};

export default observer(UserPage);
