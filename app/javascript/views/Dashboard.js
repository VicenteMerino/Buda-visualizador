import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar/Navbar';
import Orders from '../components/Orders/Orders';

const useStyles = makeStyles(() => ({
  orders: {
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
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/orders').then((res) => {
      setOrders(res.data.orders);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.orders}>
        <Orders orders={orders} />
      </div>
    </div>
  );
};

export default Dashboard;
