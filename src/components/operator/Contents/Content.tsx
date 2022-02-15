import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { Dialog } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { RESTManager } from "../../../utils/request/rest";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import { useEffect } from "react";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns: GridColDef[] = [
  { field: "bikeId", headerName: "ID", width: 120 },
  {
    field: "createTime",
    headerName: "Creat Time",
    width: 190,
  },
  {
    field: "stationName",
    headerName: "Station name",
    width: 190,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
  },
];

export default function Content() {
  const AnyReactComponent = ({ lat, lng, children }) => <div>{children}</div>;
  let stationNameRow: Array<string> = [];
  const [rows, setRows] = React.useState<any[]>([]);
  const [stationName, setStationName] = React.useState<string>("");
  const [stationEditName, setEditStationName] = React.useState<string>("");
  const [status, setStatus] = React.useState<number>(1);
  const [Editstatus, setEditStatus] = React.useState<number>(1);
  const [id, setID] = React.useState<string>("");
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openTrack, setOpenTrack] = React.useState(false);
  const [openSub, setOpenSub] = React.useState(false);
  const [openSubError, setOpenSubError] = React.useState(false);
  const [lat, setLat] = React.useState<number | null>(null);
  const [lng, setLng] = React.useState<number | null>(null);
  const [stationList, setStationList] = React.useState<any[]>([]);
  const [selectedStationId, setSelectedStationId] = React.useState<
    string | null
  >(null);
  const [allBikeList, setAllBikeList] = React.useState<any[]>([]);

  useEffect(() => {
    geStationList();
    getAllBikes();
    refreshTable();
  }, []);

  const getAllBikes = async () => {
    const res: any = await RESTManager.api.bike.get<any>();
    if (res.data) {
      setAllBikeList(res.data.bikes);
    }
  };

  const geStationList = async () => {
    const res = await RESTManager.api.station.get<any>();
    setStationList(res.data.stations);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedStationId(null);
    setLat(null);
    setLng(null);
    setOpen(false);
  };
  const handleClickOpenEdit = () => {
    if (selectionModel.length !== 1) {
      return enqueueSnackbar("Please just select one bike to edit.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else {
      setID(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).bikeId
      );
      const stringStatus = rows.find((el) => {
        return el.id === selectionModel[0];
      }).status;
      setEditStatus(
        stringStatus === "avaliable" ? 1 : stringStatus === "using" ? 0 : -1
      );
      setSelectedStationId(
        String(
          rows.find((el) => {
            return el.id === selectionModel[0];
          }).stationId
        )
      );
      setLat(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).latitude
      );
      setLng(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).lontitude
      );
      setOpenEdit(true);
    }
  };
  const handleClickOpenTrack = () => {
    if (selectionModel.length !== 1) {
      return enqueueSnackbar("Please just select one bike to track.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else {
      setID(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).bikeId
      );
      const stringStatus = rows.find((el) => {
        return el.id === selectionModel[0];
      }).status;
      setEditStatus(
        stringStatus === "avaliable" ? 1 : stringStatus === "using" ? 0 : -1
      );
      setSelectedStationId(
        String(
          rows.find((el) => {
            return el.id === selectionModel[0];
          }).stationId
        )
      );
      setLat(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).latitude
      );
      setLng(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).lontitude
      );
      setOpenTrack(true);
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleClickOpenSub = () => {
    setOpenSub(true);
    setOpen(false);
  };

  const handleCloseSub = () => {
    setOpenSub(false);
  };
  const handleClickOpenSubError = () => {
    setOpenSubError(true);
    setOpen(false);
  };

  const handleCloseSubError = () => {
    setOpenSubError(false);
  };

  const handleSubmit = async () => {
    if (selectedStationId === null && lat === null) {
      return enqueueSnackbar("Please select the position of the bike!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else {
      const data =
        selectedStationId === null
          ? {
              stationId: -1,
              latitude: lat,
              lontitude: lng,
              status,
            }
          : {
              stationId: selectedStationId,
              latitude: stationList.find((el) => {
                return el.stationId === Number(selectedStationId);
              })?.latitude,
              lontitude: stationList.find((el) => {
                return el.stationId === Number(selectedStationId);
              })?.lontitude,
              status,
            };
      const res: any = await RESTManager.api.bike.post<any>({
        data,
      });
      if (res.data) {
        setOpen(false);
        refreshTable();
        enqueueSnackbar("Add successfully!", {
          variant: "success",
          autoHideDuration: 2000,
        });
      } else {
        enqueueSnackbar("Add fail!", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  };

  const handleDelete = async () => {
    if (selectionModel.length === 0) {
      return enqueueSnackbar("Please select one or more bike to delete", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    let bikeIdList = "";
    selectionModel.forEach((item, index) => {
      if (index !== selectionModel.length - 1) {
        bikeIdList =
          bikeIdList +
          rows.find((el) => {
            return el.id === item;
          }).bikeId +
          ",";
      } else {
        bikeIdList =
          bikeIdList +
          rows.find((el) => {
            return el.id === item;
          }).bikeId;
      }
    });
    const res: any = await RESTManager.api.bike(bikeIdList).delete<any>();
    if (res.data) {
      setSelectionModel([]);
      enqueueSnackbar("Delete successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      getAllBikes();
      // await setToken(res.token);
      setTimeout(function () {
        refreshTable();
      }, 2000);
    } else {
      handleClickOpenSubError();
    }
  };

  const handleEdit = async () => {
    const data =
      selectedStationId === null
        ? {
            bikeId: id,
            stationId: -1,
            latitude: lat,
            lontitude: lng,
            status: Editstatus,
          }
        : {
            bikeId: id,
            stationId: selectedStationId,
            latitude: stationList.find((el) => {
              return el.stationId === Number(selectedStationId);
            })?.latitude,
            lontitude: stationList.find((el) => {
              return el.stationId === Number(selectedStationId);
            })?.lontitude,
            status: Editstatus,
          };
    const res: any = await RESTManager.api.bike.put<any>({
      //modify the api waiting for testing
      data,
    });
    if (res.data) {
      setOpenEdit(false);
      enqueueSnackbar("Edit successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      getAllBikes();
      // await setToken(res.token);
      setTimeout(function () {
        refreshTable();
      }, 2000);
    } else {
      enqueueSnackbar("Edit fail, the name already exist!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };
  const refreshTable = async () => {
    const res = await RESTManager.api.bike.get<any>();
    if (res.data) {
      setRows(
        res.data.bikes.map((item, index) => {
          return {
            ...item,
            id: index + 1,
            stationName: item.stationDo?.stationName,
            createTime: dayjs(new Date(item.createTime)).format(
              "YYYY/MM/DD HH:mm:ss"
            ),
            status:
              item.status === -1
                ? "need repair"
                : item.status === 0
                ? "using"
                : "avaliable",
          };
        })
      );
    }
  };

  const handleRefresh = async () => {
    setOpenSub(true);
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
      <div style={{ height: "400px", width: "100%", marginBottom: "10px" }}>
        <GoogleMapReact
          defaultCenter={{ lat: 55.8724, lng: -4.2899 }}
          defaultZoom={10}
          bootstrapURLKeys={{
            key: "AIzaSyDQsCqDb3PT0mGxtuB7Z1Y6MlK-omgrbp8",
          }}
        >
          {stationList.map((item, index) => (
            <AnyReactComponent
              lat={item.latitude}
              lng={item.lontitude}
              key={"station" + index}
            >
              <Tooltip title={item.stationName}>
                <LocationOnIcon
                  style={{
                    fontSize: "32px",
                    color: "#af0efa",
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
                  key={"bike" + index}
                >
                  <Tooltip
                    title={
                      <span style={{ whiteSpace: "pre-line" }}>
                        {"bike:" +
                          item.bikeId +
                          "\nstatus:" +
                          (item.status === -1
                            ? "need repair"
                            : item.status === 0
                            ? "using"
                            : "available")}
                      </span>
                    }
                  >
                    <PedalBikeIcon
                      style={{
                        fontSize: "32px",
                        color:
                          item.status === -1
                            ? "gray"
                            : item.status === 0
                            ? "green"
                            : "#af0efa",
                      }}
                    ></PedalBikeIcon>
                  </Tooltip>
                </AnyReactComponent>
              )
          )}
        </GoogleMapReact>
      </div>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                startIcon={
                  <AddIcon color="inherit" sx={{ display: "block" }} />
                }
                onClick={handleClickOpen}
              >
                Add a bike
              </Button>
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                startIcon={
                  <VisibilityIcon color="inherit" sx={{ display: "block" }} />
                }
                onClick={handleClickOpenTrack}
              >
                Track
              </Button>
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                startIcon={
                  <EditIcon color="inherit" sx={{ display: "block" }} />
                }
                onClick={handleClickOpenEdit}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                onClick={handleDelete}
                startIcon={
                  <DeleteOutlineIcon
                    color="inherit"
                    sx={{ display: "block" }}
                  />
                }
              >
                Delete bikes
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
          />
        </div>
      </Typography>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Fill the details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Click on the station or on the map to add a bike.
          </DialogContentText>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="select-autowidth-label"
              id="select-autowidth"
              value={String(status)}
              variant="standard"
              label="Status"
              onChange={(event: SelectChangeEvent) => {
                setStatus(Number(event.target.value));
              }}
            >
              <MenuItem value={1}>Available</MenuItem>
              <MenuItem value={0}>Using</MenuItem>
              <MenuItem value={-1}>Need Repair</MenuItem>
            </Select>
          </FormControl>
          <div style={{ height: "400px", width: "500px" }}>
            <GoogleMapReact
              defaultCenter={{ lat: 55.8724, lng: -4.2899 }}
              defaultZoom={10}
              bootstrapURLKeys={{
                key: "AIzaSyDQsCqDb3PT0mGxtuB7Z1Y6MlK-omgrbp8",
              }}
              onClick={(e) => {
                setSelectedStationId(null);
                setLat(e.lat);
                setLng(e.lng);
              }}
            >
              {stationList.map((item, index) => (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setLat(null);
                        setLng(null);
                        setSelectedStationId(String(item.stationId));
                      }}
                    ></LocationOnIcon>
                  </Tooltip>
                </AnyReactComponent>
              ))}
              {(selectedStationId === "-1" || selectedStationId === null) &&
                lat !== null && (
                  <AnyReactComponent lat={lat} lng={lng}>
                    <Tooltip title="new bike">
                      <PedalBikeIcon
                        style={{ fontSize: "32px", color: "#fa1e0e" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLat(null);
                          setLng(null);
                        }}
                      ></PedalBikeIcon>
                    </Tooltip>
                  </AnyReactComponent>
                )}
            </GoogleMapReact>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Edit the bike</DialogTitle>
        <DialogContent>
          <div style={{ fontSize: "16px" }}>
            bike id:<span style={{ color: "#af0efa" }}>{id}</span>
          </div>
          <FormControl sx={{ margin: "5px 0px", minWidth: 120 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={String(Editstatus)}
              sx={{ width: "200px" }}
              label="Status"
              onChange={(event: SelectChangeEvent) => {
                setEditStatus(Number(event.target.value));
              }}
            >
              <MenuItem value={-1}>Need Repair</MenuItem>
              <MenuItem value={0}>Using</MenuItem>
              <MenuItem value={1}>Available</MenuItem>
            </Select>
          </FormControl>
          <div style={{ height: "400px", width: "500px" }}>
            <GoogleMapReact
              defaultCenter={{ lat: 55.8724, lng: -4.2899 }}
              defaultZoom={10}
              bootstrapURLKeys={{
                key: "AIzaSyDQsCqDb3PT0mGxtuB7Z1Y6MlK-omgrbp8",
              }}
              onClick={(e) => {
                setSelectedStationId(null);
                setLat(e.lat);
                setLng(e.lng);
              }}
            >
              {stationList.map((item, index) => (
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
                      onClick={(e) => {
                        console.log(selectedStationId);
                        e.stopPropagation();
                        setLat(null);
                        setLng(null);
                        setSelectedStationId(String(item.stationId));
                      }}
                    ></LocationOnIcon>
                  </Tooltip>
                </AnyReactComponent>
              ))}
              {(selectedStationId === "-1" || selectedStationId === null) &&
                lat !== null && (
                  <AnyReactComponent lat={lat} lng={lng}>
                    <Tooltip title="new bike">
                      <PedalBikeIcon
                        style={{ fontSize: "32px", color: "#fa1e0e" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLat(null);
                          setLng(null);
                        }}
                      ></PedalBikeIcon>
                    </Tooltip>
                  </AnyReactComponent>
                )}
            </GoogleMapReact>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleEdit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openTrack}
        onClose={() => {
          setOpenTrack(false);
        }}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Track this bike</DialogTitle>
        <DialogContent>
          <div style={{ fontSize: "16px" }}>
            bike id:<span style={{ color: "#af0efa" }}>{id}</span>
          </div>
          <div style={{ height: "400px", width: "500px" }}>
            <GoogleMapReact
              defaultCenter={{ lat: 55.8724, lng: -4.2899 }}
              defaultZoom={10}
              bootstrapURLKeys={{
                key: "AIzaSyDQsCqDb3PT0mGxtuB7Z1Y6MlK-omgrbp8",
              }}
            >
              {stationList.map((item, index) => (
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
              {(selectedStationId === "-1" || selectedStationId === null) &&
                lat !== null && (
                  <AnyReactComponent lat={lat} lng={lng}>
                    <Tooltip title="the bike">
                      <PedalBikeIcon
                        style={{ fontSize: "32px", color: "#fa1e0e" }}
                      ></PedalBikeIcon>
                    </Tooltip>
                  </AnyReactComponent>
                )}
            </GoogleMapReact>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenTrack(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSub}
        onClose={handleCloseSub}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>Submit successfully!</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseSub}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSubError}
        onClose={handleCloseSubError}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Oops! There may be some wrongs in data.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseSubError}>OK</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
