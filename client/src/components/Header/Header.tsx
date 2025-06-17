import { Link } from "react-router";
import styles from "./Header.module.css";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <div className={styles.main}>
      <Link to={"/"} className={styles.title}>
        Codemo
      </Link>
    </div>
  );
};

export default Header;
