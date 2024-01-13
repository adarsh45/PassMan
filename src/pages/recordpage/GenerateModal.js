import { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { FiRefreshCw } from "react-icons/fi";
import CircleIconButton from "../../components/CircleIconButton";
import "./modal.scss";

const generator = require("generate-password");

const GenerateModal = ({ generateModal, toggleGenerateModal, setPassword }) => {
  const [generatedPass, setGeneratedPass] = useState("");
  const [length, setLength] = useState(10);
  const [isDigits, setIsDigits] = useState(true);
  const [isSymbols, setIsSymbols] = useState(false);

  const generateThePassword = () => {
    let password = generator.generate({
      length,
      numbers: isDigits,
      symbols: isSymbols,
    });
    setGeneratedPass(password);
  };

  return (
    <Modal
      isOpen={generateModal}
      toggle={toggleGenerateModal}
      centered
      className="generate-modal"
    >
      <ModalBody>
        <div className="password-div">
          <span className="pass-text">{generatedPass}</span>
          <CircleIconButton Icon={FiRefreshCw} onClick={generateThePassword} />
        </div>
        <div className="generator">
          <div className="length-div">
            <p className="length-text">Length: {length}</p>
            <div className="length-slide-parent">
              <input
                type="range"
                min="1"
                max="30"
                defaultValue={length}
                onChange={(e) => setLength(e.target.value)}
                className="slider"
                id="myRange"
              />
            </div>
          </div>
          <div className="generate-row">
            <span>Digits (e.g. 69)</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isDigits}
                onChange={(e) => setIsDigits(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="generate-row">
            <span>Include Symbols (e.g. @-#)</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isSymbols}
                onChange={(e) => setIsSymbols(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="buttons-div">
            <button
              onClick={() => {
                setPassword(generatedPass);
                toggleGenerateModal();
              }}
            >
              Use this Password
            </button>
            <button id="cancel" onClick={toggleGenerateModal}>
              Close
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default GenerateModal;
