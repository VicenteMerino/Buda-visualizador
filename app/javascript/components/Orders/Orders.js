import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

const Orders = ({ orders }) => {
  return (
    <Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Orders
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Bitcoin Received</TableCell>
            <TableCell>CLP spended</TableCell>
            <TableCell>BTC Fees</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.created_at}</TableCell>
              <TableCell>{order.traded_amount[0]}</TableCell>
              <TableCell>{order.total_exchanged[0]}</TableCell>
              <TableCell>{order.paid_fee[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
};

Orders.propTypes = {
  orders: PropTypes.array,
};

export default Orders;
