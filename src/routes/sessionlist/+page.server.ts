import type { PageServerLoadEvent } from "./$types";

// an example of how to load dat from the database into the website
export const load = async (event: PageServerLoadEvent): Promise<{ sessions: any[] } | null> => {
    try {
        // try and get some data from the data base
        const data = await event.locals.pb.collection("sessions").getFullList();
        addColorsToSession(data);
        for (const session of data) {
            const usersInSession = await event.locals.pb.collection("users").getFullList({
                filter: `session_id="${session.id}"`
            });
            session.numUsers = usersInSession.length;
        }
        return { sessions: data };
    } catch (e) {
        // default data if there is some error
        return null;
    }
}

const colors = ['#FF8D8D', '#FFF7AC', '#AFFFAD', '#DEA8FF', '#8DB4FF'];
function getBackgroundColor(id: string) {
    if (id.charCodeAt(0) < 55) {
        return colors[0];
    }
    else if (id.charCodeAt(0) < 100) {
        return colors[1];
    }
    else if (id.charCodeAt(0) < 107) {
        return colors[2];
    }
    else if (id.charCodeAt(0) < 114) {
        return colors[3];
    }
    else {
        return colors[4];
    }
}

function addColorsToSession(data: any) {
    data.forEach((session: any) => {
        session.color = getBackgroundColor(session.id);
    });
}
