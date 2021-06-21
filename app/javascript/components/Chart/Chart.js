import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import axios from "axios";
import Dropdown from "../Dropdowns/Dropdown";
import Orders from "../Orders/Orders";
import getExchangeRates from "../../fetch/getExchangeRates";
import getOrders from "../../fetch/getOrders";

const Chart = () => {
  const [prices, setPrices] = useState([]);
  const [orderFilter, setOrderFilter] = useState("");
  const [orders, setOrders] = useState([]);
  const [orderPrice, setOrderPrice] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  async function handleOrderFilterChange(e) {
    setOrderFilter(e.target.value.name);
    setOrderPrice(e.target.value.value);
    if (orderFilter) {
      getExchangeRates('btc-usd', orderFilter, today).then((res) => {
        setPrices(res.json.rates);
      });
    }
  }

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.json.orders);
    });
  });

  const ordersDates = [];
  for (const order of orders) {
    ordersDates.push({ name: order.created_at, value: order.traded_amount[0], id: order.id });
  }
  const height = 500;
  const width = 1000;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(prices, (d) => d.value * orderPrice)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleTime()
    .domain(d3.extent(prices, (d) => new Date(d.date)))
    .range([margin.left, width - margin.right]);

  d3.select("g.xAxis").call(
    d3
      .axisBottom(x)
      .ticks(width / 80)
      .tickSizeOuter(0)
  );

  d3.select("g.yAxis")
    .call(d3.axisLeft(y))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .select(".tick:last-of-type text")
        .clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(prices.y)
    );
  const line = d3
    .line()
    .defined((d) => !isNaN(d.value))
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.value * orderPrice));

  d3.select(".line")
    .datum(prices)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);
  return (
    <div>
      <div>
        <Dropdown
          onChange={handleOrderFilterChange}
          filter={"Órden"}
          options={ordersDates}
        />
      </div>
      <svg width={width} height={height}>
        <g
          transform={`translate(0,${height - margin.bottom})`}
          className="xAxis"
        ></g>
        <g
          transform={("transform", `translate(${margin.left},0)`)}
          className="yAxis"
        ></g>
        <path className="line"></path>
      </svg>
    </div>
  );
};

export default Chart;
