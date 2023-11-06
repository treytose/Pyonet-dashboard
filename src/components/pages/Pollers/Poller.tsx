import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Divider,
  Button,
  Container,
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  Card,
  Grid,
  styled,
  Stack,
  Tooltip,
} from "@mui/material";
import HttpIcon from '@mui/icons-material/Http';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Poller } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import usePollerHttp from "../../../hooks/usePollerHttp";
import useConfirm from "../../../hooks/useConfirm";

const PollerView = () => {
  const http = useHttp();
  const confirm = useConfirm();
  const pollerid = useParams<{ id: string }>().id;
  const pollerHttp = usePollerHttp({ pollerid: pollerid });
  const [poller, setPoller] = useState<Poller>();
  const [authTestSuccess, setAuthTestSuccess] = useState<string>("pending");
  const [pollStatus, setPollStatus] = useState<string>("pending");

  useEffect(() => {
    if (!pollerid) return;
    http.get(`/poller/${pollerid}`).then((response) => {
      if (response) {
        setPoller(response.data);
      }
      checkPollerStatus();

    });
  }, [pollerid]);

  const checkPollerStatus = useCallback(() => {
    pollerHttp.get("/auth/test").then((response) => {
      if (response.status == 200) {
        setAuthTestSuccess("success");
      } else {
        setAuthTestSuccess("error");
        console.error(response);
      }
    });

    pollerHttp.get("/poller/status").then((response) => {
      console.log(response);
      if (response.status == 200) {
        setPollStatus(response.data.status);
      } else {
        setPollStatus("error");
        console.error(response);
      }
    });
  }, [pollerid]);

  useEffect(() => {

    // Check status in a loop every 10 seconds
    const interval = setInterval(() => {
      checkPollerStatus();
    }, 10000);

    return () => clearInterval(interval);

  }, [pollerid]);



  return (
    <>
      {confirm.render()}
      <Backdrop open={http.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container sx={{ mt: 8 }}>
        {poller && (
          <>
            <Box>
              <Stack direction="row" justifyContent={"space-between"} alignItems="center">
                <Box>
                  <Typography variant="h4">{poller.name}</Typography>
                  <Typography variant="body1">{poller.description}</Typography>
                </Box>
                <Typography variant="body1">
                  <b> ID: </b>
                  {poller.pollerid}
                </Typography>
              </Stack>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8} lg={6}>
                <Card sx={{ p: 2, mt: 2 }}>
                  <Typography variant="body1">
                    <b> HTTP Status: </b>
                    {
                      authTestSuccess == "success" ?
                        <Tooltip title="Poller is enabled and accessible">
                          <Typography variant="caption" sx={{ color: "green" }}>
                            HTTP OK
                          </Typography>
                        </Tooltip>
                        : authTestSuccess == "pending" ?
                          <CircularProgress size={20} />
                          :
                          <Tooltip title={pollerHttp.error}>
                            <Typography variant="caption" sx={{ color: "red" }} onClick={checkPollerStatus}>
                              Unable to connect to poller
                            </Typography>
                          </Tooltip>
                    }
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems={"center"}>

                    <Typography variant="body1">
                      <b> Poller Status: </b>
                    </Typography>
                    <>
                      {
                        pollStatus == "error" ?
                          <Tooltip title={pollerHttp.error}>
                            <Typography variant="caption" sx={{ color: "red" }} onClick={checkPollerStatus}>
                              {pollerHttp.error}
                            </Typography>
                          </Tooltip>
                          : pollStatus == "pending" ?
                            <CircularProgress size={20} />
                            : pollStatus == "idle" ?
                              <Stack direction="row" spacing={1} alignItems="baseline">
                                <Tooltip title="Poller is idle">
                                  <Typography variant="caption" sx={{ color: "orange" }}>
                                    {pollStatus}
                                  </Typography>
                                </Tooltip>
                                <Button
                                  sx={{ fontSize: "12px" }}
                                  variant="text"
                                  size="small"
                                  onClick={() => { pollerHttp.post("/poller/start").then((response) => { checkPollerStatus() }) }}
                                >
                                  Start
                                </Button>
                              </Stack>
                              :
                              <Stack direction="row" spacing={0} alignItems="baseline">
                                <Typography variant="caption" sx={{ color: "green" }}>
                                  {pollStatus}
                                </Typography>
                                <Button
                                  sx={{ fontSize: "10px", pb: 0, pl: 2, pr: 2 }}
                                  variant="text"
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    confirm.show("Are you sure you want to stop the poller?", "", () => {
                                      pollerHttp.post("/poller/stop").then((response) => { checkPollerStatus() })
                                    })
                                  }}
                                >
                                  Stop
                                </Button>
                              </Stack>

                      }
                    </>
                  </Stack>

                  <Typography variant="body1">
                    <b> Host: </b>
                    {poller.hostname}:{poller.port}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default PollerView;
