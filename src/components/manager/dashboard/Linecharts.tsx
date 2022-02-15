import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import ReactEcharts from "echarts-for-react";
import { RESTManager } from "../../../utils/request/rest";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
// Generate the latest date of seven days from now

/*let dataSet;
let orderData;
let userData;
let Dates;
dataSet = JSON.parse(JSON.stringify(
    {
        "dateTime": [
            "2021-10-25",
            "2021-10-26",
            "2021-10-27",
            "2021-10-28",
            "2021-10-29",
            "2021-10-30",
            "2021-10-31"
        ],
        "orderResult": [
            10,
            4,
            2,
            8,
            6,
            2,
            4
        ],
        "activeUserResult": [
            10,
            2,
            1,
            6,
            2,
            1,
            3
        ]
    }))
orderData = dataSet["orderResult"];
userData = dataSet["activeUserResult"];
Dates = dataSet["dateTime"];*/

export default function LineCharts() {
  const theme = useTheme();
  const [orderList, setOrderList] = React.useState<any[]>([]);
  const [userList, setUserList] = React.useState<any[]>([]);
  const [timeList, setTimeList] = React.useState<any[]>([]);
  let counter = 7;
  function getDateTime() {
    let dateTime = new Date();
    const month = format(dateTime.getMonth() + 1);
    const day = format(dateTime.getDate() - counter);
    counter = counter - 1;

    function format(para) {
      if (para < 10) {
        return "0" + para;
      } else {
        return para;
      }
    }
    const time = month + "-" + day;
    return time;
  }

  async function handleRequest() {
    const res: any = await RESTManager.api.data.recordAndAmount.get<any>({});
    if (res.data) {
      // await setToken(res.token);
      setTimeout(function () {
        let dataSet = JSON.parse(JSON.stringify(res.data));
        setOrderList(dataSet["orderResult"]);
        setUserList(dataSet["activeUserResult"]);
        setTimeList(dataSet["dateTime"]);
      }, 2000);
    }
  }
  /*[
        10, 12, 23, 9, 5, 20, 15
    ];*
    const  =/* [
        7, 10, 18, 3, 4, 19, 10
    ];*/
  useEffect(() => {
    handleRequest();
    // initMap();
  }, []);

  const option = {
    title: {
      text: "Orders and users in the Past Week",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        dataView: { readOnly: false },
        magicType: { type: ["line", "bar"] },
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: timeList,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}",
      },
    },
    series: [
      {
        name: "Order Number",
        type: "line",
        data: orderList,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
      },
      {
        name: "Active User",
        type: "line",
        data: userList,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [
            { type: "average", name: "Avg" },
            [
              {
                symbol: "none",
                x: "90%",
                yAxis: "max",
              },
              {
                symbol: "circle",
                label: {
                  position: "start",
                  formatter: "Max",
                },
                type: "max",
                name: "Highest active users",
              },
            ],
          ],
        },
      },
    ],
  };
  return (
    <React.Fragment>
      <ResponsiveContainer>
        <ReactEcharts
          option={option}
          style={{ height: "300px", width: "100%" }}
          className={"react_for_echarts"}
        />
      </ResponsiveContainer>
    </React.Fragment>
  );
}
