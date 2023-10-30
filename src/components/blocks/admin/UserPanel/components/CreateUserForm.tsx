import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Role } from "../../../../../types";
import useHttp from "../../../../../hooks/useHttp";

const initialValues = {
  username: "",
  password: "",
  roles: [],
};

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required").min(8),
  roles: Yup.array().required("At least 1 role is required"),
});

interface CreateUserFormProps {
  onCreated: () => void;
}

const CreateUserForm = ({ onCreated }: CreateUserFormProps) => {
  const http = useHttp();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    http.get("/role").then((resp) => {
      if (resp) {
        setRoles(resp.data.data);
      }
    });
  }, []);

  const onSubmit = (values: Partial<User> & { password: string }) => {
    http.post("/user", values).then((resp) => {
      if (resp) {
        onCreated();
        formik.resetForm();
      }
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {http.error && (
          <Grid item xs={12}>
            <Alert severity="error">{http.error}</Alert>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
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
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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
  );
};

export default CreateUserForm;
