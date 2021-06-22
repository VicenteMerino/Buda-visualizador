import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar/Navbar';
import Chart from '../components/Chart/Chart';

const useStyles = makeStyles(() => ({
  chart: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 15,
    'margin-left': '300px',
    'margin-top': '150px',
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
