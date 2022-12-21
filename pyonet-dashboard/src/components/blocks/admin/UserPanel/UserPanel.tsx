import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { User, Role } from "../../../../types";
import useHttp from "../../../../hooks/useHttp";
import ContentDialog from "../../../ContentDialog";
import moment from "moment";

import CreateUserForm from "./components/CreateUserForm";
import EditUserForm from "./components/EditUserForm";

const UserPanel = () => {
  const http = useHttp();
  const [userFormOpen, setUserFormOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedEditUser, setSelectedEditUser] = useState<User | null>(null);

  const loadUsers = () => {
    http.get("/user", { params: { joined: true } }).then((resp) => {
      if (resp) {
        setUsers(resp.data.data);
      }
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <ContentDialog
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        title="Add User"
      >
        <br />
        <CreateUserForm
          onCreated={() => {
            setUserFormOpen(false);
            loadUsers();
          }}
        />
      </ContentDialog>

      <ContentDialog
        open={!!selectedEditUser}
        onClose={() => setSelectedEditUser(null)}
        title="Edit User"
      >
        <br />
        {selectedEditUser && (
          <EditUserForm
            user={selectedEditUser}
            onEdited={() => {
              setSelectedEditUser(null);
              loadUsers();
            }}
          />
        )}
      </ContentDialog>

      <Typography variant="h6"> Users </Typography>
      <Box sx={{ height: "400px", width: "100%" }}>
        <DataGrid
          disableSelectionOnClick
          rows={users}
          columns={[
            {
              field: "id",
              headerName: "ID",
              width: 70,
              renderCell: (params) => params.row.userid,
            },
            { field: "username", headerName: "Username", width: 170 },
            {
              field: "create_date",
              headerName: "Create Date",
              flex: 1,
              renderCell: (params) => moment(params.value).format("MM/DD/YYYY"),
            },
            {
              field: "roles",
              headerName: "Roles",
              flex: 2,
              renderCell: (params) => (
                <strong>
                  {params.value.map((role: Role) => role.name).join(", ")}
                </strong>
              ),
            },
            {
              field: "action",
              headerName: "Edit",
              width: 70,
              disableReorder: true,
              disableColumnMenu: true,
              sortable: false,
              renderCell: (params) => (
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedEditUser(params.row);
                  }}
                >
                  <EditIcon />
                </IconButton>
              ),
            },
          ]}
          getRowId={(row) => row.userid}
          pageSize={20}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
        />
      </Box>
      <Button startIcon={<AddIcon />} onClick={() => setUserFormOpen(true)}>
        {" "}
        Add User{" "}
      </Button>
    </>
  );
};

export default UserPanel;
