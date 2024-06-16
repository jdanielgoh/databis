// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Home from "./vistas/Home";
import EcoBaby from "./vistas/EcoBaby";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/ecobaby">EcoBaby</Link>
      </nav>
      <Routes>
        <Route exact path="/" element={<Home></Home>} />
        <Route path="/ecobaby" element={<EcoBaby></EcoBaby>} />
      </Routes>
    </Router>
  );
}

export default App;
