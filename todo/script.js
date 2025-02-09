document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-button");
  const taskList = document.getElementById("task-list");
  const taskCount = document.getElementById("task-count");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clear-completed");

  const dateDisplay = document.querySelector(".date-display");
  const prioritySelect = document.getElementById("priority-select");
  const totalTasks = document.getElementById("total-tasks");
  const activeTasks = document.getElementById("active-tasks");
  const completedTasks = document.getElementById("completed-tasks");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskCount();
  }

  function updateTaskCount() {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    taskCount.textContent = activeTasks;
  }

  function updateDate() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateDisplay.textContent = now.toLocaleDateString("en-US", options);
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
    taskCount.textContent = active;
  }

  function createTaskElement(task) {
    const li = document.createElement("div");
    li.className = "task-item";

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const taskDate = document.createElement("span");
    taskDate.className = "task-date";
    taskDate.textContent = new Date(task.createdAt).toLocaleDateString();

    const priorityBadge = document.createElement("div");
    priorityBadge.className = `priority-badge priority-${task.priority}`;
    priorityBadge.title = `${
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    } Priority`;

    taskContent.appendChild(priorityBadge);
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskDate);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = "action-btn edit-btn";
    editBtn.title = "Edit Task";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.title = "Delete Task";

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(actions);

    if (task.completed) li.classList.add("checked");

    return li;
  }

  function showEmptyState() {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <i class="fas fa-clipboard-list"></i>
      <p>No tasks yet! Add a new task to get started.</p>
    `;
    return emptyState;
  }

  function renderTasks(filterType = "all") {
    const taskListElement = document.getElementById("task-list");
    taskListElement.innerHTML = "";

    let filteredTasks = tasks;
    if (filterType === "active") {
      filteredTasks = tasks.filter((task) => !task.completed);
    } else if (filterType === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    }

    if (filteredTasks.length === 0) {
      taskListElement.appendChild(showEmptyState());
      return;
    }

    filteredTasks.forEach((task, index) => {
      const taskElement = createTaskElement(task);
      taskListElement.appendChild(taskElement);

      li.addEventListener("click", (e) => {
        if (e.target !== li.querySelector(".delete-btn")) {
          tasks[index].completed = !tasks[index].completed;
          li.classList.toggle("checked");
          saveTasks();
        }
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filterType);
      });
    });

    updateStats();
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      taskInput.classList.add("shake");
      setTimeout(() => taskInput.classList.remove("shake"), 500);
      return;
    }

    const newTask = {
      text: taskText,
      completed: false,
      priority: prioritySelect.value,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }

  addButton.addEventListener("click", () => {
    addTask();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addButton.click();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderTasks(button.dataset.filter);
    });
  });

  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
  });

  // Add task edit functionality
  taskList.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
      const li = e.target.closest("li");
      const taskIndex = Array.from(taskList.children).indexOf(li);
      const taskText = tasks[taskIndex].text;

      const newText = prompt("Edit task:", taskText);
      if (newText !== null && newText.trim() !== "") {
        tasks[taskIndex].text = newText.trim();
        saveTasks();
        renderTasks();
      }
    }
  });

  // Update date display periodically
  updateDate();
  setInterval(updateDate, 60000); // Update every minute

  // Initial render
  renderTasks();
  updateStats();
});
