import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Grid,
  MenuItem,
  Button,
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Permission } from "../../../../../types";
import useHttp from "../../../../../hooks/useHttp";

interface CreateFormProps {
  onCreate: () => void;
}

const CreateForm = ({ onCreate }: CreateFormProps) => {
  const http = useHttp();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    http.get("/permission").then((resp) => {
      if (resp) {
        setPermissions(resp.data.data);
      }
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissions: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      permissions: Yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      http.post("/role", values).then((resp) => {
        if (resp) {
          console.log(resp);
          onCreate();
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Permissions</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formik.values.permissions}
              onChange={formik.handleChange}
              label="Permissions"
              multiple
              name="permissions"
              error={
                formik.touched.permissions && Boolean(formik.errors.permissions)
              }
            >
              {permissions.map((p) => (
                <MenuItem key={p.permissionid} value={p.permissionid}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.permissions && formik.errors.permissions}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateForm;
