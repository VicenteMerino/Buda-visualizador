import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "../components/Dropdowns/Dropdown";
import Navbar from "../components/Navbar/Navbar";
import Orders from "../components/Orders/Orders";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.white,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 15,
  },
  orders: {
    maxWidth: "50%",
    padding: theme.spacing(2, 3),
    backgroundColor: "#ffffff",
    borderRadius: '12px',
    border: '1px solid black'
  },
}));


const Dashboard = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios
      .get("/api/v1/orders")
      .then((resp) => {
        setOrders(resp.data.orders);
      })
      .catch((resp) => console.log(resp));
  }, [orders.length]);
  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <div>
          <Dropdown filter={'options'} options={orders} />
        </div>
        <div className={classes.orders}>
          <Orders orders={orders}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
