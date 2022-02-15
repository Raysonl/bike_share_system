import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { ResponsiveContainer } from "recharts";
import ReactEcharts from "echarts-for-react";
import { RESTManager } from "../../../utils/request/rest";
import { useEffect } from "react";

const request = "userLevel";
let userData =
  //dataSet
  [
    { name: "LV1", value: 77 },
    { name: "LV2", value: 63 },
    { name: "LV3", value: 45 },
    { name: "LV4", value: 35 },
    { name: "LV5", value: 23 },
    { name: "LV6", value: 8 },
  ];

export default function PieChart() {
  const theme = useTheme();
  const [userList, setUserList] = React.useState<any[]>([]);
  async function handleRequest() {
    const res: any = await RESTManager.api.data.userLevel.get<any>({});
    if (res.data) {
      // await setToken(res.token);
      setUserList(res.data);
    }
  }
  useEffect(() => {
    handleRequest();
    // initMap();
  }, []);

  const option = {
    title: {
      text: "User Level",
      left: "center",
      top: 20,
      textStyle: {
        color: "#777",
      },
    },

    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },

    visualMap: {
      show: true,
      min: 1,
      max: 10,
      inRange: {
        colorLightness: [0, 1],
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "User Portion",
        type: "pie",
        radius: [50, 90],
        center: ["50%", "50%"],

        data: userList.sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: "angle",
        label: {
          position: "outer",
          alignTo: "labelLine",
          margin: 7,
          color: "#777",
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: "#777",
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
        },
        itemStyle: {
          borderRadius: 5,
        },

        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return Math.random() * 200;
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
