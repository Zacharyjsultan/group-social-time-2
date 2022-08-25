const SUPABASE_URL = '';
const SUPABASE_KEY = '';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export function checkAuth() {
    const user = getUser();
    // do we have a user?
    if (!user) {
        // path is different if we are at home page versus any other page
        const authUrl = location.pathname === '/' ? './auth/' : '../auth/';
        // include the current url as a "redirectUrl" search param so user can come
        // back to this page after they sign in...
        location.replace(`${authUrl}?redirectUrl=${encodeURIComponent(location)}`);
    }

    // return the user so can be used in the page if needed
    return user;
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

export async function getChilis() {
    return await client.from('chilis').select();
}

export async function uploadChilisPic(imageName, imageFile) {
    const bucket = client.storage.from('pics');
    const { data, error } = await bucket.upload(
        imageName,
        imageFile,
        {
            cacheControl: '3600',
            upsert: true,
        }
    );
    if (error) {
        console.log(error);
        return null;
    }
    const url = `${SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
    return url;
}

export function getPostImageUrl(imageName) {
    return `${SUPABASE_URL}/storage/v1/object/public/${imageName}`
}

export async function createChilis(chilis) {
    return await client.from('chilis').insert(chilis);
}

export async function deleteChilis(id) {
    return await client.from('chilis').delete().match({ id });
}

export async function addComment(comment) {
    return await client.from('comments').insert(comment).single();
}

export function onComment(postId, handleNewComment) {
    client
        .from(`comments:post_id=eq.${postId}`)
        .on('INSERT', handleNewComment)
        .subscribe();
}

export async function updateChilis(chilis) {
    return await client.from('chilis').upsert(chilis).single();
}

export async function getChilisId(id) {
    const response = await client
        .from('chilis')
        .select()
        .match({ id });
    return await response;
}