import { useHistory } from "react-router-dom";
import { supabase } from "../../client";

const RecordCard = ({ passRecord, update }) => {
  const history = useHistory();

  const handleCopy = () => {
    //   TODO: decrypt password here & copy it to clipboard
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
      update();
    } else {
      console.log(error);
    }
  };
  return (
    <div>
      <span>{passRecord.title}</span>
      <button onClick={handleCopy}>copy password</button>
      <button onClick={handleEdit}>edit record</button>
      <button onClick={handleDelete}>delete record</button>
    </div>
  );
};

export default RecordCard;
