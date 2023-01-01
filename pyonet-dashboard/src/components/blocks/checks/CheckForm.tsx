import { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import useHttp from "../../../hooks/useHttp";

interface Props {
  onCreated: (values: any) => void;
}

interface ConfigJSON {
  target_oid?: string;
}

const CheckForm = ({ onCreated }: Props) => {
  const http = useHttp();
  const [configJSON, setConfigJSON] = useState<ConfigJSON>({});

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      check_type: "",
      check_interval: 180,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("This is a required field"),
      description: Yup.string().required("This is a required field"),
      check_type: Yup.string().required("This is a required field"),
      check_interval: Yup.number(),
    }),
    onSubmit: (values) => {
      console.log(values);
      const data = {
        ...values,
        config_json: JSON.stringify(configJSON),
      };

      http.post("/check", data).then((res) => {
        if (res) {
          onCreated(values);
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="check_type">Type</InputLabel>
            <Select
              label="Type"
              labelId="check_type"
              id="check_type"
              name="check_type"
              value={formik.values.check_type}
              onChange={(e: SelectChangeEvent) => {
                formik.handleChange(e);
                setConfigJSON({});
              }}
              error={
                formik.touched.check_type && Boolean(formik.errors.check_type)
              }
            >
              <MenuItem value="snmp">SNMP</MenuItem>
              <MenuItem disabled value="ping">
                Ping (coming soon)
              </MenuItem>
              <MenuItem disabled value="script">
                Script (coming soon)
              </MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.check_type && formik.errors.check_type}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            variant="standard"
            fullWidth
            id="check_interval"
            name="check_interval"
            label="Check Interval (seconds)"
            value={formik.values.check_interval}
            onChange={formik.handleChange}
            error={
              formik.touched.check_interval &&
              Boolean(formik.errors.check_interval)
            }
            helperText={
              formik.touched.check_interval && formik.errors.check_interval
            }
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
          {formik.values.check_type === "snmp" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">SNMP Config</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target OID"
                  variant="standard"
                  value={configJSON.target_oid || ""}
                  required
                  onChange={(e) => {
                    setConfigJSON({
                      ...configJSON,
                      target_oid: e.target.value,
                    });
                  }}
                  helperText="e.g. 1.3.6.1.2.1.1.1.0"
                />
              </Grid>
            </Grid>
          )}
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

export default CheckForm;
