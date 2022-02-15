import { FC, useState } from "react";
import styles from "./index.module.css";

export const Home: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return <div className={styles["main_Div"]}></div>;
};
