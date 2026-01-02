
interface Props {
  heading: string;
  body: string;
  buttons: string[];
  links: string[];
  color: "search" | "statistics" | "lastUsed" | "createNew";
}
//Generiert einen großen Bereich auf der MainPage
function MainPageContainer({ heading, body, buttons, links, color }: Props) {
  return (
    <div className={"mainPageContainer " + "mainPageContainer-" + color}>
      <div className="textContainer">
        <label className="mainPageContainer-heading">{heading}</label>
        <p className="mainPageContainer-body">{body}</p>
      </div>

      <div className="buttonContainer">
        {buttons.map((val, index) => (
          <a
            key={index}
            className={"mainPageContainerBtn mainPageContainerBtn-" + color}
            href={links[index]}
          >
            {val}
          </a>
        ))}
      </div>
    </div>
  );
}

export default MainPageContainer;
