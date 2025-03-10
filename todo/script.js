class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        
        this.initialize();
        this.addButtonEffects();
    }

    initialize() {
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        this.renderTodos();
    }

    addButtonEffects() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const effect = e.target.querySelector('.button-effect');
                if (effect) {
                    effect.style.width = '200px';
                    effect.style.height = '200px';
                }
            });

            button.addEventListener('mouseleave', (e) => {
                const effect = e.target.querySelector('.button-effect');
                if (effect) {
                    effect.style.width = '0';
                    effect.style.height = '0';
                }
            });
        });
    }

    addTodo() {
        const todoText = this.todoInput.value.trim();
        if (todoText) {
            const todo = {
                id: Date.now(),
                text: todoText,
                completed: false
            };

            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';

            // Add animation class to the new todo
            const newTodoElement = this.todoList.lastElementChild;
            newTodoElement.style.opacity = '0';
            newTodoElement.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                newTodoElement.style.opacity = '1';
                newTodoElement.style.transform = 'translateY(0)';
            });
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
        this.renderTodos();
    }

    deleteTodo(id) {
        const todoElement = this.todoList.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.style.transform = 'translateX(100px)';
            todoElement.style.opacity = '0';
            
            setTimeout(() => {
                this.todos = this.todos.filter(todo => todo.id !== id);
                this.saveTodos();
                this.renderTodos();
            }, 300);
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', todo.id);
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                >
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">
                    <span>Delete</span>
                    <div class="button-effect"></div>
                </button>
            `;

            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });

        this.addButtonEffects();
    }
}

// Initialize the todo list
new TodoList();

// Add some visual feedback when clicking buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button')) {
        const ripple = document.createElement('div');
        ripple.classList.add('button-effect');
        e.target.appendChild(ripple);
        
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => ripple.remove(), 600);
    }
});
