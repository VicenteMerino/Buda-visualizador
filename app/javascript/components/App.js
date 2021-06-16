import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Visualizator from './Visualizator/Visualizator';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Visualizator} />
    </Switch>
  );
};

export default App;
