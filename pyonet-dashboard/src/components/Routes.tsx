import App from "../App";
import Dashboard from "../pages/Dashboard";
import MainLayout from "./Layouts/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
