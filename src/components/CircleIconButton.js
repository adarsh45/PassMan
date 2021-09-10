import "./circleiconbtn.scss";

const CircleIconButton = ({ onClick, Icon }) => {
  return (
    <button className="icon-btn" onClick={onClick}>
      <Icon />
    </button>
  );
};

export default CircleIconButton;
