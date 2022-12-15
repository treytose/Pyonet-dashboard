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
import { Poller } from "../../../types";
import useHttp from "../../../hooks/useHttp";

const PollerView = () => {
  const http = useHttp();
  const pollerid = useParams<{ id: string }>().id;
  const [poller, setPoller] = useState<Poller>();

  useEffect(() => {
    if (!pollerid) return;
    http.get(`/poller/${pollerid}`).then((response) => {
      if (response) {
        setPoller(response.data);
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
              <Typography variant="h4">{poller.name}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <b> Poller ID: </b>
                {poller.pollerid}
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default PollerView;
