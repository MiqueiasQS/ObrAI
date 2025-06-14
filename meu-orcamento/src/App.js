import React from 'react';
// Importa os componentes necessários do react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa os componentes que representam suas telas
import ListaOrcamentos from './components/ListaOrcamentos/ListaOrcamentos'; // A tela principal com a lista
import Orcamento from './components/Orcamento/Orcamento'; // A nova tela de detalhes

import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ListaOrcamentos />} />
          <Route path="/orcamento/:id" element={<Orcamento />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
