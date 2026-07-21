import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./Admin.jsx";
import "./index.css";

function Root() {
  const startsAsAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
  const [mode, setMode] = useState(startsAsAdmin ? "admin" : "store");

  if (mode === "admin") {
    return <AdminApp onExit={() => setMode("store")} />;
  }
  return <App onOpenAdmin={() => setMode("admin")} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
