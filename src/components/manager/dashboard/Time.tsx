import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { RESTManager } from "../../../utils/request/rest";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
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

export default function Time() {
  const { enqueueSnackbar } = useSnackbar();
  const date = getDateTime();
  const [time, setTime] = React.useState(0);
  async function handleCost() {
    const res: any = await RESTManager.api.data.BrAvgTime.get<any>({});
    if (res.data) {
      // await setToken(res.token);

      setTime(res.data);
    }
  }
  let num: number = time / 60000;
  useEffect(() => {
    handleCost();
    // initMap();
  }, []);
  // resultName = 17;fake data
  return (
    <React.Fragment>
      <Title>Average Time Usage</Title>

      <Typography color="text.secondary" component="p" variant="h4">
        {Math.abs(Number(num.toFixed(1)))} mins
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {date}
      </Typography>
    </React.Fragment>
  );
}
