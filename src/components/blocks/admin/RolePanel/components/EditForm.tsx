import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Grid,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Permission, Role } from "../../../../../types";
import useHttp from "../../../../../hooks/useHttp";
import useConfirm from "../../../../../hooks/useConfirm";

interface EditFormProps {
  role: Role;
  onEdit: () => void;
}

const EditForm = ({ role, onEdit }: EditFormProps) => {
  const http = useHttp();
  const confirm = useConfirm();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    http.get("/permission").then((resp) => {
      if (resp) {
        setPermissions(resp.data.data);
      }
    });
  }, []);

  const handleDelete = () => {
    confirm.show(
      "Delete Role",
      "Are you sure you want to delete this role?",
      () => {
        http.delete(`/role/${role.roleid}`).then((resp) => {
          if (resp) {
            onEdit();
          }
        });
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map(
        (permission) => permission.permissionid
      ),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      permissions: Yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      http.put(`/role/${role.roleid}`, values).then((resp) => {
        if (resp) {
          console.log(resp);
          onEdit();
        }
      });
    },
  });

  return (
    <>
      {confirm.render()}
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
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={
                formik.touched.permissions && Boolean(formik.errors.permissions)
              }
            >
              <InputLabel id="permissions-label">Permissions</InputLabel>
              <Select
                labelId="permissions-label"
                id="permissions"
                name="permissions"
                multiple
                value={formik.values.permissions}
                onChange={formik.handleChange}
                label="Permissions"
              >
                {permissions.map((permission) => (
                  <MenuItem
                    key={permission.permissionid}
                    value={permission.permissionid}
                  >
                    {permission.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.permissions && formik.errors.permissions}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Edit
              </Button>
              <IconButton
                onClick={handleDelete}
                color="error"
                aria-label="delete role"
                component="span"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditForm;
