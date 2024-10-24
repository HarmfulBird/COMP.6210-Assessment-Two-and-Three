import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../scripts/ClientConnection";

function MainContent(props) {
  /**
   * Destructures the `Subject` object from the parameters and initializes a state variable `scpData` using `useState`.
   * @returns None
   */
  const { Subject } = useParams();
  const [scpData, setSCPData] = useState(null);

  /**
   * useEffect hook that fetches SCP details based on the Subject value.
   * It sets the SCP data in the component's state if the fetch is successful.
   * @param {Function} fetchSCPDetail - Asynchronous function to fetch SCP details.
   * @param {string} Subject - The subject value used to fetch SCP details.
   * @param {Function} setSCPData - Function to set SCP data in the component's state.
   * @param {Object} client - Supabase client object used to make the API request.
   * @returns None
   */
  useEffect(() => {
    const fetchSCPDetail = async () => {
      const { data, error } = await client
        .from("SCPS")
        .select("*")
        .eq("Subject", Subject)
        .single();
      if (error) {
        console.error(error);
      } else {
        setSCPData(data);
      }
    };
    fetchSCPDetail();
  }, [Subject]);

  /**
   * Returns a JSX element that displays SCP data including image, item number, object class,
   * containment procedures, and description.
   * @returns {JSX.Element} - The JSX element to display SCP data.
   */
  return (
    <>
      <div id="dataDisplay">
        <div className="content">
          {scpData ? (
            <>
              <div className="image">
                {scpData.Image ? (
                  <img src={scpData.Image} alt={scpData.Subject} />
                ) : (
                  <img
                    src={
                      "https://tbzcwamaopbgxqewkgon.supabase.co/storage/v1/object/public/images/alt-image.png"
                    }
                    alt={scpData.Subject}
                  />
                )}
                <h1>Item #: {scpData.Subject}</h1>
                <h1>Object Class: {scpData.Class}</h1>
              </div>
              <div className="scp-info">
                <div className="scp-containment-info">
                  <h3>Special Containment Procedures:</h3>

                  <p>{scpData.Containment}</p>
                </div>

                <hr />

                <div className="scp-description">
                  <h3>Description:</h3>

                  <p>{scpData.Description}</p>
                </div>
              </div>
            </>
          ) : (
            <h1>Loading Content...</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default MainContent;
