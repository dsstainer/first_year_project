import { Server } from 'socket.io';
import PocketBase from 'pocketbase';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import fs from "fs/promises";
import bodyParser from 'body-parser';
import base64Img from 'base64-img';
import { getErrorMessages, socketError, usersError } from "./errors.js";

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

// load all the possible prompts from a file
// todo: we may generate these in a different way in the future
const PROMPTS = (await fs.readFile("prompts.txt", "utf-8")).split("\n");

function randomPrompt() {
    return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
}

// these two should contain the same items most of the time
// the sockets array is just for debugging
let sockets = [];
// userSockets is what I actually use
let userSockets = {};

// when a connection is made
io.on('connection', (socket) => {
    sockets.push(socket);
    console.log(`socket connected - num sockets connected: ${sockets.length}`);

    // let the client know that the connection is ok
    socket.emit("connectionOk");

    // when the client sends the userId
    socket.on("userId", async ({ userId }) => {
        // get the user's record from the database
        let sessionId;
        try {
            sessionId = (await pb.collection("users").getFirstListItem(`id = "${userId}"`)).session_id;
        } catch (e) {
            socketError(socket, getErrorMessages(e, "cannot get session from database"));
            return;
        }
        // add user to the user sockets once we know the user actually exists
        userSockets[userId] = socket;
        // if the number of users in that session is 4 or more the update the session
        checkUpdateSessionToDrawing(sessionId, socket, userSockets);
        // when the user submits an image
        socket.on("image", async (imageBase64) => {
            console.log("saving image");
            // save image to database
            try {
                await pb.collection("users").update(userId, { image: imageBase64 });

            } catch (e) {
                socketError(socket, getErrorMessages(e, "cannot save image to database"));
            }
            // get the users in this session form the database
            let usersInSession;
            try {
                usersInSession = await pb.collection("users").getFullList({
                    filter: `session_id = "${sessionId}"`,
                });
            } catch (e) {
                socketError(socket, getErrorMessages(e, "cannot get session from database"));
                return;
            }
            // if all the users in the session have submitted an image
            if (usersInSession.every((userInSession) => userInSession.image != "")) {
                // get some info from each user to send to all the users
                console.log('all images submitted');
                //todo: update session state in database
                // (image, user id, user name, etc)
                const imageInfoToSend = usersInSession.map((userInSession) => ({
                    userId: userInSession.id,
                    image: userInSession.image,
                    userNickname: userInSession.nickname,
                }));
                // send the image data to each user
                for (const userInSession of usersInSession) {
                    if(userSockets[userInSession.id] != null){
                        userSockets[userInSession.id].emit("stateChange", { newState: "voting", images: imageInfoToSend });
                    }
                }
            }
        });
        // when the user submits a vote
        socket.on("vote", async (voteForUserId) => {
            // save vote to database
            try {
                await pb.collection("votes").update(userId, { vote_for_user_id: voteForUserId });
            } catch (e) {
                socketError(socket, getErrorMessages(e, "cannot save vote to database"));
            }
            // get the users in this session form the database
            let usersInSession;
            try {
                usersInSession = await pb.collection("users").getFullList({
                    filter: `session_id = "${sessionId}"`,
                });
            } catch (e) {
                socketError(socket, getErrorMessages(e, "cannot get session from database"));
                return;
            }
            // if all the users in the session have submitted a vote
            if (usersInSession.every((userInSession) => userInSession.vote_for_user_id != "")) {
                // send the result of the votes to all the users
                let votesForUsers = {};
                for (const userInSession of usersInSession) {
                    votesForUsers[userInSession.id] = { nickname: userInSession.nickname, votes: 0 };
                }
                for (const userInSession of usersInSession) {
                    votesForUsers[userInSession.vote_for_user_id].votes += 1;
                }
                // send the image data to each user
                for (const userInSession of usersInSession) {
                    if(userSockets[userInSession.id] != null){
                        userSockets[userInSession.id].emit("stateChange", { newState: "ended", votes: votesForUsers });
                    }
                    
                }
            }
        });
    });
    // when the client disconnects
    socket.on("disconnect", () => {
        sockets.splice(sockets.indexOf(socket), 1);
        console.log(`socket disconnected - num sockets connected: ${sockets.length}`);
    });
});

server.listen(3000);

// socket here is the socket that is causing the session to update to drawing
// this is just for errors to jbe passed to the client
async function checkUpdateSessionToDrawing(sessionId, socket, userSockets) {
    // get the session that the user is in
    let session;
    try {
        session = await pb.collection("sessions").getFirstListItem(`id = "${sessionId}"`);
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    // get all the users in this user's session
    let usersInSession;
    try {
        usersInSession = await pb.collection("users").getFullList({
            filter: `session_id = "${sessionId}"`,
        });
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    // guard clause such that if there's not enough users then the state will not change
    if (usersInSession.length < 4) {
        return;
    }
    // no we know the state should be updated
    console.log("updating session to drawing");
    // change state to drawing if it's in waiting
    if (session.state == "waiting") {
        session.state = "drawing";
        try {
            await pb.collection("sessions").update(session.id, { state: "drawing" });
        } catch (e) {
            usersError(usersInSession, getErrorMessages(e, "cannot get session from database"));
        }
    }
    // assign a new prompt if it doesn't already have a prompt
    if (session.prompt == "") {
        const newRandomPrompt = randomPrompt();
        session.prompt = newRandomPrompt;
        try {
            await pb.collection("sessions").update(session.id, { prompt: newRandomPrompt, state: "drawing" });
        } catch (e) {
            usersError(usersInSession, getErrorMessages(e, "cannot get session from database"));
        }
    }
    // sending out a message to each user in the session
    for (const userInSession of usersInSession) {
        // get the user's socket
        const userInSessionSocket = userSockets[userInSession.id];
        // only if the socket actually exists
        if (userInSessionSocket == undefined) continue;
        userInSessionSocket.emit("stateChange", { newState: session.state, prompt: session.prompt });
    }
}
