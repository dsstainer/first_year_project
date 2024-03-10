import { socketError, getErrorMessages } from "./errors.js";

export async function stateChangeToWaitingInfo(sessionId, socket, pb){
    let usersInSession;
    try {
        usersInSession = await pb.collection("users").getFullList({
            filter: `session_id = "${sessionId}"`,
        });
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    return {newState:"waiting", numUsers: usersInSession.length};
}
export async function stateChangeToDrawingInfo(sessionId, socket, pb) {
    let session;
    console.log('changing state to drawing');
    try {
        session = await pb.collection("sessions").getFirstListItem(`id = "${sessionId}"`);
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    return { newState: "drawing", prompt: session.prompt };
}

export async function stateChageToVotingInfo(sessionId, socket, pb) {
    let usersInSession;
    try {
        usersInSession = await pb.collection("users").getFullList({
            filter: `session_id = "${sessionId}"`,
        });
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    // (image, user id, user name, etc)
    const imageInfoToSend = usersInSession.map((userInSession) => ({
        userId: userInSession.id,
        image: userInSession.image,
        userNickname: userInSession.nickname,
    }));

    return { newState: "voting", images: imageInfoToSend };
}

export async function stateChageToEndedInfo(sessionId, socket, pb) {
    let session;
    try {
        session = await pb.collection("sessions").getFirstListItem(`id = "${sessionId}"`);
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    let usersInSession;
    try {
        usersInSession = await pb.collection("users").getFullList({
            filter: `session_id = "${sessionId}"`,
        });
    } catch (e) {
        socketError(socket, getErrorMessages(e, "cannot get session from database"));
        return;
    }
    // send the result of the votes to all the users
    let votesForUsers = {};
    for (const userInSession of usersInSession) {
        console.log(userInSession.id);
        votesForUsers[String(userInSession.id)] = { nickname: userInSession.nickname, votes: 0, image: userInSession.image };
    }
    for (const userInSession of usersInSession) {
        //console.log(votesForUsers)
        votesForUsers[userInSession.vote_for_user_id].votes += 1;
    }
    /*
    votesForUsers = {
        user id: string: {
            nickname: string,
            votes: number,
        },
        user id: string: {
            nickname: string,
            votes: number,
        },
        ...
    }
    */
    console.log("update to ended state");
    return { newState: "ended", votes: votesForUsers, prompt: session.prompt };
}
