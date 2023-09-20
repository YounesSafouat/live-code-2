const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
app.use(logMiddlware);
let products = [
  { id: 100, name: "iPhone 12 Pro", price: 1099.99 },
  { id: 200, name: "Samsung Galaxy S21", price: 999.99 },
  { id: 300, name: "Sony PlayStation 5", price: 499.99 },
  { id: 400, name: "MacBook Pro 16", price: 2399.99 },
  { id: 500, name: "DJI Mavic Air 2", price: 799.99 },
];

app.get("/products", (req, res) => {
  res.send(products);
});
app.get("/product/:id", (req, res) => {
  const prodcutId = req.params.id;
  const product = products.find((product) => product.id == prodcutId);
  if (product) {
    res.send(product);
  } else {
    res.send({ message: "product not found" });
  }
});
app.post("/product/create", (req, res) => {
  const id = products.length + 1;
  console.log("req Body", req.body);
  const { name, price } = req.body;
  products.push({
    id,
    name,
    price,
  });
  res.send({ message: "created successfully", data: products });
});
app.put("/product/update/:id", (req, res) => {
  const ID = req.params.id;
  const data = req.body;
  const index = products.findIndex((prod) => prod.id == ID);
  if (index !== -1) {
    products[index].name = data.name;
    products[index].price = data.price;
    res.send({ message: "UPDATED successfully", data: products });
  } else {
    res.send("NOT FOUND");
  }
});
app.delete("/product/:id", (req, res) => {
  const id = req.params.id;
  const index = products.findIndex((prod) => prod.id == id);
  if (index !== -1) {
    products.splice(index, 1);
    res.send({ message: "deleted" });
  } else {
    res.send("NOT FOUND");
  }
});
app.get("/products/search", (req, res) => {
  const { q, minPrice, maxPrice } = req.body;
  let searchResult = products;

  console.log("product :", q);
  if (q) {
    searchResult = searchResult.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (minPrice) {
    searchResult = searchResult.filter((p) => p.price >= minPrice);
  }
  if (maxPrice) {
    searchResult = searchResult.filter((p) => p.price <= maxPrice);
  }

  if (searchResult.length === 0) {
    res.send("Product not found");
  } else {
    res.json(searchResult);
  }
});

function logMiddlware(req, res, next) {
  console.log(
    `date :${new Date()}  |  method ${req.method}   url ${req.url}     IP ${
      req.ip
    }`
  );

  next();
}
function error_han(err, req, res, next) {
  if (err) {
    console.log("error pppppp :", err);
    res.status(500).json({ error: "something wrong!" });
  }
}
app.get("/error", (req, res, next) => {
  const error = new Error("message error kk");
  next(error);
});
app.use(error_han);

app.listen(port, () => {
  console.log(`site : http://localhost:${port}`);
});
