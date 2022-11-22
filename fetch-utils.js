// import { client, SUPABASE_URL } from "./client.js";

const SUPABASE_URL = 'https://fjidvhxajekcfrrjsnla.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaWR2aHhhamVrY2ZycmpzbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAxNDU2ODYsImV4cCI6MTk3NTcyMTY4Nn0._zi_gZoOt0ksKYa3J9htU9w6oH8ojf_WkKrLHWGaswo';

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

function checkError({ data, error }) {
    //  eslint-disable-next-line
    return error ? console.error(error) : data;
}
/* Data functions */

export async function uploadChilisPhoto(photoName, photoPath) {
    try {
        const bucket = await client.storage.from('photos');
        const response = await bucket
            .upload(photoName, photoPath, {
                cacheControl: '3600',
                upsert: true,
            });
        const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
        return url;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return null;
    }
}


export async function getChilisPhoto(id) {
    const response = await client
        .from('photos')
        .select()
        .match(id)
        .single();

    return checkError(response);
}

export async function createChilis(chilis) {
    const response = await client
        .from('photos')
        .insert(chilis);

    return checkError(response);
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

export async function subscribe() {
    //eslint-disable-next-line no-unused-vars
    const mySubscription = supabase
        .from('*')
        .on('*', (payload) => {
            // eslint-disable-next-line no-console
            console.log('Change received!', payload);
        })
        .subscribe();
}