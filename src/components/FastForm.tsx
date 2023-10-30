import React, { FC, useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  TextField,
  Checkbox,
  Box,
  Button,
  Grid,
  Alert,
  Select,
  Stack,
  MenuItem,
  InputLabel,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Input,
  InputAdornment,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import useHttp from "../hooks/useHttp";

type FastFormProps = {
  entityName: string;
  entity?: object;
  entityid?: number;
  title?: string;
  subtitle?: string;
  showDelete?: boolean;
  axiosOptions?: object;
  onDeleted?: () => void;
  onCreated?: () => void;
  onExit?: () => void;
  defaultValues?: { [key: string]: DefaultValue };
};

type DefaultValue = {
  display: boolean;
  value: string | number;
  title?: string;
  type?: "string" | "integer";
};

type NameValue = {
  name: string;
  value: string;
};

type SelectorPropsType = {
  anchor: HTMLElement | null;
  propertyIndex: number;
  nameValues: NameValue[];
};

type FormOptions = {
  optional?: boolean;
  display?: boolean;
  category?: string;
  allowed_values?: string[] | number[] | NameValue[];
  suggest_only?: boolean; // if true and allowed values is provided, uses allowed values as a suggestion
  disable_edit?: boolean; // if true, input is disable during edit mode
};

type Property = {
  index: number;
  name: string;
  title: string;
  type: "string" | "integer" | "boolean";
  hidden?: boolean;
  value?: string | number;
  default?: string;
  description?: string;
  formOptions: FormOptions;
};

const FastForm: FC<FastFormProps> = ({
  entityName,
  entity,
  entityid,
  title,
  subtitle,
  onCreated,
  onDeleted,
  onExit,
  axiosOptions = {},
  defaultValues = {},
  showDelete = false,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectorProps, setSelectorProps] = useState<SelectorPropsType>();
  const [loadedEntity, setLoadedEntity] = useState(entity);
  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const http = useHttp();

  useEffect(() => {
    http.get(`/${entityName}/schema`).then((resp: any) => {
      console.log(resp);
      if (!resp) {
        return;
      }

      let props: Property[] = [];
      let index = 0;
      const createSchema = resp.data.create;

      Object.keys(createSchema.properties).forEach((key) => {
        const options = createSchema.properties[key];
        const formOptions: FormOptions = {
          display: 1,
          ...options.form_options,
        };

        if (formOptions.display) {
          props.push({
            index,
            name: key,
            value:
              key in defaultValues
                ? defaultValues[key].value
                : options.default
                ? options.default
                : !!formOptions.allowed_values &&
                  formOptions.allowed_values.length > 0
                ? typeof formOptions.allowed_values === "object"
                  ? (formOptions.allowed_values[0] as NameValue).value
                  : formOptions.allowed_values[0]
                : null,
            formOptions,
            ...options,
          });
          index++;
        }
      });

      // Load default values that were not found in schema properties
      Object.keys(defaultValues).forEach((key) => {
        if (
          createSchema.properties.hasOwnProperty(key) &&
          createSchema.properties[key].formOptions?.display
        ) {
          return;
        }

        const dv = defaultValues[key];

        props.push({
          index,
          name: key,
          value: dv.value,
          hidden: !dv.display,
          title: dv.title || key,
          type: dv.type || "string",
          formOptions: {},
        });
      });

      if (entityid) {
        loadEntity(props);
      } else {
        setProperties(props);
      }
    });
  }, []);

  const loadEntity = (properties: Property[]) => {
    http
      .get(`/${entityName}/${entityid}`, { params: { joined: true } })
      .then((resp) => {
        if (!resp) {
          return;
        }
        const entity = resp.data;
        properties.forEach((property) => {
          if (property.name in entity) {
            property.value = entity[property.name];
          }
        });

        setProperties(properties);
        setLoadedEntity(entity);
      });
  };

  const handleConfirmDelete = () => {
    setShowConfirmationDialog(false);
    http.delete(`/${entityName}/${entityid}`).then((r) => {
      if (r && onDeleted) {
        onDeleted();
      }
    });
  };

  const deleteEntity = () => {
    setShowConfirmationDialog(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let body: { [key: string]: any } = {};
    properties.forEach((prop) => {
      if (prop.value) {
        body[prop.name] = prop.value;
      }
    });

    if (loadedEntity) {
      http
        .put(`/${entityName}/${entityid}`, body, axiosOptions)
        .then((resp: any) => {
          if (!resp) {
            return;
          }
          if (onCreated) {
            onCreated();
          }
        });
    } else {
      http.post(`/${entityName}`, body, axiosOptions).then((resp: any) => {
        if (!resp) {
          return;
        }
        if (onCreated) {
          onCreated();
        }
      });
    }
  };

  const handlePropertyUpdate = (index: number, value: any) => {
    setProperties((properties) => {
      properties[index].value = value;
      return [...properties];
    });
  };

  const RenderProperty = (property: Property) => {
    if (
      property.formOptions.allowed_values &&
      property.formOptions.allowed_values.length > 0
    ) {
      if (property.formOptions.suggest_only) {
        return (
          <FormControl variant="standard" fullWidth>
            <InputLabel> {property.title} </InputLabel>
            <Input
              value={property.value || ""}
              onChange={(e) => {
                handlePropertyUpdate(property.index, e.target.value);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title="Link to page">
                    <IconButton
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        setSelectorProps({
                          propertyIndex: property.index,
                          anchor: e.currentTarget,
                          nameValues: property.formOptions
                            .allowed_values as NameValue[],
                        });
                      }}
                    >
                      <ArticleOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
            />
          </FormControl>
        );
      } else {
        return (
          <FormControl variant="standard" fullWidth>
            <InputLabel>{property.title}</InputLabel>
            <Select
              label={property.title}
              value={property.value || ""}
              onChange={(e) => {
                handlePropertyUpdate(property.index, e.target.value);
              }}
            >
              {property.formOptions.allowed_values.map((v, i) => (
                <MenuItem value={typeof v === "object" ? v?.value : v} key={i}>
                  {typeof v === "object" ? v?.name : v}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText> {property.description} </FormHelperText>
          </FormControl>
        );
      }
    }
    switch (property.type) {
      case "string":
        return (
          <Box sx={{ display: property.hidden ? "none" : "initial" }}>
            <TextField
              variant="standard"
              label={property.title}
              name={property.name}
              value={property.value || ""}
              fullWidth
              required={!property.formOptions.optional}
              onChange={(e) =>
                handlePropertyUpdate(property.index, e.target.value)
              }
              helperText={property.description}
              disabled={!!entityid && property.formOptions.disable_edit}
            />
          </Box>
        );
      case "integer":
        return (
          <Box sx={{ display: property.hidden ? "none" : "initial" }}>
            <TextField
              type="number"
              variant="standard"
              label={property.title}
              name={property.name}
              value={property.value || ""}
              fullWidth
              required={!property.formOptions.optional}
              onChange={(e) =>
                handlePropertyUpdate(property.index, e.target.value)
              }
              disabled={!!entityid && property.formOptions.disable_edit}
            />
          </Box>
        );
      case "boolean":
        return (
          <Box sx={{ display: property.hidden ? "none" : "initial" }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={!!entityid && property.formOptions.disable_edit}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handlePropertyUpdate(property.index, event.target.checked)
                    }
                    checked={!!property.value}
                  />
                }
                label={property.title || property.name}
              />
              {property.description && (
                <FormHelperText sx={{ mt: 0 }}>
                  {" "}
                  {property.description}{" "}
                </FormHelperText>
              )}
            </FormGroup>
          </Box>
        );
    }
  };

  return (
    <>
      <Popover
        open={!!selectorProps?.anchor}
        anchorEl={selectorProps?.anchor}
        onClose={() => setSelectorProps(undefined)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper sx={{ padding: "1rem 0" }}>
          <List>
            {selectorProps?.nameValues &&
              selectorProps?.nameValues.map((nv: NameValue) => (
                <ListItem disablePadding sx={{ minWidth: 300 }} key={nv.value}>
                  <ListItemButton
                    onClick={() => {
                      handlePropertyUpdate(
                        selectorProps.propertyIndex,
                        nv.value
                      );
                      setSelectorProps(undefined);
                    }}
                  >
                    <ListItemText primary={nv.name} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Paper>
      </Popover>

      <Dialog open={showConfirmationDialog}>
        <DialogTitle> Delete {entityName}? </DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmationDialog(false)}>
            {" "}
            Cancel{" "}
          </Button>
          <Button onClick={handleConfirmDelete}> Delete </Button>
        </DialogActions>
      </Dialog>

      {http.loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Stack direction="row" spacing={2}>
            {!!onExit && (
              <IconButton onClick={onExit} sx={{ color: "text.secondary" }}>
                <ChevronLeftIcon />
              </IconButton>
            )}
            <Stack spacing={1}>
              <Typography variant="h4">
                {title !== null ? title : " create " + entityName}
              </Typography>
              {subtitle && (
                <Typography variant="caption"> {subtitle} </Typography>
              )}
            </Stack>
          </Stack>
          {http.error && (
            <Alert
              sx={{ marginBottom: "1rem", marginTop: "1rem" }}
              severity="error"
            >
              {http.error}
            </Alert>
          )}
          <Box sx={{ padding: "1rem 1rem" }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  {properties.map((p) =>
                    !!p.formOptions?.category ? (
                      <React.Fragment key={p.name}>
                        <Grid item xs={12} sx={{ marginTop: "1rem" }}>
                          <Typography color="primary" variant="caption">
                            {p.formOptions.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} key={p.name}>
                          {RenderProperty(p)}
                        </Grid>
                      </React.Fragment>
                    ) : (
                      <Grid item xs={6} key={p.name}>
                        {RenderProperty(p)}
                      </Grid>
                    )
                  )}

                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Button type="submit" fullWidth variant="contained">
                        Submit
                      </Button>
                      {showDelete && (
                        <Tooltip title={`Delete ${entityName}`}>
                          <IconButton onClick={deleteEntity}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </FormControl>
            </form>
          </Box>
        </Box>
      )}
    </>
  );
};

export default FastForm;
