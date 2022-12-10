import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../ResponsiveAppBar";

const MainLayout = () => {
  return (
    <>
      <ResponsiveAppBar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
