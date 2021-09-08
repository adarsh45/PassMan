import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { supabase } from "../../client";

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

  const { title, website_url, username, pass, note } = record;

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
    if (pass) {
      //   // Encrypt
      //   const ciphertext = crypto.AES.encrypt("mypassword", "SECRETKEY").toString();
      //   console.log("Encrypted Text: ", ciphertext);
      //   // Decrypt
      //   var bytes = crypto.AES.decrypt(ciphertext, "secretkey".toUpperCase());
      //   var originalText = bytes.toString(crypto.enc.Utf8);
      //   console.log("Original Text: ", originalText);
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
            pass,
            note,
          })
          .eq("id", id);

        if (!error) {
          console.log(data);
        } else {
          console.log(error);
        }
      } else {
        console.log("no id found!");
      }
    } else {
      const { data, error } = await supabase.from("PassRecord").insert([
        {
          ...record,
          user_id: supabase.auth.user().id,
        },
      ]);
      if (!error) {
        console.log(data);
      } else {
        console.log(error);
      }
    }
    // TODO: handle errors
  };

  return (
    <div>
      <h1>PassMan</h1>
      <p>{isUpdate ? "Update PassMan Record" : "Add New PassMan Record"}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            onChange={handleChange}
            value={title}
            type="text"
            placeholder="Title or Name of Website"
            name="title"
          />
        </div>
        <div>
          <label>Website URL</label>
          <input
            onChange={handleChange}
            value={website_url}
            type="text"
            placeholder="Website URL"
            name="website_url"
          />
        </div>
        <div>
          <label>Username / Email</label>
          <input
            onChange={handleChange}
            value={username}
            type="text"
            placeholder="Username or Email"
            name="username"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            onChange={handleChange}
            value={pass}
            type="password"
            placeholder="Password you'd like to save (will be encrypted immediately)"
            name="pass"
          />
        </div>
        <div>
          <label>Note</label>
          <textarea
            onChange={handleChange}
            value={note}
            type="text"
            placeholder="Anything you want to note here"
            name="note"
          />
        </div>
        <input
          type="submit"
          value={isUpdate ? "Update" : "Save"}
          name="submit"
        />
        <input
          type="button"
          onClick={handleCancel}
          value="Cancel"
          name="cancel"
        />
      </form>
    </div>
  );
};

export default Record;
