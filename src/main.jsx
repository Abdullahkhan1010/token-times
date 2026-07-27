import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminShell from "./admin-components/components/AdminShell";
import "./index.css";

const isAdminRoute = window.location.pathname.startsWith("/admin");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminShell /> : <App />}
  </React.StrictMode>
);
