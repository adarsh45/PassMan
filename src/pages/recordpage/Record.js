import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { supabase } from "../../client";
import {
  FaEyeSlash,
  FaEye,
  FaLastfm,
  FaUserAlt,
  FaStickyNote,
} from "react-icons/fa";
import { FiLink2 } from "react-icons/fi";
import { RiLockPasswordFill } from "react-icons/ri";
import { Alert, Input, InputGroup, InputGroupAddon } from "reactstrap";
import "./recordpage.scss";
import GenerateModal from "./GenerateModal";
const crypto = require("crypto-js");

const emptyRecord = {
  title: "",
  website_url: "",
  username: "",
  pass: "",
  note: "",
};

const Record = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.state) {
      setIsEncrypted(true);
      setIsUpdate(true);
      setRecord(location.state);
    }
  }, [location]);

  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [record, setRecord] = useState(emptyRecord);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const toggleGenerateModal = () => setGenerateModal(!generateModal);

  const [passVisible, setPassVisible] = useState(false);
  const togglePassVisibility = () => setPassVisible(!passVisible);

  const { title, website_url, username, pass, note } = record;

  const setPassword = (passd) => {
    setRecord({ ...record, pass: passd });
    setIsGenerated(true);
  };

  useEffect(() => {
    let newPass = "";
    if (!pass || !isUpdate || isGenerated) return;
    console.log("I was called");
    if (passVisible) {
      // Decrypt
      const bytes = crypto.AES.decrypt(pass, supabase.auth.user().id);
      newPass = bytes.toString(crypto.enc.Utf8);
      setIsEncrypted(false);
    } else {
      // encrypt
      newPass = crypto.AES.encrypt(pass, supabase.auth.user().id).toString();
      setIsEncrypted(true);
    }
    setRecord({ ...record, pass: newPass });
  }, [passVisible]);

  const copyToClipboard = (e) => {
    e.preventDefault();
    let newPass = pass;
    if (isEncrypted && !isGenerated) {
      // Decrypt
      const bytes = crypto.AES.decrypt(pass, supabase.auth.user().id);
      newPass = bytes.toString(crypto.enc.Utf8);
    }
    navigator.clipboard.writeText(newPass);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRecord({ ...record, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setRecord(emptyRecord);
    history.goBack();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: add empty check for each input
    if (!title) {
      return setError("Title cannot be empty!");
    }
    if (!pass) {
      return setError("Password cannot be empty!");
    }
    let mData, mError, encryptedPass;
    if (pass && pass.length > 6) {
      if (!isEncrypted) {
        // Encrypt
        encryptedPass = crypto.AES.encrypt(
          pass,
          supabase.auth.user().id
        ).toString();
        setRecord({ ...record, pass: encryptedPass });
      } else {
        encryptedPass = pass;
      }
    } else {
      return setError("Password should be at least 6 characters long!");
    }
    if (isUpdate) {
      const { id } = record;
      if (id) {
        const { data, error } = await supabase
          .from("PassRecord")
          .update({
            title,
            website_url,
            username,
            pass: encryptedPass,
            note,
          })
          .eq("id", id);

        mData = data;
        mError = error;
      } else {
        console.log("no id found!");
      }
    } else {
      const { data, error } = await supabase.from("PassRecord").insert([
        {
          title,
          website_url,
          username,
          pass: encryptedPass,
          note,
          user_id: supabase.auth.user().id,
        },
      ]);
      mData = data;
      mError = error;
    }
    // TODO: handle errors
    if (!mError) {
      console.log("DATA: ", mData);
      history.goBack();
    } else {
      setError(mError);
      console.log("ERROR: ", mError);
    }
  };

  return (
    <div className="record-page">
      <h1 className="heading">
        Pass<span className="color-green">Man</span>
      </h1>
      <p className="sub-heading">
        {isUpdate ? "Update PassMan Record" : "Add New PassMan Record"}
      </p>
      {error && <Alert color="danger">{error}</Alert>}
      {copied && <Alert color="success">Copied to clipboard &#10003;</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <FaLastfm className="icon" />
            </InputGroupAddon>

            <Input
              onChange={handleChange}
              value={title}
              type="text"
              name="title"
              className="input"
            />
          </InputGroup>
        </div>
        <div className="form-row">
          <label>Website URL</label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <FiLink2 className="icon" />
            </InputGroupAddon>

            <Input
              onChange={handleChange}
              value={website_url}
              type="text"
              name="website_url"
              className="input"
            />
          </InputGroup>
        </div>
        <div className="form-row">
          <label>Username / Email</label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <FaUserAlt className="icon" />
            </InputGroupAddon>

            <Input
              onChange={handleChange}
              value={username}
              type="text"
              name="username"
              className="input"
            />
          </InputGroup>
        </div>
        <div className="form-row">
          <label>Password</label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <RiLockPasswordFill className="icon" />
            </InputGroupAddon>

            <Input
              onChange={handleChange}
              value={pass}
              type={passVisible ? "text" : "password"}
              name="pass"
              id="pass-field"
              className="input"
            />
            <InputGroupAddon addonType="append" className="eye-icon-div">
              <button onClick={copyToClipboard} className="copy-btn">
                Copy
              </button>
              {passVisible ? (
                <FaEye onClick={togglePassVisibility} />
              ) : (
                <FaEyeSlash onClick={togglePassVisibility} />
              )}
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="generate-pass-div">
          <span className="generate-text" onClick={toggleGenerateModal}>
            Generate strong password!
          </span>
        </div>
        <div className="form-row">
          <label>Note</label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <FaStickyNote className="icon" />
            </InputGroupAddon>

            <Input
              onChange={handleChange}
              value={note}
              type="textarea"
              name="note"
              className="input"
            />
          </InputGroup>
        </div>
        <div className="button-row">
          <button type="submit" name="submit">
            {isUpdate ? "Update" : "Save"}
          </button>
          <button
            type="cancel"
            id="cancel"
            onClick={handleCancel}
            name="cancel"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* generate pass modal */}
      <GenerateModal
        generateModal={generateModal}
        toggleGenerateModal={toggleGenerateModal}
        setPassword={setPassword}
      />
    </div>
  );
};

export default Record;
