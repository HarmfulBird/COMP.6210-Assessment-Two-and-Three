import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { client } from "../scripts/ClientConnection";

function FrontPage() {
  const [scps, setSCPS] = useState([]);

  useEffect(
    () => {
      const fetchSCPS = async () => {
        const {data, error} = await client.from('SCPS').select('id, Subject, Class, Image');
        if(error){
          console.error(error);
        } else {
          setSCPS(data);
        }
      };
      fetchSCPS();
    }, []
  );


  return (
    <>
      <div className="content-main">
        <div className="warning-home">
          <h1>
            <span id="warn">WARNING:</span> THE FOUNDATION DATABASE IS
          </h1>
          <h1>
            <span id="classified">CLASSIFIED</span>
          </h1>
          <h2>UNAUTHORIZED PERSONNEL WILL BE TRACKED, LOCATED, AND DETAINED</h2>

          <h1 id="scp">SECURE. CONTAIN. PROTECT.</h1>
        </div>
      </div>
      <hr />
      <div className="grid-container">
        {scps.map((scp) => (
          <Link
            to={`/scp/${scp.Subject}`}
            className="grid-item"
            key={scp.Subject}
          >
            {scp.Image ? <img src={scp.Image} alt={scp.Subject} /> : <img src={'https://tbzcwamaopbgxqewkgon.supabase.co/storage/v1/object/public/images/alt-image.png'} alt={scp.Subject} />}
            <div className="grid-info">
              <h1>Item #: {scp.Subject}</h1>
              <h1>Object Class: {scp.Class}</h1>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default FrontPage;
