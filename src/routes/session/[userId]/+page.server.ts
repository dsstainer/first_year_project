export async function load({ params, locals }: any) {
    // called userId in the slug meaning its called userId in params
    return {
        userId: params.userId
    };
    // return await locals.pb.collection("users").getFirstListItem(`id = "${params.userId}"`);
}