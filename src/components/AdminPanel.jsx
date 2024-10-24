import { useState, useEffect } from "react"; // Import hooks from React
import { client } from "../scripts/ClientConnection"; // Import your client connection
import "../css/styles.css"; // Import CSS styles

function AdminPanel() {
  // State hooks to manage SCP data, search query, and form records
  const [scps, setSCPS] = useState([]); // Holds the list of SCP records
  const [searchQuery, setSearchQuery] = useState(""); // Stores the current search input
  const [newRecord, setNewRecord] = useState({
    Subject: "", // Form field for SCP subject
    Class: "", // Form field for SCP class
    Containment: "", // Form field for containment info
    Description: "", // Form field for description
    Image: "", // Form field for image link
  });
  const [editRecord, setEditRecord] = useState(null); // Holds the current record being edited

  useEffect(() => {
    // Fetch SCP data when the component mounts
    const fetchSCPS = async () => {
      const { data, error } = await client.from("SCPS").select("*"); // Get all SCP records
      if (error) {
        console.error(error); // Log errors if any
      } else {
        setSCPS(data); // Set SCP data in state if successful
      }
    };
    fetchSCPS(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Helper function to format the SCP subject into "SCP-[Number]" format
  const formatSCP = (input) => {
    if (!input) return ""; // If input is empty, return empty string

    const number = input.match(/\d+/)?.[0] || "0"; // Extract digits or default to "0"
    const parsedNumber = parseInt(number, 10); // Parse the number from the string

    if (parsedNumber < 100) {
      // Add leading zeros if number < 100
      return `SCP-${parsedNumber.toString().padStart(3, "0")}`;
    }
    return `SCP-${parsedNumber}`; // Return as is for numbers >= 100
  };

  // Function to add a new SCP record
  const addSubject = async () => {
    const formattedRecord = {
      ...newRecord, // Spread operator to copy the current newRecord state
      Subject: formatSCP(newRecord.Subject), // Format the Subject before adding
    };

    // Check if the Subject already exists in the database
    const { data: existingRecord, error } = await client
      .from("SCPS")
      .select("Subject")
      .eq("Subject", formattedRecord.Subject)
      .single();

    if (error && error.details != "The result contains 0 rows" && error.details != "The result contains 0 rows") {
      console.error("Error checking for existing record:\n", error.message);
      return;
    }
    if (existingRecord) {
      // Show an error popup if the SCP Subject already exists
      window.alert(
        `Error: \nSCP with subject name: ${formattedRecord.Subject}, already exists.`
      );
      return; // Exit the function to prevent adding a duplicate
    }

    // Ask for confirmation before adding
    const isConfirmed = window.confirm(
      `Are you sure you would like to add ${formattedRecord.Subject}?`
    );

    if (isConfirmed) {
      // If confirmed, insert the new record into the database
      const { error: insertError } = await client
        .from("SCPS")
        .insert([formattedRecord]);

      if (insertError) {
        console.error("Error inserting new record: \n", insertError);
        return;
      }

      setNewRecord({
        // Reset the form fields after submission
        Subject: "",
        Class: "",
        Containment: "",
        Description: "",
        Image: "",
      });

      window.location.reload(); // Refresh the page to update the SCP list
    }
  };

  // Function to delete an SCP record by ID
  const deleteSubject = async (id) => {
    // Fetch the SCP with the given id to retrieve its Subject name
    const { data, error } = await client
      .from("SCPS")
      .select("Subject")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching SCP:\n", error);
      return;
    }
    // Show a confirmation prompt with the SCP's subject
    const isConfirmed = window.confirm(
      `Are you sure you would like to delete ${data.Subject}?`
    );

    if (isConfirmed) {
      // If confirmed, delete the record from the database
      await client.from("SCPS").delete().eq("id", id);
      window.location.reload(); // Refresh the page after deletion
    }
  };

  // Function to start editing a record
  const startEditing = (scp) => {
    setEditRecord(scp); // Set the SCP record for editing
  };

  // Function to save the edited record
  const saveEdit = async (id) => {
    const formattedRecord = {
      ...editRecord, // Spread operator to copy the edited record state
      Subject: formatSCP(editRecord.Subject), // Format the Subject before saving
    };
    const isConfirmed = window.confirm(
      `Are you sure you would like to edit ${formattedRecord.Subject}?`
    );

    if (isConfirmed) {
      // If confirmed, update the SCP record in the database
      await client.from("SCPS").update(formattedRecord).eq("id", id);
      setEditRecord(null); // Clear the edit state after saving
      window.location.reload(); // Refresh the page after saving
    }
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditRecord(null); // Clear the edit state and revert back to add mode
  };

  // Filter SCPs based on the search query and sort them by number
  const filteredScps = scps
    .filter(
      (scp) => scp.Subject.toLowerCase().includes(searchQuery.toLowerCase()) // Match subject to search query
    )
    .sort((a, b) => {
      const numA = parseInt(a.Subject.match(/\d+/), 10); // Extract number from SCP subject A
      const numB = parseInt(b.Subject.match(/\d+/), 10); // Extract number from SCP subject B
      return numA - numB; // Sort by SCP number in ascending order
    });

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
