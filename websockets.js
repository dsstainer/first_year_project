import { Server } from 'socket.io';
import PocketBase from 'pocketbase';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import fs from "fs/promises";
import bodyParser from 'body-parser';

import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const server = createServer(app);

const io = new Server(server
    , {
        cors: {
            origin: 'http://localhost:5173', // Replace with the origin of your SvelteKit app
            methods: ['GET', 'POST'],
        },
    }
);

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090/');

const PROMPTS = (await fs.readFile("prompts.txt", "utf-8")).split("\n");

function randomPrompt() {
    return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
}

// these two should contain the same items most of the time
// sockets id just for debugging
/// userSockets is what I actually use
let sockets = [];
let userSockets = {};

const VERBOSE_CONSOLE_ERRORS = true;

function socketError(error, socket, socketErrorMessage) {
    const simpleAutoErrorMessage = error.message.split("\n")[0];
    const consoleErrorMessage = VERBOSE_CONSOLE_ERRORS ? error : simpleAutoErrorMessage
    const socketErrormessage = socketErrorMessage || simpleAutoErrorMessage;
    console.log('\x1b[36m%s\x1b[0m', `Socket Error: ${socketErrorMessage}`);
    console.error(consoleErrorMessage);
    console.log('\x1b[36m%s\x1b[0m', "-------------");
    socket.emit("error", { message: socketErrorMessage });
}

// when a connection is made
io.on('connection', (socket) => {
    sockets.push(socket);
    console.log(`socket connected - num sockets connected: ${sockets.length}`);

    // let the client know that the connection is ok
    socket.emit("connectionOk");

    // when the client sends the userId
    socket.on("userId", async ({ userId }) => {
        // get the user's record from the database
        let user;
        try {
            user = await pb.collection("users").getFirstListItem(`id = "${userId}"`);
        } catch (e) {
            socketError(e, socket, "user id not in database");
            return;
        }
        const sessionId = user.session_id;
        // add the socket to the users -> sockets map
        userSockets[userId] = socket;
        // use the sessionId of that user to get a list of all the users in that session
        let usersInSession;
        try {
            usersInSession = await pb.collection("users").getFullList({
                filter: `session_id = "${sessionId}"`,
            });
        } catch (e) {
            socketError(e, socket, "can't get users in session");
            return;
        }
        // if the number of users in that session is 4 or more
        if (usersInSession.length >= 4) {
            console.log("updating session to drawing");
            // change state to drawing and assign a prompt
            const newRandomPrompt = randomPrompt();
            try {
                await pb.collection("sessions").update(sessionId, { prompt: newRandomPrompt, state: "drawing" });
            } catch (e) {
                socketError(e, socket, "can't update session");
            }
            // sending out messages to each user in the session
            for (const userInSession of usersInSession) {
                // get the user's socket
                const userInSessionSocket = userSockets[userInSession.id];
                // only if the socket actually exists
                if (userInSessionSocket == undefined) continue;
                userInSessionSocket.emit("stateChange", { newState: "drawing", prompt: newRandomPrompt });
            }
        }
    });

    // when the client disconnects
    socket.on("disconnect", () => {
        sockets.splice(sockets.indexOf(socket), 1);
        console.log(`socket disconnected - num sockets connected: ${sockets.length}`);
    });
});

// console.log(socket.client.conn);
// add the newly created socket to the array
// unorganisedSockets.add(socket);

// // when the socket recieves some ids
// socket.on("ids", async (userId) => {
//     // remove the socket from the original array
//     unorganisedSockets.delete(socket);

//     // get the sessionId of the user from the database
//     let user;
//     try {
//         user = await pb.collection("users").getFirstListItem(`id="${userId}"`);
//     } catch (e) {
//         socket.disconnect();
//         return;
//     }
//     const sessionId = user.session_id;
//     let session = await pb.collection("sessions").getFirstListItem(`id="${sessionId}"`);
//     // add the user to the users weakmap
//     users.set(socket, {
//         userId,
//         sessionId,
//     });

//     // if the session does not exist in the sessions object, then add it
//     if (sessions[sessionId] == undefined) {
//         sessions[sessionId] = {
//             users: {},
//         }
//     }

//     // add the user to the session
//     sessions[sessionId].users[userId] = socket;

//     // if the number of users has reached 4, then the session should start
//     if (Object.keys(sessions[sessionId].users).length >= 4) {
//         // enter the draing state for the session
//         await pb.collection("sessions").update(sessionId, {state: "drawing"});
//         // create a prompt for the session
//         if (session.prompt == "") {
//             const prompt = prompts[Math.floor(Math.random() * prompts.length)];
//             await pb.collection("sessions").update(sessionId, {prompt});
//             session.prompt = prompt;
//         }
//         // send a message to all the users:
//         // - that the drawing has started
//         // - the prompt
//         for (let [userId, socket] of Object.entries(sessions[sessionId].users)) {
//             socket.emit("startDrawing", {
//                 prompt: session.prompt,
//             });
//         }
//     }
// });

// socket.on("disconnect", () => {
//     // try {
//     //     delete sessions[users[socket].sessionId].users[users[socket].userId];
//     // } catch(e) {};
//     users.delete(socket);
// });

// socket.emit('connectionOk');
// });

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


// app.listen(process.env.WS_PORT || 3000);
server.listen(3000);

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
        users: {
            id: string:
                socket: socket-io-socket,

            id: string:
                socket: socket-io-socket,

            id: string:
                socket: socket-io-socket,

            ...
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