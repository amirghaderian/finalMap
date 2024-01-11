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
import { Observable } from "ol";
import { XYZ } from "ol/source";

const LittleMap = ({
  center,
  onSelectedChange,
  nearPoints,
  selectedPointsCount,
}) => {
  const mapContainerRef = useRef(null);
  const access_token =
    "pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw";

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
      controls: []
    });

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
    useEffect(() => {
    if (myMap.current) {
      const evHandler = function (event) {
        const feature = myMap.current.forEachFeatureAtPixel(
          event.pixel,
          function (feature) {
            return feature;
          }
        );

        if (feature) {
          const featureId = feature.ol_uid;
          const selectedPoint = {
            ...nearPoints.find((point) => point.id == featureId),
          };
          if (selectedPointsCount < 5) {
            onSelectedChange(featureId);
          } else if (selectedPoint.selected) {
            onSelectedChange(featureId);
          }
        }
      };
      myMap.current.on("click", evHandler);
      return () => {
        myMap?.current?.un("click", evHandler);
      };
    }
  });

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
