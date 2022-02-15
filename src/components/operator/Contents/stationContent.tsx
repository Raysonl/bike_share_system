import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { Dialog, InputLabel, MenuItem } from "@mui/material";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
} from "@material-ui/core";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { RESTManager } from "../../../utils/request/rest";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FormControl from "@mui/material/FormControl";
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
  { field: "stationId", headerName: "ID", width: 120 },
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
  const [stationName, setStationName] = React.useState<string>("");
  const [stationEditName, setEditStationName] = React.useState<string>("");
  const [status, setStatus] = React.useState(1);
  const [Editstatus, setEditStatus] = React.useState<number>(1);
  const [selectionModel, setSelectionModel] = React.useState<any[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openSub, setOpenSub] = React.useState(false);
  const [openSubError, setOpenSubError] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [lat, setLat] = React.useState<number | null>(null);
  const [lng, setLng] = React.useState<number | null>(null);
  const [id, setID] = React.useState<string>("");

  useEffect(() => {
    refreshTable();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLat(null);
    setLng(null);
  };
  const handleClickOpenEdit = () => {
    if (selectionModel.length !== 1) {
      return enqueueSnackbar("Please just select one station to edit.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else {
      setID(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).stationId
      );
      setEditStationName(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).stationName
      );
      setEditStatus(
        rows.find((el) => {
          return el.id === selectionModel[0];
        }).status === "avaliable"
          ? 1
          : -1
      );
      setOpenEdit(true);
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
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
    if (stationName === "") {
      return enqueueSnackbar("The name of station can not be empty!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    if (lat === null) {
      return enqueueSnackbar(
        "Please click on the map and select one location!",
        {
          variant: "error",
          autoHideDuration: 2000,
        }
      );
    }
    const res: any = await RESTManager.api.station.post<any>({
      data: { stationName, status, latitude: lat, lontitude: lng },
    });
    if (res.data) {
      enqueueSnackbar("Create station successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      setOpen(false);
      // await setToken(res.token);
      setTimeout(function () {
        //rows = res.data;
        refreshTable();
      }, 2000);
    } else {
      handleClickOpenSubError();
    }
  };

  const handleDelete = async () => {
    if (selectionModel.length === 0) {
      return enqueueSnackbar("Please select one or more station to delete", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    let stationIdList = "";
    selectionModel.forEach((item, index) => {
      if (index !== selectionModel.length - 1) {
        stationIdList =
          stationIdList +
          rows.find((el) => {
            return el.id === item;
          }).stationId +
          ",";
      } else {
        stationIdList =
          stationIdList +
          rows.find((el) => {
            return el.id === item;
          }).stationId;
      }
    });
    const res: any = await RESTManager.api.station(stationIdList).delete<any>();
    if (res.data) {
      enqueueSnackbar("Delete successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      // await setToken(res.token);
      setTimeout(function () {
        refreshTable();
        setSelectionModel([]);
      }, 2000);
    } else {
      handleClickOpenSubError();
    }
  };

  const handleEdit = async () => {
    if (stationEditName === "") {
      return enqueueSnackbar("The name of station can not be empty!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    judgeInput(stationEditName, Editstatus);
  };

  async function judgeInput(stationEditName, Editstatus) {
    const res: any = await RESTManager.api.station.put<any>({
      //modify the api waiting for testing
      data: { stationId: id, stationName: stationEditName, status: Editstatus },
    });
    if (res.data) {
      setOpenEdit(false);
      enqueueSnackbar("Edit successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
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
  }

  const refreshTable = async () => {
    const res = await RESTManager.api.station.get<any>();
    if (res.data) {
      setRows(
        res.data.stations.map((item, index) => {
          return {
            ...item,
            id: index + 1,
            createTime: dayjs(new Date(item.createTime)).format(
              "YYYY/MM/DD HH:mm:ss"
            ),
            status: item.status === -1 ? "unavaliable" : "avaliable",
          };
        })
      );
    }
  };

  const handleRefresh = async () => {
    //let row = res.data //not completed��need writing request the station table from back-end

    // rows = row;  //all rows in the table  shows on this page
    setOpenSub(true);
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
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
                Add a station
              </Button>
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
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
                Delete stations
              </Button>

              <Tooltip title="Reload">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon color="inherit" sx={{ display: "block" }} />
                </IconButton>
              </Tooltip>
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
        <DialogContent sx={{ paddingTop: "0px" }}>
          <DialogContentText>
            Click on the map to select the location of the station.
          </DialogContentText>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="stationName"
              label="Station name"
              type="stationName"
              value={stationName}
              variant="standard"
              onChange={(e) => {
                setStationName(e.target.value);
              }}
              sx={{ display: "inline-block", marginBottom: "10px" }}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="simple-select-autowidth-label">Status</InputLabel>
              <Select
                labelId="simple-select-autowidth-label"
                id="simple-select-autowidth"
                value={status}
                sx={{ width: "200px" }}
                label="status"
                variant="standard"
                onChange={(event: any) => {
                  setStatus(event.target.value);
                }}
              >
                <MenuItem value={-1}>Unavailable</MenuItem>
                <MenuItem value={1}>Available</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ height: "400px", width: "500px" }}>
            <GoogleMapReact
              defaultCenter={{ lat: 55.8724, lng: -4.2899 }}
              defaultZoom={10}
              bootstrapURLKeys={{
                key: "AIzaSyDQsCqDb3PT0mGxtuB7Z1Y6MlK-omgrbp8",
              }}
              onClick={(e) => {
                setLat(e.lat);
                setLng(e.lng);
              }}
            >
              {rows.map((item, index) => (
                <AnyReactComponent
                  lat={item.latitude}
                  lng={item.lontitude}
                  key={"station" + index}
                >
                  <Tooltip title={item.stationName}>
                    <LocationOnIcon
                      style={{ fontSize: "32px", color: "#af0efa" }}
                    ></LocationOnIcon>
                  </Tooltip>
                </AnyReactComponent>
              ))}
              {lat !== null && (
                <AnyReactComponent lat={lat} lng={lng}>
                  <Tooltip title="new station">
                    <LocationOnIcon
                      style={{ fontSize: "32px", color: "#fa1e0e" }}
                      onClick={() => {
                        setLat(null);
                        setLng(null);
                      }}
                    ></LocationOnIcon>
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
        <DialogTitle>Fill the details</DialogTitle>
        <DialogContent>
          <div style={{ fontSize: "16px" }}>
            Station id:<span style={{ color: "#af0efa" }}>{id}</span>
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="stationName"
            label="Station name"
            type="stationName"
            value={stationEditName}
            sx={{ width: "400px" }}
            variant="standard"
            onChange={(e) => {
              setEditStationName(e.target.value);
            }}
          />
          <br />
          <InputLabel id="demo-simple-select-autowidth-label">
            Status
          </InputLabel>
          <Select
            labelId="simple-select-autowidth-label"
            id="simple-select-autowidth"
            value={Editstatus}
            autoWidth
            label="status"
            onChange={(event: any) => {
              setEditStatus(event.target.value);
            }}
          >
            <MenuItem value={-1}>Unavailable</MenuItem>
            <MenuItem value={1}>Available</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleEdit}>Submit</Button>
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
