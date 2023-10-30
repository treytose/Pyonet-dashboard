import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Alert from "@mui/material/Alert";
import ReactDOM from "react-dom";

const useSnackbar = () => {
  enum SEVERITY {
    INFO,
    ERROR,
    SUCCESS,
    WARNING,
    MESSAGE,
  }
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | JSX.Element>("");
  const [action, setAction] = useState<JSX.Element>();
  const [severity, setSeverity] = useState<SEVERITY>(SEVERITY.INFO);
  const [mounted, setMounted] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return {
    render: () =>
      mounted ? (
        ReactDOM.createPortal(
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            onClick={handleClose}
          >
            {
              {
                [SEVERITY.ERROR]: <Alert severity="error"> {message} </Alert>,
                [SEVERITY.SUCCESS]: (
                  <Alert severity="success"> {message} </Alert>
                ),
                [SEVERITY.WARNING]: (
                  <Alert severity="warning"> {message} </Alert>
                ),
                [SEVERITY.INFO]: <Alert severity="info"> {message} </Alert>,
                [SEVERITY.MESSAGE]: (
                  <SnackbarContent message={message} action={action} />
                ),
              }[severity]
            }
          </Snackbar>,
          document.getElementById("snackbar_container") as Element
        )
      ) : (
        <></>
      ),
    success: (message: string | JSX.Element) => {
      setMessage(message);
      setSeverity(SEVERITY.SUCCESS);
      setOpen(true);
    },
    error: (message: string | JSX.Element) => {
      setMessage(message);
      setSeverity(SEVERITY.ERROR);
      setOpen(true);
    },
    warning: (message: string | JSX.Element) => {
      setMessage(message);
      setSeverity(SEVERITY.WARNING);
      setOpen(true);
    },
    info: (message: string | JSX.Element) => {
      setMessage(message);
      setSeverity(SEVERITY.INFO);
      setOpen(true);
    },
    message: (message: string | JSX.Element, action: JSX.Element) => {
      setMessage(message);
      setSeverity(SEVERITY.MESSAGE);
      setAction(action);
      setOpen(true);
    },
  };
};

export default useSnackbar;
