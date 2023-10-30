import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface ContentDialogProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const ContentDialog = ({
  open,
  title,
  children,
  onClose,
  maxWidth,
}: ContentDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth || "md"} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography> {title || ""}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ padding: "1rem" }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDialog;
