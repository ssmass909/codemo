import { Link } from "react-router";
import styles from "./Header.module.css";
import Button from "../Button/Button";
import darkModeIcon from "../../assets/darkMode.svg";
import lightModeIcon from "../../assets/lightMode.svg";
import useThemeModeSwitcher from "../../hooks/useThemeModeSwitcher";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const [isDarkMode, switchMode] = useThemeModeSwitcher();
  return (
    <div className={styles.main}>
      <Link to={"/"} className={styles.title}>
        Codemo
      </Link>
      <div className={styles.left}>
        <Button onClick={() => switchMode()} iconSrc={isDarkMode ? lightModeIcon : darkModeIcon} />
        <div className={styles.authBtns}>
          <Button onClick={() => {}}>Register</Button>
          <Button onClick={() => {}}>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
