import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthRequired = (props: any) => {
  const authCtx = useAuth();
  const location = useLocation();

  return authCtx.token ? (
    props.children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default AuthRequired;
