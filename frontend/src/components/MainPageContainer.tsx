import { Link } from "react-router";

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
    <div className={"mainPageContainer " + "mainPageContainer-" + color}>
      <div className="textContainer">
        <label className="mainPageContainer-heading">{heading}</label>
        <p className="mainPageContainer-body">{body}</p>
      </div>

      <div className="buttonContainer">
        {buttons.map((val, index) => (
          <Link
            to={links[index]}
            key={index}
            className={"mainPageContainerBtn mainPageContainerBtn-" + color}
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
