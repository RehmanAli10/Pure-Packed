// IMPORTING MODULES
const fs = require("fs");
const http = require("http");
const url = require("url");

// READING FILES
const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProducts = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);
const devData = fs.readFileSync("./dev-data/data.json", "utf-8");
const productsData = JSON.parse(devData);

function renderingTemplate(temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
}

// CREATING SERVER
const server = http.createServer(function (req, res) {
  const { pathname, query } = url.parse(req.url, true);

  // ROUTES

  // OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = productsData.map((el) => renderingTemplate(tempCard, el));

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  }

  // PRODUCT PAGE
  else if (pathname === "/product") {
    const product = productsData[query.id];
    const output = renderingTemplate(tempProducts, product);
    res.end(output);
  }

  // API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(devData);
  }

  // NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen("8000", "localhost", () => {
  console.log("Server running successfully");
});
