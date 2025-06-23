import { Link } from "react-router";
import AccountCircle from "../../IconComponents/AccountCircle/AccountCircle";
import ArrowDropDown from "../../IconComponents/ArrowDropDown/ArrowDropDown";
import styles from "./ProfileDropdown.module.css";
import { useAuthStore } from "../../providers/AuthStoreProvider";

interface ProfileDropdownProps {}

const ProfileDropdown = ({}: ProfileDropdownProps) => {
  const authStore = useAuthStore();

  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <Link to={`/user/${authStore.user?._id}`} className={styles.link}>
          <AccountCircle />
          <span className={styles.name}>{authStore.user?.firstName}</span>
        </Link>
        <button className={styles.dropdownBtn}>
          <ArrowDropDown />
        </button>
      </div>
      {/* TODO later */}
      <div className={styles.dropdown}></div>
    </div>
  );
};

export default ProfileDropdown;
