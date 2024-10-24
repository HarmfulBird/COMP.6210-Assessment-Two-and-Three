/**
 * Imports necessary components and styles for the React application.
 * Components include FrontPage, Header, MainContent, AdminPanel, and ScrollToTop.
 * Styles are imported from the "styles.css" file located in the "css" directory.
 */
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

/**
 * Functional component representing the main App structure.
 * It includes a Router component from React Router, ScrollToTop component,
 * Header component, and Routes with different Route paths for rendering the MainContent,
 * FrontPage, and AdminPanel components based on the URL path.
 * @returns JSX element representing the main structure of the App.
 */
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
