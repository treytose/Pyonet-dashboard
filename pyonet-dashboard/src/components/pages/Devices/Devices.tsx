import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridRowsProp } from "@mui/x-data-grid";
import { Device } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import ContentDialog from "../../ContentDialog";
import DeviceForm from "./DeviceForm";
import { Link } from "react-router-dom";

const Devices = () => {
  const http = useHttp();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [deviceFormOpen, setDeviceFormOpen] = useState(false);

  const handleDeviceCreated = () => {
    setDeviceFormOpen(false);
    // reload devices
    loadDevices();
  };

  const loadDevices = () => {
    http.get("/device").then((response) => {
      if (response) {
        // format rows for DataGrid
        setRows(
          response.data.data.map((device: Device) => {
            return {
              id: device.deviceid,
              name: device.name,
              description: device.description,
              hostname: device.hostname,
            };
          })
        );
      }
    });
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <>
      <ContentDialog
        title="Add Device"
        open={deviceFormOpen}
        onClose={() => setDeviceFormOpen(false)}
      >
        <DeviceForm onCreated={handleDeviceCreated} />
      </ContentDialog>

      <Backdrop open={http.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <h1>Devices</h1>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={rows}
            columns={[
              { field: "id", headerName: "ID", width: 70 },
              {
                field: "name",
                headerName: "Name",
                width: 130,
                renderCell: (params) => (
                  <Link to={`/devices/${params.id}`}>{params.value}</Link>
                ),
              },
              { field: "description", headerName: "Description", flex: 2 },
              { field: "hostname", headerName: "Hostname", width: 130 },
            ]}
            pageSize={100}
            rowsPerPageOptions={[10, 20, 50, 100, 500]}
            disableSelectionOnClick
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setDeviceFormOpen(true)}
          >
            Add Device
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Devices;
