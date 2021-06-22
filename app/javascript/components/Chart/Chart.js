import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Dropdown from '../Dropdowns/Dropdown';

const useStyles = makeStyles(() => ({
  root: {
    fontFamily: 'Roboto',
    display: 'inline-flex',
    'flex-direction': 'column',
    margin: '3px 3px 3px 3px',
  },
  orders: {
    'text-align': 'center',
    'margin-top': '1px',
    'margin-bottom': '1px',
  },
  chart: {
    backgroundColor: 'white',
    display: 'inline-flex',
    border: '1px solid black',
    'margin-top': '3px',
    'margin-bottom': '3px',
  },
  negPerformance: {
    color: 'red',
  },
  posPerformance: {
    color: 'green',
  },
  performancePlaceHolder: {
    'text-align': 'center',
    'margin-top': '3px',
    'margin-bottom': '3px',
  },
}));

const Chart = () => {
  const [prices, setPrices] = useState([]);
  const [orderFilter, setOrderFilter] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderPrice, setOrderPrice] = useState(null);
  const [performance, setPerformance] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  const classes = useStyles();

  const findOrderByDate = (ordersArray, date) => {
    for (const order of ordersArray) {
      if (order.created_at === date) {
        return order;
      }
    }
    return null;
  };

  const handleOrderFilterChange = (e) => {
    setOrderFilter(e.target.value);
  };

  useEffect(() => {
    if (orderFilter) {
      const foundOrder = findOrderByDate(orders, orderFilter);
      setOrderPrice(foundOrder.traded_amount[0]);
      axios
        .post('http://localhost:3000/api/v1/exchange-rates', {
          market: 'btc-usd',
          end_date: today,
          start_date: orderFilter,
        })
        .then((res) => {
          setPrices(res.data.rates);
        });
    }
  }, [orderFilter]);

  useEffect(() => {
    if (prices.length) {
      setPerformance(
        `${(
          (100 * (prices[prices.length - 1].value - prices[0].value))
          / prices[0].value
        ).toFixed(2)}`,
      );
    }
  }, [prices]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/orders').then((res) => {
      setOrders(res.data.orders);
    });
  }, []);

  const ordersDates = [];
  for (const order of orders) {
    ordersDates.push({
      value: order.created_at,
      id: order.id,
    });
  }
  const height = 500;
  const width = 1000;
  const margin = {
    top: 20, right: 30, bottom: 30, left: 40,
  };

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(prices, (d) => d.value * orderPrice)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleTime()
    .domain(d3.extent(prices, (d) => new Date(d.date)))
    .range([margin.left, width - margin.right]);

  d3.select('g.xAxis').call(
    d3
      .axisBottom(x)
      .ticks(width / 80)
      .tickSizeOuter(0),
  );

  d3.select('g.yAxis')
    .call(d3.axisLeft(y))
    .call((g) => g.select('.domain').remove())
    .call((g) => g
      .select('.tick:last-of-type text')
      .clone()
      .attr('x', 3)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(prices.y));
  const line = d3
    .line()
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.value * orderPrice));

  d3.select('.line')
    .datum(prices)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);
  return (
    <div className={classes.root}>
      <div className={classes.orders}>
        <Dropdown
          onChange={handleOrderFilterChange}
          filter="Órden"
          options={ordersDates}
        />
      </div>
      <div className={classes.chart}>
        <svg width={width} height={height}>
          <g
            transform={`translate(0,${height - margin.bottom})`}
            className="xAxis"
          />
          <g
            transform={('transform', `translate(${margin.left},0)`)}
            className="yAxis"
          />
          <path className="line" />
        </svg>
      </div>
      <div className={classes.performancePlaceHolder}>
        <h1>
          El rendimiento de tu inversión es:
          {' '}
          <span className={performance >= 0 ? classes.posPerformance : classes.negPerformance}>
            {performance}
            %
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Chart;
