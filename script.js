document.getElementById('add-important-task').addEventListener('click', function() {
    addTask('important-tasks', 'important');
});

document.getElementById('add-regular-task').addEventListener('click', function() {
    addTask('regular-tasks', 'regular');
});

function addTask(taskContainerId, taskType) {
    const taskContainer = document.getElementById(taskContainerId);
    const lastTaskInput = taskContainer.querySelector('.task:last-child input[type="text"]');

    // Check if the last task input is empty
    if (lastTaskInput && lastTaskInput.value.trim() === '') {
        alert('Please fill in the current task before adding a new one.');
        return;
    }

    const newTaskDiv = document.createElement('div');
    newTaskDiv.className = `task ${taskType}-task`;

    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.className = 'task-checkbox'; // Add class for styling

    const newTaskInput = document.createElement('input');
    newTaskInput.type = 'text';
    newTaskInput.placeholder = 'New Task';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';

    newCheckbox.addEventListener('change', function() {
        if (newTaskInput.value.trim() === '') {
            // If the task input is empty, don't apply strike-through
            this.checked = false;
            alert('Please enter a task before checking the box.');
            return;
        }

        if (this.checked) {
            newTaskInput.style.textDecoration = 'line-through'; // Strike through the task
            moveTaskToBottom(taskContainerId, newTaskDiv); // Move to the bottom
            showAppreciationPopup(); // Show appreciation popup
        } else {
            newTaskInput.style.textDecoration = 'none'; // Remove strike-through if unchecked
        }
        saveTasks(); // Save tasks when checkbox state changes
    });

    newTaskInput.addEventListener('input', saveTasks); // Save tasks when input changes

    deleteButton.addEventListener('click', function() {
        newTaskDiv.remove();
        saveTasks(); // Save tasks when a task is deleted
    });

    newTaskDiv.appendChild(newCheckbox);
    newTaskDiv.appendChild(newTaskInput);
    newTaskDiv.appendChild(deleteButton);

    taskContainer.appendChild(newTaskDiv);
    saveTasks(); // Save tasks when a new task is added
}

function moveTaskToBottom(taskContainerId, taskDiv) {
    const taskContainer = document.getElementById(taskContainerId);
    taskContainer.removeChild(taskDiv);
    taskContainer.appendChild(taskDiv);
}

function showAppreciationPopup() {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'appreciation-popup';
    popupDiv.textContent = 'Great job!';

    Object.assign(popupDiv.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        fontSize: '1.5em',
        textAlign: 'center',
        zIndex: '1000'
    });

    document.body.appendChild(popupDiv);

    setTimeout(() => {
        document.body.removeChild(popupDiv);
    }, 2000);
}

function saveTasks() {
    const tasks = {
        important: [],
        regular: []
    };

    // Save important tasks
    document.querySelectorAll('#important-tasks .task').forEach(task => {
        tasks.important.push({
            text: task.querySelector('input[type="text"]').value,
            completed: task.querySelector('input[type="checkbox"]').checked
        });
    });

    // Save regular tasks
    document.querySelectorAll('#regular-tasks .task').forEach(task => {
        tasks.regular.push({
            text: task.querySelector('input[type="text"]').value,
            completed: task.querySelector('input[type="checkbox"]').checked
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) return;

    tasks.important.forEach(task => {
        const taskContainer = document.getElementById('important-tasks');
        const newTaskDiv = document.createElement('div');
        newTaskDiv.className = 'task important-task';

        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.checked = task.completed;
        newCheckbox.className = 'task-checkbox'; // Add class for styling

        const newTaskInput = document.createElement('input');
        newTaskInput.type = 'text';
        newTaskInput.value = task.text;

        if (task.completed) {
            newTaskInput.style.textDecoration = 'line-through';
            moveTaskToBottom('important-tasks', newTaskDiv);
        }

        newCheckbox.addEventListener('change', function() {
            if (newTaskInput.value.trim() === '') {
                // If the task input is empty, don't apply strike-through
                this.checked = false;
                alert('Please enter a task before checking the box.');
                return;
            }

            if (this.checked) {
                newTaskInput.style.textDecoration = 'line-through';
                moveTaskToBottom('important-tasks', newTaskDiv);
                showAppreciationPopup();
            } else {
                newTaskInput.style.textDecoration = 'none';
            }
            saveTasks();
        });

        newTaskInput.addEventListener('input', saveTasks);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';

        deleteButton.addEventListener('click', function() {
            newTaskDiv.remove();
            saveTasks(); // Save tasks when a task is deleted
        });

        newTaskDiv.appendChild(newCheckbox);
        newTaskDiv.appendChild(newTaskInput);
        newTaskDiv.appendChild(deleteButton);

        taskContainer.appendChild(newTaskDiv);
    });

    tasks.regular.forEach(task => {
        const taskContainer = document.getElementById('regular-tasks');
        const newTaskDiv = document.createElement('div');
        newTaskDiv.className = 'task regular-task';

        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.checked = task.completed;
        newCheckbox.className = 'task-checkbox'; // Add class for styling

        const newTaskInput = document.createElement('input');
        newTaskInput.type = 'text';
        newTaskInput.value = task.text;

        if (task.completed) {
            newTaskInput.style.textDecoration = 'line-through';
            moveTaskToBottom('regular-tasks', newTaskDiv);
        }

        newCheckbox.addEventListener('change', function() {
            if (newTaskInput.value.trim() === '') {
                // If the task input is empty, don't apply strike-through
                this.checked = false;
                alert('Please enter a task before checking the box.');
                return;
            }

            if (this.checked) {
                newTaskInput.style.textDecoration = 'line-through';
                moveTaskToBottom('regular-tasks', newTaskDiv);
                showAppreciationPopup();
            } else {
                newTaskInput.style.textDecoration = 'none';
            }
            saveTasks();
        });

        newTaskInput.addEventListener('input', saveTasks);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';

        deleteButton.addEventListener('click', function() {
            newTaskDiv.remove();
            saveTasks(); // Save tasks when a task is deleted
        });

        newTaskDiv.appendChild(newCheckbox);
        newTaskDiv.appendChild(newTaskInput);
        newTaskDiv.appendChild(deleteButton);

        taskContainer.appendChild(newTaskDiv);
    });
}

// Load tasks when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateDateTime(); // Initialize the date and time
    setInterval(updateDateTime, 1000); // Update every second
});

function updateDateTime() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    const formattedDate = `It's ${day}, ${date} ${month} ${year}`;
    const formattedTime = `${hour12}:${minutes}:${seconds} ${period}`;

    document.getElementById('current-date-time').innerHTML = `${formattedDate}<br>${formattedTime}`;
}
