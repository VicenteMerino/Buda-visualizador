import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../views/Dashboard';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
    </Switch>
  );
};

export default App;
