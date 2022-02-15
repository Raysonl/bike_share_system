import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RESTManager } from "utils/request/rest";
import { useSnackbar } from "notistack";
import GoogleMapReact from "google-map-react";
import Tooltip from "@mui/material/Tooltip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import { appStore } from "store/app";
import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        O_Lab2_T6
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}
export default function Borrow() {
  // let map: google.maps.Map;
  // function initMap(): void {
  //   map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
  //     center: { lat: 55.864, lng: 4.251 },
  //     zoom: 8,
  //     mapId: "c20edfbb90cdfef9",
  //   });
  // }
  const [selectedStationId, setSelectedStationId] = React.useState("");
  const [bikeList, setBikeList] = React.useState<any[]>([]);
  const [allBikeList, setAllBikeList] = React.useState<any[]>([]);
  const [selectedBikeId, setSelectedBikeId] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [stations, setStations] = React.useState<any>([]);
  const [inputBikeId, setInputBikeId] = React.useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const getStationList = async () => {
    const res: any = await RESTManager.api.station.get<any>({
      query: { status: 1 },
    });
    if (res.data) {
      setStations(res.data.stations);
    }
  };
  const AnyReactComponent = ({ lat, lng, children }) => <div>{children}</div>;
  useEffect(() => {
    getStationList();
    getAllBikes();
    // initMap();
  }, []);
  const rentBike = async (bikeId) => {
    if (appStore.user === null || appStore.user === undefined) {
      enqueueSnackbar("Please login first!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      history.push("/login");
    }
    const bike = allBikeList.find((el) => {
      return el.bikeId === bikeId;
    });
    const res: any = await RESTManager.api.user.borrow.put<any>({
      data: {
        bikeId,
        latitude: bike.latitude,
        lontitude: bike.lontitude,
        stationId: bike.stationId,
      },
    });
    if (res.code === 200) {
      getAllBikes();
      enqueueSnackbar("Rent successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
    }
  };
  const getAllBikes = async () => {
    const res: any = await RESTManager.api.bike.get<any>({
      query: { status: 1 },
    });
    if (res.data) {
      setBikeList(res.data.bikes);
      setAllBikeList(res.data.bikes);
    }
  };
  const handleSearch = async (stationId) => {
    if (stationId) {
      const res: any = await RESTManager.api.bike.post<any>({
        data: { stationId: selectedStationId, status: 1 },
      });
      if (res.data) {
        setBikeList(res.data.bikes);
      }
    } else {
      getAllBikes();
    }
  };
  const handleSearchByBikeId = async () => {
    const res: any = await RESTManager.api.bike(inputBikeId).get<any>({
      query: { status: 1 },
    });
    if (res.data) {
      setBikeList(res.data.bikes);
    }
  };
  return (
    <>
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}>
        <Paper
          sx={{
            maxWidth: 936,
            margin: "auto",
            overflow: "hidden",
            backgroundColor: "rgb(234, 238, 243)",
          }}
        >
          <AppBar
            position="static"
            elevation={0}
            color="default"
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div style={{ height: "400px", width: "100%" }}>
              <GoogleMapReact
                defaultCenter={{ lat: 55.8724, lng: -4.2899 }}
                defaultZoom={10}
                bootstrapURLKeys={{
                  key: "AIzaSyDQsCqDb3PT0mGxtuB7Z1Y6MlK-omgrbp8",
                }}
              >
                {stations.map((item, index) => (
                  <AnyReactComponent
                    lat={item.latitude}
                    lng={item.lontitude}
                    key={"station" + index}
                  >
                    <Tooltip title={item.stationName}>
                      <LocationOnIcon
                        style={{
                          fontSize: "32px",
                          color:
                            String(item.stationId) === selectedStationId
                              ? "#fa1e0e"
                              : "#af0efa",
                        }}
                      ></LocationOnIcon>
                    </Tooltip>
                  </AnyReactComponent>
                ))}
                {allBikeList.map(
                  (item, index) =>
                    item.stationId === -1 &&
                    item.latitude !== null && (
                      <AnyReactComponent
                        lat={item.latitude}
                        lng={item.lontitude}
                      >
                        <Tooltip title={"bike:" + item.bikeId}>
                          <PedalBikeIcon
                            style={{ fontSize: "32px", color: "#af0efa" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBikeId(item.bikeId);
                              setDialogOpen(true);
                            }}
                          ></PedalBikeIcon>
                        </Tooltip>
                      </AnyReactComponent>
                    )
                )}
              </GoogleMapReact>
            </div>
            <div
              style={{ marginLeft: "5px", fontSize: "18px", fontWeight: 600 }}
            >
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                *Click on a station to search bikes in this station.
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                *Click on a bike to rent this bike.
              </div>
              {/* <div
                style={{
                  fontSize: "14px",
                  opacity: 0.7,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon
                  style={{ fontSize: "24px", color: "#af0efa" }}
                ></LocationOnIcon>
                Station which have bikes
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.7,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon
                  style={{ fontSize: "24px", color: "#4e4e4e" }}
                ></LocationOnIcon>
                Station which have no bike.
              </div> */}
            </div>
          </AppBar>
          <AppBar
            position="static"
            elevation={0}
            color="default"
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div
              style={{ marginLeft: "5px", fontSize: "18px", fontWeight: 600 }}
            >
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                *In order to keep the city clean, we{" "}
                <span style={{ color: "red" }}>STRONGLY SUGGEST</span> you to
                borrow or return bike at stations.
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                But you still can borrow or return bikes outside stations.
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                If you want to create a new station, please cantact operators.
              </div>
              Search by station:
            </div>
            <Toolbar style={{ paddingLeft: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={stations.map((option) => option.stationName)}
                  sx={{ width: 200, display: "inline-block" }}
                  onChange={(e, value) => {
                    const selectedIndex = stations.findIndex((el) => {
                      return el.stationName === value;
                    });
                    setSelectedStationId(stations[selectedIndex]?.stationId);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Station" size="small" />
                  )}
                />
                <Button
                  variant="contained"
                  startIcon={
                    <SearchIcon color="inherit" sx={{ display: "block" }} />
                  }
                  sx={{ marginLeft: "20px" }}
                  onClick={() => {
                    handleSearch(selectedStationId);
                  }}
                >
                  Search
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <AppBar
            position="static"
            elevation={0}
            color="default"
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div
              style={{ marginLeft: "5px", fontSize: "18px", fontWeight: 600 }}
            >
              <span
                style={{
                  color: "#931dc8",
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              >
                or
              </span>
              Search by bike ID:
            </div>
            <Toolbar style={{ paddingLeft: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="bike id"
                  size="small"
                  value={inputBikeId}
                  onChange={(e) => {
                    setInputBikeId(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={
                    <SearchIcon color="inherit" sx={{ display: "block" }} />
                  }
                  sx={{ marginLeft: "20px" }}
                  onClick={handleSearchByBikeId}
                >
                  Search
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <AppBar
            position="static"
            elevation={0}
            color="default"
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div
              style={{ marginLeft: "5px", fontSize: "18px", fontWeight: 600 }}
            >
              Result (Up to 20 bikes will be shown):
            </div>
            <div style={{ minHeight: 200, width: "100%" }}>
              {bikeList.length === 0 ? (
                <i style={{ width: "50px", marginLeft: "5px" }}>
                  No Bike Available
                </i>
              ) : (
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Bike ID</TableCell>
                        <TableCell align="left">Station name</TableCell>
                        <TableCell align="left">Operation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bikeList.slice(0, 20).map((row) => (
                        <TableRow
                          key={row.bikeId}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.bikeId}
                          </TableCell>
                          <TableCell align="left">
                            {row.stationDo?.stationName}
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedBikeId(row.bikeId);
                                setDialogOpen(true);
                              }}
                            >
                              Rent
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </AppBar>
        </Paper>
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
        <Copyright />
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Rent this bike?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The bike ID is&nbsp;
            <span style={{ color: "red" }}>{selectedBikeId}</span>. Charging
            will begin after your confirm.
            <br /> If there is any problem with the bike, you can use "Report
            for repair" function to return it for free.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              rentBike(selectedBikeId);
              setDialogOpen(false);
            }}
            autoFocus
          >
            Rent
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
