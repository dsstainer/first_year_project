export async function load({ params, url }) {
    return {
        prefill: {
            sessionId: url.searchParams.get("sessionId"),
        }
    };
}

import type { Actions } from './$types.js';

function reconstructFormData(formData: any): any {
    let newFormData: any = {};
    for (let x of formData) {
        newFormData[x[0]] = x[1];
    }
    return newFormData;
}

export const actions: Actions = {
    default: async (event: any) => {
        const formData = reconstructFormData(await event.request.formData());
        let users;
        try {
            users = await event.locals.pb.collection("users").getFullList({ filter: `session_id = "${formData.sessionId}"` });
        } catch (e) {
            return "500";
        }
        if (users.length <= 3) {
            let record;
            try {
                record = await event.locals.pb.collection("users").create({ nickname: formData.nickname, session_id: formData.sessionId });
            } catch (e) {
                return "500";
            }
            return record;
        } else {
            return 'session-full';
        }
    }
};
