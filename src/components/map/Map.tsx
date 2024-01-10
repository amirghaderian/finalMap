// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Circle, RegularShape } from "ol/style";
import data from "../../services/servers.json";
import { XYZ } from "ol/source";

import { Dialogs } from "..";
const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [FId, setFId] = useState<Number>();
  const [center, setCenter] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [littleMapId, setLittleMapId] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [centerId, setCenterId] = useState<Number>();
  const access_token =
    "pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw";
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const mapContainerId = `map-${Math.floor(Math.random() * 1000)}`;

    const mapContainer = document.createElement("div");
    mapContainer.id = mapContainerId;
    mapContainer.style.width = "100%";
    mapContainer.style.height = "100%";
    document.getElementById("map-container").appendChild(mapContainer);

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
        center: [5720467.70799008, 4262248.0061709145],
        zoom: 13,
      }),
    });

    // Create an array of points
    const points = data.map((server) => ({
      coordinates: [server.location?.longitude, server.location?.latitude],
      color: "blue",
      id: server.id,
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
          fill: new Fill({ color: point.color }),
          stroke: new Stroke({ color: "white", width: 1 }),
        }),
      });

      feature.setStyle(pointStyle);

      return feature;
    });

    // Create a vector layer with the point features
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: pointFeatures,
      }),
    });

    map.addLayer(vectorLayer);

    map.on("click", function (event) {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );

      if (feature) {
        const featureId = feature.ol_uid;
        const featureCoordinates = feature.getGeometry().getCoordinates();
        const featureProperties = feature.getProperties();
        setCenter(featureCoordinates);
        setCenterId(featureId);
        setOpen(true);
        setFId(Number(featureId));
      }
    });

    return () => {
      map.setTarget(null);
      document
        .getElementById("map-container")
        .removeChild(mapContainerRef.current);
    };
  }, []);

  return (
    <>
      <div id="map-container" style={{ width: "100%", height: "700px" }}></div>
      {open && (
        <Dialogs
          littleMapId={littleMapId}
          setLittleMapId={setLittleMapId}
          timeSeries={timeSeries}
          setTimeSeries={setTimeSeries}
          isOpen={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          center={center}
          centerId={centerId}
          fId={FId}
        />
      )}
    </>
  );
};

export default MapComponent;
