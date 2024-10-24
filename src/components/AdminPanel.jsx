import { useState, useEffect } from "react"; 
import { client } from "../scripts/ClientConnection"; 
import "../css/styles.css"; 

function AdminPanel() {
  /**
   * Initializes state variables for managing SCP records.
   * @returns None
   */
  const [scps, setSCPS] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newRecord, setNewRecord] = useState({
    Subject: "", 
    Class: "", 
    Containment: "", 
    Description: "", 
    Image: "", 
  });
  const [editRecord, setEditRecord] = useState(null); 

  /**
   * useEffect hook that fetches data from the "SCPS" table using the client object.
   * Sets the fetched data to the SCPS state variable.
   * @returns None
   */
  useEffect(() => {
    const fetchSCPS = async () => {
      const { data, error } = await client.from("SCPS").select("*"); 
      if (error) {
        console.error(error); 
      } else {
        setSCPS(data); 
      }
    };
    fetchSCPS(); 
  }, []); 

  /**
   * Formats the input into an SCP format.
   * @param {{string}} input - The input string to format.
   * @returns The formatted SCP string.
   */
  const formatSCP = (input) => {
    if (!input) return "";

    const number = input.match(/\d+/)?.[0] || "0"; 
    const parsedNumber = parseInt(number, 10); 

    if (parsedNumber < 100) {
      return `SCP-${parsedNumber.toString().padStart(3, "0")}`;
    }
    return `SCP-${parsedNumber}`; 
  };

  /**
   * Adds a new subject record to the database after confirming with the user.
   * @returns None
   */
  const addSubject = async () => {
    const formattedRecord = {
      ...newRecord, 
      Subject: formatSCP(newRecord.Subject), 
    };

    const { data: existingRecord, error } = await client
      .from("SCPS")
      .select("Subject")
      .eq("Subject", formattedRecord.Subject)
      .single();

    if (existingRecord) {
      window.alert(
        `Error: \nSCP with subject name: ${formattedRecord.Subject}, already exists.`
      );
      return; 
    }

    const isConfirmed = window.confirm(
      `Are you sure you would like to add ${formattedRecord.Subject}?`
    );

    if (isConfirmed) {
      const { error: insertError } = await client
        .from("SCPS")
        .insert([formattedRecord]);

      if (insertError) {
        console.error("Error inserting new record: \n", insertError);
        return;
      }

      setNewRecord({
        Subject: "",
        Class: "",
        Containment: "",
        Description: "",
        Image: "",
      });

      window.location.reload(); 
    }
  };

  /**
   * Deletes a subject with the given id from the "SCPS" table in the database.
   * Prompts the user for confirmation before deleting.
   * @param {{number}} id - The id of the subject to be deleted.
   * @returns None
   */
  const deleteSubject = async (id) => {
    const { data, error } = await client
      .from("SCPS")
      .select("Subject")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching SCP:\n", error);
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you would like to delete ${data.Subject}?`
    );

    if (isConfirmed) {
      await client.from("SCPS").delete().eq("id", id);
      window.location.reload();
    }
  };


  /**
   * Sets the edit record to the provided SCP.
   * @param {{any}} scp - The SCP to set as the edit record.
   * @returns None
   */
  const startEditing = (scp) => {
    setEditRecord(scp); 
  };

  /**
   * Saves the edited record to the database after confirming with the user.
   * @param {{string}} id - The id of the record to be edited.
   * @returns None
   */
  const saveEdit = async (id) => {
    const formattedRecord = {
      ...editRecord, 
      Subject: formatSCP(editRecord.Subject), 
    };
    const isConfirmed = window.confirm(
      `Are you sure you would like to edit ${formattedRecord.Subject}?`
    );

    if (isConfirmed) {
      await client.from("SCPS").update(formattedRecord).eq("id", id);
      setEditRecord(null); 
      window.location.reload(); 
    }
  };

  /**
   * Cancels the current edit operation by setting the edit record to null.
   * @returns None
   */
  const cancelEdit = () => {
    setEditRecord(null);
  };

  /**
   * Filters and sorts an array of objects based on a search query and a numeric value in the object's Subject property.
   * @param {{Array}} scps - The array of objects to filter and sort.
   * @param {{string}} searchQuery - The search query to filter the objects by.
   * @returns A new array of objects that match the search query, sorted by the numeric value in the Subject property.
   */
  const filteredScps = scps
    .filter(
      (scp) => scp.Subject.toLowerCase().includes(searchQuery.toLowerCase()) 
    )
    .sort((a, b) => {
      const numA = parseInt(a.Subject.match(/\d+/), 10); 
      const numB = parseInt(b.Subject.match(/\d+/), 10); 
      return numA - numB; 
    });

  /**
   * This returns a JSX element that represents an admin interface for managing SCP records.
   * It includes sections for adding/editing SCP records, searching SCPs, and displaying a list of SCPs.
   * @returns {JSX.Element} The JSX element representing the admin interface.
   */
  return (
    <>
      <div className="admin-container">
        <section className="admin-section admin-form">
          <h3>{editRecord ? "Edit Record" : "Add New Record"}</h3>
          <p>Subject:</p>
          <input
            className="admin-input"
            value={editRecord ? editRecord.Subject : newRecord.Subject}
            onChange={(e) =>
              editRecord
                ? setEditRecord({
                    ...editRecord,
                    Subject: formatSCP(e.target.value),
                  })
                : setNewRecord({
                    ...newRecord,
                    Subject: formatSCP(e.target.value),
                  })
            }
            placeholder="Subject"
          />
          <p>Class:</p>
          <input
            className="admin-input"
            value={editRecord ? editRecord.Class : newRecord.Class}
            onChange={(e) =>
              editRecord
                ? setEditRecord({ ...editRecord, Class: e.target.value })
                : setNewRecord({ ...newRecord, Class: e.target.value })
            }
            placeholder="Class"
          />
          <p>Containment Info:</p>
          <textarea
            className="admin-input"
            value={editRecord ? editRecord.Containment : newRecord.Containment}
            onChange={(e) =>
              editRecord
                ? setEditRecord({ ...editRecord, Containment: e.target.value })
                : setNewRecord({ ...newRecord, Containment: e.target.value })
            }
            placeholder="Containment"
          />
          <p>Description:</p>
          <textarea
            className="admin-input"
            value={editRecord ? editRecord.Description : newRecord.Description}
            onChange={(e) =>
              editRecord
                ? setEditRecord({ ...editRecord, Description: e.target.value })
                : setNewRecord({ ...newRecord, Description: e.target.value })
            }
            placeholder="Description"
          />
          <p>Image Link:</p>
          <input
            className="admin-input"
            value={editRecord ? editRecord.Image : newRecord.Image}
            onChange={(e) =>
              editRecord
                ? setEditRecord({ ...editRecord, Image: e.target.value })
                : setNewRecord({ ...newRecord, Image: e.target.value })
            }
            placeholder="Image"
          />
          {editRecord ? (
            <div className="admin-buttons">
              <button
                className="admin-button save-button"
                onClick={() => saveEdit(editRecord.id)}
              >
                Save
              </button>
              <button
                className="admin-button delete-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="admin-buttons">
              <button className="admin-button add-button" onClick={addSubject}>
                Add SCP
              </button>
            </div>
          )}
        </section>

        <section className="admin-section admin-sidebar">
          <search className="admin-search" id="admin-search-bar">
            <input
              type="text"
              placeholder="Search SCPs by #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </search>

          <div className="admin-search-content" id="search-content">
            <ul>
              {filteredScps.map((scp) => (
                <li key={scp.Subject}>
                  <div className="admin-search-card">
                    <h1>{scp.Subject}</h1>
                    <p>
                      <strong>Class: </strong>
                      {scp.Class}
                    </p>
                    <p>
                      <strong>Containment: </strong>
                      {scp.Containment}
                    </p>
                    <p>
                      <strong>Description: </strong>
                      {scp.Description}
                    </p>
                    <p>
                      <strong>Image Link: </strong>
                      {scp.Image}
                    </p>
                    <div className="admin-buttons">
                      <button
                        className="admin-button edit-button"
                        onClick={() => startEditing(scp)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-button delete-button"
                        popovertarget="confirm-delete"
                        onClick={() => deleteSubject(scp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminPanel;
