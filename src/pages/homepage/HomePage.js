import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../client";
import RecordCard from "./RecordCard";

const HomePage = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    readMyRecords();
  }, []);

  const readMyRecords = async () => {
    let { data: PassRecords, error } = await supabase
      .from("PassRecord")
      .select("*")
      .eq("user_id", supabase.auth.user().id);

    if (PassRecords.length) {
      setRecords(PassRecords);
      console.log(PassRecords);
    }
    if (error) {
      setError(error);
      console.log(error);
    }
  };

  return (
    <div>
      <h1>PassMan</h1>

      {records.length ? (
        records.map((passRecord) => (
          <RecordCard
            key={passRecord.id}
            passRecord={passRecord}
            update={readMyRecords}
          />
        ))
      ) : (
        <p>{error ? error : "No records found!"}</p>
      )}
      <button>
        <Link to="/record">+ Add New Password Record</Link>
      </button>
    </div>
  );
};

export default HomePage;
