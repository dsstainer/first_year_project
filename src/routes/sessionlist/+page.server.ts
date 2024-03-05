import type { PageServerLoadEvent } from "./$types";

// an example of how to load dat from the database into the website
export const load = async (event: PageServerLoadEvent): Promise<{ sessions: any[] } | null> => {
    try {
        // try and get some data from the data base
        const data = await event.locals.pb.collection("sessions").getFullList();
        data.sessions = addColorsToSession(data);
        return { sessions: data };
    } catch (e) {
        // default data if there is some error
        return null;
    }
}

const colors = ['#FF8D8D', '#FFF7AC', '#AFFFAD', '#DEA8FF', '#8DB4FF'];
function getBackgroundColor(id){
    if (id.charCodeAt(0) < 55) {
        return colors[0];
    }
    else if(id.charCodeAt(0)< 100){
        return colors[1];
    }
    else if(id.charCodeAt(0)<107){
        return colors[2];
    }
    else if(id.charCodeAt(0)<114){
        return colors[3];
    }
    else{
        return colors[4];
    }

    console.log(id.charCodeAt(0))
    return color;
}

function addColorsToSession(data){
    let result = [];
    data.forEach((session)=>{
        session.color = getBackgroundColor(session.id);
        result.push(session);
    });
    console.log(result);
    return result;
}
