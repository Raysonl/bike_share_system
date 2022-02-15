import * as React from "react";
import { FC, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { RESTManager } from "../../../utils/request/rest";
import { useSnackbar } from "notistack";
function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

function getDateTime() {
  let dateTime = new Date();
  const year = format(dateTime.getFullYear());
  const month = format(dateTime.getMonth() + 1);
  const day = format(dateTime.getDate());
  function format(para) {
    if (para < 10) {
      return "0" + para;
    } else {
      return para;
    }
  }
  const time = day + "-" + month + "-" + year;
  return time;
}

export default function Cost() {
  const { enqueueSnackbar } = useSnackbar();
  const [cost, setCost] = React.useState<string>("");
  const date = getDateTime();
  async function handleCost() {
    const res: any = await RESTManager.api.data.BrAvgAmount.get<any>({});
    if (res.data) {
      enqueueSnackbar("Submit successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
      // await setToken(res.token);
      setCost(res.data);
    }
  }
  useEffect(() => {
    handleCost();
    // initMap();
  }, []);
  // cost_avg = 3.4;fake data
  return (
    <React.Fragment>
      <Title>Recent Average Cost</Title>

      <Typography color="text.secondary" component="p" variant="h4">
        £ {cost}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {date}
      </Typography>
    </React.Fragment>
  );
}
