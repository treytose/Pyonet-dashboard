import { useState, useEffect, useCallback } from "react";
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
  Stack,
  Tooltip,
} from "@mui/material";
import HttpIcon from '@mui/icons-material/Http';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Poller } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import usePollerHttp from "../../../hooks/usePollerHttp";

const PollerView = () => {
  const http = useHttp();
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



  return (
    <>
      <Backdrop open={http.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container sx={{ mt: 8 }}>
        {poller && (
          <>
            <Box>
              <Stack direction="column">
                <Typography variant="h4">{poller.name}</Typography>

              </Stack>
            </Box>
            <Box>
              <Typography variant="body1">
                <b> ID: </b>
                {poller.pollerid}
              </Typography>
              <Typography variant="body1">
                <b> Description: </b>
                {poller.description}
              </Typography>
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
                          HTTP ERROR
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
                          Poller ERROR
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
                            <Button variant="outlined" size="small" onClick={() => { pollerHttp.post("/poller/start").then((response) => { checkPollerStatus() }) }}>
                              Start
                            </Button>
                          </Stack>
                          :
                          <Typography variant="caption" sx={{ color: "green" }}>
                            {pollStatus}
                          </Typography>

                  }
                </>
              </Stack>

              <Typography variant="body1">
                <b> Host: </b>
                {poller.hostname}:{poller.port}
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default PollerView;
