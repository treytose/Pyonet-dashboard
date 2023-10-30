import React, { useState, useEffect } from "react";
import { useTheme, Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Button, Checkbox, CircularProgress } from "@mui/material";
import useHttp from "../../../../hooks/useHttp";
import { Device, DeviceCheck, GroupedDeviceChecks } from "../../../../types";

interface Props {
  device: Device;
}

const DeviceChecks = ({ device }: Props) => {
  const theme = useTheme();
  const http = useHttp();
  const [checks, setChecks] = useState<GroupedDeviceChecks>();

  useEffect(() => {
    http.get("/device-check/by-device/" + device.deviceid, { params: { grouped: true } }).then((res) => {
      if (res) {
        setChecks(res.data);
      }
    });
  }, []);

  return (
    <Box>
      <Typography variant="h5">Checks</Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Check Type</TableCell>
              <TableCell>Check Interval</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!checks && !http.loading && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center" }}>No checks configured</TableCell>
              </TableRow>
            )}
            {
              http.loading && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )
            }
            {
              checks?.groups && Object.keys(checks.groups).map((groupid: any, idx) => {
                const group = checks.groups[groupid];
                const groupChecks = group.checks;

                return (
                  <React.Fragment key={idx}>
                    <TableRow sx={{
                      backgroundColor: theme.palette.background.default
                    }}>
                      <TableCell colSpan={1} sx={{ fontWeight: "bold" }}>{group.name}</TableCell>
                      <TableCell colSpan={3}>{group.description}</TableCell>
                    </TableRow>
                    {
                      groupChecks.map((check: DeviceCheck, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell
                              sx={{ pl: 3 }}
                            >{check.name}</TableCell>
                            <TableCell>{check.description}</TableCell>
                            <TableCell>{check.check_type}</TableCell>
                            <TableCell>{check.check_interval}</TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </React.Fragment>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  )

}

export default DeviceChecks;