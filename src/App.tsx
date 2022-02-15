import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { LoginPage } from "pages/login";
import { RegisterPage } from "pages/register";
import { OperatorPage } from "pages/operator";
import { BorrowPage } from "pages/borrow";
import { OrderPage } from "pages/orders";
import { ProfilePage } from "pages/profile";
import { OperatorStationPage } from "pages/operatorStation";
import { OperatorRepairPage } from "pages/operatorRepair";
import { OperatorDataAnalyticPage } from "pages/visualization";
import { SnackbarProvider } from "notistack";
import Navigator from "components/operator/fragments/Navigator";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Header } from "components/operator/Headers/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.css";

let theme = createTheme({
  palette: {
    primary: {
      light: "#af0efa",
      main: "#931dc8",
      dark: "#ae1cf1",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#140427",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#ac4cd8",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 15,
          fontWeight: theme.typography.fontWeightMedium,
          fontFamily: "-apple-system",
          fontStyle: "italic",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

function App() {
  const drawerWidth = 250;
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Switch>
            {/* <Route exact path="/" component={HomePage} /> */}
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route
              exact
              path="/visualization"
              component={OperatorDataAnalyticPage}
            />
            <Route
              exact
              path="/operator/(|bikes|stations|repair)"
              render={(routeProps) => {
                const path = routeProps.match.params[0];
                return (
                  <Box sx={{ display: "flex", minHeight: "100vh" }}>
                    <CssBaseline />
                    <Box
                      component="nav"
                      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    >
                      {isSmUp ? null : (
                        <Navigator
                          PaperProps={{ style: { width: drawerWidth } }}
                          variant="temporary"
                          open={mobileOpen}
                          onClose={handleDrawerToggle}
                          active_name={path}
                        />
                      )}
                      <Navigator
                        PaperProps={{ style: { width: drawerWidth } }}
                        sx={{ display: { sm: "block", xs: "none" } }}
                        active_name={path}
                      />
                    </Box>
                    <Box
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Header path={path} onDrawerToggle={handleDrawerToggle} />
                      {path === "bikes" ? (
                        <OperatorPage />
                      ) : path === "stations" ? (
                        <OperatorStationPage />
                      ) : (
                        <OperatorRepairPage />
                      )}
                    </Box>
                  </Box>
                );
              }}
            />
            <Route
              exact
              path="/(|orders)"
              render={(routeProps) => {
                const path = routeProps.match.params[0];
                return (
                  <Box sx={{ display: "flex", minHeight: "100vh" }}>
                    <CssBaseline />
                    <Box
                      component="nav"
                      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    >
                      {isSmUp ? null : (
                        <Navigator
                          PaperProps={{ style: { width: drawerWidth } }}
                          variant="temporary"
                          open={mobileOpen}
                          onClose={handleDrawerToggle}
                          active_name={path}
                        />
                      )}
                      <Navigator
                        PaperProps={{ style: { width: drawerWidth } }}
                        sx={{ display: { sm: "block", xs: "none" } }}
                        active_name={path}
                      />
                    </Box>
                    <Box
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Header path={path} onDrawerToggle={handleDrawerToggle} />
                      {path === "" ? <BorrowPage /> : <OrderPage />}
                    </Box>
                  </Box>
                );
              }}
            />
          </Switch>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
