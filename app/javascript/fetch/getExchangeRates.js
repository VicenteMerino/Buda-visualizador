export default async function getOrders(market, start_date, end_date) {
  const response = await fetch("http://localhost:3000/api/v1/exchange-rates", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      market: market,
      start_date: start_date,
      end_date: end_date,
    }),
  });
  const json = await response.json();
  const status = response.status;
  return { json, status };
}
