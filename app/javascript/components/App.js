import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Chart from '../views/Chart';
import Dashboard from '../views/Dashboard';

const App = () => (
  <Switch>
    <Route exact path="/" component={Chart} />
    <Route exact path="/dashboard" component={Dashboard} />
  </Switch>
);

export default App;
