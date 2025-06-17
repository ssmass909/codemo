import type { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconSrc?: string;
  children?: ReactNode;
}

const Button = ({ onClick, iconSrc, children }: ButtonProps) => {
  return (
    <button className={styles.main} onClick={onClick}>
      {iconSrc && <img className={styles.icon} src={iconSrc} alt="button icon" />}
      {children}
    </button>
  );
};

export default Button;
