import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Backdrop,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridRowsProp } from "@mui/x-data-grid";
import { Device } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import ContentDialog from "../../ContentDialog";
import DeviceForm from "./DeviceForm";
import { Link } from "react-router-dom";

const Devices = () => {
  const http = useHttp();
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceFormOpen, setDeviceFormOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device>();

  const handleDeviceCreated = () => {
    setDeviceFormOpen(false);
    setSelectedDevice(undefined);
    // reload devices
    loadDevices();
  };

  const loadDevices = () => {
    http.get("/device").then((response) => {
      if (response) {
        // format rows for DataGrid
        setDevices(response.data.data);
      }
    });
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <>
      <ContentDialog
        title={selectedDevice ? "Edit Device" : "Add Device"}
        open={deviceFormOpen}
        onClose={() => {
          setDeviceFormOpen(false);
          setSelectedDevice(undefined);
        }}
      >
        <DeviceForm onCreated={handleDeviceCreated} device={selectedDevice} />
      </ContentDialog>

      <Backdrop open={http.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <h1>Devices</h1>
        <Box sx={{ height: 400 }}>
          <DataGrid
            getRowId={(row) => row.deviceid}
            rows={devices}
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
              {
                field: "edit",
                headerName: "Edit",
                width: 70,
                renderCell: (params) => (
                  <IconButton
                    onClick={() => {
                      setSelectedDevice(params.row as Device);
                      setDeviceFormOpen(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                ),
              },
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
