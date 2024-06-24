import { useState, useMemo, useEffect } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { timeParse } from "d3-time-format";

import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";

import { load } from "@loaders.gl/core";
import { CSVLoader } from "@loaders.gl/csv";

import AnimatedArcLayer from "../utils/animated-arc-group-layer";
import RangeInput from "../utils/range-input";
import diccionario_estaciones from "../assets/estaciones.json";
import "maplibre-gl/dist/maplibre-gl.css";

// Data source
const DATA_URL = "https://tirandocodigo.mx/databis/datos/retiro_arribo.csv";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  longitude: -99.2,
  latitude: 19.4,
  zoom: 12,
  maxZoom: 20,
};

/* eslint-disable react/no-deprecated */
export default function EcoBaby({
  mapStyle = MAP_STYLE,
  muestraviajes = true,
  delta = 300,
}) {
  const [tiempo_actual, setTiempoActual] = useState(0);
  const [velocidad, setVelocidad] = useState(5);
  const cambiaVelocidad = (event) => {
    setVelocidad(event.target.value);
  };
  const [data, setData] = useState(null);

  useEffect(() => {
    load(DATA_URL, CSVLoader, { csv: { dynamicTyping: false } }).then(
      (viajes) => {
        setData(viajes);
      }
    );
  }, []);
  const citiesLayers = useMemo(
    () => [
      new GeoJsonLayer({
        id: "cities-highlight",
        data: "https://tirandocodigo.mx/databis/datos/cicloestaciones.geojson",
        pointType: "circle",
        pointRadiusUnits: "common",
        pointRadiusScale: 0.2,
        pointRadiusMinPixels: 0.1,
        pointRadiusMaxPixels: 1.5,
        getFillColor: [255, 171, 100, 200],

        getLineWidth: 1,
        lineWidthUnits: "pixels",
        filled: true,
        stroked: false,

        //extensions: [new MaskExtension()],
        //maskId: 'viaje-mask'
      }),
    ],
    []
  );

  const viajeLayerProps = {
    data,
    greatCircle: true,
    getSourcePosition: (d) => diccionario_estaciones?.[d.r_e],
    getTargetPosition: (d) => diccionario_estaciones?.[d.a_e],
    getSourceTimestamp: (d) => +d.r_f,
    getTargetTimestamp: (d) => +d.a_f,
    getHeight: 0,
  };

  const viajePathsLayer =
    muestraviajes &&
    new AnimatedArcLayer({
      ...viajeLayerProps,
      id: "viaje-paths",
      timeRange: [tiempo_actual - 240, tiempo_actual], // 10 minutes
      getWidth: 0.2,
      widthMinPixels: 1,
      widthMaxPixels: 4,
      widthUnits: "common",
      getSourceColor: [50, 240, 236],
      getTargetColor: [250, 80, 247],
      parameters: { depthTcitiesest: false },
    });

  const viajeMaskLayer = new AnimatedArcLayer({
    ...viajeLayerProps,
    id: "viaje-mask",
    timeRange: [tiempo_actual - delta * 4, tiempo_actual],
    operation: "mask",
    getWidth: 10,
    widthUnits: "meters",
  });

  return (
    <>
      <div className="inicio">
        <h2>Visualización de datos de viajes en ecobici</h2>
        <p>
          En este mapa animado e interactivo se muestran los viajes realizados
          en el mes de mayo de 2024 en Ecobici, los datos se obtienen del{" "}
          <a href="https://ecobici.cdmx.gob.mx/datos-abiertos/" target="_blank">
            portal de datos abiertos
          </a>
          .
        </p>
        <p>
          <span className="vis-nomenclatura">
            <span
              className="figura-variable"
              style={{background: 'rgb(50, 240, 236)'}}
            ></span>
            Inicio del viaje
          </span>
          <span className="vis-nomenclatura">
            <span
              className="figura-variable"
              style={{background: 'rgb(250, 80, 247)'}}
            ></span>
            Fin del viaje
            </span>
        </p>
      </div>
      <div className="contenedor-mapa">
        <div className="detalle-tiempo">
          <p>{tiempo_actual}</p>
        </div>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={[viajePathsLayer, citiesLayers]}
        >
          <Map
            reuseMaps
            mapLib={maplibregl}
            mapStyle={mapStyle}
            preventStyleDiffing={true}
          />
        </DeckGL>
        {data && (
          <RangeInput
            min={0}
            max={2678399}
            value={tiempo_actual}
            animationSpeed={velocidad}
            formatLabel={formatTimeLabel}
            onChange={setTiempoActual}
          />
        )}
      </div>
    </>
  );
}
var fecha_inicial = timeParse("%d-%m-%Y")("01-01-2024");
let dias = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function formatTimeLabel(seconds) {
  var fecha_actualizada = timeParse("%d-%m-%Y")("01-01-2024");

  const dia = new Date(
    fecha_actualizada.setSeconds(fecha_inicial.getSeconds() + seconds)
  );

  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  return (
    dias[dia.getDay()] +
    " " +
    dia.getDate() +
    " de mayo | " +
    [dia.getHours(), dia.getMinutes(), dia.getSeconds()]
      .map((x) => x.toString().padStart(2, "0"))
      .join(":")
  );
}
