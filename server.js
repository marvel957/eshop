const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const { connectMongo } = require("./services/mongo.js");
const app = require("./app.js");
const server = http.createServer(app);

async function startServer() {
  await connectMongo();

  server.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });
}
startServer();
