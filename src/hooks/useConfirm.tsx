import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { on } from "stream";

const useConfirm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [onConfirm, setOnConfirm] = useState<() => void>();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const render = () => {
    return (
      <Dialog open={open} maxWidth="md">
        <DialogTitle>{title || "Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleConfirm}>
            Yes
          </Button>
          <Button color="primary" onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const show = (title: string, text: string, onConfirm: () => void) => {
    setTitle(title);
    setText(text);
    setOnConfirm(() => {
      return onConfirm;
    });
    setOpen(true);
  };

  return {
    render,
    show,
  };
};

export default useConfirm;
