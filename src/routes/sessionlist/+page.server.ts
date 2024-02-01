import type { PageServerLoadEvent } from "./$types";

// an example of how to load dat from the database into the website
export const load = async (event: PageServerLoadEvent): Promise<{ sessions: any[] } | null> => {
    try {
        // try and get some data from the data base
        const data = await event.locals.pb.collection("sessions").getFullList();
        return { sessions: data };
    } catch (e) {
        // default data if there is some error
        return null;
    }
}