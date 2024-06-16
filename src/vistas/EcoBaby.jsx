


import React from 'react';
import {useState, useMemo,useEffect} from 'react';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { timeParse } from 'd3-time-format'

import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';

import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';

import AnimatedArcLayer from '../utils/animated-arc-group-layer';
import RangeInput from '../utils/range-input';
import diccionario_estaciones from  "../assets/estaciones.json"

// Data source
const DATA_URL = "https://tirandocodigo.mx/movilidad-cdmx/datos/retiro_arribo.csv"
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: -99.2,
  latitude:19.4,
  zoom: 12,
  maxZoom: 20
};

/* eslint-disable react/no-deprecated */
export default function EcoBaby({
  mapStyle = MAP_STYLE,
  showFlights = true,
  timeWindow = 300,
  animationSpeed = 5
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    load(DATA_URL, CSVLoader,  { csv: { dynamicTyping:false} }).then(flights => {
      setData(flights);
    });

  }, []);
  const citiesLayers = useMemo(
    () => [


      new GeoJsonLayer({
        id: 'cities-highlight',
        data: 'https://tirandocodigo.mx/movilidad-cdmx/datos/cicloestaciones.geojson',
        pointType: 'circle',
        pointRadiusUnits: 'common',
        pointRadiusScale: 0.2,
        pointRadiusMinPixels: 1,
        pointRadiusMaxPixels: 2,
        getFillColor: [200, 10, 200, 100],

        getLineWidth: 1,
        lineWidthUnits: 'pixels',
        filled: true,
        stroked: false,

        //extensions: [new MaskExtension()],
        //maskId: 'flight-mask'
      })
    ],
    []
  );

  const flightLayerProps = {
    data,
    greatCircle: true,
    getSourcePosition: d => diccionario_estaciones?.[d.r_e],
    getTargetPosition: d => diccionario_estaciones?.[d.a_e],
    getSourceTimestamp: d => +d.r_f,
    getTargetTimestamp: d => +d.a_f,
    getHeight: 0
  };

  const flightPathsLayer =
    showFlights &&
    new AnimatedArcLayer({
      ...flightLayerProps,
      id: 'flight-paths',
      timeRange: [currentTime - 240, currentTime], // 10 minutes
      getWidth: 0.2,
      widthMinPixels: 1,
      widthMaxPixels: 4,
      widthUnits: 'common',
      getSourceColor: [200, 10, 10],
      getTargetColor: [0, 154, 68],
      parameters: {depthTcitiesest: false}
    });

  const flightMaskLayer = new AnimatedArcLayer({
    ...flightLayerProps,
    id: 'flight-mask',
    timeRange: [currentTime - timeWindow * 4, currentTime],
    operation: 'mask',
    getWidth: 10,
    widthUnits: 'meters'
  });

  return (
    <>
    <div className='detalle-tiempo'>
      <p>{currentTime}</p>
    </div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[flightPathsLayer, citiesLayers]}
      >
        <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
      </DeckGL>
      {data && (
        <RangeInput
          min={0}
          max={2678399}
          value={currentTime}
          animationSpeed={animationSpeed}
          formatLabel={formatTimeLabel}
          onChange={setCurrentTime}
        />
      )}
    </>
  );
}
var fecha_inicial = timeParse("%d-%m-%Y")("01-01-2024")
let dias = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

function formatTimeLabel(seconds) {
  var fecha_actualizada = timeParse("%d-%m-%Y")("01-01-2024")
  
  const dia = new Date(fecha_actualizada.setSeconds(fecha_inicial.getSeconds() + seconds))
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  return dias[dia.getDay()] +dia.toString() + [h, m, s].map(x => x.toString().padStart(2, '0')).join(':');
}
