import MainLayout from "./Layouts/Main";
import { Devices, Dashboard, Login, Device } from "./pages";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthRequired from "./AuthRequired";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={"/dashboard"} />,
      },
      {
        element: <AuthRequired />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "devices",
            element: <Devices />,
          },
          {
            path: "devices/:id",
            element: <Device />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
