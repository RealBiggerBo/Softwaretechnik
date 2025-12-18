interface Props {
  heading: string;
  body: string;
  buttons: string[];
  color: "search" | "statistics" | "lastUsed" | "createNew";
}
//Generiert einen großen Bereich auf der MainPage
function MainPageContainer({ heading, body, buttons, color }: Props) {
  return (
    <div className={"mainPageContainer " + "mainPageContainer-" + color}>
      <div className="textContainer">
        <label className="mainPageContainer-heading">{heading}</label>
        <p className="mainPageContainer-body">{body}</p>
      </div>

      <div className="buttonContainer">
        {buttons.map((val, index) => (
          <button
            key={index}
            className={"mainPageContainerBtn mainPageContainerBtn-" + color}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MainPageContainer;
