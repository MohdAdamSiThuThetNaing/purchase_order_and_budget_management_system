import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";

import "./MainLayout.css";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <main className="main-layout-content">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
