import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { FC, useState, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { RESTManager } from "utils/request/rest";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GoogleMapReact from "google-map-react";
import Tooltip from "@mui/material/Tooltip";
import { appStore } from "store/app";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit">O_Lab2_T6</Link> {new Date().getFullYear()}.
    </Typography>
  );
}

const getDiscount = () => {
  const exp = appStore.user?.exp;
  if (exp) {
    if (exp < 1) {
      return 1;
    } else if (exp < 5) {
      return 0.95;
    } else if (exp < 20) {
      return 0.9;
    } else if (exp < 50) {
      return 0.85;
    } else if (exp < 200) {
      return 0.8;
    } else {
      return 0.75;
    }
  } else {
    return 1;
  }
};
interface OrderItemProps {
  orderData: any;
  returnBike: any;
  repairReport: any;
}
const OrderItem: FC<OrderItemProps> = ({
  orderData,
  returnBike,
  repairReport,
}) => {
  const AnyReactComponent = ({ lat, lng, children }) => <div>{children}</div>;
  const getCost = (seconds) => {
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) {
      return 1;
    } else if (minutes < 300) {
      return Math.ceil(minutes / 60) * 1;
    } else {
      return 5;
    }
  };
  const [seconds, setSeconds] = useState<number>(0);
  const [cost, setCost] = useState<number | null>(null);
  const [repairOpen, setRepairOpen] = useState<boolean>(false);
  const [returnOpen, setReturnOpen] = useState<boolean>(false);
  const [damagePart, setDamagePart] = useState<number>(0);
  const [lat, setLat] = React.useState<number | null>(null);
  const [lng, setLng] = React.useState<number | null>(null);
  const [selectedStationId, setSelectedStationId] = React.useState<
    string | null
  >(null);
  const [stationList, setStationList] = React.useState<any[]>([]);
  useEffect(() => {
    geStationList();
    const timer = setInterval(function () {
      setSeconds(
        Math.ceil((new Date().getTime() - orderData.startTime) / 1000)
      );
      if (
        cost !==
        getCost(Math.ceil((new Date().getTime() - orderData.startTime) / 1000))
      ) {
        setCost(
          getCost(
            Math.ceil((new Date().getTime() - orderData.startTime) / 1000)
          )
        );
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const formatTime = (s) => {
    const sec = s % 60;
    const min = Math.floor(s / 60) % 60;
    const hour = Math.floor(s / 3600);
    if (hour === 0) {
      return (
        (min < 10 ? "0" : "") + min + "m" + (sec < 10 ? "0" : "") + sec + "s"
      );
    } else {
      return (
        hour +
        "h" +
        (min < 10 ? "0" : "") +
        min +
        "m" +
        (sec < 10 ? "0" : "") +
        sec +
        "s"
      );
    }
  };
  const { enqueueSnackbar } = useSnackbar();
  const geStationList = async () => {
    const res = await RESTManager.api.station.get<any>();
    setStationList(res.data.stations);
  };
  return (
    <Card sx={{ width: 500, margin: "20px" }}>
      <CardMedia
        component="img"
        height="140"
        image="glasgow.jpeg"
        alt="Glasgow"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {cost !== null && (
            <>
              <span
                style={{
                  textDecoration: "line-through",
                  marginRight: "10px",
                  color: "red",
                }}
              >
                ￡{cost}
              </span>
              <span style={{ color: "#af0efa" }}>￡{cost * getDiscount()}</span>
            </>
          )}
          {/* ensure have this line while null*/}
          &nbsp;
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ListAltIcon style={{ fontSize: "14px" }} />
          &nbsp;Order id:&nbsp;
          <span style={{ color: "black", fontSize: "14px", fontWeight: 500 }}>
            {orderData.brId}
          </span>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <PedalBikeIcon style={{ fontSize: "14px" }} />
          &nbsp;Bike id:&nbsp;
          <span style={{ color: "black", fontSize: "14px", fontWeight: 500 }}>
            {orderData.bikeId}
          </span>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <AccessTimeIcon style={{ fontSize: "14px" }} />
          &nbsp;Time cost:&nbsp;
          <span style={{ color: "#af0efa", fontSize: "18px", fontWeight: 600 }}>
            {formatTime(seconds)}
          </span>
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            setReturnOpen(true);
          }}
        >
          Return
        </Button>
        <Button
          size="small"
          onClick={() => {
            setRepairOpen(true);
          }}
        >
          Report for repair
        </Button>
      </CardActions>
      <Dialog
        open={returnOpen}
        onClose={() => {
          setSelectedStationId(null);
          setLat(null);
          setLng(null);
          setReturnOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Return bike"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {cost !== null && (
              <span style={{ color: "#af0efa", fontSize: "22px" }}>
                ￡{cost * getDiscount()}
              </span>
            )}
            &nbsp;should be paid.
            <div>
              Click on the map and select a location you want to return the bike
              at.
            </div>
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
                {lat !== null && (
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedStationId(null);
              setLat(null);
              setLng(null);
              setReturnOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              if (selectedStationId === null && lat === null) {
                enqueueSnackbar("please select a location to return bike!", {
                  variant: "error",
                  autoHideDuration: 2000,
                });
              } else {
                console.log(orderData.brId);
                returnBike(
                  orderData.brId,
                  orderData.bikeId,
                  selectedStationId === null ? "-1" : selectedStationId,
                  lat === null
                    ? stationList.find((el) => {
                        return el.stationId === selectedStationId;
                      })?.latitude
                    : lat,
                  lng === null
                    ? stationList.find((el) => {
                        return el.stationId === selectedStationId;
                      })?.lontitude
                    : lng
                );
                setSelectedStationId(null);
                setLat(null);
                setLng(null);
                setReturnOpen(false);
              }
            }}
            autoFocus
          >
            Return and pay
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={repairOpen}
        onClose={() => {
          setSelectedStationId(null);
          setLat(null);
          setLng(null);
          setRepairOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Report for repair"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            bike id:&nbsp;
            {cost !== null && (
              <span style={{ color: "#af0efa" }}>{orderData.bikeId}</span>
            )}
            <div>
              Click on the map and select a location you want to return the bike
              at.
            </div>
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
                {lat !== null && (
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
          </DialogContentText>
          <Select
            labelId="select-autowidth-label"
            id="select-autowidth"
            value={String(damagePart)}
            variant="standard"
            label="Status"
            sx={{ width: "200px" }}
            onChange={(e) => {
              setDamagePart(Number(e.target.value));
            }}
          >
            <MenuItem value={0}>Wheel</MenuItem>
            <MenuItem value={1}>Brake</MenuItem>
            <MenuItem value={2}>Saddle</MenuItem>
            <MenuItem value={3}>Frame</MenuItem>
            <MenuItem value={4}>Foot pedal</MenuItem>
            <MenuItem value={5}>Chain</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedStationId(null);
              setLat(null);
              setLng(null);
              setRepairOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={async () => {
              if (selectedStationId === null && lat === null) {
                enqueueSnackbar("please select a location to return bike!", {
                  variant: "error",
                  autoHideDuration: 2000,
                });
              } else {
                await repairReport(
                  orderData.brId,
                  orderData.bikeId,
                  selectedStationId === null ? "-1" : selectedStationId,
                  lat === null
                    ? stationList.find((el) => {
                        return el.stationId === selectedStationId;
                      }).latitude
                    : lat,
                  lng === null
                    ? stationList.find((el) => {
                        return el.stationId === selectedStationId;
                      }).lontitude
                    : lng,
                  damagePart
                );
                setSelectedStationId(null);
                setLat(null);
                setLng(null);
                setRepairOpen(false);
              }
            }}
            autoFocus
          >
            Report for repair
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
export default function Order() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  // const orderDetail = [
  //   {
  //     id: "1110001",
  //     startTime: new Date().getTime(),
  //     bikeId: "10001",
  //     startStation: "Station 1",
  //   },
  //   {
  //     id: "1110001",
  //     startTime: new Date().getTime(),
  //     bikeId: "10001",
  //     startStation: "Station 1",
  //   },
  // ];
  const getOrders = async () => {
    const res: any = await RESTManager.api.borrowrecord
      .status("1")
      .user.get<any>();
    setOrderDetail(res.data.borrowRecords);
  };
  useEffect(() => {
    getOrders();
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  const returnBike = async (brId, bikeId, stationId, latitude, lontitude) => {
    const res: any = await RESTManager.api.user.return.put<any>({
      data: { brId, bikeId, stationId, latitude, lontitude },
    });
    if (res.code === 200) {
      enqueueSnackbar("Return successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      getOrders();
    } else {
      enqueueSnackbar("Return fail! Please check if your balance is enough.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };
  const repairReport = async (
    brId,
    bikeId,
    stationId,
    latitude,
    lontitude,
    damagePart
  ) => {
    const res: any = await RESTManager.api.repair.post<any>({
      data: {
        brId,
        bikeId,
        stationId,
        latitude,
        lontitude,
        damagePart,
        status: 0,
      },
    });
    if (res.code === 200) {
      enqueueSnackbar("Report successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      getOrders();
    } else {
      enqueueSnackbar("Report fail! Please check the input and your account.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };
  const history = useHistory();
  return (
    <>
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}>
        <Container maxWidth="sm">
          <div
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {orderDetail.length === 0 && (
              <i
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "18px",
                }}
              >
                No order now,&nbsp;
                <span
                  style={{
                    color: "#af0efa",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  borrow one
                </span>
              </i>
            )}
            {orderDetail.map((order, index) => (
              <OrderItem
                orderData={order}
                returnBike={returnBike}
                repairReport={repairReport}
                key={order.id}
              />
            ))}
          </div>
        </Container>
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
        <Copyright />
      </Box>
    </>
  );
}
