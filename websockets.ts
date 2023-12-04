import type { Server } from 'socket.io';
import PocketBase from 'pocketbase';

export const setupConnections = (io: Server) => {
    const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090/');
    let sockets: any[] = [];
    io.on('connection', (socket) => {
        sockets.push(socket);
        socket.emit('eventFromServer', 'hello world');
    });
    //server sending messages on its own without getting a request from the client
    setInterval(async () => {
        try {
            let datafromthedatabase = await pb.collection("testdata").getFullList();
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
};