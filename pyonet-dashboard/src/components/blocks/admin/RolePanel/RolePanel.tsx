import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { Role } from "../../../../types";
import useHttp from "../../../../hooks/useHttp";

const RolePanel = () => {
  const http = useHttp();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    http.get("/role", { params: { joined: true } }).then((resp) => {
      if (resp) {
        console.log(resp);
        setRoles(resp.data.data);
      }
    });
  }, []);

  return (
    <>
      <Typography variant="h6"> Roles </Typography>
      <Box sx={{ height: "300px", width: "100%" }}>
        <DataGrid
          disableSelectionOnClick
          rows={roles}
          columns={[
            { field: "roleid", headerName: "ID", width: 70 },
            { field: "name", headerName: "Name", width: 130 },
            { field: "description", headerName: "Description", flex: 2 },
            {
              field: "permissions",
              headerName: "Permissions",
              width: 130,
              renderCell: (params) => {
                return params.row.permissions?.map((permission) => {
                  return <p>{permission.name}</p>;
                });
              },
              flex: 2,
            },
            {
              field: "edit",
              headerName: "Edit",
              width: 70,
              disableReorder: true,
              disableColumnMenu: true,
              sortable: false,
              renderCell: (params) => {
                return (
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                );
              },
            },
          ]}
          getRowId={(row) => row.roleid}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          pageSize={20}
        />
      </Box>
    </>
  );
};

export default RolePanel;
