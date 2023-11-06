import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  FormHelperText,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as yup from "yup";
import { Device, Poller } from "../../../types";
import useHttp from "../../../hooks/useHttp";
import useConfirm from "../../../hooks/useConfirm";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string(),
  hostname: yup.string().required("Hostname is required"),
  snmp_community: yup
    .string()
    .default("public")
    .required("SNMP Community is required"),
  snmp_version: yup.string().default("2c").required("SNMP Version is required"),
  snmp_port: yup.number().default(161).required("SNMP Port is required"),
  pollerid: yup.number().required("Poller is required"),
});

type DeviceFormProps = {
  onCreated: () => void;
  device?: Device;
};

const DeviceForm = ({ onCreated, device }: DeviceFormProps) => {
  const http = useHttp();
  const confirm = useConfirm();
  const [pollers, setPollers] = useState<Poller[]>([]);

  //load pollers
  useEffect(() => {
    http.get("/poller").then((response) => {
      if (response) {
        setPollers(response.data.data);
      }
    });
  }, []);

  const onDelete = () => {
    if (device) {
      confirm.show("Are you sure?", "This action cannot be undone", () => {
        http.delete("/device/" + device.deviceid).then((resp) => {
          if (resp) {
            onCreated();
          }
        });
      });
    }
  };

  const onSubmit = (values: Partial<Device>) => {
    if (device) {
      http.put(`/device/${device.deviceid}`, values).then((resp) => {
        if (resp) {
          onCreated();
        }
      });
    } else {
      http.post("/device", values).then((resp) => {
        onCreated();
      });
    }
  };

  const formik = useFormik({
    onSubmit,
    validationSchema,
    initialValues: {
      name: device?.name || "",
      description: device?.description || "",
      hostname: device?.hostname || "",
      snmp_community: device?.snmp_community || "public",
      snmp_version: device?.snmp_version || "2c",
      snmp_port: device?.snmp_port || 161,
      pollerid: device?.pollerid,
    },
  });

  return (
    <>
      {confirm.render()}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
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
          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              fullWidth
              id="hostname"
              name="hostname"
              label="Hostname"
              value={formik.values.hostname}
              onChange={formik.handleChange}
              error={formik.touched.hostname && Boolean(formik.errors.hostname)}
              helperText={formik.touched.hostname && formik.errors.hostname}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
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
            <FormControl fullWidth>
              <FormLabel>Poller</FormLabel>
              <Select
                variant="standard"
                placeholder="Poller"
                id="pollerid"
                name="pollerid"
                value={formik.values.pollerid || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.pollerid && Boolean(formik.errors.pollerid)
                }
              >
                {pollers.map((poller) => (
                  <MenuItem key={poller.pollerid} value={poller.pollerid}>
                    {poller.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.pollerid && formik.errors.pollerid}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              SNMP
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              fullWidth
              id="snmp_community"
              name="snmp_community"
              label="SNMP Community"
              value={formik.values.snmp_community}
              onChange={formik.handleChange}
              error={
                formik.touched.snmp_community &&
                Boolean(formik.errors.snmp_community)
              }
              helperText={
                formik.touched.snmp_community && formik.errors.snmp_community
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              fullWidth
              id="snmp_version"
              name="snmp_version"
              label="SNMP Version"
              value={formik.values.snmp_version}
              onChange={formik.handleChange}
              error={
                formik.touched.snmp_version &&
                Boolean(formik.errors.snmp_version)
              }
              helperText={
                formik.touched.snmp_version && formik.errors.snmp_version
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              fullWidth
              id="snmp_port"
              name="snmp_port"
              label="SNMP Port"
              value={formik.values.snmp_port}
              onChange={formik.handleChange}
              error={
                formik.touched.snmp_port && Boolean(formik.errors.snmp_port)
              }
              helperText={formik.touched.snmp_port && formik.errors.snmp_port}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                fullWidth
              >
                Submit
              </Button>
              <IconButton color="error" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default DeviceForm;
