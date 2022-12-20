import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Alert,
  Icon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Role } from "../../../../../types";
import useHttp from "../../../../../hooks/useHttp";
import useConfirm from "../../../../../hooks/useConfirm";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(8),
  roles: Yup.array().required("At least 1 role is required"),
});

interface EditUserFormProps {
  user: User;
  onEdited: () => void;
}

const EditUserForm = ({ user, onEdited }: EditUserFormProps) => {
  const http = useHttp();
  const confirm = useConfirm();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    http.get("/role").then((resp) => {
      if (resp) {
        setRoles(resp.data.data);
      }
    });
  }, []);

  const onSubmit = (values: any) => {
    if (values.password === "") {
      delete values.password;
    }

    http.put("/user/" + user.userid, values).then((resp) => {
      if (resp) {
        onEdited();
      }
    });
  };

  const handleDelete = () => {
    confirm.show(
      "Delete User",
      "Are you sure you want to delete this user?",
      () => {
        http.delete("/user/" + user.userid).then((resp) => {
          if (resp) {
            onEdited();
          }
        });
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      username: user.username,
      password: "",
      roles: user.roles?.map((role) => role.roleid) || [],
    },
    validationSchema,
    onSubmit,
  });

  return (
    <>
      {confirm.render()}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {http.error && (
            <Grid item xs={12}>
              <Alert severity="error">{http.error}</Alert>{" "}
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password
                  ? formik.errors.password
                  : "Only updated if provided"
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="roles-label">Roles</InputLabel>
              <Select
                label="Roles"
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
            <Stack direction="row" spacing={2}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
              >
                Edit
              </Button>
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditUserForm;
