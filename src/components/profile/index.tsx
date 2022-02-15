import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Header } from "components/operator/Headers/Header";
import Container from "@mui/material/Container";
import { FC, useState, useEffect } from "react";
import { appStore } from "store/app";
import { observer } from "mobx-react-lite";
import { RESTManager } from "utils/request/rest";
import { setSelfToStore } from "store/self";
import { useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useSnackbar } from "notistack";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { removeToken } from "utils/auth";
import Popover from "@mui/material/Popover";
import dayjs from "dayjs";

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
interface DetalItemProps {
  detailName: string;
}
const DetalItem: FC<DetalItemProps> = (props) => {
  const { children, detailName } = props;
  return (
    <div style={{ display: "flex", minHeight: "30px" }}>
      <div
        style={{
          width: "100px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-end",
          color: "#48576a",
          paddingRight: "10px",
          fontSize: "14px",
        }}
      >
        {detailName + ":"}
      </div>
      <div
        style={{
          width: "calc(100% - 100px)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "#898989",
          fontSize: "14px",
          paddingLeft: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
};
export const Profile: FC = observer(() => {
  const [userDetail, setUserDetail] = useState<any>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [chargeNumber, setChargeNumber] = useState<number | "">("");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const loginByToken = async () => {
    try {
      const res: any = await RESTManager.api.user.getUserInfoByToken.get<any>();
      if (res.data) {
        setSelfToStore(res.data);
        setUserDetail(res.data);
      }
      if (res.code !== 200) {
        history.push("/login");
      }
    } catch {
      history.push("/login");
    }
  };
  useEffect(() => {
    if (appStore.user) {
      setUserDetail(appStore.user);
    } else {
      // loginByToken();
    }
  }, []);
  const charge = async (number) => {
    if (number === "") {
      enqueueSnackbar("Please enter how much you want to charge!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else {
      const res: any = await RESTManager.api.user.topup.post<any>({
        data: { balance: number },
      });
      if (res.code === 200) {
        enqueueSnackbar("Charge successfully!", {
          variant: "success",
          autoHideDuration: 2000,
        });
        loginByToken();
        setDialogOpen(false);
      } else {
        enqueueSnackbar("Charge fail! Connect Error!", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  };
  const getLevel = (exp) => {
    exp = Number(exp);
    if (exp < 1) {
      return 0;
    } else if (exp < 5) {
      return 1;
    } else if (exp < 20) {
      return 2;
    } else if (exp < 50) {
      return 3;
    } else if (exp < 200) {
      return 4;
    } else {
      return 5;
    }
  };
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 52px)",
        }}
      >
        <Header path={"profile"} onDrawerToggle={() => {}} />
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
        >
          <Container maxWidth="sm">
            <div style={{ backgroundColor: "white" }}>
              <div
                style={{
                  width: "100%",
                  height: "50px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: "20px",
                  color: "#c75df8",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#c75df8",
                    width: "4px",
                    height: "16px",
                    marginRight: "5px",
                  }}
                />
                <span>My Profile</span>
              </div>
              <div style={{ padding: "20px 0" }}>
                <DetalItem detailName={"Username"}>
                  {userDetail.userName}
                  <div
                    style={{
                      height: "20px",
                      width: "60px",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#c75df8",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "3px",
                    }}
                    onClick={async () => {
                      removeToken();
                      history.push("/login");
                    }}
                  >
                    Log out
                  </div>
                </DetalItem>
                <DetalItem detailName={"Exp"}>
                  <span>{userDetail.exp}</span>
                  <div
                    style={{
                      height: "28px",
                      width: "56px",
                      marginLeft: "40px",
                      transform: "scale( 0.5,0.5 )",
                      color: "white",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: "22px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor:
                        getLevel(userDetail.exp) === 0
                          ? "#bfbfbf"
                          : getLevel(userDetail.exp) === 1
                          ? "#96DFB4"
                          : getLevel(userDetail.exp) === 2
                          ? "#94D0E7"
                          : getLevel(userDetail.exp) === 3
                          ? "#FFB478"
                          : getLevel(userDetail.exp) === 4
                          ? "#f08432"
                          : "#fa6f6f",
                    }}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <div style={{ margin: "20px" }}>
                        <div
                          style={{
                            fontSize: "16px",
                            marginLeft: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          Level System Rule
                        </div>
                        <div
                          style={{
                            opacity: 0.7,
                            fontSize: "14px",
                            marginLeft: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          *You will get 1 exp everytime you pay for a bike
                          order.
                        </div>
                        {[0, 1, 2, 3, 4, 5].map((item) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span
                              style={{
                                height: "28px",
                                width: "56px",
                                transform: "scale( 0.5,0.5 )",
                                color: "white",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: 600,
                                fontSize: "22px",
                                borderRadius: "4px",
                                backgroundColor:
                                  item === 0
                                    ? "#bfbfbf"
                                    : item === 1
                                    ? "#96DFB4"
                                    : item === 2
                                    ? "#94D0E7"
                                    : item === 3
                                    ? "#FFB478"
                                    : item === 4
                                    ? "#f08432"
                                    : "#fa6f6f",
                              }}
                            >
                              {"LV" + item}
                            </span>
                            <span style={{ width: "70px", textAlign: "right" }}>
                              {item === 0
                                ? "0"
                                : item === 1
                                ? "1"
                                : item === 2
                                ? "5"
                                : item === 3
                                ? "20"
                                : item === 4
                                ? "50"
                                : "200"}
                              {item === 5 ? "+" : item === 0 ? "" : "~"}
                              {item === 0
                                ? ""
                                : item === 1
                                ? "4"
                                : item === 2
                                ? "19"
                                : item === 3
                                ? "49"
                                : item === 4
                                ? "199"
                                : ""}
                              &nbsp;
                            </span>
                            exp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span
                              style={{
                                color:
                                  item === 0
                                    ? "#bfbfbf"
                                    : item === 1
                                    ? "#96DFB4"
                                    : item === 2
                                    ? "#94D0E7"
                                    : item === 3
                                    ? "#FFB478"
                                    : item === 4
                                    ? "#f08432"
                                    : "#fa6f6f",
                                width: "40px",
                                textAlign: "right",
                              }}
                            >
                              {5 * item}%&nbsp;
                            </span>
                            discount
                          </div>
                        ))}
                      </div>
                    </Popover>
                    {"LV" + getLevel(userDetail.exp)}
                  </div>
                </DetalItem>
                <DetalItem detailName={"Create at"}>
                  {dayjs(new Date(userDetail.createTime)).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
                </DetalItem>
                <DetalItem detailName={"Balance"}>
                  <span style={{ color: "#c75df8", width: "auto" }}>
                    ￡{userDetail.balance}
                  </span>
                  <div
                    style={{
                      height: "20px",
                      width: "60px",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#c75df8",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "3px",
                    }}
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    Charge
                  </div>
                </DetalItem>
                <DetalItem detailName={"Gender"}>
                  <div
                    style={{
                      height: "20px",
                      width: "60px",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        userDetail.gender === undefined ||
                        userDetail.gender === null ||
                        userDetail.gender === -1
                          ? "#c75df8"
                          : "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      color:
                        userDetail.gender === undefined ||
                        userDetail.gender === null ||
                        userDetail.gender === -1
                          ? "white"
                          : "#c75df8",
                      borderRadius: "3px",
                    }}
                    onClick={async () => {
                      const res: any = await RESTManager.api.user.put<any>({
                        data: { gender: -1 },
                      });
                      if (res.code === 200) {
                        setUserDetail({ ...userDetail, gender: -1 });
                      }
                    }}
                  >
                    unset
                  </div>
                  <div
                    style={{
                      height: "20px",
                      width: "60px",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        userDetail.gender === 0 || userDetail.gender === false
                          ? "#c75df8"
                          : "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      color:
                        userDetail.gender === 0 || userDetail.gender === false
                          ? "white"
                          : "#c75df8",
                      marginLeft: "20px",
                      borderRadius: "3px",
                    }}
                    onClick={async () => {
                      const res: any = await RESTManager.api.user.put<any>({
                        data: { gender: 0 },
                      });
                      if (res.code === 200) {
                        setUserDetail({ ...userDetail, gender: 0 });
                      }
                    }}
                  >
                    Female
                  </div>
                  <div
                    style={{
                      height: "20px",
                      width: "60px",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        userDetail.gender === 1 || userDetail.gender === true
                          ? "#c75df8"
                          : "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      color:
                        userDetail.gender === 1 || userDetail.gender === true
                          ? "white"
                          : "#c75df8",
                      marginLeft: "20px",
                      borderRadius: "3px",
                    }}
                    onClick={async () => {
                      const res: any = await RESTManager.api.user.put<any>({
                        data: { gender: 1 },
                      });
                      if (res.code === 200) {
                        setUserDetail({ ...userDetail, gender: 1 });
                      }
                    }}
                  >
                    Male
                  </div>
                </DetalItem>
                <DetalItem detailName={"Role"}>
                  <span style={{ color: "#deb887", width: "60px" }}>
                    {userDetail.authority === 0
                      ? "Manager"
                      : userDetail.authority === 1
                      ? "Operator"
                      : "Customer"}
                  </span>
                  {userDetail.authority === 2 && (
                    <span
                      style={{
                        fontWeight: "lighter",
                        opacity: "0.7",
                        fontSize: "12px",
                        marginLeft: "20px",
                      }}
                    >
                      *You can apply to become an operator by contacting us.
                    </span>
                  )}
                </DetalItem>
              </div>
            </div>
          </Container>
        </Box>
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
        <DialogTitle id="alert-dialog-title">
          {"Charge your accont."}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="charge number"
            value={chargeNumber}
            onChange={(e) => {
              console.log(e.target.value);
              if (e.target.value !== "") {
                setChargeNumber(Number(e.target.value));
              } else {
                setChargeNumber("");
              }
            }}
            name="numberformat"
            id="formatted-numberformat-input"
            type="number"
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">￡</InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              charge(chargeNumber);
            }}
            autoFocus
          >
            Charge
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
