import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative z-50 pt-20">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
