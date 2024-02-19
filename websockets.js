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

// console.log(pb.collection("testdata"));

/*
unorganisedSockets = set [
    socket-io-socket,
    socket-io-socket,
    socket-io-socket,
    socket-io-socket, ...
]

users = weakmap [
    socket: socket-io-socket:
    {
        userid: string,
        sessionid: string,
    }, ...
]

sessions = {
    sessionid: {
        users: [
            {
                id: string,
                socket: socket-io-socket,
            },
            {
                id: string,
                socket: socket-io-socket,
            }, ...
        ]
    },
    sessionid: {
        users: [
            {
                id: string,
                socket: socket-io-socket,
            },
            {
                id: string,
                socket: socket-io-socket,
            }, ...
        ]
    }
}

maybe:

weakmap [
    socket: socket-io-socket:
    {
        userId: string,
        sessionId: string,
        otherUsers: [
            {
                userId: string,
                socket: socket-io-socket,
            },
            {
                userId: string,
                socket: socket-io-socket,
            },
            {
                userId: string,
                socket: socket-io-socket,
            }
        ]
    },
    socket: socket-io-socket:
    {
        userId: string,
        sessionId: string,
        otherUsers: [
            {
                userId: string,
                socket: socket-io-socket,
            },
            {
                userId: string,
                socket: socket-io-socket,
            },
            {
                userId: string,
                socket: socket-io-socket,
            }
        ]
    }, ...
]
*/

// sockets that have been created from new users that have not been assigned to a session yet
let unorganisedSockets = new Set();
// organised users in their sessions
let users = new WeakMap();
let sessions = {};

// when a connection is made
io.on('connection', (socket) => {
    
    // add the newly created socket to the array
    unorganisedSockets.add(socket);

    // when the socket recieves some ids
    socket.on("ids", async (userId) => {
        // remove the socket from the original array
        unorganisedSockets.delete(socket);
        
        // get the sessionId of the user from the database
        const sessionId = (await pb.collection("users").getFirstListItem(`id="${userId}"`)).session_id;
        let session = await pb.collection("sessions").getFirstListItem(`id="${sessionId}"`);
        // let sessionUsers = await pb.collection("users").getFullList(`session_id="${sessionId}"`);

        // add the user to the users weakmap
        users.set(socket, {
            userId,
            sessionId,
        });

        // if the session does not exist in the sessions object, then add it
        if (sessions[sessionId] == undefined) {
            sessions[sessionId] = {
                users: [],
            }
        }

        // add the user to the session
        sessions[sessionId].users.push({
            userId,
            socket,
        });

        // if the number of users has reached 4, then the session should start
        if (sessions[sessionId].users.length >= 4) {
            await pb.collection("sessions").update(sessionId, {state: "drawing"});
            for (let user of sessions[sessionId].users) {
                user.socket.emit("stateUpdate", {
                    newState: "drawing",
                })
            }
        }
    });

    socket.on("disconnect", () => {
        users.delete(socket);
    });
    
    socket.emit('connectionOk');

});

// setInterval(() => {
//     console.log(unorganisedSockets);
//     console.log(users);
// }, 100);

//server sending messages on its own without getting a request from the client
// setInterval(async () => {
//     try {
//         let datafromthedatabase = await pb.collection("users").getFullList();
//         for (let socket of sockets) {
//             socket.emit("message", "hello this is a message");
//             socket.emit("datafromthedatabase", datafromthedatabase);
//         }
//     } catch (e) {
//         for (let socket of sockets) {
//             socket.emit("error", "couldn't get data from the database");
//         }
//     }
// }, 1000);


server.listen(process.env.WS_PORT || 3000);
