import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../scripts/ClientConnection";

function MainContent(props) {
  const { Subject } = useParams();
  const [scpData, setSCPData] = useState(null);

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
