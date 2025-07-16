import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./pages/Navbar";
import AnalysisPage from "./pages/AnalysisPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/analysis" element={<App />} /> */}
        {/* <Route path="/analysis" element={<AnalysisPage />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
