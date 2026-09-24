let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");
const categoryFilter = document.getElementById("categoryFilter");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const themeBtn = document.getElementById("themeBtn");


// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// Add Task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        errorMessage.textContent = "Please enter a task.";
        return;
    }

    errorMessage.textContent = "";

    const task = {
        id: Date.now(),
        title: title,
        category: categoryInput.value,
        priority: priorityInput.value,
        date: dateInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";

    renderTasks();
}


// Display Tasks
function renderTasks() {

    const searchText = searchInput.value.toLowerCase();
    const filter = filterInput.value;
    const category = categoryFilter.value;

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesStatus =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed);

        const matchesCategory =
            category === "all" ||
            task.category === category;

        return matchesSearch &&
            matchesStatus &&
            matchesCategory;
    });


    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    filteredTasks.forEach(task => {

        const taskItem = document.createElement("div");

        taskItem.className =
            `task-item ${task.completed ? "completed" : ""}`;

        taskItem.innerHTML = `

            <button class="check-btn"
                onclick="toggleTask(${task.id})">
            </button>

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-meta">

                    <span class="badge category-badge">
                        ${task.category}
                    </span>

                    <span class="badge priority-${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                    ${
                        task.date
                        ? `<span class="badge date-badge">
                            <i class="fa-regular fa-calendar"></i>
                            ${formatDate(task.date)}
                           </span>`
                        : ""
                    }

                </div>

            </div>

            <div class="task-actions">

                <button class="action-btn"
                    onclick="editTask(${task.id})"
                    title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="action-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;

        taskList.appendChild(taskItem);
    });

    updateSummary();
}


// Complete / Pending
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Delete
function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// Edit
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newTitle =
        prompt("Edit your task:", task.title);

    if (newTitle === null) {
        return;
    }

    const updatedTitle = newTitle.trim();

    if (updatedTitle === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.title = updatedTitle;

    saveTasks();
    renderTasks();
}


// Clear completed tasks
clearCompletedBtn.addEventListener("click", function() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});


// Search
searchInput.addEventListener("input", renderTasks);


// Status Filter
filterInput.addEventListener("change", renderTasks);


// Category Filter
categoryFilter.addEventListener("change", renderTasks);


// Update Summary
function updateSummary() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}


// Format Date
function formatDate(date) {

    const parts = date.split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


// Prevent HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Dark Mode
themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark);

    themeBtn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
});


// Load Dark Mode
if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
}


// Initial display
renderTasks();