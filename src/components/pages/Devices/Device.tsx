import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  Button,
  Container,
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  styled,
} from "@mui/material";
import DeviceForm from "./DeviceForm";
import useSnackbar from "../../../hooks/useSnackbar";
import { Device } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import DeviceInterfaces from "./components/DeviceInterfaces";
import DeviceChecks from "./components/DeviceChecks";
import DeviceStorage from "./components/DeviceStorage";

const DevicePage = () => {
  const http = useHttp();
  const snackbar = useSnackbar();
  const deviceid = useParams<{ id: string }>().id;

  const [device, setDevice] = useState<Device>();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (!deviceid) return;
    http.get(`/device/${deviceid}`, { params: { joined: true } }).then((response) => {
      if (response) {
        setDevice(response.data);
      }
    });
  }, [deviceid]);

  return (
    <>
      <Backdrop open={http.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {snackbar.render()}
      <Container sx={{ mt: 8 }}>
        {device && (
          <>
            <Box>
              <Typography variant="h4">{device.name}</Typography>
              <Typography variant="subtitle1">{device.description}</Typography>
            </Box>
            <Tabs
              value={selectedTab}
              onChange={(e, v) => setSelectedTab(v)}
              sx={{ mt: 2 }}
            >
              <Tab label="Overview" />
              <Tab label="Interfaces" />
              <Tab label="Storage" />
              <Tab label="Checks" />
              <Tab label="Settings" />
            </Tabs>
            {selectedTab == 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ mt: 2, p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">Device Details </Typography>
                      <Typography variant="subtitle1">
                        ID: {device.deviceid}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1">
                      <b>Hostname:</b> {device.hostname}
                    </Typography>
                    <Typography variant="body1">
                      <b>Poller:</b> <Link to={`/pollers/${device.poller?.pollerid}`}>{device.poller?.name || "not set"}</Link>
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2, textDecoration: "underline" }}>
                      SNMP Details
                    </Typography>
                    <Typography variant="body1">
                      <b> SNMP Community: </b>
                      {device?.snmp_community}
                    </Typography>
                    <Typography variant="body1">
                      <b> SNMP Version: </b>
                      {device?.snmp_version}
                    </Typography>
                    <Typography variant="body1">
                      <b> SNMP Port: </b>
                      {device?.snmp_port}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            )}
            {
              selectedTab == 1 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={8}>
                    <DeviceInterfaces device={device} onMonitorSelected={() => {
                      setSelectedTab(3);
                      snackbar.success("Interfaces Monitored");
                    }} />
                  </Grid>
                </Grid>
              )
            }
            {
              selectedTab == 2 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={8}>
                    <DeviceStorage device={device} onMonitorSelected={() => {
                      setSelectedTab(3);
                      snackbar.success("Partitions Monitored");
                    }} />
                  </Grid>
                </Grid>
              )
            }
            {
              selectedTab == 3 && (
                <Card sx={{ mt: 2, p: 4 }}>
                  <DeviceChecks device={device} />
                </Card>
              )
            }
            {
              selectedTab == 4 && (
                <Card sx={{ mt: 2, p: 4 }}>
                  <DeviceForm device={device} onCreated={() => {
                    http.get(`/device/${deviceid}`, { params: { joined: true } }).then((response) => {
                      if (response) {
                        setDevice(response.data);
                        snackbar.success("Device Updated");
                      }
                    });
                  }} />
                </Card>
              )
            }
          </>
        )}
      </Container>
    </>
  );
};

export default DevicePage;
