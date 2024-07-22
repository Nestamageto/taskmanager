document.addEventListener("DOMContentLoaded", () => {
    const newTaskInput = document.getElementById("new-task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const pendingTasksList = document.getElementById("pending-tasks");
    const completedTasksList = document.getElementById("completed-tasks");
    const saveCompletedBtn = document.getElementById("save-completed-btn");

    // Function for adding a new task
    addTaskBtn.addEventListener("click", () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            newTaskInput.value = ""; // to clear input after adding
        }
    });

    // Function for adding a task to the pending list
    function addTask(taskText) {
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

        taskItem.appendChild(completeBtn);
        taskItem.appendChild(deleteBtn);

        pendingTasksList.appendChild(taskItem);
    }

    // Function for marking a task as completed
    function completeTask(taskItem) {
        taskItem.querySelector(".complete-btn").remove();
        completedTasksList.appendChild(taskItem);
    }

    // Function for deleting a task
    function deleteTask(taskItem) {
        taskItem.remove();
    }

    // Function for saving completed tasks
    saveCompletedBtn.addEventListener("click", () => {
        const completedTasks = [];
        completedTasksList.querySelectorAll("li").forEach((taskItem) => {
            completedTasks.push(taskItem.firstChild.textContent.trim());
        });

        // Create a blob of the completed tasks
        const blob = new Blob([completedTasks.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        // Create a link to download the blob
        const a = document.createElement("a");
        a.href = url;
        a.download = "completed_tasks.txt";
        document.body.appendChild(a);
        a.click();

        // Clean up the DOM
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
