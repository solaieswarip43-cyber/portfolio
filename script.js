// LocalStorage Key
const LOCAL_STORAGE_KEY = 'portfolio_todos';

// State Management
let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// 1. Save to LocalStorage
function saveTodos() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

// 2. Render Function (Read & Filter)
function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true; // 'all'
  });

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--border-color); border-radius: 6px;';

    li.innerHTML = `
      <span class="todo-text" style="${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${escapeHTML(todo.text)}</span>
      <div>
        <button type="button" class="action-btn toggle-btn">${todo.completed ? 'Undo' : 'Complete'}</button>
        <button type="button" class="action-btn delete-btn" style="background-color: #dc2626;">Delete</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// XSS Safety Helper
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// 3. Create (Add Task)
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = '';
});

// 4. Event Delegation (Update & Delete)
todoList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('li');
  if (!li) return;

  const todoId = li.dataset.id;

  // Toggle Complete (Update)
  if (target.classList.contains('toggle-btn')) {
    todos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    saveTodos();
    renderTodos();
  }

  // Delete Task (Delete)
  if (target.classList.contains('delete-btn')) {
    todos = todos.filter(todo => todo.id !== todoId);
    saveTodos();
    renderTodos();
  }
});

// 5. Advanced Filter (All, Active, Completed)
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Page load aagumbole render pannanum
document.addEventListener('DOMContentLoaded', renderTodos);
