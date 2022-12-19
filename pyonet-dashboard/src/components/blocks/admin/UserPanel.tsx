import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Role } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import ContentDialog from "../../ContentDialog";
import moment from "moment";

const createUserInitialValues = {
  username: "",
  password: "",
  roles: [],
};

const createUserValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  roles: Yup.array().required("At least 1 role is required"),
});

const UserPanel = () => {
  const http = useHttp();
  const [userFormOpen, setUserFormOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const loadUsers = () => {
    http.get("/user", { params: { joined: true } }).then((resp) => {
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
  }, []);

  const onCreateSubmit = (values: typeof createUserInitialValues) => {
    http.post("/user", values).then((resp) => {
      if (resp) {
        loadUsers();
        setUserFormOpen(false);
        formik.resetForm();
      }
    });
  };

  const formik = useFormik({
    initialValues: createUserInitialValues,
    validationSchema: createUserValidationSchema,
    onSubmit: onCreateSubmit,
  });

  return (
    <>
      <ContentDialog
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        title="Add User"
      >
        <br />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="roles-label">Roles</InputLabel>
                <Select
                  labelId="roles-label"
                  id="roles"
                  name="roles"
                  multiple
                  value={formik.values.roles}
                  onChange={formik.handleChange}
                  error={formik.touched.roles && Boolean(formik.errors.roles)}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.roleid} value={role.roleid}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formik.touched.roles && formik.errors.roles}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
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
              width: 150,
              renderCell: (params) => (
                <IconButton
                  color="primary"
                  onClick={() => {
                    console.log(params.row);
                  }}
                >
                  <EditIcon />
                </IconButton>
              ),
            },
          ]}
          getRowId={(row) => row.userid}
          pageSize={5}
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
