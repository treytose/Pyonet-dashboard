import { useState } from "react";
import { Container, Button } from "@mui/material";
import ContentDialog from "../ContentDialog";
import CheckForm from "../blocks/checks/CheckForm";

const Checks = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <ContentDialog
        title="Create Check"
        open={showForm}
        onClose={() => setShowForm(false)}
      >
        <CheckForm
          onCreated={() => {
            setShowForm(false);
          }}
        />
      </ContentDialog>

      <Container>
        <h1> Checks </h1>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Create Check
        </Button>
      </Container>
    </>
  );
};

export default Checks;
