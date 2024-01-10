// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Circle } from "ol/style";
import data from "../../services/servers.json";
import { Observable } from "ol";
import { XYZ } from "ol/source";

const LittleMap = ({
  center,
  onIdNumberChange,
  centerId,
  onSelectedChange,
  nearPoints,
  setNearPoints,
  selectedPointsCount,
}) => {
  const mapContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [idNumber, setIdNumber] = useState<Number>();
  const access_token =
    "pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw";
  const y = 0.01324773;
  const x = 2.16 * y;
  console.log(center);
  const FindLatiude = data.find((item) => item.id === centerId)?.location
    .latitude;
  const FindeLongitude = data.find((item) => item.id === centerId)?.location
    .longitude;
  const FilterNear = data.filter(
    (item) =>
      (item.location.latitude >= FindLatiude - y &&
        item.location.latitude <= FindLatiude + y) ||
      (item.location.longitude >= FindeLongitude - x &&
        item.location.longitude <= FindeLongitude + x)
  );

  const myMap = useRef(null);

  useEffect(() => {
    const mapContainerId = `map-${Math.floor(Math.random() * 1000)}`;

    const mapContainer = document.createElement("div");
    mapContainer.id = mapContainerId;
    mapContainer.style.width = "100%";
    mapContainer.style.height = "200px";

    mapContainerRef.current = mapContainer;

    document.getElementById("littleMap").appendChild(mapContainer);
    const map = new Map({
      target: mapContainerId,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${access_token}`,
          }),
        }),
      ],
      view: new View({
        center: center,
        zoom: 13,
        minZoom: 13,
        maxZoom: 13,
      }),
      interactions: [],
    });

    map.on("click", function (event) {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );

      if (feature) {
        console.log({ feature });
        const featureId = feature.ol_uid;
        // onSelectedChange(featureId);

        setOpen(true);
        setIdNumber(Number(featureId));
        onIdNumberChange(Number(featureId));
      }
    });

    // setMyMap(map);
    myMap.current = map;

    return () => {
      if (myMap.current) myMap.current = null;
      const mapContainerElement = document.getElementById("littleMap");
      if (mapContainerElement && mapContainerRef.current) {
        map.setTarget(null);
        mapContainerElement.removeChild(mapContainerRef.current);
      }
    };
  }, []);
  useEffect(
    () => {
      // let evHandler;
      console.count("called");
      if (myMap.current) {
        // myMap.current.un("click", evHandler);
        const evHandler = function (event) {
          console.log("!!@!@");
          console.log({ selectedPointsCount });
          const feature = myMap.current.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
              return feature;
            }
          );

          if (feature) {
            console.log({ feature });
            const featureId = feature.ol_uid;
            const selectedPoint = {
              ...nearPoints.find((point) => point.id == featureId),
            };
            if (selectedPointsCount < 5) {
              onSelectedChange(featureId);
              setOpen(true);
              setIdNumber(Number(featureId));
              onIdNumberChange(Number(featureId));
            } else if (selectedPoint.selected) {
              onSelectedChange(featureId);
              setOpen(true);
              setIdNumber(Number(featureId));
              onIdNumberChange(Number(featureId));
            }
          }
          // if (selectedPointsCount < 5) {
          // }
        };
        myMap.current.on("click", evHandler);
        return () => {
          // if (evHandler.current) {
          // 	// Observable.unByKey(evHandler.current);
          // 	evHandler.current = null;
          // }
          // console.log("CALLING RET");
          myMap?.current?.un("click", evHandler);
        };
      }
    }
    // [onSelectedChange, selectedPointsCount]
  );

  useEffect(() => {
    // Create an array of points
    if (myMap.current) {
      const points = nearPoints.map((server) => ({
        coordinates: [server.location?.longitude, server.location?.latitude],
        color: server.fillColor || "#A6A7A6",

        id: server.id,
        selected: server.selected,
      }));

      // Create an array of point features
      const pointFeatures = points.map((point) => {
        const geom = new Point(fromLonLat(point.coordinates));
        const feature = new Feature(geom);
        feature.ol_uid = point.id;
        // Style for the point
        const pointStyle = new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({
              // color: centerId === point.id ? "red" : point.color,
              // color: point.selected ? "red" : point.color,
              color: point.color,
            }),
            stroke: new Stroke({ color: "#808080", width: 1 }),
          }),
        });

        feature.setStyle(pointStyle);

        return feature;
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: pointFeatures,
        }),
      });

      myMap.current.addLayer(vectorLayer);
    }
  }, [nearPoints]);

  const handleChange = (event) => {
    const aa = { ...nearPoints.find((point) => point.id == event.target.id) };
    const filteredPoints = nearPoints.filter(
      (point) => point.id != event.target.id
    );
    aa.selected = event.target.checked;
    console.log({ nearPoints });
    setNearPoints([...filteredPoints, aa]);
  };

  return (
    <>
      <div
        id="littleMap"
        style={{ width: "100%", height: "100%" }}
        ref={mapContainerRef}
      ></div>
    </>
  );
};

export default LittleMap;
