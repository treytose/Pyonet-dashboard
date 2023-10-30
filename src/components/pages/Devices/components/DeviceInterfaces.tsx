import { useEffect, useState } from "react";
import useHttp from "../../../../hooks/useHttp"
import { Button, Card, Checkbox, CircularProgress, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from "@mui/material";
import { Device } from "../../../../types";
import useSnackbar from "../../../../hooks/useSnackbar";

interface Props {
  device: Device;
  onMonitorSelected: () => void;
}

interface InterfaceData {
  [key: string]: {
    ifHCInOctetsOID: string;
    ifHCInOctetsValue: string;
    ifHCOutOctetsOID: string;
    ifHCOutOctetsValue: string;
  }
}

interface InterfaceSelection {
  interface: string;
  inOctetsOID: string;
  outOctetsOID: string;
}


const DeviceInterfaces = ({ device, onMonitorSelected }: Props) => {

  const http = useHttp();
  const snackbar = useSnackbar();
  const [resp, setResp] = useState<InterfaceData>();
  const [selectedInterfaces, setSelectedInterfaces] = useState<InterfaceSelection[]>([]);

  useEffect(() => {
    http.post("/device-poller", {
      "deviceid": device.deviceid,
      "route": "/poller/scan-interfaces",
      "params": { deviceid: device.deviceid }
    }).then((resp) => {
      if (resp) {
        setResp(resp.data);
      }
    })
  }, [device]);

  const handleMonitorSelected = () => {

    selectedInterfaces.forEach((interfaceData, idx) => {
      http.post("/device-check-group", {
        "name": `${interfaceData.interface}`,
        "description": `Check group for ${interfaceData.interface} in/out octets on ${device.name}`,
        "deviceid": device.deviceid
      }).then((resp) => {
        if (resp) {
          const checkGroupID = resp.data;
          http.post("/device-check", {
            "name": `${interfaceData.interface} - Out Octets`,
            "description": `Out Octets for ${interfaceData.interface} on ${device.name}`,
            "oid": interfaceData.outOctetsOID,
            "deviceid": device.deviceid,
            "check_type": "snmp",
            "check_interval": 60,
            "device_check_groupid": checkGroupID
          }).then((resp) => {
            http.post("/device-check", {
              "name": `${interfaceData.interface} - In Octets`,
              "description": `In Octets for ${interfaceData.interface} on ${device.name}`,
              "oid": interfaceData.inOctetsOID,
              "deviceid": device.deviceid,
              "check_type": "snmp",
              "check_interval": 60,
              "device_check_groupid": checkGroupID
            }).then((resp) => {
              if (idx == selectedInterfaces.length - 1) {
                onMonitorSelected();
              }
            });
          });
        }
      });
    });
  }

  return (
    <Box>
      {snackbar.render()}
      <Typography variant="h5">Interfaces</Typography>
      <Box>
        {http.loading && !resp && (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Scanning Interfaces...</Typography>
              <CircularProgress />
            </Stack>
          </Box>
        )}
      </Box>

      {
        resp && (
          <Box>
            <Stack direction="row" justifyContent={"space-between"}>
              <Typography variant="subtitle1">Select the interfaces you want to monitor. </Typography>
              <Button
                onClick={handleMonitorSelected}
                variant="outlined"
                disabled={selectedInterfaces.length == 0}
              >
                Monitor Selected
              </Button>
            </Stack>
            <Card sx={{ mt: 2, p: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Interface</TableCell>
                      <TableCell>In Octets</TableCell>
                      <TableCell>Out Octets</TableCell>
                      <TableCell>Monitor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(resp).map((key) => {
                      const interfaceData = resp[key];
                      return (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{interfaceData.ifHCInOctetsValue}</TableCell>
                          <TableCell>{interfaceData.ifHCOutOctetsValue}</TableCell>
                          <TableCell>
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedInterfaces([...selectedInterfaces, {
                                    interface: key,
                                    inOctetsOID: interfaceData.ifHCInOctetsOID,
                                    outOctetsOID: interfaceData.ifHCOutOctetsOID
                                  }])
                                } else {
                                  setSelectedInterfaces(selectedInterfaces.filter((i) => i.interface != key));
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        )
      }
    </Box>
  )

}

export default DeviceInterfaces;