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

const AdminPanel = () => {
  const http = useHttp();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [userFormOpen, setUserFormOpen] = useState<boolean>(false);
  const [roleFormOpen, setRoleFormOpen] = useState<boolean>(false);
  const [permissionFormOpen, setPermissionFormOpen] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<number>(0);

  const loadUsers = () => {
    http.get("/user").then((resp) => {
      if (resp) {
        setUsers(resp.data.data);
      }
    });
  };

  useEffect(() => {
    loadUsers();

    http.get("/role").then((resp) => {
      if (resp) {
        setRoles(resp.data.data);
      }
    });

    http.get("/permission").then((resp) => {
      if (resp) {
        setPermissions(resp.data.data);
      }
    });
  }, []);

  return (
    <>
      <ContentDialog open={userFormOpen} onClose={() => setUserFormOpen(false)}>
        <FastForm
          entityName="user"
          onCreated={() => {
            setUserFormOpen(false);
            loadUsers();
          }}
        />
      </ContentDialog>

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
        {currentTab === 0 && (
          <>
            <Typography variant="h6"> Users </Typography>
            <Box sx={{ height: "400px", width: "100%" }}>
              <DataGrid
                disableSelectionOnClick
                rows={users}
                columns={[
                  { field: "id", headerName: "ID", width: 70 },
                  { field: "username", headerName: "Username", width: 130 },
                ]}
                getRowId={(row) => row.userid}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            </Box>
            <Button onClick={() => setUserFormOpen(true)}> Add User </Button>
          </>
        )}

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
