import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Container>
      <Link to="/">
        <Button variant="contained"> Home </Button>
      </Link>
    </Container>
  );
};

export default Dashboard;
