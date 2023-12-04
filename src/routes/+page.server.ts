
// import type { PageLoad } from "./$types";

import type { PageServerLoad, PageServerLoadEvent } from "./$types";

// import type { LoadEvent } from "@sveltejs/kit";

export const load = async ({ locals }: PageServerLoadEvent) => {
    try {
        let data = await locals.pb.collection("testdata").getFullList();
        return data[0];
    } catch (e) {
        return { "nodata": "sad" };
    }
}