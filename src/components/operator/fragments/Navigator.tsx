import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import PublicIcon from "@mui/icons-material/Public";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useHistory, useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { useEffect } from "react";

function usePageViews() {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
}

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props: any) {
  const { active_name, ...other } = props;
  const categories: any =
    active_name === "bikes" ||
    active_name === "stations" ||
    active_name === "repair"
      ? [
          {
            id: "Bikes",
            children: [
              {
                id: "Bike Management",
                icon: <PedalBikeIcon />,
                active: active_name === "bikes",
              },
            ],
          },
          {
            id: "Station",
            children: [
              {
                id: "Station Management",
                icon: <LocationOnIcon />,
                active: active_name === "stations",
              },
            ],
          },
          {
            id: "Repair",
            children: [
              {
                id: "Repair Reports",
                icon: <ReportGmailerrorredIcon />,
                active: active_name === "repair",
              },
            ],
          },
        ]
      : [
          {
            id: "Functions",
            children: [
              {
                id: "Borrow Bikes",
                icon: <DirectionsBikeIcon />,
                active: active_name === "",
              },
              {
                id: "Your Orders",
                icon: <ReceiptIcon />,
                active: active_name === "orders",
              },
            ],
          },
          // {
          //   id: "Profile Overview",
          //     children: [{ id: "Your profile", icon: <SettingsIcon />, active: active_name === "profile" }],
          // },
        ];
  usePageViews();
  const history = useHistory();

  const [selectedValue, setSelectedValue] = React.useState(String);
  function handleListItemClick(value: string) {
    //switch pages in navigator
    setSelectedValue(value);
    console.log(selectedValue);
    checkout(value);
  }
  function checkout(selectedValue) {
    if (selectedValue === "Station Management") {
      history.push("/operator/stations");
    } else if (selectedValue === "Bike Management") {
      history.push("/operator/bikes");
    } else if (selectedValue === "Borrow Bikes") {
      history.push("/");
    } else if (selectedValue === "Your Orders") {
      history.push("/orders");
    } else if (selectedValue === "Your profile") {
      history.push("/profile");
    } else if (selectedValue === "Repair Reports") {
      history.push("/operator/repair");
    }
  }

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 20, color: "#fff" }}
        >
          <PedalBikeIcon />
          Rainbow Bikes
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  selected={active}
                  sx={item}
                  onClick={() => handleListItemClick(childId)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
