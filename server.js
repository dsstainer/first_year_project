import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { handler } from './build/handler.js';
import { setupConnections } from './websockets.js';

const app = express();
const server = createServer(app);

const io = new Server(server);

setupConnections(io);

app.use(handler)

server.listen(process.env.PROD_PORT || 3000);
