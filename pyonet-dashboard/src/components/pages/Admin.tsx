import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Grid,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { User, Role, Permission } from "../../types";
import FastForm from "../FastForm";
import ContentDialog from "../ContentDialog";
import useHttp from "../../hooks/useHttp";

import UserPanel from "../blocks/admin/UserPanel";

const AdminPanel = () => {
  const http = useHttp();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [userFormOpen, setUserFormOpen] = useState<boolean>(false);
  const [roleFormOpen, setRoleFormOpen] = useState<boolean>(false);
  const [permissionFormOpen, setPermissionFormOpen] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <>
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4"> Admin Dashboard </Typography>
        <br />
        <Tabs
          value={currentTab}
          onChange={(e, value) => setCurrentTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Users" />
          <Tab label="Roles" />
          <Tab label="Permissions" />
        </Tabs>
        <br />
        {currentTab === 0 && <UserPanel />}

        {currentTab === 1 && (
          <>
            <Typography variant="h6"> Roles </Typography>
            <Box sx={{ height: "300px", width: "100%" }}>
              <DataGrid
                disableSelectionOnClick
                rows={roles}
                columns={[
                  { field: "id", headerName: "ID", width: 70 },
                  { field: "name", headerName: "Name", width: 130 },
                ]}
                getRowId={(row) => row.roleid}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            </Box>
          </>
        )}
        {currentTab === 2 && (
          <>
            <Typography variant="h6"> Permissions </Typography>
            <Box sx={{ height: "300px", width: "100%" }}>
              <DataGrid
                disableSelectionOnClick
                rows={permissions}
                columns={[
                  { field: "id", headerName: "ID", width: 70 },
                  { field: "name", headerName: "Name", width: 130 },
                ]}
                getRowId={(row) => row.permissionid}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default AdminPanel;
