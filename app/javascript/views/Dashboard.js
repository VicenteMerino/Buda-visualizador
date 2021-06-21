import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar/Navbar";
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

  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <div>
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
