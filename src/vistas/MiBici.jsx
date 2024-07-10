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
import { styled } from "@mui/system";

import Slider from "@mui/material/Slider";

import diccionario_estaciones from "../assets/estaciones_mibici.json";
import "maplibre-gl/dist/maplibre-gl.css";

const COLOR = "#fff";

const ControlDeslizante = styled(Slider)(({ theme }) => ({
  marginLeft: 12,
  width: "40%",
  color: COLOR,
  "& .MuiSlider-valueLabel": {
    whiteSpace: "nowrap",
    background: "none",
    color: COLOR,
  },
}));

// Data source
const DATA_URL =
  "https://tirandocodigo.mx/databis/datos/retiro_arribo_mibici.csv";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  longitude: -103.36,
  latitude: 20.67,
  zoom: 12,
  maxZoom: 20,
};

/* eslint-disable react/no-deprecated */
export default function EcoBaby({
  mapStyle = MAP_STYLE,
  muestraviajes = true,
}) {
  const [tiempo_actual, setTiempoActual] = useState(0);
  const [velocidad, setVelocidad] = useState(10);
  const cambiaVelocidad = (event,newValue) => {
    setVelocidad(newValue);
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
        data: "https://tirandocodigo.mx/databis/datos/cicloestaciones_mibici.geojson",
        pointType: "circle",
        pointRadiusUnits: "common",
        pointRadiusScale: 0.2,
        pointRadiusMinPixels: 0.1,
        pointRadiusMaxPixels: 1.5,
        getFillColor: [255, 171, 100, 200],

        getLineWidth: 1,
        filled: true,
        stroked: false,
      }),
    ],
    []
  );

  const viajeLayerProps = {
    data,
    greatCircle: true,
    getSourcePosition: (d, i) =>
      diccionario_estaciones?.[d.r_e].map(
        (dd, i) => dd + (i % 2 == 0 ? 0.00032 : 0.0006)
      ),
    getTargetPosition: (d) =>
      diccionario_estaciones?.[d.a_e].map(
        (dd, i) => dd + (i % 2 == 0 ? 0.00032 : 0.0006)
      ),
    getSourceTimestamp: (d) => +d.r_f,
    getTargetTimestamp: (d) => +d.a_f,
    getHeight: 0,
  };

  const viajePathsLayer =
    muestraviajes &&
    new AnimatedArcLayer({
      ...viajeLayerProps,
      id: "viaje-paths",
      timeRange: [tiempo_actual - 180, tiempo_actual],
      getWidth: 0.2,
      widthMinPixels: 1,
      widthMaxPixels: 4,
      widthUnits: "common",
      getSourceColor: [50, 240, 236],
      getTargetColor: [250, 80, 247],
    });

  return (
    <>
      <div className="ecobaby">
        <h2>Visualización de datos de viajes en MiBici</h2>
        <p>
          En este mapa animado e interactivo se muestran los viajes realizados
          en el mes de mayo de 2024 en MiBici, los datos se obtienen del{" "}
          <a href="https://www.mibici.net/es/datos-abiertos/" target="_blank">
            portal de datos abiertos
          </a>
          .
        </p>
        <p>
          Cada viaje se representa con un punto que se mueve en trayectoria
          recta, ya que sólo se cuenta con datos de origen y destino, y
          preferimos no asumir que las rutas calculadas mediante otras herramientas son las
          que toman realmente lxs ciclistas.
        </p>
        <p>
          <span className="vis-nomenclatura">
            <span
              className="figura-variable"
              style={{ background: "rgb(50, 240, 236)" }}
            ></span>
            Inicio del viaje
          </span>
          <span className="vis-nomenclatura">
            <span
              className="figura-variable"
              style={{ background: "rgb(250, 80, 247)" }}
            ></span>
            Fin del viaje
          </span>
        </p>
        <div className="contenedor-info-control">
          <div>
            <span className="etiqueta-fecha">
              {formatTimeLabel(tiempo_actual).split("-")[0]}
            </span>
            <br />
            <span className="etiqueta-hora">
              {formatTimeLabel(tiempo_actual).split("-")[1]}
            </span>
          </div>
          <div className="contenedor-vel">
            <label className="etiqueta-vel">Velocidad:</label>
            <ControlDeslizante
              min={1}
              max={300}
              defaultValue={velocidad}
              value={velocidad}
              onChange={cambiaVelocidad}
              valueLabelDisplay="auto"
            ></ControlDeslizante>
          </div>
        </div>
      </div>
      <div className="contenedor-mapa">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={[citiesLayers, viajePathsLayer]}
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
            max={2678398}
            value={tiempo_actual}
            animationSpeed={velocidad}
            formatLabel={formatTimeLabel}
            onChange	={setTiempoActual}
          />
        )}
      </div>
    </>
  );
}
var fecha_inicial = timeParse("%d-%m-%Y")("01-05-2024");
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
  var fecha_actualizada = timeParse("%d-%m-%Y")("01-05-2024");

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
    " de " +
    "mayo" +
    " - " +
    [dia.getHours(), dia.getMinutes(), dia.getSeconds()]
      .map((x) => x.toString().padStart(2, "0"))
      .join(":")
  );
}
