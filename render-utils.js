export function renderPhotoContainer(photo) {
    const container = document.createElement('div');
    container.classList.add('photo-container');

    const photoPath = document.createElement('p');
    photoPath.classList.add('photo-path');
    photoPath.textContent = photo.filepath;
    
    const photoName = document.createElement('p');
    photoName.classList.add('photo-name');
    photoName.texConent = photo.name;

    container.append(photoName, photoPath);
    return container;
}
export function renderComments(comments) {
    const ul = document.createElement('ul');

    for (const comment of comments) {
        const li = document.createElement('li');
        li.textContent = comment.textContent;
        ul.append(li);
    }
    return ul;
}