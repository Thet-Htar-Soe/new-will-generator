import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./pages/Navbar";
import ClientForm from "./components/ClientForm";
import Selection from "./components/Selection";
import GenerateDiagram from "./pages/GenerateDiagram";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<App />} /> */}
        <Route path="/" element={<ClientForm />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/diagram" element={<GenerateDiagram />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
