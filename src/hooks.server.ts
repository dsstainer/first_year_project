
// import { redirect, type Handle } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
    try {
        event.locals.pb = new PocketBase(process.env.POCKETBASE_URL || "http://localhost:8090/");
    } catch (e) {
        console.log("can't connect to pocketbase");
    }
    const response = await resolve(event);
    return response;
}