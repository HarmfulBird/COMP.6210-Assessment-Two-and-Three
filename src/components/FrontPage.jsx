import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { client } from "../scripts/ClientConnection";

function FrontPage() {
  /**
   * useState hook to manage the state of an array of SCPS.
   * @returns An array and a function to update the array state.
   */
  const [scps, setSCPS] = useState([]);

  /**
   * useEffect hook that fetches data from the 'SCPS' table using the provided client,
   * and updates the state with the fetched data.
   * @param {function} fetchSCPS - Asynchronous function to fetch data from 'SCPS' table.
   * @param {object} client - Supabase client object used to interact with the database.
   * @param {function} setSCPS - State setter function to update the 'SCPS' state with fetched data.
   * @returns None
   */
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


  /**
   * Returns a JSX element containing a list of SCP items with their details.
   * @param {{Array}} scps - An array of SCP objects containing Subject, Image, and Class properties.
   * @returns A JSX element displaying SCP items with their details.
   */
  return (
    <>
      <div className="content-main">
        <div className="warning-home">
          <h1>
            <span id="warn">NOT A WARNING:</span> THE FOUNDATION DATABASE IS
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
