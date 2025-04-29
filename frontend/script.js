const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addButton = document.getElementById('addButton');

// Load all tasks on page load
window.onload = function() {
    fetchTasks();
};

function fetchTasks() {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                addTaskToDOM(task);
            });
        });
}

// --- 1. Create task item with checkbox
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed || false; // default false

    checkbox.addEventListener('change', () => {
        toggleTaskComplete(task.id, checkbox.checked); // <- Calling the function here
    });

    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    if (checkbox.checked) {
        textSpan.style.textDecoration = 'line-through';
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.onclick = () => deleteTask(task.id);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

// --- 2. ADD toggleTaskComplete function here ---
function toggleTaskComplete(id, completed) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT', // PUT request to update completion
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
    })
    .then(response => response.json())
    .then(updatedTask => {
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (li) {
            const textSpan = li.querySelector('span');
            if (updatedTask.completed) {
                textSpan.style.textDecoration = 'line-through';
            } else {
                textSpan.style.textDecoration = 'none';
            }
        }
    });
}

// --- 3. Add a new task
addButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    .then(response => response.json())
    .then(newTask => {
        addTaskToDOM(newTask);
        taskInput.value = '';
    });
});

// --- 4. Delete a task
function deleteTask(id) {
  fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE'
  })
  .then(() => {
      const li = document.querySelector(`li[data-id="${id}"]`);
      if (li) {
          li.classList.add('fade-out');
          setTimeout(() => {
              li.remove();
          }, 300); // Wait for animation to finish
      }
  });
}

const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️ Light Mode';
    } else {
        darkModeToggle.textContent = '🌙 Dark Mode';
    }
});

