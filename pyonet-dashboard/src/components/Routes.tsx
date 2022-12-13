import App from "../App";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MainLayout from "./Layouts/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthRequired from "./AuthRequired";

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
        element: (
          <AuthRequired>
            <Dashboard />
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
