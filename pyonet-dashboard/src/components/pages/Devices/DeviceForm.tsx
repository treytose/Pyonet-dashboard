import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Device, Poller } from "../../../types";
import useHttp from "../../../hooks/useHttp";

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

const initialValues = {
  name: "",
  description: "",
  hostname: "",
  snmp_community: "public",
  snmp_version: "2c",
  snmp_port: 161,
  pollerid: 0,
};

type DeviceFormProps = {
  onCreated: () => void;
};

const DeviceForm = ({ onCreated }: DeviceFormProps) => {
  const http = useHttp();
  const [pollers, setPollers] = useState<Poller[]>([]);

  //load pollers
  useEffect(() => {
    http.get("/poller").then((response) => {
      if (response) {
        setPollers(response.data.data);
      }
    });
  }, []);

  const onSubmit = (values: Partial<Device>) => {
    http.post("/device", values).then((response) => {
      console.log(response);
      onCreated();
    });
  };

  const formik = useFormik({ onSubmit, validationSchema, initialValues });

  return (
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
            helperText={formik.touched.description && formik.errors.description}
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
              error={formik.touched.pollerid && Boolean(formik.errors.pollerid)}
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
              formik.touched.snmp_version && Boolean(formik.errors.snmp_version)
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
            error={formik.touched.snmp_port && Boolean(formik.errors.snmp_port)}
            helperText={formik.touched.snmp_port && formik.errors.snmp_port}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DeviceForm;
