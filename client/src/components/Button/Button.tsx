import styles from "./Button.module.css";

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  iconSrc?: string;
}

const Button = ({ onClick, title, iconSrc }: ButtonProps) => {
  return (
    <button className={styles.main} {...onClick}>
      <span className={styles.title}>{title}</span>
      <img className={styles.icon} src={iconSrc} alt={`${title} button icon`} />
    </button>
  );
};

export default Button;
