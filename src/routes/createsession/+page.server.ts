import type { PageServerLoadEvent } from '../sessionlist/$types.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async (event: any) => {
		const record = await event.locals.pb.collection("sessions").create({ state: "waiting" });
		return record;
	}
};