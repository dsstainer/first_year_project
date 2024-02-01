enum SessionState {
    Wating,
    Drawing,
    Voting,
    Ended,
}
interface Session {
    id: string,
    state: Session,
}
interface User {
    id: string,
    nickname: string,
    session_id: string,
}
interface Prompt {
    id: string,
    prompt: string,
    session_id: string,
}
interface Image {
    id: string,
    user_id: string,
    image: Image,
}
interface Vote {
    id: string,
    from_user_id: string,
    for_image_id: string,
}