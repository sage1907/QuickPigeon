import http from "http";

import "./config/env.config.js";

import app from "./app.js";


const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running at port ${PORT}`));