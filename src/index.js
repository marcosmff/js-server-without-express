const http = require("http");
const { URL } = require("url");

const routes = require("./routes");
const bodyParser = require("./helpers/bodyParser");
const baseUrl = "http://localhost:3000";

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`${baseUrl}${request.url}`);

  console.log(
    `Request method ${request.method} | Endpoint ${parsedUrl.pathname}`
  );

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndPoint = pathname.split("/").filter(Boolean);

  if (splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`;
    id = splitEndPoint[1];
  }

  const route = routes.find(
    (routeObj) =>
      routeObj.method === request.method && routeObj.endpoint === pathname
  );

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { "Content-Type": "application/json" });
      response.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATCH"].includes(request.method))
      bodyParser(request, () => route.handler(request, response));
    else route.handler(request, response);
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${pathname}`);
  }
});

server.listen(3000, () => console.log(`Server started at ${baseUrl}`));
