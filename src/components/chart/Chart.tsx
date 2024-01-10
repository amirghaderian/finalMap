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
				show: true, // نمایش ابزار زوم
				start: 0, // درصد شروع زوم
				end: 100, // درصد پایان زوم
				handleSize: "100%", // اندازه دسته زوم (تا 100% از نمودار)
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
			},
			{
				type: "inside",
				xAxisIndex: [0],
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
			eChartsRef.current.getEchartsInstance().setOption(option, true);
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
