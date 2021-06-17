import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "../components/Dropdowns/Dropdown";
import Navbar from "../components/Navbar/Navbar";
import Orders from "../components/Orders/Orders";
import Chart from "../components/Chart/Chart";

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
    borderRadius: "12px",
    border: "1px solid black",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("");
  const [market, setMarket] = useState("");
  const [periods, setPeriods] = useState([]);

  const handleOrderFilterChange = (e) => {
    setOrderFilter(e.target.value);
  };

  const handleMarketChange = (e) => {
    setMarket(e.target.value);
  };

  const handlePeriodsChange = (e) => {
    setPeriods(e.target.value);
  };

  useEffect(() => {
    axios
      .get("/api/v1/orders")
      .then((resp) => {
        setOrders(resp.data.orders);
      })
      .catch((resp) => console.log(resp));
  }, [orders.length]);

  const markets = [
    { value: "btc-usd", id: 1 },
    { value: "btc-clp", id: 2 },
  ];
  const ordersDates = [];
  for (const order of orders) {
    ordersDates.push({ value: order.created_at, id: order.id });
  }

  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <div>
          <Dropdown
            filter={"orders"}
            options={ordersDates}
            onChange={handleOrderFilterChange}
          />
          <Dropdown
            filter={"market"}
            options={markets}
            onChange={handleMarketChange}
          />
          <Dropdown
            filter={"period"}
            options={periods}
            onChange={handlePeriodsChange}
          />
        </div>
        <div>
          <Chart orderFilter={orderFilter} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
