// importing other stuff, utility functions for:
// working with supabase:
import { addComment, checkAuth, signOutUser, uploadChilisPhoto } from './fetch-utils.js';

// pure rendering (data --> DOM):
/// will need to make render comments function 
import { renderComments, renderPhotoContainer } from './render-utils.js';
/*  "boiler plate" auth code */
// checking if we have a user! (will redirect to auth if not):
checkAuth();
// can optionally return the user:
const user = checkAuth();
const preview = document.querySelector('img');
const chilisForm = document.getElementById('chilis-form');
const photoContainer = document.getElementById('photo-container');
const fileInput = document.querySelector('input[type=file]');
const postPhotoButton = document.getElementById('post-photo-button');


// sign out link:
const signOutLink = document.getElementById('sign-out-link');
signOutLink.addEventListener('click', signOutUser);
/* end "boiler plate auth code" */

// grab needed DOM elements on page:
// local state:
let comments = [];

// display functions:

// events:

fileInput.addEventListener('change', () => {
    const [file] = fileInput.files;
    preview.src = URL.createObjectURL(file);
});


chilisForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(chilisForm);

    const photo = data.get('file-input');
   
    let url = null;
    if (photo.size) {
        const imageName = `${user.id}/${photo.name}`;
        url = await uploadChilisPhoto(imageName, photo);
    }
    
});

const commentsContainer = document.getElementById('comment-container');

/// display comments - finish..
function displayComments(){
    commentsContainer.innerHTML = '';
    
    const ul = renderComments(comments);
    commentsContainer.append(ul);
}

displayComments();

const addCommentEl = document.getElementById('add-comment')
;
// eventistener 

addCommentEl.addEventListener('click', async (e) =>{
    e.preventDefault();

    const FormData = new FormData(addCommentEl);

    const response = await addComment({
        text: FormData.get('text'),
        

    });

    const comment = response.data;
    comments.push(comment);

    displayComments();
});

async function displayImage() {
    // clear the container (.innerHTML = '')
    photoContainer.innerHTML = '';

    const newUpload = await getChilisPhoto(id);
   
    const item = renderPhotoContainer(newUpload);
       
    photoContainer.append(item);
}



