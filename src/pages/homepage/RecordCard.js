import { useState } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../../client";
import { FaCopy, FaPen, FaTrash } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Alert, Modal, ModalBody } from "reactstrap";
import "./recordcard.scss";
const crypto = require("crypto-js");

const RecordCard = ({ passRecord, update }) => {
  const history = useHistory();
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal((prev) => !prev);

  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    // Decrypt
    const bytes = crypto.AES.decrypt(passRecord.pass, supabase.auth.user().id);
    const newPass = bytes.toString(crypto.enc.Utf8);
    navigator.clipboard.writeText(newPass);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleEdit = () => {
    history.push({
      pathname: "/record",
      state: passRecord,
    });
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("PassRecord")
      .delete()
      .eq("id", passRecord.id);

    if (!error) {
      console.log(data);
    } else {
      console.log(error);
    }
    update();
    toggleDeleteModal();
  };
  return (
    <>
      {copied && <Alert color="success">Copied to clipboard &#10003;</Alert>}
      <div className="record-card">
        {/* TODO: urls without http not opening directly (localhost/ appended) */}
        <a
          href={passRecord.website_url ? passRecord.website_url : "#"}
          target="_blank"
          rel="noreferrer"
        >
          <span className="title">{passRecord.title}</span>
        </a>
        <div className="div-btns">
          <button className="icon-btn" onClick={handleCopy}>
            <FaCopy />
          </button>
          <button className="icon-btn" onClick={handleEdit}>
            <FaPen />
          </button>
          <button className="icon-btn" onClick={toggleDeleteModal}>
            <FaTrash />
          </button>
        </div>

        <>
          <Modal
            isOpen={deleteModal}
            toggle={toggleDeleteModal}
            className="delete-modal"
            centered
          >
            <ModalBody>
              <div>{`Are you sure want to delete ${passRecord.title} ?`}</div>
              <div className="btns-div">
                <button className="icon-btn" id="danger" onClick={handleDelete}>
                  <FaTrash />
                </button>
                <button className="icon-btn" onClick={toggleDeleteModal}>
                  <ImCross />
                </button>
              </div>
            </ModalBody>
          </Modal>
        </>
      </div>
    </>
  );
};

export default RecordCard;
