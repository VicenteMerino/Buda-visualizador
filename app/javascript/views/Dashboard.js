import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar/Navbar';
import Chart from '../components/Chart/Chart';

const useStyles = makeStyles(() => ({
  root: {
  },
  chart: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 15,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.chart}>
        <Chart />
      </div>
    </div>
  );
};

export default Dashboard;
