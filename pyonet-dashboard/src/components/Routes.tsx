import MainLayout from "./Layouts/Main";
import { Devices, Dashboard, Login } from "./pages";
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
        path: "dashboard",
        element: (
          <AuthRequired>
            <Dashboard />
          </AuthRequired>
        ),
      },
      {
        path: "devices",
        element: (
          <AuthRequired>
            <Devices />
          </AuthRequired>
        ),
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
