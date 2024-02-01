import { Server } from 'socket.io';
import PocketBase from 'pocketbase';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server
    ,{
    cors: {
        origin: 'http://localhost:5173', // Replace with the origin of your SvelteKit app
        methods: ['GET', 'POST'],
    },
}
);

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090/');

console.log(pb.collection("testdata"));

let sockets = [];

io.on('connection', (socket) => {
    sockets.push(socket);
    socket.emit('eventFromServer', 'hello world');
});

//server sending messages on its own without getting a request from the client
setInterval(async () => {
    try {
        let datafromthedatabase = await pb.collection("users").getFullList();
        for (let socket of sockets) {
            socket.emit("message", "hello this is a message");
            socket.emit("datafromthedatabase", datafromthedatabase);
        }
    } catch (e) {
        for (let socket of sockets) {
            socket.emit("error", "couldn't get data from the database");
        }
    }
}, 1000);


server.listen(process.env.WS_PORT || 3000);
