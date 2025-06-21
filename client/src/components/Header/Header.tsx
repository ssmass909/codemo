import { Link } from "react-router";
import styles from "./Header.module.css";
import darkModeIcon from "../../assets/darkMode.svg";
import lightModeIcon from "../../assets/lightMode.svg";
import useThemeModeSwitcher from "../../hooks/useThemeModeSwitcher";
import LoginModal from "../LoginModal/LoginModal";
import HeaderStore from "../../stores/HeaderStore";
import RegisterModal from "../RegisterModal/RegisterModal";
import { observer } from "mobx-react";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const [isDarkMode, switchMode] = useThemeModeSwitcher();
  const headerStore = new HeaderStore();

  return (
    <>
      <div className={styles.main}>
        <Link to={"/"} className={styles.title}>
          Codemo
        </Link>
        <div className={styles.left}>
          <button className={`${styles.themeBtn} button`} onClick={() => switchMode()}>
            <img className={styles.themeIcon} src={isDarkMode ? lightModeIcon : darkModeIcon} />
          </button>
          <div className={styles.authBtns}>
            <button
              className={`${styles.loginBtn} button ${styles.authBtn} gradientTxt ${styles.loginBtn}`}
              onClick={() => headerStore.setLoginModalOpen(true)}
            >
              Login
            </button>
            <button
              className={`${styles.registerBtn} button ${styles.authBtn} gradientTxt ${styles.registerBtn} `}
              onClick={() => {
                headerStore.setRegisterModalOpen(true);
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <LoginModal headerStore={headerStore} />
      <RegisterModal headerStore={headerStore} />
    </>
  );
};

export default observer(Header);
