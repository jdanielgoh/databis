// App.js
import React from "react";
import Footer from "./componentes/ui/Footer";
import Header from "./componentes/ui/Header";
import "./App.scss"
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";

import HechosTransito from "./vistas/HechosTransito";
import EcoBaby from "./vistas/EcoBaby";
import MiBici from "./vistas/MiBici";

import Inicio from "./vistas/Inicio";

function App() {
  return (
    <>
      <Header></Header>
      <div id="contenido-vistas">
        <BrowserRouter basename="/databis">
          <h1>DataBis</h1>
          <p></p>
          <nav className="interno">
          <NavLink to="/" >Inicio</NavLink> | <NavLink to="/ecobaby">Ecobici</NavLink> | <NavLink to="/mibici">MiBici</NavLink>  | <NavLink to="/hechos-transito" >Hechos de transito</NavLink> 
          </nav>
          <Routes>
            <Route exact path="/" element={<Inicio></Inicio>} />
           <Route path="/ecobaby" element={<EcoBaby></EcoBaby>} />
           <Route path="/mibici" element={<MiBici></MiBici>} />

            <Route path="/hechos-transito" element={<HechosTransito></HechosTransito>} />
          </Routes>
        </BrowserRouter>
      </div>

      <Footer></Footer>
    </>
  );
}

export default App;
