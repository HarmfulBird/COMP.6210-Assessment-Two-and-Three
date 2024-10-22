import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./css/styles.css";
import FrontPage from "./components/FrontPage";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import AdminPanel from "./components/AdminPanel";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/SCP/:Subject" element={<MainContent />} />
          <Route path="/" element={<FrontPage />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
