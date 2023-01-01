import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Box,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Check } from "../../types";
import ContentDialog from "../ContentDialog";
import CheckForm from "../blocks/checks/CheckForm";
import useHttp from "../../hooks/useHttp";

const Checks = () => {
  const http = useHttp();
  const [showForm, setShowForm] = useState(false);
  const [checks, setChecks] = useState<Check[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<Check>();

  const loadChecks = () => {
    http.get("/check").then((res) => {
      if (res) {
        setChecks(res.data.data);
      }
    });
  };

  useEffect(() => {
    loadChecks();
  }, []);

  return (
    <>
      <ContentDialog
        title="Create Check"
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedCheck(undefined);
        }}
      >
        <CheckForm
          check={selectedCheck}
          onCreated={() => {
            setSelectedCheck(undefined);
            setShowForm(false);
            loadChecks();
          }}
        />
      </ContentDialog>
      <Backdrop open={http.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <h1> Checks </h1>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={checks}
            columns={[
              { field: "checkid", headerName: "ID", width: 70 },

              {
                field: "name",
                headerName: "Name",
                flex: 1,
              },
              {
                field: "description",
                headerName: "Description",
                flex: 2,
              },
              {
                field: "check_type",
                headerName: "Type",
                width: 130,
              },
              {
                field: "check_interval",
                headerName: "Interval",
                width: 130,
              },
              {
                field: "edit",
                headerName: "Edit",
                width: 70,
                renderCell: (params) => (
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setShowForm(true);
                      setSelectedCheck(params.row);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ),
              },
            ]}
            getRowId={(row) => row.checkid}
            disableSelectionOnClick
            pageSize={100}
            rowsPerPageOptions={[10, 20, 50, 100, 500]}
          />
        </Box>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setShowForm(true)}
          sx={{ mt: 2 }}
        >
          Create Check
        </Button>
      </Container>
    </>
  );
};

export default Checks;
