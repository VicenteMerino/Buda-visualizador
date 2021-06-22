import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Dropdown from '../Dropdowns/Dropdown';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 auto',
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.white,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 15,
  },
  orders: {
    maxWidth: '50%',
    padding: theme.spacing(2, 3),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid black',
  },
}));

const Chart = () => {
  const [prices, setPrices] = useState([]);
  const [orderFilter, setOrderFilter] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderPrice, setOrderPrice] = useState(null);
  const [performance, setPerformance] = useState(null);
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
    <div>
      <div>
        <Dropdown
          onChange={handleOrderFilterChange}
          filter="Órden"
          options={ordersDates}
        />
      </div>
      <div>
        <h1>
          El rendimiento de tu inversión es:
          {' '}
          {performance && (
          <span>
            {performance}
            %
          </span>
          )}
        </h1>
      </div>
      <div>
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
    </div>
  );
};

export default Chart;
