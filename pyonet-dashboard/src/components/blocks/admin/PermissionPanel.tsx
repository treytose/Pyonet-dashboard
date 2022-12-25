import { useState, useEffect } from "react";
import { Permission } from "../../../types";
import { Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useHttp from "../../../hooks/useHttp";

const PermissionPanel = () => {
  const http = useHttp();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    http.get("/permission").then((resp) => {
      if (resp) {
        setPermissions(resp.data.data);
      }
    });
  }, []);

  return (
    <>
      <Typography variant="h6"> Permissions </Typography>
      <Box sx={{ height: "300px", width: "100%" }}>
        <DataGrid
          disableSelectionOnClick
          rows={permissions}
          columns={[
            { field: "permissionid", headerName: "ID", width: 70 },
            { field: "name", headerName: "Name", width: 130 },
            { field: "description", headerName: "Description", flex: 2 },
          ]}
          getRowId={(row) => row.permissionid}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
        />
      </Box>
    </>
  );
};

export default PermissionPanel;
