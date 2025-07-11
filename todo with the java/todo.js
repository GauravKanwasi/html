z// Load tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render the task list
function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear previous tasks

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit your task:', task.text);
      if (newText && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

// Add task event
document.getElementById('addTaskBtn').addEventListener('click', () => {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  input.value = '';
});

// Allow "Enter" key to add task
document.getElementById('taskInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    document.getElementById('addTaskBtn').click();
  }
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});
