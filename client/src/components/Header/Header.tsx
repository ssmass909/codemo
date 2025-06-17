import styles from "./Header.module.css";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <div className={styles.main}>
      <div className={styles.headerContent}>hi</div>
    </div>
  );
};

export default Header;
