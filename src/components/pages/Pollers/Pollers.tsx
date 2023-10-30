import React, { useState, useEffect } from "react";
import { DataGrid, GridRowsProp } from "@mui/x-data-grid";
import { Box, Grid, Container, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { Poller } from "../../../types";
import useHttp from "../../../hooks/useHttp";

const Pollers = () => {
  const http = useHttp();
  const [pollers, setPollers] = useState<Poller[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    http.get("/poller").then((response) => {
      if (response) {
        // setPollers(response.data.data);
        setRows(
          response.data.data.map((poller: Poller) => {
            return {
              id: poller.pollerid,
              name: poller.name,
              description: poller.description,
            };
          })
        );
      }
    });
  }, []);

  return (
    <Container sx={{ mt: 8 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Pollers</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              disableSelectionOnClick
              rows={rows}
              columns={[
                { field: "id", headerName: "ID", width: 70 },
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  renderCell: (params) => {
                    return (
                      <Link to={`/pollers/${params.id}`}>{params.value}</Link>
                    );
                  },
                },
                { field: "description", headerName: "Description", flex: 2 },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button startIcon={<AddIcon />} variant="contained">
            Add Poller
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Pollers;
