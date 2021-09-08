import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { supabase } from "../../client";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import "./recordpage.scss";
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
      setRecord(location.state);
      setIsUpdate(true);
    }
  }, [location]);

  const [record, setRecord] = useState(emptyRecord);
  const [isUpdate, setIsUpdate] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const togglePassVisibility = () => setPassVisible(!passVisible);

  const { title, website_url, username, pass, note } = record;

  useEffect(() => {
    let newPass = "";
    if (!pass || !isUpdate) return;
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
    // TODO: do password encryption here
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
    } else return;
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
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input
            onChange={handleChange}
            value={title}
            type="text"
            name="title"
          />
        </div>
        <div className="form-row">
          <label>Website URL</label>
          <input
            onChange={handleChange}
            value={website_url}
            type="text"
            name="website_url"
          />
        </div>
        <div className="form-row">
          <label>Username / Email</label>
          <input
            onChange={handleChange}
            value={username}
            type="text"
            name="username"
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <div className="input-div">
            <input
              className="input-field"
              onChange={handleChange}
              value={pass}
              type={passVisible ? "text" : "password"}
              name="pass"
              id="pass-field"
            />
            <span className="icon">
              {passVisible ? (
                <FaEye onClick={togglePassVisibility} />
              ) : (
                <FaEyeSlash onClick={togglePassVisibility} />
              )}
            </span>
          </div>
        </div>
        <div className="form-row">
          <label>Note</label>
          <textarea
            onChange={handleChange}
            value={note}
            type="text"
            name="note"
          />
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
    </div>
  );
};

export default Record;
