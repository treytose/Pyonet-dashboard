import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

const AuthRequired = (props: any) => {
  const authCtx = useAuth();
  const location = useLocation();

  return authCtx.token ? (
    props.children || <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default AuthRequired;
