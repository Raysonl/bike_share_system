import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AlarmIcon from "@mui/icons-material/Alarm";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import PieChart from "./dashboard/Piechart";
import LineCharts from "./dashboard/Linecharts";
import Cost from "./dashboard/Cost";
import Popular from "./dashboard/Popular";
import TotalAmount from "./dashboard/TotalAmount";
import Time from "./dashboard/Time";
import Orders from "./dashboard/Orders";
import Card from "./dashboard/Card/Card.js";
import CardHeader from "./dashboard/Card/CardHeader.js";
import CardIcon from "./dashboard/Card/CardIcon.js";
import { Header } from "components/operator/Headers/Header";
import CardFooter from "./dashboard/Card/CardFooter.js";
import { Accessibility, DateRange, Store } from "@mui/icons-material";
//import ChartistGraph from "react-chartist";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Header path={"visualization"} onDrawerToggle={() => {}} />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Deposits */}
              <Grid item xs={12} md={3} lg={6}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Store />
                    </CardIcon>
                    <Popular />
                  </CardHeader>
                  <CardFooter stats>Last 7 days</CardFooter>
                </Card>
              </Grid>
              <Grid item xs={"auto"} md={3} lg={6}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="info">
                      <AlarmIcon />
                    </CardIcon>
                    <Time />
                  </CardHeader>
                  <CardFooter stats>Last 7 days</CardFooter>
                </Card>
              </Grid>
              <Grid item xs={12} md={3} lg={6}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="info">
                      <Accessibility />
                    </CardIcon>
                    <Cost />
                  </CardHeader>
                  <CardFooter stats>Last 7 days</CardFooter>
                </Card>
              </Grid>
              <Grid item xs={12} md={3} lg={6}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="info">
                      <AccountBalanceWalletIcon />
                    </CardIcon>
                    <TotalAmount />
                  </CardHeader>
                  <CardFooter stats>All Orders</CardFooter>
                </Card>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 340,
                    width: 1150,
                  }}
                >
                  <LineCharts />
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 340,
                    width: 1150,
                  }}
                >
                  <PieChart />
                </Paper>
              </Grid>

              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {/* <Orders />*/}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
