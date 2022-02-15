import * as React from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import BarChartIcon from "@mui/icons-material/BarChart";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { FC, useEffect } from "react";
import { RESTManager } from "utils/request/rest";
import { setSelfToStore } from "store/self";
import { observer } from "mobx-react-lite";
import { appStore } from "store/app";

const lightColor = "rgba(255, 255, 255, 0.7)";

interface HeaderProps {
  onDrawerToggle: () => void;
  path: string;
}

export const Header: FC<HeaderProps> = observer((props) => {
  const { onDrawerToggle, path } = props;
  const history = useHistory();
  const loginByToken = async () => {
    const res: any = await RESTManager.api.user.getUserInfoByToken.get<any>();
    if (res.data) {
      setSelfToStore(res.data);
      setUserDetail(res.data);
    }
  };
  const [userDetail, setUserDetail] = React.useState<any>({});
  useEffect(() => {
    if (appStore.user) {
      setUserDetail(appStore.user);
    } else {
      loginByToken();
    }
  }, []);

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            {path !== "profile" && (
              <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            )}
            <Grid item xs />
            <Grid item>
              <Link
                onClick={() => {
                  history.push("/");
                }}
                variant="body2"
                sx={{
                  textDecoration: "none",
                  color: lightColor,
                  cursor: "pointer",
                  "&:hover": {
                    color: "common.white",
                  },
                }}
                rel="noopener noreferrer"
              >
                Go home
              </Link>
            </Grid>
            {(userDetail?.authority === 1 || userDetail?.authority === 0) && (
              <Grid item>
                <Tooltip title="Manage system - for operators only">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      history.push("/operator/bikes");
                    }}
                  >
                    <ManageSearchIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            {userDetail?.authority === 0 && (
              <Grid item>
                <Tooltip title="Data Report - for manager only">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      history.push("/visualization");
                    }}
                  >
                    <BarChartIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Grid item>
              <div
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const route = userDetail?.userName ? "/profile" : "/login";
                  history.push(route);
                }}
              >
                {userDetail?.userName ? userDetail.userName : "log in"}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {path !== "profile" && (
        <AppBar
          component="div"
          color="primary"
          position="static"
          elevation={0}
          sx={{ zIndex: 0 }}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                  {path === "bikes"
                    ? "Bike Management"
                    : path === "stations"
                    ? "Station Management"
                    : path === "orders"
                    ? "Your Orders"
                    : path === "repair"
                    ? "Repair List"
                    : path === "visualization"
                    ? "Data Analysis"
                    : "Borrow Bikes"}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      )}
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      ></AppBar>
    </React.Fragment>
  );
});
