import React from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Main } from './modules/Main';

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
}

export default App;
