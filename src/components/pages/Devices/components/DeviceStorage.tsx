import { useState, useEffect } from "react";
import { IconButton, Checkbox, Button, Stack, CircularProgress, Card, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Device } from "../../../../types";
import usePollerHttp from "../../../../hooks/usePollerHttp";
import RefreshIcon from '@mui/icons-material/Refresh';
import useHttp from "../../../../hooks/useHttp";

interface Props {
  device: Device;
  onMonitorSelected: () => void;
}

interface StorageResp {
  desc: string;
  alloc_units: number;
  size: number;
  used: number;
  percent_used: number;
  desc_oid: string;
  used_oid: string;
  size_oid: string;
  alloc_units_oid: string;
}

const toGB = (bytes: number, alloc_units: number) => {
  // round to 1 decimal places

  let value = (bytes / 1024 / 1024 / 1024) * alloc_units;
  return Math.round(value * 10) / 10;
}

const DeviceStorage = ({ device, onMonitorSelected }: Props) => {
  const http = useHttp();
  const pollerHttp = usePollerHttp({ pollerid: device.pollerid });
  const [storage, setStorage] = useState<StorageResp[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<StorageResp[]>([]);

  useEffect(() => {
    scan();
  }, []);

  const scan = () => {
    pollerHttp.get("/poller/scan-storage", { params: { deviceid: device.deviceid } }).then((resp) => {
      if (resp) {
        console.log(resp);
        setStorage(resp.data);
      }
    });
  }


  const handleMonitorSelected = () => {
    selectedStorage.forEach((storageData, idx) => {
      http.post("/device-check-group", {
        "name": `${storageData.desc}`,
        "description": `Used and total storage available on ${storageData.desc} on ${device.name}`,
        "deviceid": device.deviceid
      }).then((resp) => {
        if (resp) {
          const checkGroupID = resp.data;
          http.post("/device-check", {
            "name": "usedStorage",
            "description": `Used storage for ${storageData.desc} on ${device.name}`,
            "oid": storageData.used_oid,
            "deviceid": device.deviceid,
            "check_type": "snmp",
            "check_interval": 300, // 5 minutes
            "device_check_groupid": checkGroupID
          }).then((resp) => {
            http.post("/device-check", {
              "name": "totalStorage",
              "description": `Total storage for ${storageData.desc} on ${device.name}`,
              "oid": storageData.size_oid,
              "deviceid": device.deviceid,
              "check_type": "snmp",
              "check_interval": 300,
              "device_check_groupid": checkGroupID
            }).then((resp) => {
              if (idx == selectedStorage.length - 1) {
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
      <Stack direction="row" spacing={0.2} alignItems="center">
        <Typography variant="h5">Storage</Typography>
        <IconButton onClick={scan} size="small">
          <RefreshIcon />
        </IconButton>
      </Stack>
      <Box>
        {pollerHttp.loading && storage.length == 0 && (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Scanning Storage...</Typography>
              <CircularProgress />
            </Stack>
          </Box>
        )}
      </Box>
      {
        storage.length == 0 && !pollerHttp.loading && (
          <Box>
            <Stack direction="row" spacing={0.2} alignItems="center">
              <Typography variant="subtitle1">No storage found.</Typography>
              <IconButton onClick={scan}>
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Box>
        )
      }
      {storage.length > 0 && (
        <Box>
          <Stack direction="row" justifyContent={"space-between"}>
            <Typography variant="subtitle1">Select the partitions you want to monitor. </Typography>
            <Button
              onClick={handleMonitorSelected}
              variant="outlined"
              disabled={selectedStorage.length == 0}
            >
              Monitor Selected
            </Button>
          </Stack>
          <Card sx={{ mt: 2, p: 2, mb: 4 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Storage</TableCell>
                    {/* <TableCell>Allocated</TableCell> */}
                    <TableCell>Used</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell> Percent Used</TableCell>
                    <TableCell>Monitor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storage.map((s: StorageResp) => (
                    <TableRow key={s.desc_oid}>
                      <TableCell>{s.desc}</TableCell>
                      {/* <TableCell>{s.alloc_units}</TableCell> */}
                      <TableCell>{toGB(s.used, s.alloc_units)}GB</TableCell>
                      <TableCell>{toGB(s.size, s.alloc_units)}GB</TableCell>
                      <TableCell>{Math.round(s.percent_used)}%</TableCell>
                      <TableCell sx={{ pt: 0, pb: 0 }}>
                        <Checkbox
                          size="small"
                          checked={selectedStorage.includes(s)}
                          onClick={() => {
                            if (selectedStorage.includes(s)) {
                              setSelectedStorage(selectedStorage.filter((i) => i != s));
                            } else {
                              setSelectedStorage([...selectedStorage, s]);
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>)}
    </Box>
  )

}

export default DeviceStorage;