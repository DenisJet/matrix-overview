import styles from "./Button.module.scss";

export default function Button({
  children,
  type,
  onClick,
}: {
  children: string;
  type: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
}) {
  return (
    <button className={styles.button} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
