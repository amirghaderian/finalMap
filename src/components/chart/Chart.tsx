// @ts-nocheck
import ReactEcharts from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const Echart = ({ nearPoints }) => {
  const eChartsRef = useRef(null);

  const [pointsMap, setPointsMap] = useState([]);

  const daynamictimeSeri = [...pointsMap];

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Search Engine", ...pointsMap.map((point) => point.name)],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: "دانلود چارت",
        },
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        show: true,
        type: "slider", // Use slider for better control
        start: 0,
        end: 100,
        handleSize: "100%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        textStyle: {
          color: "#fff",
        },
        xAxisIndex: [0],
      },
      {
        show: true,
        type: "slider",
        start: 0,
        end: 100,
        handleSize: "100%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        textStyle: {
          color: "#fff",
        },
        yAxisIndex: [0],
      },
      {
        type: "inside",
        xAxisIndex: [0],
        start: 30,
        end: 70,
      },
      {
        type: "inside",
        yAxisIndex: [0],
        start: 30,
        end: 70,
      },
    ],

    series: daynamictimeSeri,
  };

  useEffect(() => {
    const pointsMapss = nearPoints
      .filter((point) => point.selected)
      .map((point) => ({
        name: point.title,
        type: "line",
        data: point.time_series || [],
        smooth: true,
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: point.fillColor,
        },
      }));
    setPointsMap(pointsMapss);
  }, [nearPoints]);

  useEffect(() => {
    if (eChartsRef && eChartsRef.current) {
      eChartsRef.current
        .getEchartsInstance()
        .setOption(option, { notMerge: true });

      eChartsRef.current.getEchartsInstance().dispatchAction({
        type: "tooltipHide",
      });
      // Trigger the zoom animation

      eChartsRef.current.getEchartsInstance().dispatchAction({
        type: "dataZoom",
        start: 0,
        end: 100,
      });
    }
  }, [option, nearPoints, pointsMap]);

  return (
    <>
      {pointsMap.length ? (
        <ReactEcharts
          option={option}
          style={{
            height: "500px",
            width: "100%",
          }}
          className="w-[300px]"
          ref={eChartsRef}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>از منو مقابل نقطه‌ای را انتخاب کنید</Typography>
        </Box>
      )}
    </>
  );
};
export default Echart;
