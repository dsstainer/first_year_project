import type { PageServerLoadEvent } from "./$types";

// an example of how to load dat from the database into the website
export const load = async ({ locals }: PageServerLoadEvent) => {
    try {
        // try and get some data from the data base
        let data = await locals.pb.collection("users").getFullList();
        return data[0];
    } catch (e) {
        // default data if there is some error
        return { "nodata": "oh no" };
    }
}