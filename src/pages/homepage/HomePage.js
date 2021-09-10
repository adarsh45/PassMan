import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { supabase } from "../../client";
import RecordCard from "./RecordCard";
import { FaPlus } from "react-icons/fa";
import { ReactComponent as IndianFarmer } from "../../assets/indian_farmer.svg";
import { FiLogOut } from "react-icons/fi";
import "./homepage.scss";
import { isAuthenticated, signout } from "../../auth/helper/authCalls";

const HomePage = () => {
  const history = useHistory();

  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    readMyRecords();
  }, []);

  const readMyRecords = async () => {
    setLoading(true);
    let { data: PassRecords, error } = await supabase
      .from("PassRecord")
      .select("*")
      .eq("user_id", supabase.auth.user().id);

    if (PassRecords && PassRecords.length) {
      setRecords(PassRecords);
      console.log(PassRecords);
    }
    if (error) {
      setError(error);
      console.log(error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    signout().then(() => {
      history.push("/");
    });
  };

  return (
    <div className="home-page">
      <div className="profile-div">
        <span>
          Hey,{" "}
          <span className="color-green">
            {isAuthenticated().fullname.split(" ")[0]}!
          </span>
        </span>
        <span>
          <FiLogOut onClick={handleLogout} />
        </span>
      </div>
      <h1 className="heading">
        Pass<span className="color-green">Man</span>
      </h1>
      {records.length ? (
        <div>
          <div className="records-list">
            {records.map((passRecord) => (
              <RecordCard
                key={passRecord.id}
                passRecord={passRecord}
                update={readMyRecords}
              />
            ))}
          </div>
          <button className="add-btn">
            <Link to="/record">
              {" "}
              <FaPlus />{" "}
            </Link>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            margin: "4em auto",
          }}
        >
          <span
            style={{ color: "#65b67f", fontWeight: "500", fontSize: "1.6em" }}
          >
            {loading
              ? "Load ho raha hai, Sabr karo!"
              : "No passwords yet, beta ? Start adding then !"}
            {!loading && (
              <button className="add-btn" style={{ margin: "0.2em auto" }}>
                <Link to="/record">
                  <FaPlus />
                </Link>
              </button>
            )}
          </span>
          <IndianFarmer style={{ width: "20rem", height: "auto" }} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
