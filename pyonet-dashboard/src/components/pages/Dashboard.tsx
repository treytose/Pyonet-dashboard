import { useContext } from "react";
import { Container, Button, Stack } from "@mui/material";
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
      <Stack direction={"row"} spacing={2}>
        <Link to="/">
          <Button variant="contained"> Home </Button>
        </Link>
        <Link to="/devices">
          <Button variant="contained"> Devices </Button>
        </Link>
        <Link to="/pollers">
          <Button variant="contained"> Pollers </Button>
        </Link>
        <Link to="/admin">
          <Button variant="contained"> Admin </Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default Dashboard;
