import { FC, useState } from "react";
import styles from "./index.module.css";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import RepeatIcon from "@mui/icons-material/Repeat";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RESTManager } from "utils/request/rest";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © O_Lab2_T6 "}
      {/* <Link color="inherit">O_Lab2_T6</Link> */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

export const Register: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const handleRegister = async () => {
    if (username === "" || password === "") {
      return enqueueSnackbar("Username and password can not be empty!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    if (password !== confirmPassword) {
      return enqueueSnackbar(
        "Password and confirmed passwords are not the same!",
        {
          variant: "error",
          autoHideDuration: 2000,
        }
      );
    }
    const res: any = await RESTManager.api.user.register.post<any>({
      data: { userName: username, userPassword: password },
    });
    if (res.data) {
      enqueueSnackbar("Register successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      setTimeout(function () {
        history.push("/login");
      }, 2000);
    } else {
      enqueueSnackbar("Register fail!\t" + res.message + "!", {
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
            <CreateOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an account
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User name or Email"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="Confirm Password"
              label="Confirm Password"
              value={confirmPassword}
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RepeatIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<AddBoxIcon />}
              sx={{ mt: 3, mb: 2.5 }}
              onClick={handleRegister}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <span
                  className={styles["register_text"]}
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Had an account? Log in
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
