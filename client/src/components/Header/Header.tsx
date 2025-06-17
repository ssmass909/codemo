import { Link } from "react-router";
import styles from "./Header.module.css";
import darkModeIcon from "../../assets/darkMode.svg";
import lightModeIcon from "../../assets/lightMode.svg";
import useThemeModeSwitcher from "../../hooks/useThemeModeSwitcher";
import LoginModal from "../LoginModal/LoginModal";
import { useState } from "react";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const [isDarkMode, switchMode] = useThemeModeSwitcher();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
              onClick={() => setLoginModalOpen(true)}
            >
              Login
            </button>
            <button
              className={`${styles.registerBtn} button ${styles.authBtn} gradientTxt ${styles.registerBtn} `}
              onClick={() => {}}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
    </>
  );
};

export default Header;
