import { useContext } from "react";
import { Alert, Typography, Container, TextField, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import useHttp from "../../hooks/useHttp";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

const Login = () => {
  const http = useHttp();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const onSubmit = (values: any) => {
    login(values.username, values.password);
  };

  const formik = useFormik({ onSubmit, validationSchema, initialValues });

  const login = (username: string, password: string) => {
    http.post("/auth/login", { username, password }).then((response) => {
      if (response) {
        authCtx.setToken(response.data.access_token);
      }
    });
  };

  return (
    <Container>
      {authCtx.token && <Navigate to={from} replace={true} />}
      <video
        src="/video/circuit_bg.mp4"
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background:
            "linear-gradient(to bottom, rgb(4 13 28 / 80%), rgb(4 30 72 / 80%))",
        }}
      />
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            mt: "25vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 400,
            ml: "auto",
            mr: "auto",
          }}
        >
          {http.error && (
            <Box>
              <Alert severity="error">{http.error}</Alert>
            </Box>
          )}
          <Typography variant="h5">Pyonet Dashboard Login</Typography>
          <TextField
            onChange={formik.handleChange}
            name="username"
            label="Username"
            helperText={formik.touched.username && formik.errors.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
          />
          <TextField
            onChange={formik.handleChange}
            name="password"
            label="Password"
            helperText={formik.touched.password && formik.errors.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            type="password"
          />
          <LoadingButton
            loading={http.loading}
            type="submit"
            variant="contained"
          >
            Login
          </LoadingButton>
        </Box>
      </form>
    </Container>
  );
};

export default Login;
