const createNoteButton = document.getElementById('createNoteButton');
const noteFormSection = document.getElementById('noteFormSection');
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const cancelButton = document.getElementById('cancelButton');
const themeButton = document.getElementById('themeButton');
const themePopup = document.getElementById('themePopup');
const closeThemePopupButton = document.getElementById('closeThemePopup');
const lightThemeButton = document.getElementById('lightThemeButton');
const darkThemeButton = document.getElementById('darkThemeButton');

let userNotes = [];
let editingNoteIndex = null;
const pastelColors = ['#fff3b0', '#b0f4f3', '#f3b0f3', '#b0d3f3', '#d3f3b0'];

// Show form as a popup
createNoteButton.addEventListener('click', () => {
    noteFormSection.classList.add('visible');
    noteForm.reset();
    editingNoteIndex = null;
});

// Hide form
cancelButton.addEventListener('click', () => {
    noteFormSection.classList.remove('visible');
});

// Theme button click event to open theme popup
themeButton.addEventListener('click', () => {
    themePopup.classList.add('visible');
});

// Close the theme popup (cross sign)
closeThemePopupButton.addEventListener('click', () => {
    themePopup.classList.remove('visible');
});

// Switch to Light Mode
lightThemeButton.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themePopup.classList.remove('visible');
});

// Switch to Dark Mode
darkThemeButton.addEventListener('click', () => {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themePopup.classList.remove('visible');
});

// Save or edit note
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const imageFile = document.getElementById('noteImage').files[0];

    if (!title || !content) {
        alert('Title and content are required!');
        return;
    }

    const note = { title, content, color: pastelColors[0] };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
            note.image = reader.result;
            saveOrEdit(note);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveOrEdit(note);
    }
});

function saveOrEdit(note) {
    if (editingNoteIndex !== null) {
        userNotes[editingNoteIndex] = note;
    } else {
        userNotes.push(note);
    }
    renderNotes();
    noteFormSection.classList.remove('visible');
}

function renderNotes() {
    notesList.innerHTML = '';
    userNotes.forEach((note, index) => createNoteElement(note, index));
}

function createNoteElement(note, index) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.style.backgroundColor = note.color;

    noteElement.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.content}</p>
        ${note.image ? `<img src="${note.image}" alt="Note Image">` : ''}
        <div class="color-picker">
            ${pastelColors
                .map(
                    (color) =>
                        `<div style="background-color: ${color}" onclick="changeColor(${index}, '${color}')"></div>`
                )
                .join('')}
        </div>
        <button class="edit-btn" onclick="edit(${index})"><i class="fas fa-pen"></i></button>
        <button class="delete-btn" onclick="remove(${index})"><i class="fas fa-trash"></i></button>
    `;
    notesList.appendChild(noteElement);
}

function edit(index) {
    const note = userNotes[index];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    noteFormSection.classList.add('visible');
    editingNoteIndex = index;
}

function remove(index) {
    userNotes.splice(index, 1);
    renderNotes();
}

// Change Note Color
function changeColor(index, color) {
    userNotes[index].color = color;
    renderNotes();
}
