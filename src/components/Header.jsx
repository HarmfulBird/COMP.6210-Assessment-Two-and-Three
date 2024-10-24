import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from "../scripts/ClientConnection";

function Header() {
  const [scps, setSCPS] = useState([]);

  useEffect(() => {
    const fetchSCPS = async () => {
      const { data, error } = await client.from("SCPS").select("id, Subject");
      if (error) {
        console.error(error);
      } else {
        setSCPS(data);
      }
    };
    fetchSCPS();
  }, []);

  return (
    <>
      <header className="header">
        <div className="logo" id="chk1">
          <img
            src="https://scpwiki.github.io/sigma/images/header-logo.svg"
            alt="Logo"
            aria-label="Website Logo"
          />
          <div className="logo-names">
            <h1>
              <Link to={`/`}>SCP Foundation</Link>
            </h1>
            <h2>
              <Link to={`/`}>Secure, Contain, Protect</Link>
            </h2>
          </div>
        </div>

        <div className="center-nav" id="chk2">
          <nav className="navbar navbar-dark">
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon bg-transparent"></span>
            </button>

            <div
              className="collapse navbar-collapse navli"
              id="navbarNavAltMarkup"
            >
              <ul className="navbar-nav  ms-auto ">
                <li>
                  <NavLink to="/AdminPanel">Admin Panel</NavLink>
                </li>
                {scps
                  .sort((a, b) => {
                    const numA = parseInt(a.Subject.match(/\d+/), 10);
                    const numB = parseInt(b.Subject.match(/\d+/), 10);
                    return numA - numB;
                  })
                  .map((scp) => (
                    <li key={scp.Subject}>
                      <NavLink to={`/SCP/${scp.Subject}`}>
                        {scp.Subject}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;