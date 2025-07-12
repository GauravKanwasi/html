let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let darkMode = localStorage.getItem('darkMode') === 'true';

// Priority order for sorting
const priorityOrder = { high: 1, medium: 2, low: 3 };

// Save tasks and preferences
function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('darkMode', darkMode);
}

// Render tasks with filters/sorting
function renderTasks() {
  const taskList = document.getElementById('taskList');
  const statusFilter = document.getElementById('statusFilter').value;
  const sortFilter = document.getElementById('sortFilter').value;

  // Filter tasks
  let filteredTasks = [...tasks];
  if (statusFilter === 'active') {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  } else if (statusFilter === 'completed') {
    filteredTasks = filteredTasks.filter(t => t.completed);
  }

  // Sort tasks
  if (sortFilter === 'dueDate') {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortFilter === 'priority') {
    filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  taskList.innerHTML = '';
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
      li.classList.add('overdue'); // Highlight overdue tasks
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveData();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const dueDate = document.createElement('small');
    dueDate.textContent = task.dueDate ? ` • Due: ${task.dueDate}` : '';

    const priorityTag = document.createElement('span');
    priorityTag.className = `priority-tag ${task.priority}`;
    priorityTag.textContent = ` ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit task:', task.text);
      if (newText) {
        task.text = newText;
        saveData();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveData();
      renderTasks();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(dueDate);
    li.appendChild(priorityTag);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

// Event Listeners
document.getElementById('addTaskBtn').addEventListener('click', () => {
  const text = document.getElementById('taskInput').value.trim();
  const dueDate = document.getElementById('dueDateInput').value;
  const priority = document.getElementById('priorityInput').value;
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    dueDate,
    priority,
    completed: false
  });
  saveData();
  renderTasks();
  document.getElementById('taskInput').value = '';
  document.getElementById('dueDateInput').value = '';
});

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);
  saveData();
});

// Load Filters/Theme
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.toggle('dark', darkMode);
  document.getElementById('statusFilter').addEventListener('change', renderTasks);
  document.getElementById('sortFilter').addEventListener('change', renderTasks);
  renderTasks();
});
