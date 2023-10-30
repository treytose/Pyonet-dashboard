import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { Role } from "../../../../types";
import useHttp from "../../../../hooks/useHttp";

import ContentDialog from "../../../ContentDialog";
import CreateForm from "./components/CreateForm";
import EditForm from "./components/EditForm";

const RolePanel = () => {
  const http = useHttp();
  const [roles, setRoles] = useState<Role[]>([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const updateRoles = () => {
    http.get("/role", { params: { joined: true } }).then((resp) => {
      if (resp) {
        console.log(resp);
        setRoles(resp.data.data);
      }
    });
  };

  useEffect(() => {
    updateRoles();
  }, []);

  return (
    <>
      <ContentDialog
        title="Create Role"
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
      >
        <CreateForm
          onCreate={() => {
            updateRoles();
            setCreateFormOpen(false);
          }}
        />
      </ContentDialog>

      <ContentDialog
        title="Edit Role"
        open={!!selectedRole}
        onClose={() => setSelectedRole(null)}
      >
        {selectedRole && (
          <EditForm
            role={selectedRole}
            onEdit={() => {
              updateRoles();
              setSelectedRole(null);
            }}
          />
        )}
      </ContentDialog>

      <Typography variant="h6"> Roles </Typography>
      <Box sx={{ height: "400px", width: "100%" }}>
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
                return (
                  <Typography variant="body2">
                    {params.row.permissions?.map((p) => p.name).join(", ")}
                  </Typography>
                );
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
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedRole(params.row);
                    }}
                  >
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
      <Box>
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateFormOpen(true)}
        >
          Create Role
        </Button>
      </Box>
    </>
  );
};

export default RolePanel;
