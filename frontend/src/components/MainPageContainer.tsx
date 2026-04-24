import { Link } from "react-router";
import styles from "../styles/MainPage.module.css";

interface Props {
  heading: string;
  body: string;
  buttons: string[];
  links: string[];
  enabled?: boolean[];
  color: "search" | "statistics" | "lastUsed" | "createNew";
}
//Generiert einen großen Bereich auf der MainPage
function MainPageContainer({
  heading,
  body,
  buttons,
  links,
  enabled,
  color,
}: Props) {
  return (
    <div
      className={`${styles.mainPageContainer} ${styles[`mainPageContainer-${color}`]}`}
    >
      <div className={styles.textContainer}>
        <label className={styles.mainPageContainer_heading}>{heading}</label>
        <p className={styles.mainPageContainer_body}>{body}</p>
      </div>

      <div className={styles.buttonContainer}>
        {buttons.map((val, index) => (
          <Link
            to={links[index]}
            key={index}
            className={`${styles.mainPageContainerBtn} ${styles[`mainPageContainerBtn-${color}`]}`}
            style={{
              pointerEvents:
                enabled !== undefined &&
                enabled.length > index &&
                !enabled[index]
                  ? "none"
                  : "auto",
            }}
          >
            {val}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPageContainer;
