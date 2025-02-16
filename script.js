function updateDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("current-date").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}
updateDate();

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  const toDoList = document.getElementById("todo-list");
  const completedList = document.getElementById("completed-list");

  // Clear existing lists
  toDoList.innerHTML = "";
  completedList.innerHTML = "";

  // Sort tasks: uncompleted tasks first, then completed tasks
  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

  sortedTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    // Add priority color
    taskItem.style.borderLeft = `5px solid ${getPriorityColor(task.priority)}`;

    if (task.completed) {
      taskItem.classList.add("completed");
      completedList.appendChild(taskItem);
    } else {
      toDoList.appendChild(taskItem);
    }

    taskItem.innerHTML = `
            <input 
                type="checkbox" 
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${tasks.indexOf(task)})"
            >
            <label>
                ${task.text}
                <span class="date">(${task.date})</span>
                ${
                  task.priority
                    ? `<span class="priority">(${task.priority})</span>`
                    : ""
                }
            </label>
            <button class="delete" onclick="deleteTask(${tasks.indexOf(
              task
            )})">✕</button>
        `;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high":
      return "#ff4d4d";
    case "medium":
      return "#ffa500";
    case "low":
      return "#4CAF50";
    default:
      return "#ddd";
  }
}

function addTask() {
  const input = document.getElementById("task-input");
  const prioritySelect = document.getElementById("priority-select");
  const taskText = input.value.trim();

  if (taskText) {
    const now = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = now.toLocaleDateString("en-US", options);

    tasks.push({
      text: taskText,
      completed: false,
      priority: prioritySelect.value,
      date: date,
    });
    input.value = "";
    prioritySelect.value = "low"; // Reset to default
    renderTasks();
  }
}

function toggleTask(index) {
  // Toggle the completed status
  tasks[index].completed = !tasks[index].completed;

  // If task is completed, move to the end of the array
  if (tasks[index].completed) {
    const completedTask = tasks.splice(index, 1)[0];
    tasks.push(completedTask);
  }

  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function clearAllTasks() {
  // Clear all tasks
  tasks = [];
  renderTasks();
}

// Initial render
renderTasks();
