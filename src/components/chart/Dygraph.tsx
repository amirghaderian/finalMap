import { useEffect, useRef } from "react";
import Dygraph from "dygraphs";

import "./dygraph.css";

var graphStyle = {
  width: "100%",
  height: 300,
};

var divStyle = {
  border: "1px solid #c8c8c8",
  padding: "1rem 2rem 2rem 0",
  boxSizing: "border-box",
  margin: "1rem",
  borderRadius: "4px",
};

var header = {
  margin: 0,
  opacity: 0.8,
  marginBottom: "1rem",
};

var cleanPresets = {
  axes: {
    x: {
      drawGrid: false,
      drawAxis: false,
    },
    y: {
      drawGrid: false,
      drawAxis: false,
    },
  },
  rollPeriod: 7,
  labelsDiv: "",
  highlightCircleSize: 2,
  strokeWidth: 2,
  legend: "none",
  animatedZooms: false,
  colors: ["#f47560", "#61cdbb"],
};

var fullPresets = {
  axes: {
    x: {
      drawGrid: false,
      drawAxis: true,
      axisLineColor: "white",
      axisLineWidth: 1.5,
    },
    y: {
      drawAxis: true,
      gridLineWidth: 1.5,
      gridLineColor: "#eee",
      gridLinePattern: [5, 5],
      axisLineColor: "white",
      axisLineWidth: 1,
    },
  },
  rollPeriod: 10,
  highlightCircleSize: 5,
  labels: ["X", "Y1", "Y2"],
  legendFormatter: legendFormatter,
  legend: "follow",
  strokeWidth: 2,
  fillGraph: true,
  colors: ["#f47560", "#61cdbb"],
  visibility: [true, true],
  animatedZooms: true,
  hideOverlayOnMouseOut: false,
};

function legendFormatter(data) {
  if (data.x == null) {
    // This happens when there's no selection and {legend: 'always'} is set.
    return +data.series
      .map(function (series) {
        return series.dashHTML + " " + series.labelHTML;
      })
      .join();
  }

  var html = "<b>" + data.xHTML + "</b>";
  data.series.forEach((series) => {
    if (!series.isVisible) return;

    var labeledData = series.labelHTML + " <b>" + series.yHTML + "</b>";

    if (series.isHighlighted) {
      labeledData = "<b>" + labeledData + "</b>";
    }

    html +=
      "<div class='dygraph-legend-row'>" +
      series.dashHTML +
      "<div>" +
      labeledData +
      "</div></div>";
  });
  return html;
}

export default function Graph(props) {
  const graphEl = useRef(null);
  useEffect(() => {
    new Dygraph(graphEl.current, props.data, fullPresets);
  });
  return (
    <div style={divStyle}>
      <h3 style={header}>{props.title || "No title"}</h3>
      <div style={graphStyle} className={props.id} ref={graphEl} />
    </div>
  );
}
