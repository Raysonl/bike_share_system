import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
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
import { appStore } from "store/app";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns: GridColDef[] = [
  { field: "repairId", headerName: "ID", width: 120 },
  { field: "bikeId", headerName: "Bike ID", width: 150 },
  {
    field: "reportTime",
    headerName: "Report Time",
    width: 190,
  },
  {
    field: "damagePartLebale",
    headerName: "damage part",
    width: 190,
  },
  {
    field: "statusName",
    headerName: "status",
    width: 190,
  },
];

export default function Content() {
  const AnyReactComponent = ({ lat, lng, children }) => <div>{children}</div>;
  const [stationName, setStationName] = React.useState<string>("");
  const [status, setStatus] = React.useState(1);
  const [selectionModel, setSelectionModel] = React.useState<any[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [lat, setLat] = React.useState<number | null>(null);
  const [lng, setLng] = React.useState<number | null>(null);
  const [id, setID] = React.useState<string>("");

  useEffect(() => {
    refreshTable();
  }, []);

  const handleRepair = async () => {
    if (selectionModel.length !== 1) {
      return enqueueSnackbar("Please just select one report to repair", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else if (
      rows.find((el) => {
        return el.id === selectionModel[0];
      }).status !== 0
    ) {
      return enqueueSnackbar(
        "Please not repair the report which have been solved",
        {
          variant: "error",
          autoHideDuration: 2000,
        }
      );
    } else {
      const res1: any = await RESTManager.api.bike.put<any>({
        data: {
          bikeId: rows.find((el) => {
            return el.id === selectionModel[0];
          }).bikeId,
          status: 1,
        },
      });
      const res2: any = await RESTManager.api.repair.put<any>({
        data: {
          repairId: rows.find((el) => {
            return el.id === selectionModel[0];
          }).repairId,
          status: 1,
          operatorId: appStore.user?.userId,
        },
      });
      if (res1.code === 200 && res2.code === 200) {
        enqueueSnackbar("Repair successfully!", {
          variant: "success",
          autoHideDuration: 2000,
        });
        // await setToken(res.token);
        setTimeout(function () {
          refreshTable();
          setSelectionModel([]);
        }, 2000);
      } else {
        enqueueSnackbar("Repair fail!", {
          variant: "success",
          autoHideDuration: 2000,
        });
      }
    }
  };
  const refreshTable = async () => {
    const res = await RESTManager.api.repair.get<any>({ query: { status: 0 } });
    if (res.data) {
      console.log(res.data);
      setRows(
        res.data.repairs.map((item, index) => {
          return {
            ...item,
            id: index + 1,
            reportTime: dayjs(new Date(item.reportTime)).format(
              "YYYY/MM/DD HH:mm:ss"
            ),
            statusName: item.status === 0 ? "unsolved" : "solved",
            damagePartLebale:
              item.damagePart === 0
                ? "Wheel"
                : item.damagePart === 1
                ? "Brake"
                : item.damagePart === 2
                ? "Saddle"
                : item.damagePart === 3
                ? "Frame"
                : item.damagePart === 4
                ? "Foot pedal"
                : "Chain",
          };
        })
      );
    }
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
            <Grid item xs></Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                onClick={handleRepair}
                startIcon={
                  <SettingsIcon color="inherit" sx={{ display: "block" }} />
                }
              >
                Repair
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
    </Paper>
  );
}
