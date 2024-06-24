import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useState, useEffect } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const DATA_URL = "https://tirandocodigo.mx/databis/datos/hechos_ciclistas.json";
const colores = {
  CHOQUE: [7, 158, 158, 155],
  "CAIDA DE CICLISTA": [247, 178, 3, 155],
  ATROPELLADO: [241, 60, 1, 155],
  "CAIDA DE PASAJERO": [201, 201, 201, 155],
  DERRAPADO: [201, 201, 201, 155],
  VOLCADURA: [201, 201, 201, 155],
};
const INITIAL_VIEW_STATE = {
  longitude: -99.2,
  latitude: 19.4,
  zoom: 10,
  maxZoom: 20,
};

const Home = ({
  mapStyle = MAP_STYLE,
  data = DATA_URL,
  intensity = 2,
  threshold = 0.3,
  radiusPixels = 30,
}) => {
  const [datos, setDatos] = useState([]);
  useEffect(() => {
    // Cargar los datos desde la URL
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((ladata) => {
        // Filtrar los datos
        const filteredData = ladata;
        setDatos(filteredData);
      });
  }, []);

  const [selectedLayer, setSelectedLayer] = useState("layer1");
  const handleLayerChange = (event) => {
    setSelectedLayer(event.target.value);
  };

  const [hoverInfo, setHoverInfo] = useState({});
  function renderTooltip(info) {
    const { object, x, y } = info;
    if (info.object) {
      return (
        <div
          className="tooltip interactive"
          style={{ left: x, top: y, position: "absolute" }}
        >
          <b> {info.object[2]}</b>
          <br />
          <b> {info.object[8]}</b>
          <br />
          <b>Fecha: </b> {info.object[0]}
          <br />
          <b>Hora: </b>
          {info.object[1]}
          <br />
        </div>
      );
    }

    if (!object) {
      return null;
    }
  }

  const layers = [
    new HeatmapLayer({
      data: datos,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d[5], d[4], 0],
      getFilterValue: (d) => d[8] == "fallecida",
      getWeight: (d) => d[9],
      radiusPixels,
      intensity,
      threshold,
    }),
    new ScatterplotLayer({
      id: "scatter-plot",
      data: datos,
      radiusScale: 50,
      radiusMinPixels: 1,
      radiusMaxPixels: 12,
      getPosition: (d) => [d[5], d[4], 0],
      getRadius: 1,
      getFillColor: (d) => colores[d[2]],
      onHover: !hoverInfo.objects && setHoverInfo,
      pickable: true,
    }),
  ];

  return (
    <>
      <div className="inicio">
        <h2>Visualización de hechos de tránsito de ciclistas</h2>
        <p>
          En esta visualización se muestran los accientes de tránsito en los que
          hubo ciclistas involucrados en CDMX de enero de 2020 a diciembre de
          2023. La fuente de los datos corresponde a los datos abiertos de
          <a
            href="https://datos.cdmx.gob.mx/dataset/hechos-de-transito-reportados-por-ssc-base-ampliada-no-comparativa/resource/0555dd20-d921-4f76-aa8c-1a0689f48bce?inner_span=True"
            target="_blank"
          >
            Hechos de tránsito registrados por la SSC
          </a>.
        </p>
        <p></p>
      </div>
      <div>
        <input
          type="radio"
          id="layer1"
          name="layer"
          value="layer1"
          checked={selectedLayer === "layer1"}
          onChange={handleLayerChange}
        />
        <label htmlFor="layer1">Mapa de calor</label>

        <input
          type="radio"
          id="layer2"
          name="layer"
          value="layer2"
          checked={selectedLayer === "layer2"}
          onChange={handleLayerChange}
        />
        <label htmlFor="layer2">Mapa de puntos</label>
      </div>
      <div>
        {selectedLayer === "layer2" ? (
          <p>
            <span className="vis-nomenclatura">
              <span
                className="figura-variable"
                style={{ background: "rgb(7, 158, 158)" }}
              ></span>
              CHOQUE
            </span>
            <span className="vis-nomenclatura">
              <span
                className="figura-variable"
                style={{ background: "rgb(247, 178, 3)" }}
              ></span>
              CAIDA DE CICLISTA
            </span>
            <span className="vis-nomenclatura">
              <span
                className="figura-variable"
                style={{ background: "rgb(241, 60, 1)" }}
              ></span>
              ATROPELLADO
            </span>
            <span className="vis-nomenclatura">
              <span
                className="figura-variable"
                style={{ background: "rgb(201, 201, 201)" }}
              ></span>
              OTRO
            </span>
          </p>
        ) : (
          <p> .</p>
        )}
      </div>
      <div className="contenedor-mapa">
        <DeckGL
          layers={selectedLayer === "layer1" ? [layers[0]] : [layers[1]]}
          initialViewState={INITIAL_VIEW_STATE}
          controller
        >
          <Map
            reuseMaps
            mapLib={maplibregl}
            mapStyle={mapStyle}
            preventStyleDiffing={true}
          />
          {renderTooltip(hoverInfo)}
        </DeckGL>
      </div>
    </>
  );
};
export default Home;
