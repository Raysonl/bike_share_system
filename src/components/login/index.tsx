import { FC, useState } from "react";
import styles from "./index.module.css";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import { RESTManager } from "utils/request/rest";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { setToken } from "utils/auth";
import { setSelfToStore } from "store/self";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © O_Lab2_T6 "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const handleLogin = async () => {
    if (username === "" || password === "") {
      return enqueueSnackbar("Username and password can not be empty!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    const res: any = await RESTManager.api.user.login.post<any>({
      data: { userName: username, userPassword: password },
    });
    if (res.data) {
      setSelfToStore(res.data.userEntity);
      enqueueSnackbar("Login successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      await setToken(res.data.token);
      setTimeout(function () {
        if (res.data?.userEntity?.authority === 0) {
          history.push("/visualization");
        } else if (res.data?.userEntity?.authority === 1) {
          history.push("/operator/bikes");
        } else {
          history.push("/");
        }
      }, 2000);
    } else {
      enqueueSnackbar("Login fail!\t" + res.message + "!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };
  const history = useHistory();
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#931dc8" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in to your account
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User name"
              name="username"
              value={username}
              autoComplete="username"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={password}
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<LoginIcon />}
              onClick={handleLogin}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <span
                  className={styles["register_text"]}
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  Don't have an account? Create an account
                </span>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
