// ===================== ELEMENTS =====================
const taskInput = document.getElementById("taskInput");
const noteInput = document.getElementById("noteInput");
const searchInput = document.getElementById("searchInput");

const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const completedList = document.getElementById("completedList");
const recentTasks = document.getElementById("recentTasks");
const notesList = document.getElementById("notesList");

const languageSelect = document.getElementById("language-select");

// ===================== DATA =====================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let currentFilter = "all";
let currentLanguage = "en";

// ===================== BACKGROUNDS =====================
const backgrounds = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#ff6a00,#ee0979)",
  "linear-gradient(135deg,#00c9ff,#92fe9d)",
  "linear-gradient(135deg,#fc466b,#3f5efb)",
  "linear-gradient(135deg,#11998e,#38ef7d)"
];

let bgIndex = 0;

function changeBackground() {
  document.body.style.background = backgrounds[bgIndex];
  bgIndex = (bgIndex + 1) % backgrounds.length;
}

changeBackground();
setInterval(changeBackground, 5000);

// ===================== SAVE =====================
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("notes", JSON.stringify(notes));
}

// ===================== TRANSLATIONS =====================
const translations = {

  en: {
    title: "To-Do Workspace",
    search: "Search tasks and notes...",
    addTask: "Add new task...",
    addNote: "Add a note...",
    all: "All",
    active: "Active",
    completedFilter: "Completed",
    recent: "Recently Added",
    todo: "To-Do",
    progress: "In Progress",
    completed: "Completed",
    notes: "Notes",
    completeBtn: "Complete",
    progressBtn: "Progress",
    deleteBtn: "Delete",
    importantBtn: "Important"
  },

  fr: {
    title: "Espace de Travail",
    search: "Rechercher tâches et notes...",
    addTask: "Ajouter une tâche...",
    addNote: "Ajouter une note...",
    all: "Tous",
    active: "Actif",
    completedFilter: "Terminé",
    recent: "Ajouté Récemment",
    todo: "À Faire",
    progress: "En Cours",
    completed: "Terminé",
    notes: "Notes",
    completeBtn: "Terminer",
    progressBtn: "Progression",
    deleteBtn: "Supprimer",
    importantBtn: "Important"
  },

  es: {
    title: "Espacio de Tareas",
    search: "Buscar tareas y notas...",
    addTask: "Agregar tarea...",
    addNote: "Agregar nota...",
    all: "Todos",
    active: "Activo",
    completedFilter: "Completado",
    recent: "Recientemente",
    todo: "Por Hacer",
    progress: "En Progreso",
    completed: "Completado",
    notes: "Notas",
    completeBtn: "Completar",
    progressBtn: "Progreso",
    deleteBtn: "Eliminar",
    importantBtn: "Importante"
  },

  af: {
    title: "Werkruimte",
    search: "Soek take en notas...",
    addTask: "Voeg taak by...",
    addNote: "Voeg nota by...",
    all: "Alles",
    active: "Aktief",
    completedFilter: "Voltooi",
    recent: "Onlangs Bygevoeg",
    todo: "Om Te Doen",
    progress: "Besig",
    completed: "Voltooi",
    notes: "Notas",
    completeBtn: "Voltooi",
    progressBtn: "Vordering",
    deleteBtn: "Verwyder",
    importantBtn: "Belangrik"
  },

  zu: {
    title: "Indawo Yemisebenzi",
    search: "Sesha imisebenzi namanothi...",
    addTask: "Faka umsebenzi...",
    addNote: "Faka inothi...",
    all: "Konke",
    active: "Kuyasebenza",
    completedFilter: "Kuqediwe",
    recent: "Okusanda Kufakwa",
    todo: "Okufanele Kwenziwe",
    progress: "Kuyaqhubeka",
    completed: "Kuqediwe",
    notes: "Amanothi",
    completeBtn: "Qeda",
    progressBtn: "Inqubekela",
    deleteBtn: "Susa",
    importantBtn: "Kubalulekile"
  }

};

// ===================== LANGUAGE =====================
function updateLanguage() {

  const t = translations[currentLanguage];

  document.getElementById("app-title").textContent = t.title;

  searchInput.placeholder = t.search;
  taskInput.placeholder = t.addTask;
  noteInput.placeholder = t.addNote;

  document.querySelectorAll(".filter-btn")[0].textContent = t.all;
  document.querySelectorAll(".filter-btn")[1].textContent = t.active;
  document.querySelectorAll(".filter-btn")[2].textContent = t.completedFilter;

  document.querySelectorAll(".column h2")[0].textContent = t.recent;
  document.querySelectorAll(".column h2")[1].textContent = t.todo;
  document.querySelectorAll(".column h2")[2].textContent = t.progress;
  document.querySelectorAll(".column h2")[3].textContent = t.completed;

  document.querySelector(".notes-section h2").textContent = t.notes;

  renderTasks();
  renderNotes();
}

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  updateLanguage();
});

// ===================== TASKS =====================
function renderTasks() {

  const t = translations[currentLanguage];

  todoList.innerHTML = "";
  progressList.innerHTML = "";
  completedList.innerHTML = "";
  recentTasks.innerHTML = "";

  let filteredTasks = tasks.filter(task => {

    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {

    const card = document.createElement("div");
    card.className = "task-card";

    if (task.completed) card.classList.add("completed");

    card.innerHTML = `
      <div class="task-top">
        <strong>
          ${task.text}
          ${task.completed ? '<span class="green-icon">✔</span>' : ""}
        </strong>
      </div>

      <div class="task-buttons">

        <button class="complete-btn" onclick="completeTask(${task.id})">
          ${t.completeBtn}
        </button>

        <button class="progress-btn" onclick="moveProgress(${task.id})">
          ${t.progressBtn}
        </button>

        <button class="delete-btn" onclick="deleteTask(${task.id})">
          ${t.deleteBtn}
        </button>

      </div>
    `;

    if (task.status === "todo") todoList.appendChild(card);
    if (task.status === "progress") progressList.appendChild(card);
    if (task.status === "completed") completedList.appendChild(card);

    recentTasks.appendChild(card.cloneNode(true));
  });
}

// ===================== NOTES =====================
function renderNotes() {

  const t = translations[currentLanguage];

  notesList.innerHTML = "";

  notes.forEach(note => {

    const card = document.createElement("div");
    card.className = "note-card";

    if (note.important) card.classList.add("important");

    card.innerHTML = `
      <p>${note.text}</p>

      <div class="note-actions">

        <button onclick="markImportant(${note.id})">
          ${t.importantBtn}
        </button>

        <button class="delete-btn" onclick="deleteNote(${note.id})">
          ${t.deleteBtn}
        </button>

      </div>
    `;

    notesList.appendChild(card);
  });
}

// ===================== EVENTS =====================
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.unshift({
      id: Date.now(),
      text,
      completed: false,
      status: "todo"
    });

    taskInput.value = "";
    saveData();
    renderTasks();
  }
});

noteInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {

    const text = noteInput.value.trim();
    if (!text) return;

    notes.unshift({
      id: Date.now(),
      text,
      important: false
    });

    noteInput.value = "";
    saveData();
    renderNotes();
  }
});

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {

    const value = searchInput.value.toLowerCase();

    document.querySelectorAll(".task-card, .note-card")
      .forEach(card => {

        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(value) ? "block" : "none";
      });
  }
});

// ===================== TASK ACTIONS =====================
function completeTask(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      t.completed = true;
      t.status = "completed";
    }
    return t;
  });

  saveData();
  renderTasks();
}

function moveProgress(id) {
  tasks = tasks.map(t => {
    if (t.id === id) t.status = "progress";
    return t;
  });

  saveData();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveData();
  renderTasks();
}

// ===================== NOTES ACTIONS =====================
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveData();
  renderNotes();
}

function markImportant(id) {
  notes = notes.map(n => {
    if (n.id === id) n.important = !n.important;
    return n;
  });

  saveData();
  renderNotes();
}

// ===================== FILTERS =====================
document.querySelectorAll(".filter-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    currentFilter = btn.dataset.filter;

    renderTasks();
  });
});

// ===================== INIT =====================
updateLanguage();
renderTasks();
renderNotes();




 

  

 

 
