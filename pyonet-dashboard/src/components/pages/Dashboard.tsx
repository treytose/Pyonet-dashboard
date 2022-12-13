import { useContext } from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

const Dashboard = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Container>
      {authCtx.token ? (
        <h1> You are logged in </h1>
      ) : (
        <h1> You are not logged in </h1>
      )}
      <Link to="/">
        <Button variant="contained"> Home </Button>
      </Link>
    </Container>
  );
};

export default Dashboard;
