import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../ResponsiveAppBar";

const MainLayout = () => {
  return (
    <html>
      <header></header>
      <body>
        <ResponsiveAppBar />
        <div>
          <Outlet />
        </div>
      </body>
    </html>
  );
};

export default MainLayout;
