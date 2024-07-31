document.addEventListener("DOMContentLoaded", () => {
    const newTaskInput = document.getElementById("new-task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const pendingTasksList = document.getElementById("pending-tasks");
    const completedTasksList = document.getElementById("completed-tasks");
    const saveCompletedBtn = document.getElementById("save-completed-btn");

    const apiUrl = "http://localhost:3000/tasks";

    // Function for adding a new task
    addTaskBtn.addEventListener("click", async () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            await addTask(taskText);
            newTaskInput.value = ""; // Clear input after adding
        }
    });

    // Function to fetch tasks from the server
    async function fetchTasks() {
        const response = await fetch(apiUrl);
        return await response.json();
    }

    // Function to save tasks to the server
    async function saveTasks(tasks) {
        await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tasks),
        });
    }

    // Function for adding a task to the pending list and server
    async function addTask(taskText) {
        const tasks = await fetchTasks();
        tasks.pending.push(taskText);
        await saveTasks(tasks);
        addTaskToPending(taskText);
    }

    // Function to add a task to the pending list
    function addTaskToPending(taskText) {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.classList.add("complete-btn");
        completeBtn.addEventListener("click", () => completeTask(taskItem));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(taskItem));

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => editTask(taskItem));

        taskItem.appendChild(completeBtn);
        taskItem.appendChild(deleteBtn);
        taskItem.appendChild(editBtn);

        pendingTasksList.appendChild(taskItem);
    }

    // Function to mark a task as completed
    async function completeTask(taskItem) {
        const taskText = getTaskText(taskItem);
        taskItem.querySelector(".complete-btn").remove();
        completedTasksList.appendChild(taskItem);

        const tasks = await fetchTasks();
        tasks.pending = tasks.pending.filter(task => task !== taskText);
        tasks.completed.push(taskText);
        await saveTasks(tasks);
    }

    // Function to delete a task
    async function deleteTask(taskItem) {
        const taskText = getTaskText(taskItem);
        const taskList = taskItem.parentNode.id;

        taskItem.remove(); // Remove the task from the UI

        const tasks = await fetchTasks();
        if (taskList === "pending-tasks") {
            tasks.pending = tasks.pending.filter(task => task !== taskText);
        } else if (taskList === "completed-tasks") {
            tasks.completed = tasks.completed.filter(task => task !== taskText);
        }
        await saveTasks(tasks);
    }

    // Function to edit a task
    function editTask(taskItem) {
        const taskText = getTaskText(taskItem);
        const newTaskText = prompt("Edit task:", taskText);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskItem.firstChild.textContent = newTaskText; // Update the task text

            // Update the task in the server
            updateTaskInServer(taskText, newTaskText);
        }
    }

    // Function to update a task in the server
    async function updateTaskInServer(oldTaskText, newTaskText) {
        const tasks = await fetchTasks();
        tasks.pending = tasks.pending.map(task => task === oldTaskText ? newTaskText : task);
        tasks.completed = tasks.completed.map(task => task === oldTaskText ? newTaskText : task);
        await saveTasks(tasks);
    }

    // Function for saving completed tasks
    saveCompletedBtn.addEventListener("click", async () => {
        const completedTasks = [];
        completedTasksList.querySelectorAll("li").forEach((taskItem) => {
            completedTasks.push(getTaskText(taskItem));
        });

        const blob = new Blob([completedTasks.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "completed_tasks.txt";
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Helper function to get task text, stripping out button text
    function getTaskText(taskItem) {
        return taskItem.textContent.replace(/(Complete|Delete|Edit)/g, "").trim();
    }

    // Load initial tasks from the server
    async function loadTasks() {
        const tasks = await fetchTasks();
        tasks.pending.forEach(task => addTaskToPending(task));
        tasks.completed.forEach(task => addTaskToCompleted(task));
    }

    // Function to add a task to the completed list
    function addTaskToCompleted(taskText) {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(taskItem));

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => editTask(taskItem));

        taskItem.appendChild(deleteBtn);
        taskItem.appendChild(editBtn);

        completedTasksList.appendChild(taskItem);
    }

    loadTasks();
});
