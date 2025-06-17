import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  setOpen: (newValue: boolean) => void;
  children?: ReactNode;
}

const Modal = ({ open, setOpen, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  return (
    <dialog className={styles.main} onClick={handleClick} ref={dialogRef}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
