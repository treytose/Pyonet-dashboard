import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const authCtx = useContext(AuthContext);

  return authCtx;
};

export default useAuth;
