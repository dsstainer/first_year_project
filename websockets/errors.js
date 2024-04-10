const VERBOSE_CONSOLE_ERRORS = true;

// just some functions for errors
export function getErrorMessages(error, socketErrorMessage) {
    const simpleAutoErrorMessage = error.message.split("\n")[0];
    const consoleErrorMessage = VERBOSE_CONSOLE_ERRORS ? error : simpleAutoErrorMessage
    socketErrorMessage = socketErrorMessage || simpleAutoErrorMessage;
    return { consoleErrorMessage, socketErrorMessage };
}

function consoleSocketError({ consoleErrorMessage, socketErrorMessage }) {
    console.log('\x1b[36m%s\x1b[0m', `Socket Error: ${socketErrorMessage}`);
    console.error(consoleErrorMessage);
    console.log('\x1b[36m%s\x1b[0m', "-------------");
}

function sendErrorOverSocket(socket, socketErrorMessage) {
    socket.emit("error", { message: socketErrorMessage });
}

export function bothErrors(msg) {
    return {
        consoleErrorMessage: msg,
        socketErrorMessage: msg
    }
}

export function socketError(socket, { consoleErrorMessage, socketErrorMessage }) {
    consoleSocketError({ consoleErrorMessage, socketErrorMessage });
    sendErrorOverSocket(socket, socketErrorMessage);
}

function sendErrorToUsers(users, socketErrorMessage) {
    for (const user of users) {
        sendErrorOverSocket(userSockets[user.id], socketErrorMessage)
    }
}

export function usersError(users, { consoleErrorMessage, socketErrorMessage }) {
    consoleSocketError({ consoleErrorMessage, socketErrorMessage });
    sendErrorToUsers(users, socketErrorMessage);
}