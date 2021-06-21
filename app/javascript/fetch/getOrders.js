export default async function getOrders() {
  const response = await fetch("http://localhost:3000/api/v1/orders", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: 'cors'
  });
  const json = await response.json();
  return {response, json};
}
