// ======================================
// To-Do App JavaScript
// ======================================

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");
// Statistics elements
const totalTasks = document.getElementById("totalTasks");
const totalPending = document.getElementById("totalPending");
const totalCompleted = document.getElementById("totalCompleted");
const completionRate = document.getElementById("completionRate");
const progressBar = document.getElementById("progressBar");
const progressPercentage =
    document.getElementById("progressPercentage");
// Local Storage key
const STORAGE_KEY = "todoTasks";

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


// ======================================
// Save Tasks to Local Storage
// ======================================

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


// ======================================
// Generate Unique ID
// ======================================

function generateId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}


// ======================================
// Add New Task
// ======================================

function addTask() {

    const text = taskInput.value.trim();

    // Do not add empty tasks
    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    // Clear input
    taskInput.value = "";

    // Put cursor back in input
    taskInput.focus();
}


// ======================================
// Mark Task Complete / Pending
// ======================================

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    if (task.completed) {
        task.completedAt = new Date().toISOString();
    } else {
        task.completedAt = null;
    }

    saveTasks();
    renderTasks();
}


// ======================================
// Delete Task
// ======================================

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// ======================================
// Edit Task
// ======================================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const taskItem = document.querySelector(
        `.task-item[data-id="${id}"]`
    );

    if (!taskItem) return;

    const taskContent = taskItem.querySelector(".task-content");

    taskContent.innerHTML = "";

    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.text;

    const saveButton = document.createElement("button");

    saveButton.textContent = "Save";
    saveButton.className = "save-edit-btn";

    const cancelButton = document.createElement("button");

    cancelButton.textContent = "Cancel";
    cancelButton.className = "cancel-edit-btn";

    const editActions = document.createElement("div");

    editActions.className = "task-actions";

    editActions.appendChild(saveButton);
    editActions.appendChild(cancelButton);

    taskContent.appendChild(editInput);

    taskItem.appendChild(editActions);

    editInput.focus();

    // Save edited task
    saveButton.addEventListener("click", function () {

        const newText = editInput.value.trim();

        if (newText === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = newText;

        saveTasks();
        renderTasks();
    });

    // Cancel editing
    cancelButton.addEventListener("click", function () {
        renderTasks();
    });

    // Press Enter to save
    editInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            saveButton.click();
        }

        if (event.key === "Escape") {
            cancelButton.click();
        }
    });
}


// ======================================
// Format Date and Time
// ======================================

function formatDateTime(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString();
}


// ======================================
// Create Task Element
// ======================================

function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    taskItem.dataset.id = task.id;


    // Task content
    const taskContent = document.createElement("div");

    taskContent.className = "task-content";


    // Task text
    const taskText = document.createElement("div");

    taskText.className = "task-text";

    // textContent prevents HTML injection
    taskText.textContent = task.text;


    // Timestamp
    const taskTime = document.createElement("span");

    taskTime.className = "task-time";

    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Completed: ${formatDateTime(task.completedAt)}`;

    } else {

        taskTime.textContent =
            `Added: ${formatDateTime(task.createdAt)}`;
    }


    taskContent.appendChild(taskText);
    taskContent.appendChild(taskTime);


    // Task action buttons
    const taskActions = document.createElement("div");

    taskActions.className = "task-actions";


    // Complete button
    const completeButton = document.createElement("button");

    completeButton.className = "complete-btn";

    completeButton.textContent =
        task.completed ? "Mark Pending" : "Mark Complete";

    completeButton.addEventListener("click", function () {
        toggleTask(task.id);
    });


    // Edit button
    const editButton = document.createElement("button");

    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
        editTask(task.id);
    });


    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
    });


    // Add buttons
    taskActions.appendChild(completeButton);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);


    // Add everything to task item
    taskItem.appendChild(taskContent);
    taskItem.appendChild(taskActions);


    return taskItem;
}


// ======================================
// Render All Tasks
// ======================================

function renderTasks() {

    // Clear current lists
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";


    // Separate pending and completed tasks
    const pending = tasks.filter(task => !task.completed);

    const completed = tasks.filter(task => task.completed);


    // Update counters
    pendingCount.textContent =
        `${pending.length} pending`;

    completedCount.textContent =
        `${completed.length} completed`;

    // Update statistics
    const total = tasks.length;

    const completedTotal = completed.length;

    const pendingTotal = pending.length;

    const rate = total === 0
        ? 0
        : Math.round((completedTotal / total) * 100);

    totalTasks.textContent = total;
    totalPending.textContent = pendingTotal;
    totalCompleted.textContent = completedTotal;
    completionRate.textContent = `${rate}%`;
    // Update productivity progress
progressBar.style.width = `${rate}%`;
progressPercentage.textContent = `${rate}%`;
    // Show pending empty message
    if (pending.length === 0) {

        pendingTasks.appendChild(pendingEmpty);

    } else {

        pending.forEach(task => {

            const taskElement = createTaskElement(task);

            pendingTasks.appendChild(taskElement);

        });
    }


    // Show completed empty message
    if (completed.length === 0) {

        completedTasks.appendChild(completedEmpty);

    } else {

        completed.forEach(task => {

            const taskElement = createTaskElement(task);

            completedTasks.appendChild(taskElement);

        });
    }
}


// ======================================
// Add Task Button
// ======================================

addTaskBtn.addEventListener("click", addTask);


// ======================================
// Press Enter to Add Task
// ======================================

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }
});


// ======================================
// Load Tasks When Page Opens
// ======================================

renderTasks();