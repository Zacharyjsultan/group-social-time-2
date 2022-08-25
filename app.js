// importing other stuff, utility functions for:
// working with supabase:
import { addComment, checkAuth, signOutUser, uploadPhoto } from './fetch-utils.js';

// pure rendering (data --> DOM):
/// will need to make render comments function 
import { renderPhotoContainer } from 'render-utils.js'; 
import { renderComments } from './render-utils.js';
/*  "boiler plate" auth code */
// checking if we have a user! (will redirect to auth if not):
checkAuth();
// can optionally return the user:
// const user = checkAuth();

// sign out link:
const signOutLink = document.getElementById('sign-out-link');
signOutLink.addEventListener('click', signOutUser);
/* end "boiler plate auth code" */

// grab needed DOM elements on page:
const preview = document.querySelector('img');
const chilisForm = document.getElementById('chilis-form');
const displayPhoto = document.getElementById('display-photo');
const fileInput = document.querySelector('input[type=file]');

// local state:

// display functions:

// events:

fileInput.addEventListener('change', () => {
    const [file] = fileInput.files;
    preview.src = URL.createObjectURL(file);
});



chilisForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(chilisForm);
    const picture = data.get('file-input');
    const photo = {
        photoName: 'name',
        photoPath: picture,
    };

    await uploadPhoto(photo.photoName, photo.photoPath);
        
    const newContainer = renderPhotoContainer(photo);
    displayPhoto.append(newContainer);
        
    fileInput.value = '';
        
    return displayPhoto;
});

const commentsContainer = document.getElementById('comment-container');

/// display comments - finish..
function displayComments(){
    commentsContainer.innerHTML = '';
    
    const ul = renderComments(comments);
    commentsContainer.append(ul);
}
///////////
displayComments();
///////////////
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