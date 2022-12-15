import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
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

import { Device } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import ContentDialog from "../../ContentDialog";

const DevicePage = () => {
  const http = useHttp();
  const deviceid = useParams<{ id: string }>().id;

  const [device, setDevice] = useState<Device>();
  const [snmpDialogOpen, setSnmpDialogOpen] = useState(false);

  useEffect(() => {
    if (!deviceid) return;
    http.get(`/device/${deviceid}`).then((response) => {
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

      <ContentDialog
        title="SNMP Details"
        open={snmpDialogOpen}
        onClose={() => setSnmpDialogOpen(false)}
        maxWidth="sm"
      >
        <Box>
          <Typography variant="body1">
            <b> SNMP Community: </b>
            {device?.snmp_community}
          </Typography>
        </Box>
      </ContentDialog>

      <Container sx={{ mt: 8 }}>
        {device && (
          <>
            <Box>
              <Typography variant="h4">{device.name}</Typography>
              <Typography variant="subtitle1">{device.description}</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
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
                  <Button
                    onClick={() => setSnmpDialogOpen(true)}
                    variant="text"
                  >
                    SNMP Details
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default DevicePage;
